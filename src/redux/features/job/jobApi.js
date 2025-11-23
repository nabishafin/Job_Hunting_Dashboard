import baseApi from "../../api/baseApi";

export const jobApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ================================
    // Get jobs with all status
    // ================================
    getJobsWithStatus: builder.query({
      query: () => ({
        url: "/jobs/job-with-all-status",
        method: "GET",
      }),
      providesTags: ["JobStatus"],
    }),

    // ================================
    // Get all jobs (with filters / params)
    // ================================
    getAllJobs: builder.query({
      query: (params) => ({
        url: "/jobs",
        method: "GET",
        params: params,
      }),
      providesTags: ["Jobs"],
    }),

    // ================================
    // Get Job by ID
    // ================================
    getJobById: builder.query({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      }),
      providesTags: ["JobDetail"],
    }),

    // ================================
    // Create Job
    // ================================
    createJob: builder.mutation({
      query: (jobData) => ({
        url: "/jobs",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
        body: jobData,
      }),
      invalidatesTags: ["JobStatus", "Jobs"],
    }),

    // ================================
    // Update Job
    // ================================
    updateJob: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/jobs/${id}`,
        method: "PATCH",
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
        body: updatedData,
      }),
      invalidatesTags: ["Jobs", "JobDetail", "JobStatus"],
    }),

    // ================================
    // Delete Job
    // ================================
    deleteJob: builder.mutation({
      query: (id) => ({
        url: `/jobs/${id}`,
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("accessToken"),
        },
      }),
      invalidatesTags: ["Jobs", "JobStatus"],
    }),
  }),
});

export const {
  useGetJobsWithStatusQuery,
  useGetAllJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
} = jobApi;
