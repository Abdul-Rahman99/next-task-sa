import axios from "axios";

export let role = "admin";

const api = axios.create({
  baseURL: "http://localhost:3000/",
});

export default api;
