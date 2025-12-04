import baseApi from "../../api/baseApi";

export const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ⭐ Create Blog
        createBlog: builder.mutation({
            query: (data) => ({
                url: "/blogs/create-blog",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),

        // ⭐ Get All Blogs
        getAllBlogs: builder.query({
            query: (query) => {
                if (!query) {
                    return {
                        url: "/blogs",
                        method: "GET",
                    };
                }
                const params = new URLSearchParams(query).toString();
                return {
                    url: `/blogs?${params}`,
                    method: "GET",
                };
            },
            providesTags: ["Blog"],
        }),

        // ⭐ Get Single Blog by ID
        getBlogById: builder.query({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "GET",
            }),
            providesTags: ["Blog"],
        }),

        // ⭐ Update Blog
        updateBlog: builder.mutation({
            query: ({ id, data }) => ({
                url: `/blogs/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Blog"],
        }),

        // ⭐ Delete Blog
        deleteBlog: builder.mutation({
            query: (id) => ({
                url: `/blogs/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Blog"],
        }),

    }),
});

export const {
    useCreateBlogMutation,
    useGetAllBlogsQuery,
    useGetBlogByIdQuery,
    useUpdateBlogMutation,
    useDeleteBlogMutation
} = blogApi;
