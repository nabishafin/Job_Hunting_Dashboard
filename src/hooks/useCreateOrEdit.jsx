import {  useCallback } from "react";
import { useSelector } from "react-redux";
import httpRequest from "../axios";
import { selectAccessToken } from "../stores/userSlice";
import useUnauthenticate from "./handle-unauthenticated";

const useCreateOrEdit = () => {
  const accessToken = useSelector(selectAccessToken);
  const unauthenticate = useUnauthenticate();

  const submitData = useCallback(
    async (endPoint, data, method = "POST") => {
        const url = method === "POST" ? httpRequest.post : httpRequest.put
        console.log(data)
      try {
        const response = await url(endPoint, data, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status === 200 || response.status === 201) {
          return response
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          unauthenticate();
        } else {
          throw err; 
        }
      }
    },
    [accessToken, unauthenticate]
  );

  return { submitData };
};

export default useCreateOrEdit;
