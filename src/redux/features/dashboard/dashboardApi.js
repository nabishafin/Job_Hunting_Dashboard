import baseApi from "../../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllJobStatus: builder.query({
      query: () => ({
        url: "/users/dashboard",
        method: "GET",
      }),
      providesTags: ["dashboardStats"],
    }),
  }),
});

export const { useGetAllJobStatusQuery } = dashboardApi;
