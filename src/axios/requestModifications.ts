import { store } from "../stores/store";
import { clearUser } from "../stores/userSlice";

export const requestHandler = (request: any) => {
  let accessToken = localStorage.getItem("accessToken"); // Try to get the explicitly set token first

  if (!accessToken) { // Fallback to redux-persist stored token if explicit one is not found
    try {
      const persistedState = localStorage.getItem('persist:root');
      if (persistedState) {
        const parsedState = JSON.parse(persistedState);
        const userState = JSON.parse(parsedState.user);
        accessToken = userState.accessToken;
      }
    } catch (error) {
      console.error("Failed to parse persisted state from localStorage", error);
    }
  }

  if (accessToken) request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
};

export const successHandler = (response: any) => {
  return {
    ...response,
    data: response.data,
  };
};
export const errorHandler = (error: any) => {
  const { status, data } = error?.response;
  if (
    status === 401 ||
    data?.message === "Unauthorized Access to an operation"
  ) {
    store.dispatch(clearUser());
  }
  return Promise.reject(error);
};
