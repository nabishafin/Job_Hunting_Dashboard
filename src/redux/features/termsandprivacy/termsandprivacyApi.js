// src/redux/features/termsandprivacy/termsandprivacyApi.js
import { baseApi } from "../../api/baseApi";

export const termsAndPrivacyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // POST Terms and Conditions
        postTermsAndConditions: builder.mutation({
            query: (data) => ({
                url: "/terms/create-term",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Terms"],
        }),

        // POST Privacy Policy
        postPrivacyPolicy: builder.mutation({
            query: (data) => ({
                url: "/privacies/create-privacy",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["PrivacyPolicy"],
        }),
    }),
    overrideExisting: false,
});

export const {
    usePostTermsAndConditionsMutation,
    usePostPrivacyPolicyMutation,
} = termsAndPrivacyApi;
