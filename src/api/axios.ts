import axios from "axios";

const instance = axios.create({
  baseURL: "https://your-api-url.com/api",
  withCredentials: true,
});

export default instance;
