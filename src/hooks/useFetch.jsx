import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import httpRequest from "../axios";
import { selectAccessToken } from "../stores/userSlice";
import useUnauthenticate from "./handle-unauthenticated";

const useFetch = () => {
  const [error, setError] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const accessToken = useSelector(selectAccessToken);
  const unauthenticate = useUnauthenticate();

  const fetchData = useCallback(
    async (url, params = undefined) => {
      setError(null);

      try {
        const options = {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        if (params) {
          options.params = params;
        }

        const response = await httpRequest.get(url, options);

        if (response.status === 200 || response.status === 201) {
          return response;
        }
      } catch (err) {
        if (err?.response?.status === 401) {
          unauthenticate();
        } else {
          setError(err);
        }
        throw err;
      } finally {
        setPageLoading(false);
      }
    },
    [accessToken, unauthenticate]
  );

  return { error, fetchData };
};

export default useFetch;
