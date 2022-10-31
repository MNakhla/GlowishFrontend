import api from "./api.services";

const addAppointment = (appointment) => api().post("v1/book/", appointment);
const cancelAppointment = (appointmentId, customerId, body) =>
  api().patch(
    `v1/book/cancelAppointment/${customerId}?appointmentId=${appointmentId}`,
    body
  );

export { addAppointment, cancelAppointment };
