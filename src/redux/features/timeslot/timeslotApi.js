import baseApi from "../../api/baseApi";

export const timeslotApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // -------------------------
        // 👉 Get All TimeSlots
        // -------------------------
        getAllTimeslots: builder.query({
            query: (query) => {
                const params = new URLSearchParams(query).toString();
                return {
                    url: `/time-slots?${params}`,
                    method: "GET",
                };
            },
            providesTags: ["TimeSlots"],
        }),

        // -------------------------
        // 👉 Add New TimeSlot
        // -------------------------
        addTimeslot: builder.mutation({
            query: (data) => ({
                url: "time-slots/create-time-slot",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["TimeSlots"],
        }),

        // -------------------------
        // 👉 Update TimeSlot
        // -------------------------
        updateTimeslot: builder.mutation({
            query: ({ id, data }) => ({
                url: `/time-slots/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["TimeSlots"],
        }),

        // -------------------------
        // 👉 Delete TimeSlot
        // -------------------------
        deleteTimeslot: builder.mutation({
            query: (id) => ({
                url: `/time-slots/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["TimeSlots"],
        }),
    }),
});

export const {
    useGetAllTimeslotsQuery,
    useAddTimeslotMutation,
    useUpdateTimeslotMutation,
    useDeleteTimeslotMutation,
} = timeslotApi;
