// src/redux/features/profile/profileApi.js

import { baseApi } from "../../api/baseApi";

export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({

        // GET Profile - fetches current authenticated user
        getProfile: builder.query({
            query: () => ({
                url: "/users/me",
                method: "GET",
            }),
            providesTags: ["PROFILE"],
        }),

        // UPDATE Profile (PATCH /users/:id)
        updateProfile: builder.mutation({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["PROFILE"],
        }),

    }),
});

export const {
    useGetProfileQuery,
    useUpdateProfileMutation,
} = profileApi;
