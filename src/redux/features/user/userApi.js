import baseApi from "@/redux/api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET all users with pagination and filters
    getUsers: builder.query({
      query: ({
        page = 1,
        limit = 10,
        search = "",
        status = "",
        role = "",
      }) => {
        const params = new URLSearchParams();

        params.append("page", page.toString());
        params.append("limit", limit.toString());

        if (search) params.append("search", search);
        if (status) params.append("status", status);
        if (role) params.append("role", role);

        return {
          url: `/users?${params.toString()}`,
          method: "GET",
        };
      },

      // This will normalize cache
      providesTags: ["users"],
      keepUnusedDataFor: 0,
    }),
  }),
});

export const { useGetUsersQuery } = userApi;
export default userApi;
