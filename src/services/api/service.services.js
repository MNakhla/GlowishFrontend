import api from "./api.services";

const getById = (id) => api().get(`/v1/service?id=${id}`);

export { getById };
