import api from "./api.services";

const getFreelancerById = (id) => api().get(`/v1/freelancerProfile/${id}`);

const setFreelancerComplete = (id, completed) =>
  api().put(`/v1/freelancerProfile/complete/${id}`, completed);

const postFreelancerReview = (id, customerId, review) =>
  api().post(`/v1/freelancerProfile/review/${id}/${customerId}`, review);

const putFreelancerInfo = (id, updatedInfo) =>
  api().put(`/v1/freelancerProfile/info/${id}`, updatedInfo);

const deleteFreelancerService = (id, serviceId) =>
  api()
    .delete(`/v1/freelancerProfile/service/${id}/${serviceId}`)
    .catch((err) => console.log(err.message));
const postNewFreelancerService = (id, service) =>
  api().post(`/v1/freelancerProfile/service/${id}/`, service);
const putFreelancerService = (id, serviceId, updatedService) =>
  api().put(`/v1/freelancerProfile/service/${id}/${serviceId}`, updatedService);

//#region FreelancerDefaultAvailability
const postNewFreelancerDefaultAvailability = (id, newDefaultAvailability) =>
  api().post(
    `/v1/freelancerProfile/defaultAvailability/${id}`,
    newDefaultAvailability
  );
const putFreelancerDefaultAvailability = (id, updatedDefaultAvailability) =>
  api().put(
    `/v1/freelancerProfile/defaultAvailability/${id}`,
    updatedDefaultAvailability
  );

const postNewFreelancerSpecificDateAvailability = (
  id,
  newSpecificDateAvailability
) =>
  api().post(
    `/v1/freelancerProfile/specificDateAvailability/${id}`,
    newSpecificDateAvailability
  );
const putFreelancerSpecificDateAvailability = (
  id,
  specificDateAvailabilityId,
  updatedSpecificDateAvailability
) =>
  api()
    .put(
      `/v1/freelancerProfile/specificDateAvailability/${id}/${specificDateAvailabilityId}`,
      updatedSpecificDateAvailability
    )
    .then((res) => {
      return res;
    });

//#endregion

const uploadPhoto = async (photo) => {
  const formData = new FormData();
  let imageUrl = "";
  formData.append("file", photo);
  try {
    const response = await api().post("/v1/image-upload/upload", formData);
    imageUrl = response;
  } catch (error) {
    console.error(error);
  }
  return imageUrl;
};

const postNewFreelancerPortfolioImg = (id, imgUrl) => {
  // console.log(imgUrl);
  api()
    .post(`/v1/freelancerProfile/${id}/portfolio/`, { imgUrl: imgUrl })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err.message));
};
const deleteFreelancerPortfolioImg = (id, imageUrl) =>
  api().put(`/v1/freelancerProfile/portfolio/delete/${id}`, {
    imageUrl: imageUrl,
  });

const updateFreelancerProfileImg = (id, imgUrl) =>
  api().put(`/v1/freelancerProfile/${id}/profileImage/`, { imgUrl: imgUrl });

const postSpecificAvailability = (id, data) =>
  api().post(`v1/freelancerProfile/specificDateAvailability/${id}`, data);

const updateSpecificAvailability = (id, sid, data) =>
  api().put(`v1/freelancerProfile/specificDateAvailability/${id}/${sid}`, data);

export {
  getFreelancerById,
  setFreelancerComplete,
  deleteFreelancerService,
  postNewFreelancerService,
  putFreelancerService,
  postNewFreelancerPortfolioImg,
  deleteFreelancerPortfolioImg,
  updateFreelancerProfileImg,
  uploadPhoto,
  postNewFreelancerDefaultAvailability,
  putFreelancerDefaultAvailability,
  postNewFreelancerSpecificDateAvailability,
  putFreelancerSpecificDateAvailability,
  postSpecificAvailability,
  updateSpecificAvailability,
  putFreelancerInfo,
  postFreelancerReview,
};
