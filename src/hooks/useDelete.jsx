import {  useCallback } from "react";
import { useSelector } from "react-redux";
import httpRequest from "../axios";
import { selectAccessToken } from "../stores/userSlice";
import useUnauthenticate from "./handle-unauthenticated";

const useDelete = () => {
  const accessToken = useSelector(selectAccessToken);
  const unauthenticate = useUnauthenticate();

  const deleteData = useCallback(
    async (url, params = {}) => {
      try {
        const response = await httpRequest.delete(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          data: params, // Add params to the request body if needed
        });

        if (response.status === 200 || response.status === 204) {
          return response.data; // Return the response data if any
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          unauthenticate();
        } else {
          throw err; // Re-throw the error for the caller to handle
        }
      }
    },
    [accessToken, unauthenticate]
  );

  return { deleteData };
};

export default useDelete;
