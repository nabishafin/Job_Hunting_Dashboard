import baseApi from "@/redux/api/baseApi";
import {
  setResetEmail,
  clearResetEmail,
} from "@/redux/slices/forgotPasswordSlice";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 01. login
    login: builder.mutation({
      query: (loginData) => ({
        url: "/auth/login",
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: ["auth"],
    }),

    // 02. refresh token
    refreshToken: builder.mutation({
      query: () => {
        const refreshToken = localStorage.getItem("refreshToken");
        return {
          url: "/auth/refresh-auth",
          method: "POST",
          body: { refreshToken },
        };
      },
      invalidatesTags: ["auth"],
    }),

    // 03. logout
    logout: builder.mutation({
      query: () => {
        const refreshToken = localStorage.getItem("refreshToken");
        return {
          url: "/auth/logout",
          method: "POST",
          body: { refreshToken },
        };
      },
      invalidatesTags: ["auth"],
    }),

    // 04. get user by token
    getUserByToken: builder.query({
      query: () => ({ url: `/user/my-profile`, method: "GET" }),
      providesTags: ["auth"],
    }),

    // 05. update user
    updateUser: builder.mutation({
      query: (data) => ({
        url: `/user/update`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),

    // 06. forgot password
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;

          // Store reset token if provided
          const token =
            data?.resetPasswordToken ||
            data?.data?.resetPasswordToken ||
            data?.token;
          if (token) localStorage.setItem("resetPasswordToken", token);

          // Store email for OTP verification
          if (arg.email) dispatch(setResetEmail(arg.email));
        } catch (error) {
          console.error("Forgot password error:", error);
        }
      },
    }),

    // 07. verify email/OTP
    verifyEmail: builder.mutation({
      query: ({ email, otp }) => ({
        url: "/auth/verify-email-otp",
        method: "POST",
        body: { email, otp },
      }),
      invalidatesTags: ["auth"],
    }),

    // 08. reset password
    resetPassword: builder.mutation({
      query: (data) => {
        return {
          url: `/auth/reset-password`,
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["auth"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(clearResetEmail());
        } catch (error) {
          console.error("Reset password error:", error);
        }
      },
    }),

    // 09. change password (logged-in user)
    changePassword: builder.mutation({
      query: (data) => ({
        url: `/users/update-admin-password`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetUserByTokenQuery,
  useUpdateUserMutation,
} = authApi;
