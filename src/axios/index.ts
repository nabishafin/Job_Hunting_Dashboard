import axios from "axios";
import {
  requestHandler,
  successHandler,
  errorHandler,
} from "./requestModifications";
import { API_BASE_URL } from "../constants";

const httpRequest = (
  config = {
    headers: {
      contentType: "application/json",
    },
  }
) => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      "Content-Type": config.headers.contentType || "application/json",
    },
  });

  instance.interceptors.request.use(requestHandler);
  instance.interceptors.response.use(successHandler, errorHandler);
  return instance;
};
export default httpRequest();
