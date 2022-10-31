import * as React from "react";
import { useParams } from "react-router-dom";
import {
  Grid,
  Card,
  CardActionArea,
  Typography,
  CardMedia,
  Input,
} from "@mui/material/";
import { Edit } from "@mui/icons-material/";
import {
  ServicesAndPrices,
  EditServiceForm,
  AppointmentAvailability,
  FreelancerPortfolio,
  FreelancerSpecificDateAvailability,
} from "../../components";
import { useState } from "react";
import {
  getFreelancerById,
  deleteFreelancerService,
  putFreelancerService,
  postNewFreelancerService,
  postNewFreelancerPortfolioImg,
  updateFreelancerProfileImg,
  postNewFreelancerDefaultAvailability,
  putFreelancerDefaultAvailability,
  postNewFreelancerSpecificDateAvailability,
  putFreelancerSpecificDateAvailability,
  setFreelancerComplete,
  putFreelancerInfo,
} from "../../services/api/freelancerProfile.services";
import EditAppointmentAvailabilityForm from "../../components/appointmentAvailability/EditAppointmentAvailabilityForm";
import Navbar from "../../components/common/layout/Navbar";
import Loading from "../../components/common/Loading/Loading";
import addImage from "../../assets/addImage.png";
import { uploadPhoto } from "../../services/api/freelancerProfile.services";
import ReviewsAndRatings from "../../components/reviewsAndRatings/ReviewsAndRatings";
import { SocketContext } from "../../utils/socket";
import FreelancerInfo from "../../components/freelancerInfo/FreelancerInfo";
import EditFreelancerInfoForm from "../../components/freelancerInfo/EditFreelancerInfoForm";
import EditReviewForm from "../../components/reviewsAndRatings/EditReviewForm";
import { postFreelancerReview } from "../../services/api/freelancerProfile.services";

const FreelancerProfile = () => {
  const { freelancerId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const socket = React.useContext(SocketContext);
  const [editable, setEditable] = useState(
    localStorage.getItem("userType") === "freelancer" &&
      localStorage.getItem("userId") === freelancerId
  );

  // console.log(freelancerId);
  async function getFreelancer() {
    await getFreelancerById(freelancerId).then(async (freelancer) => {
      await setFreelancer(freelancer);
      await setServices(freelancer.services);
      await setReviews(freelancer.reviews);
      await setFreelancerPortfolioImages(freelancer.portfolio);
      await setFreelancerProfileImage(freelancer.profilePicture);
      setIsLoading(false);
    });
  }
  async function handleSetFreelancerComplete(isCompleted) {
    return await setFreelancerComplete(freelancerId, {
      completed: isCompleted,
    });
  }
  //#region service & prices
  const [services, setServices] = useState([]);
  const [editServiceForm, setEditServiceForm] = useState({
    show: false,
    isNewService: true,
    serviceToUpdate: null,
  });

  const handleToggleEditServiceForm = () => {
    setEditServiceForm({ ...editServiceForm, show: !editServiceForm.show });
  };

  const handleToggleAddServiceForm = () => {
    setEditServiceForm({
      ...editServiceForm,
      show: !editServiceForm.show,
      isNewService: true,
    });
  };
  const handleToggleUpdateServiceForm = (id) => {
    const serviceToUpdate = services.find((service) => service._id === id);
    setEditServiceForm({
      ...editServiceForm,
      show: !editServiceForm.show,
      isNewService: false,
      serviceToUpdate: serviceToUpdate,
    });
  };

  const handleAdd = ({ name, price, estimatedTime, serviceCategory }) => {
    const newService = {
      serviceCategory: serviceCategory,
      name: name,
      price: price,
      estimatedTime: estimatedTime,
    };
    async function addService() {
      await postNewFreelancerService(freelancerId, newService).then(
        async (postedService) => {
          if (freelancer.defaultAvailability && !freelancer.completed) {
            await handleSetFreelancerComplete(true).then(async () => {
              setFreelancer({ ...freelancer, completed: true });
            });
          }
          setServices([...services, postedService]);
        }
      );
    }
    addService();
    handleToggleEditServiceForm();
  };

  const handleUpdate = (newService) => {
    async function updateService() {
      await putFreelancerService(freelancerId, newService._id, newService);
      setServices(
        services.map((oldService) => {
          if (oldService._id === newService._id) {
            return newService;
          } else {
            return oldService;
          }
        })
      );
    }
    updateService();
    handleToggleEditServiceForm();
  };

  const handleDelete = (id) => {
    async function deleteService() {
      await deleteFreelancerService(freelancerId, id).then(async () => {
        // console.log("last service?", services, freelancer.completed);
        if (services.length <= 1 && freelancer.completed) {
          // console.log("last service");
          handleSetFreelancerComplete(false).then(async () => {
            setFreelancer({ ...freelancer, completed: false });
          });
        }
        setServices(services.filter((service) => service._id !== id));
      });
    }
    deleteService();
  };

  //#endregion

  //#region appointment availability
  const [
    showEditAppointmentAvailabilityForm,
    toggleEditAppointmentAvailabilityForm,
  ] = useState(false);

  const handleToggleEditAppointmentAvailabilityForm = () => {
    toggleEditAppointmentAvailabilityForm(!showEditAppointmentAvailabilityForm);
  };
  async function handleAddNewFreelancerDefaultAvailability(
    newFreelancerDefaultAvailability
  ) {
    return await postNewFreelancerDefaultAvailability(
      freelancer._id,
      newFreelancerDefaultAvailability
    );
  }

  async function handleUpdateFreelancerDefaultAvailability(
    newFreelancerDefaultAvailability
  ) {
    return await putFreelancerDefaultAvailability(
      freelancer._id,
      newFreelancerDefaultAvailability
    );
  }

  async function handleAddNewFreelancerSpecificDateAvailability(
    newFreelancerSpecificDateAvailability
  ) {
    return await postNewFreelancerSpecificDateAvailability(
      freelancer._id,
      newFreelancerSpecificDateAvailability
    );
  }

  async function handleUpdateFreelancerSpecificDateAvailability(
    specificDateAvailabilityId,
    updatedFreelancerSpecificDateAvailability
  ) {
    return await putFreelancerSpecificDateAvailability(
      freelancer._id,
      specificDateAvailabilityId,
      updatedFreelancerSpecificDateAvailability
    );
  }

  const handleUpdateFreelancerAppointmentAvailability = (
    alreadyHasDefaultAvaiability,
    newFreelancerDefaultAvailability,
    newFreelancerSpecificEdittedDates
  ) => {
    setIsLoading(true);
    const allPromises = [];
    if (!alreadyHasDefaultAvaiability) {
      allPromises.push(
        handleAddNewFreelancerDefaultAvailability(
          newFreelancerDefaultAvailability
        )
      );
    } else {
      allPromises.push(
        handleUpdateFreelancerDefaultAvailability(
          newFreelancerDefaultAvailability
        )
      );
    }

    newFreelancerSpecificEdittedDates.forEach((freelancerDate) => {
      const newFreelancerSpecificDateAvailability =
        new FreelancerSpecificDateAvailability();
      newFreelancerSpecificDateAvailability.areaRadius =
        freelancerDate.areaRadius;
      newFreelancerSpecificDateAvailability.centerLocation =
        freelancerDate.centerLocation;
      newFreelancerSpecificDateAvailability.date = freelancerDate.date;
      newFreelancerSpecificDateAvailability.locationStatus =
        freelancerDate.locationStatus;
      newFreelancerSpecificDateAvailability.offDay = freelancerDate.bOffDay;
      newFreelancerSpecificDateAvailability.schedule = freelancerDate.schedule;

      if (freelancerDate.bDefault)
        allPromises.push(
          handleAddNewFreelancerSpecificDateAvailability(
            newFreelancerSpecificDateAvailability
          )
        );
      else
        allPromises.push(
          handleUpdateFreelancerSpecificDateAvailability(
            freelancerDate.specificDateAvailabilityId,
            newFreelancerSpecificDateAvailability
          )
        );
    });

    if (
      freelancer.services !== null &&
      freelancer.services.length > 0 &&
      !freelancer.completed
    ) {
      allPromises.push(handleSetFreelancerComplete(true));
    }

    Promise.all(allPromises).then(async (allResponses) => {
      // console.log(allResponses);
      getFreelancer();
      handleToggleEditAppointmentAvailabilityForm();
    });
  };

  //#endregion

  //#region Profile Image
  const [freelancerProfileImage, setFreelancerProfileImage] = useState("");
  const handleAddFreelancerProfileImg = async (imgUrl) => {
    await updateFreelancerProfileImg(freelancerId, imgUrl).catch((err) => {
      alert("Error updating freelancer profile image");
    });
    setFreelancerProfileImage(imgUrl);
  };

  const handleChangeProfilePicture = async (event) => {
    if (event.target.value) {
      await uploadPhoto(event.target.files[0])
        .then((imageURL) => {
          handleAddFreelancerProfileImg(imageURL);
        })
        .catch((err) => {
          alert("Error uploading photo");
        });
    }
  };
  //#endregion

  //#region portfolio
  const [freelancerPortfolioImages, setFreelancerPortfolioImages] = useState(
    []
  );
  const handleAddFreelancerPortfolioImg = (imgUrl) => {
    async function addFreelancerPortfolioImg() {
      await postNewFreelancerPortfolioImg(freelancerId, imgUrl);
      setFreelancerPortfolioImages([...freelancerPortfolioImages, imgUrl]);
    }
    addFreelancerPortfolioImg();
  };

  const handleDeleteFreelancerPortfolioImg = (imgUrl) => {
    setFreelancerPortfolioImages(
      freelancerPortfolioImages.filter((image) => image !== imgUrl)
    );
  };
  //#endregion

  //#region info
  const [showEditInfoForm, toggleEditInfoForm] = useState(false);
  const handleToggleEditInfoForm = () => {
    toggleEditInfoForm(!showEditInfoForm);
  };

  const handleUpdateFreelancerInfo = (udpatedInfo) => {
    async function updateInfo() {
      await putFreelancerInfo(freelancerId, udpatedInfo);
      setFreelancer({
        ...freelancer,
        firstName: udpatedInfo.firstName,
        lastName: udpatedInfo.lastName,
        phone: udpatedInfo.phone,
        bio: udpatedInfo.bio,
        facebookURL: udpatedInfo.facebookURL,
        instagramURL: udpatedInfo.instagramURL,
      });
    }
    updateInfo();
    handleToggleEditInfoForm();
  };

  //#endregion

  //#region review & ratings
  const [showEditReviewForm, toggleEditReviewForm] = useState(false);
  const handleToggleEditReviewForm = () => {
    toggleEditReviewForm(!showEditReviewForm);
  };
  const [reviews, setReviews] = useState([]);
  const handleAddReview = (newReview) => {
    async function addReview() {
      await postFreelancerReview(freelancerId, localStorage.getItem("userId"), {
        newReview: newReview,
        newAverageRating:
          reviews.reduce(
            (previousValue, review) => previousValue + review.rating,
            newReview.rating
          ) /
          (reviews.length + 1),
      }).then(async (postedReview) => {
        // console.log("postedReview", postedReview);
        setReviews([...reviews, postedReview]);
      });
    }
    addReview();
    handleToggleEditReviewForm();
  };
  //#endregion

  const [freelancer, setFreelancer] = useState(null);

  React.useEffect(() => {
    socket?.emit("updateNotifications", null, null);
  }, [freelancer?.completed]);

  React.useEffect(() => {
    socket?.emit("updateNotifications", freelancerId, "freelancer");
  }, [reviews]);

  React.useEffect(() => {
    socket?.emit("updateProfilePic");
  }, [freelancerProfileImage]);

  React.useEffect(() => {
    socket?.emit("updateName");
  }, [freelancer?.firstName, freelancer?.lastName]);

  React.useEffect(() => {
    setEditable(
      localStorage.getItem("userType") === "freelancer" &&
        localStorage.getItem("userId") === freelancerId
    );
    getFreelancer();
  }, [freelancerId]);

  if (isLoading) return <Loading />;
  else
    return (
      <div>
        {/* {console.log("freelancer", freelancer)} */}
        <Grid container alignItems="baseline">
          <Grid item xs={12}>
            <Grid container rowSpacing={4} alignItems="flex-start">
              {/* Nav bar */}
              <Navbar />

              {/* profile picture and bio */}
              <Grid item xs={12}>
                <Grid container columnSpacing={2}>
                  <Grid item xs={4}>
                    <Card id="profile-pic">
                      <CardActionArea disabled={!editable}>
                        <label htmlFor="contained-button-file1">
                          {editable && (
                            <Input
                              accept="image/*"
                              id="contained-button-file1"
                              type="file"
                              style={{ display: "none" }}
                              onChange={(event) => {
                                handleChangeProfilePicture(event);
                              }}
                            ></Input>
                          )}
                          <CardMedia
                            component="img"
                            height="240"
                            image={
                              freelancerProfileImage !== ""
                                ? freelancerProfileImage
                                : addImage
                            }
                          />
                          {editable && (
                            <Edit
                              style={{
                                position: "absolute",
                                top: "5px",
                                right: "5px",
                              }}
                            />
                          )}
                        </label>
                      </CardActionArea>
                    </Card>
                  </Grid>
                  <Grid item xs={8}>
                    <FreelancerInfo
                      editable={editable}
                      freelancer={freelancer}
                      handleToggleEditInfoForm={handleToggleEditInfoForm}
                    />
                    <EditFreelancerInfoForm
                      show={showEditInfoForm}
                      freelancer={freelancer}
                      handleUpdateFreelancerInfo={handleUpdateFreelancerInfo}
                      handleToggleEditInfoForm={handleToggleEditInfoForm}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Services&Prices and Reviews&Ratings */}
              <Grid item xs={8}>
                <Grid
                  container
                  direction="column"
                  alignItems="stretch"
                  justifyContent="flex-start"
                  rowSpacing={2}
                >
                  <Grid item>
                    <EditServiceForm
                      show={editServiceForm.show}
                      isNewService={editServiceForm.isNewService}
                      serviceToUpdate={editServiceForm.serviceToUpdate}
                      handleToggleEditServiceForm={handleToggleEditServiceForm}
                      handleAdd={handleAdd}
                      handleUpdate={handleUpdate}
                    />
                    <ServicesAndPrices
                      services={services}
                      editable={editable}
                      handleDelete={handleDelete}
                      handleToggleAddServiceForm={handleToggleAddServiceForm}
                      handleToggleUpdateServiceForm={
                        handleToggleUpdateServiceForm
                      }
                    />
                  </Grid>
                  <Grid item>
                    <EditReviewForm
                      handleAddReview={handleAddReview}
                      handleToggleEditReviewForm={handleToggleEditReviewForm}
                      show={showEditReviewForm}
                    />
                    <ReviewsAndRatings
                      editable={editable}
                      reviewsAndRatings={reviews}
                      handleToggleEditReviewForm={handleToggleEditReviewForm}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Appointment availability */}
              <Grid item xs={4}>
                <Grid
                  container
                  alignItems="flex-start"
                  justifyContent="flex-end"
                >
                  <Grid item>
                    <AppointmentAvailability
                      freelancer={freelancer}
                      handleToggleEditAppointmentAvailabilityForm={
                        handleToggleEditAppointmentAvailabilityForm
                      }
                      editable={editable}
                    />
                    <EditAppointmentAvailabilityForm
                      freelancer={freelancer}
                      show={showEditAppointmentAvailabilityForm}
                      handleToggleEditAppointmentAvailabilityForm={
                        handleToggleEditAppointmentAvailabilityForm
                      }
                      handleAddNewFreelancerDefaultAvailability={
                        handleAddNewFreelancerDefaultAvailability
                      }
                      handleUpdateFreelancerDefaultAvailability={
                        handleUpdateFreelancerDefaultAvailability
                      }
                      handleAddNewFreelancerSpecificDateAvailability={
                        handleAddNewFreelancerSpecificDateAvailability
                      }
                      handleUpdateFreelancerSpecificDateAvailability={
                        handleUpdateFreelancerSpecificDateAvailability
                      }
                      handleUpdateFreelancerAppointmentAvailability={
                        handleUpdateFreelancerAppointmentAvailability
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Portfolio */}
              <Grid item xs={12}>
                <Card>
                  <Typography gutterBottom variant="h3" component="div">
                    Portfolio
                  </Typography>
                </Card>
                {/* <MuiCalendar freelancer={freelancer} edittable={false} /> */}
                <FreelancerPortfolio
                  handleAddFreelancerPortfolioImg={
                    handleAddFreelancerPortfolioImg
                  }
                  handleDeleteFreelancerPortfolioImg={
                    handleDeleteFreelancerPortfolioImg
                  }
                  freelancerPortfolioImages={freelancerPortfolioImages}
                  editable={editable}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
};

export default FreelancerProfile;
