import * as React from "react";
import { useParams } from "react-router-dom";
import LocationAutocomplete from "../../components/common/LocationAutocomplete/LocationAutocomplete";
import markerIconRed from "../../assets/marker-icon-red.png";
import { MapContainer, TileLayer, Marker, Circle } from "react-leaflet";
import { Icon } from "leaflet";
import { useNavigate } from "react-router-dom";
import { arePointsNear } from "../../utils/functions";
import { loadStripe } from "@stripe/stripe-js";
import { SocketContext } from "../../utils/socket";

import {
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Alert,
  Grid,
} from "@mui/material";
import { services } from "../../utils/constants";
import {
  ServicesTab,
  TimeSlotList,
  Payment,
  MuiCalendar,
  BookingSummary,
} from "../../components";
import { getFreelancerPopById } from "../../services/api/freelancer.services";

import { addAppointment } from "../../services/api/appointment.services";
import { createSecret } from "../../services/api/payment.services";
import Loading from "../../components/common/Loading/Loading";
import {
  getAvailableStartSlotIndecesForAppointment,
  translateScheduleSlotIndexToSlotTimeString,
  translateSlotTimeStringToScheduleSlotIndex,
} from "../../utils/functions";
import Navbar from "../../components/common/layout/Navbar";
import { Place, Circle as CircleIcon } from "@mui/icons-material";
import { fullRefund } from "../../services/api/payment.services";
const steps = [
  "Choose date and services",
  "Choose time slot and location",
  "Confirm and proceed to payment",
  "Add card details",
];

const defaultCheckedVal = () => {
  return services.reduce((acc, cur) => {
    acc[cur] = new Set();
    return acc;
  }, {});
};

function formatDate(date) {
  return date.toLocaleString("default", {
    dateStyle: "full",
  });
}
// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

export default function BookingStepper() {
  const { freelancerId } = useParams();
  const customerId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const socket = React.useContext(SocketContext);
  const [isLoading, setIsLoading] = React.useState(true);
  const [freelancerData, setFreelancerData] = React.useState();
  const [freelancerServices, setFreelancerServices] = React.useState({});
  const [timeSlots, setTimeSlots] = React.useState();
  const [freelancerDate, setFreelancerDate] = React.useState();
  const [appTime, setAppTime] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [clientSecret, setClientSecret] = React.useState("");
  const [activeStep, setActiveStep] = React.useState(0);
  const [timeSlot, setTimeSlot] = React.useState();
  const [address, setAddress] = React.useState("");
  const [latitude, setLatitude] = React.useState();
  const [longitude, setLongitude] = React.useState();
  const [checked, setChecked] = React.useState(defaultCheckedVal());
  const [currentTab, setCurrentTab] = React.useState(0);
  const [locationOptions, setLocationOptions] = React.useState([]);
  const [chosenLocationObject, setChosenLocationObject] = React.useState();
  const [clickedDate, setClickedDate] = React.useState(null);
  const [numChosenServices, setNumChosenServices] = React.useState(0);
  const [nextDisabled, setNextDisabled] = React.useState(true);
  const [locError, setLocError] = React.useState("");
  const [showDialog, setShowDialog] = React.useState(false);

  React.useEffect(() => {
    async function getFreelancerData() {
      await getFreelancerPopById(freelancerId).then((freelancer) => {
        setFreelancerData(freelancer);
        setIsLoading(false);
        setFreelancerServices(
          freelancer?.services?.reduce((acc, cur) => {
            if (cur.serviceCategory in acc) {
              acc[cur.serviceCategory].push(cur);
            } else {
              acc[cur.serviceCategory] = [cur];
            }
            return acc;
          }, {})
        );
      });
    }
    getFreelancerData();
  }, [freelancerId]);

  React.useEffect(() => {
    if (freelancerDate?.locationStatus === "AtSalon") {
      setAddress(freelancerDate?.centerLocation?.address);
      setLatitude(freelancerDate?.centerLocation?.latitude);
      setLongitude(freelancerDate?.centerLocation?.longitude);
    } else {
      setAddress("");
      setLatitude(null);
      setLongitude(null);
    }
    // console.log("book date", freelancerDate);
  }, [freelancerDate]);
  const handleTimeSlot = (_, newSlot) => {
    setTimeSlot(newSlot);
  };

  React.useEffect(() => {
    if (
      chosenLocationObject?.referencePosition?.longitude &&
      chosenLocationObject?.referencePosition?.latitude
    ) {
      setLongitude(chosenLocationObject?.referencePosition?.longitude);
      setLatitude(chosenLocationObject?.referencePosition?.latitude);
      setAddress(chosenLocationObject?.formattedAddress);
    }
  }, [chosenLocationObject]);

  React.useEffect(() => {
    setLocError(
      freelancerDate &&
        freelancerDate.locationStatus !== "AtSalon" &&
        chosenLocationObject &&
        !arePointsNear(
          freelancerDate.centerLocation,
          { latitude: latitude, longitude: longitude },
          freelancerDate.areaRadius
        )
        ? "You must provide a location within area range"
        : ""
    );
  }, [address, latitude, longitude, freelancerDate, chosenLocationObject]);

  React.useEffect(() => {
    if (activeStep === 1)
      setChosenLocationObject({
        referencePosition: {
          latitude: latitude,
          longitude: longitude,
        },
        formattedAddress: address,
      });
  }, [activeStep]);

  React.useEffect(() => {
    switch (activeStep) {
      case 0:
        setNextDisabled(
          numChosenServices === 0 || !clickedDate || !freelancerDate
        );
        break;
      case 1:
        setNextDisabled(
          (timeSlot !== 0 && !timeSlot) ||
            !address ||
            !latitude ||
            !longitude ||
            !chosenLocationObject ||
            locError
        );
        break;
      case 2:
      case 3:
        setNextDisabled(false);
        break;
      default:
        setNextDisabled(true);
    }
  }, [
    activeStep,
    numChosenServices,
    clickedDate,
    address,
    latitude,
    longitude,
    chosenLocationObject,
    locError,
    freelancerDate,
    timeSlot,
  ]);

  const handleToggle = (value) => () => {
    const category = Object.keys(freelancerServices)[currentTab];
    const containsVal = checked[category].has(value);
    const newChecked = { ...checked };
    const fService = freelancerServices[category][value];

    if (!containsVal) {
      newChecked[category].add(value);
      setPrice((price) => price + fService.price);
      setAppTime((time) => time + fService.estimatedTime);
      setNumChosenServices((num) => num + 1);
    } else {
      newChecked[category].delete(value);
      setPrice((price) => price - fService.price);
      setAppTime((time) => time - fService.estimatedTime);
      setNumChosenServices((num) => num - 1);
    }
    setChecked(newChecked);
  };

  async function createNewIntent() {
    await createSecret(customerId, { amount: price }).then(
      async (clientSecretRes) => {
        setClientSecret(clientSecretRes?.client_secret);
        // console.log("client secret", clientSecret);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  async function handleNext() {
    if (activeStep === 0) {
      await createNewIntent();
      setTimeSlots(
        getAvailableStartSlotIndecesForAppointment(
          freelancerDate?.schedule,
          appTime
        ).map((startSlot) => {
          const slots = appTime / 15;
          let endSlot = [...startSlot];
          for (let i = 0; i < slots; i++) {
            if (endSlot[1] + 1 < freelancerDate?.schedule[0].length) {
              endSlot[1]++;
            } else {
              endSlot = [(endSlot[0] + 1) % freelancerDate?.schedule.length, 0];
            }
          }
          return (
            translateScheduleSlotIndexToSlotTimeString(startSlot) +
            "-" +
            translateScheduleSlotIndexToSlotTimeString(endSlot)
          );
        })
      );
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  async function handleSubmitAppointment(paymentIntentId) {
    setIsLoading(true);
    const [startTime, endTime] = timeSlots[timeSlot].split("-");
    // console.log("startTime", startTime);
    // console.log("endTime", endTime);
    for (
      let st = translateSlotTimeStringToScheduleSlotIndex(startTime);
      translateScheduleSlotIndexToSlotTimeString(st) !== endTime;

    ) {
      freelancerDate.schedule[st[0]][st[1]] = "booked";
      if (st[1] + 1 === freelancerDate?.schedule[0].length) {
        st[0] += 1;
        st[1] = 0;
      } else st[1] += 1;
    }
    await addAppointment({
      date: freelancerDate?.date,
      location: {
        address: address,
        latitude: latitude,
        longitude: longitude,
      },
      freelancer: freelancerId,
      customer: customerId,
      startTime: startTime,
      endTime: endTime,
      price: price,
      freelancerDate: freelancerDate?.bDefault
        ? {
            bDefault: freelancerDate?.bDefault,
            locationStatus: freelancerDate?.locationStatus,
            centerLocation: freelancerDate?.centerLocation,
            date: freelancerDate?.date,
            offDay: freelancerDate?.bOffDay,
            schedule: freelancerDate?.schedule,
            areaRadius: freelancerDate?.areaRadius,
          }
        : {
            specificDateAvailabilityId:
              freelancerDate?.specificDateAvailabilityId,
            schedule: freelancerDate?.schedule,
            bDefault: freelancerDate?.bDefault,
          },
      paymentIntentId: paymentIntentId,
      services: Object.values(freelancerServices).reduce((acc, servs) => {
        servs.forEach((s, i) => {
          if (checked[s.serviceCategory].has(i)) {
            acc.push(s._id);
          }
        });
        return acc;
      }, []),
    })
      .then((appointment) => {
        socket?.emit("updateNotifications", freelancerId, "freelancer");
        navigate("/search");
      })
      .catch(async (error) => {
        console.log(error);
        await fullRefund(customerId, paymentIntentId)
          .then(() => {
            console.log("payment was successful but refunded");
          })
          .catch((err) => {
            console.log("payment refund failed", err);
          });
        setIsLoading(false);
        setShowDialog(true);
        console.log("book appointment failed");
      });
  }
  if (isLoading) {
    return <Loading />;
  }

  const summaryComponent = () => {
    return (
      <BookingSummary
        freelancerDate={formatDate(freelancerDate?.date)}
        freelancerServices={freelancerServices}
        checked={checked}
        appTime={appTime}
        price={price}
      />
    );
  };

  return (
    <Grid
      container
      spacing={4}
      sx={{
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <Grid item xs={6}>
            <Typography variant="h4" sx={{ m: 2 }} align="center">
              Book your Appointment with {freelancerData?.firstName}{" "}
              {freelancerData?.lastName}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <Grid item xs={8}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps = {};
                const labelProps = {};

                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={3} />
      <Grid item xs={6} sx={{ ml: "10" }}>
        <Alert severity="info">
          Please complete all needed information to book your appointment
        </Alert>
      </Grid>
      <Grid item xs={12}>
        {activeStep === 0 ? (
          <Grid container justifyContent="space-evenly">
            <Grid item xs={4}>
              <Grid container direction="column" alignItems="center">
                <Typography align="center" variant="h6">
                  Choose an appointment date
                </Typography>
                <Grid item>
                  <MuiCalendar
                    freelancer={freelancerData}
                    edittable={false}
                    handleEditSpecificFreelancerDate={setFreelancerDate}
                    clickedDate={clickedDate}
                    setClickedDate={setClickedDate}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={3}>
              <Grid
                container
                direction="column"
                alignItems="center"
                sx={{ pr: 15 }}
              >
                <Typography variant="h6" align="center">
                  Choose appointment services
                </Typography>
                <Alert severity="info">
                  Please choose at least one service for your appointment
                </Alert>
                <ServicesTab
                  servicesTypes={freelancerServices}
                  currentTab={currentTab}
                  setCurrentTab={setCurrentTab}
                  handleToggle={handleToggle}
                  checked={checked}
                />
              </Grid>
            </Grid>
          </Grid>
        ) : activeStep === 1 ? (
          <Grid
            container
            direction="column"
            justifyContent="space-evenly"
            spacing={4}
          >
            <Grid item>
              <Grid container justifyContent="space-evenly">
                <Grid xs={6} container direction="column" alignItems="center">
                  <Typography align="center" variant="h6">
                    Booking Summary
                  </Typography>
                  <Grid item xs={5}>
                    {summaryComponent()}
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container direction="column" alignItems="center">
                    <Typography align="center" variant="h6">
                      Choose Time Slot
                    </Typography>
                    <Typography>Available Appointments</Typography>
                    <Typography>{formatDate(freelancerDate?.date)}</Typography>
                    {timeSlots?.length > 0 ? (
                      <TimeSlotList
                        items={timeSlots}
                        value={timeSlot}
                        onChange={handleTimeSlot}
                      />
                    ) : (
                      <Grid
                        container
                        spacing={4}
                        direction="column"
                        alignItems="center"
                      >
                        <Grid item />
                        <Grid item>
                          <Typography align="center">
                            Sorry there aren't available slots that fit your
                            total services time.
                          </Typography>
                        </Grid>
                        <Grid>
                          <Typography align="center">
                            Please choose another date
                          </Typography>
                        </Grid>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container justifyContent="center" spacing={4}>
                <Grid item>
                  <Typography variant="h6" align="center">
                    Appointment location
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Grid container direction="column">
                    <LocationAutocomplete
                      locationOptions={locationOptions}
                      setLocationOptions={setLocationOptions}
                      chosenLocationObject={chosenLocationObject}
                      setChosenLocationObject={setChosenLocationObject}
                      locString={address}
                      handleLocChange={setAddress}
                      setLongitude={setLongitude}
                      setLatitude={setLatitude}
                      disabled={freelancerDate?.locationStatus === "AtSalon"}
                      bookLocationEdit={true}
                      errorBook={locError}
                    />
                    <Grid item xs={1}>
                      <Alert severity="info">
                        {freelancerDate?.locationStatus === "AtSalon"
                          ? "Cannot be customized as the freelancer will be at the salon on the day of your appointment"
                          : "Enter your preferred appointment location within the freelancer's allowed area colored in blue"}
                      </Alert>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container xs={9} justifyContent="flex-end">
                {/* <Grid item xs={9}> */}
                <Typography variant="subtitle2" color="primary">
                  <Place fontSize="medium" />
                  Freelancer Center location
                </Typography>
                <Typography variant="subtitle2" color="error">
                  <Place fontSize="medium" />
                  Appointment Location
                </Typography>
                {freelancerDate?.locationStatus === "OnTheMove" &&
                  freelancerDate?.areaRadius > 0 && (
                    <Typography variant="subtitle2" color="primary">
                      <CircleIcon fontSize="medium" />
                      Freelancer Radius
                    </Typography>
                  )}
                {/* </Grid> */}
              </Grid>
            </Grid>
            <Grid item>
              <Grid container justifyContent="center">
                <Grid item xs={7}>
                  <MapContainer
                    center={[
                      freelancerDate?.centerLocation?.latitude,
                      freelancerDate?.centerLocation?.longitude,
                    ]}
                    zoom={13}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* freelancer location marker*/}
                    <Marker
                      position={[
                        freelancerDate?.centerLocation?.latitude,
                        freelancerDate?.centerLocation?.longitude,
                      ]}
                    />
                    {locError === "" && latitude && longitude && (
                      // customer chosen location marker
                      <Marker
                        icon={
                          new Icon({
                            iconUrl: markerIconRed,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                          })
                        }
                        position={[latitude, longitude]}
                      />
                    )}
                    {/* radius value is in meters so we need to convert freelancer radius from KM to meters */}
                    {freelancerDate?.locationStatus === "OnTheMove" &&
                      freelancerDate?.areaRadius > 0 && (
                        <Circle
                          center={[
                            freelancerDate?.centerLocation?.latitude,
                            freelancerDate?.centerLocation?.longitude,
                          ]}
                          radius={freelancerDate?.areaRadius * 1000}
                        />
                      )}
                  </MapContainer>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : activeStep === 2 ? (
          <Grid container direction="column" spacing={4}>
            <Grid item>
              <Grid container justifyContent="center">
                <Grid item>
                  <Typography variant="h4"> Appointment Details </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Grid container justifyContent="space-around">
                <Grid item xs={6}>
                  {summaryComponent()}
                </Grid>
                <Grid item xs={4}>
                  <Grid
                    container
                    spacing={5}
                    direction="column"
                    justifyContent="space-evenly"
                    alignItems="stretch"
                  >
                    <Grid item />
                    <Grid item>
                      <Grid container spacing={2}>
                        <Grid item sx={{ fontWeight: "bold" }}>
                          Location:
                        </Grid>
                        <Grid item>{address}</Grid>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Grid container spacing={2}>
                        <Grid item sx={{ fontWeight: "bold" }}>
                          Time:
                        </Grid>
                        <Grid item>{timeSlots[timeSlot]}</Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Payment
            clientSecret={clientSecret}
            handleSubmitAppointment={handleSubmitAppointment}
            summaryComponent={summaryComponent()}
            handleBack={handleBack}
            showDialog={showDialog}
            setShowDialog={setShowDialog}
            stripePromise={stripePromise}
            setActiveStep={setActiveStep}
          />
        )}
      </Grid>
      <Grid item xs={12}>
        {/* don't render back/next buttons in payment view */}
        {activeStep < steps.length - 1 && (
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            sx={{ m: 10 }}
          >
            <Grid item xs={2}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
            </Grid>
            <Grid item xs={2}>
              <Button onClick={handleNext} disabled={nextDisabled}>
                Next
              </Button>
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}
