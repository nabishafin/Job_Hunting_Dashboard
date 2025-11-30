// src/redux/features/couriers/couriersApi.js
import baseApi from "../../api/baseApi";

export const couriersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET all couriers
        getAllCouriers: builder.query({
            query: (params) => {
                const queryString = new URLSearchParams({ ...params, role: "courier" }).toString();
                return `/users?${queryString}`;
            },
            providesTags: ["Courier"],
        }),

        // GET single courier by ID
        getCourierById: builder.query({
            query: (id) => `/users/${id}`,
            providesTags: (result, error, id) => [{ type: "Courier", id }],
        }),

        // CREATE courier
        addCourier: builder.mutation({
            query: (data) => ({
                url: "/users/create-user",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Courier"],
        }),

        // UPDATE courier
        updateCourier: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Courier", id }, "Courier"],
        }),

        // DELETE courier
        deleteCourier: builder.mutation({
            query: (id) => ({
                url: `/couriers/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Courier"],
        }),
    }),

    overrideExisting: false,
});

export const {
    useGetAllCouriersQuery,
    useGetCourierByIdQuery,
    useAddCourierMutation,
    useUpdateCourierMutation,
    useDeleteCourierMutation,
} = couriersApi;
