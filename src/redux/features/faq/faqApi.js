// src/redux/features/faq/faqApi.js
import { baseApi } from "../../api/baseApi";

export const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // GET all FAQs
        getAllFaqs: builder.query({
            query: (query) => {
                const params = new URLSearchParams(query).toString();
                return {
                    url: `/faqs?${params}`,
                    method: "GET",
                };
            },
            providesTags: ["Faq"],
        }),



        // ADD new FAQ
        addFaq: builder.mutation({
            query: (data) => ({
                url: "faqs/create-faq",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Faq"],
        }),

        // UPDATE FAQ
        updateFaq: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `faqs/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Faq", id }],
        }),

        // DELETE FAQ
        deleteFaq: builder.mutation({
            query: (id) => ({
                url: `faqs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Faq"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllFaqsQuery,
    useAddFaqMutation,
    useUpdateFaqMutation,
    useDeleteFaqMutation,
} = faqApi;
