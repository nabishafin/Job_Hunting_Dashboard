// src/redux/features/settings/SettingsApi.js
import { baseApi } from "../../api/baseApi";

export const settingsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST Settings
        postSettings: builder.mutation({
            query: (data) => ({
                url: "/contact-socials/create-contact-social",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Settings"],
        }),
    }),
    overrideExisting: false,
});

export const { usePostSettingsMutation } = settingsApi;
