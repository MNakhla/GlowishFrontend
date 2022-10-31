import api from "./api.services";

const updateCustomerNotification = (id, notif_idx) =>
  api().patch(`v1/customer/notif/${id}/${notif_idx}`);

const getCustomer = (_id) => api().get(`/v1/customer/getOne/${_id}`);

export { getCustomer, updateCustomerNotification };
