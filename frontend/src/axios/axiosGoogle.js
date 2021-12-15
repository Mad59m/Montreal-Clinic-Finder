import axios from "axios";

const googleAPIInstance = axios.create({
  baseURL: "https://maps.googleapis.com/maps/api",
});

export default googleAPIInstance;
