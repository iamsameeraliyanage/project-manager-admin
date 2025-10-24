import type { User } from "../types/user";
import { ENV_API_BASE_URL } from "./base-url";
import API from "./axios-client";
import type { LoginRequest, LoginResponse } from "../types/authentication";

const API_BASE_URL = `${ENV_API_BASE_URL}/api`;

export const loginMutationFn = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const getCurrentUserQueryFn = async (): Promise<User> => {
  const response = await API.get(`${API_BASE_URL}/users/current`);
  return response.data;
};
