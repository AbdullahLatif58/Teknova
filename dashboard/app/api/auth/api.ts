import axiosClient from "@/utils/apiClient";

export const signupUser = async (data: Record<string, string>) => {
  const res = await axiosClient.post("/auth/signup", data);
  // @ts-ignore
  if (res.data?.success || res.status === 200 || res.status === 201) {
    return res.data;
  }
  // @ts-ignore
  throw new Error(res.data?.message || "Registration failed");
};

export const loginUser = async (data: Record<string, string>) => {
  const res = await axiosClient.post("/auth/login", data);
  // @ts-ignore
  if (res.data?.success || res.status === 200) {
    return res.data;
  }
  // @ts-ignore
  throw new Error(res.data?.message || "Login failed");
};

export const requestPasswordReset = async (email: string) => {
  const res = await axiosClient.post("/auth/password-forget", { email });
  // @ts-ignore
  if (res.data?.success || res.status === 200) {
    return res.data;
  }
  // @ts-ignore
  throw new Error(res.data?.message || "Failed to send reset link");
};

export const resetPassword = async (token: string, data: Record<string, string>) => {
  const res = await axiosClient.post(`/auth/password-reset/${token}`, data);
  // @ts-ignore
  if (res.data?.success || res.status === 200) {
    return res.data;
  }
  // @ts-ignore
  throw new Error(res.data?.message || "Failed to reset password");
};

export const logoutUser = async () => {
  const res = await axiosClient.post("/auth/logout");
  return res.data;
};

export const getProfile = async () => {
  const res = await axiosClient.get("/auth/me");
  return res.data;
};

export const updateProfile = async (data: any) => {
  const res = await axiosClient.patch("/auth/me", data);
  return res.data;
};

export const refreshToken = async () => {
  const res = await axiosClient.post("/auth/refresh-token");
  return res.data;
};
