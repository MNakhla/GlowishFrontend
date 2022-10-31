import api from "./api.services";

const getAllFreelancers = () => api().get("/v1/freelancer/");
const getFreelancerById = (id) => api().get(`/v1/freelancerProfile/${id}`);
const getFreelancerPopById = (id) => api().get(`/v1/freelancer/${id}`);
const searchByDateAndLoc = (latitude, longitude, date, service) =>
  api().get(
    `/v1/freelancer/search?latitude=${latitude}&longitude=${longitude}&date=${date}&service=${service}`
  );

const updateFreelancerNotification = (id, notif_idx) =>
  api().patch(`v1/freelancer/notif/${id}/${notif_idx}`);

export {
  getAllFreelancers,
  getFreelancerById,
  getFreelancerPopById,
  searchByDateAndLoc,
  updateFreelancerNotification,
};
