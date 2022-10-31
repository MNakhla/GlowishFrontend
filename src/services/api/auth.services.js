import api from "./api.services";

const signUp = (data) => api("no-auth").post("/v1/auth/signup", data);
const logIn = (data) => api("no-auth").post("/v1/auth/login", data);

export { signUp, logIn };
