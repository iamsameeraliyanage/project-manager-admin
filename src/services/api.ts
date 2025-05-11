import axios from "axios";
import type { JsonPlaceHolderUser, User } from "../types/user";
import { ENV_API_BASE_URL } from "./base-url";
import API from "./axios-client";
import type { LoginRequest, LoginResponse } from "../types/authentication";

const API_JSON_PLACEHOLDER_BASE_URL = "https://jsonplaceholder.typicode.com"; //TODO remove this later

const API_BASE_URL = `${ENV_API_BASE_URL}/api`;

//TODO Remove this
export const getJsonPlaceholderUsersQueryFn = async (): Promise<
  JsonPlaceHolderUser[]
> => {
  try {
    const response = await axios.get(`${API_JSON_PLACEHOLDER_BASE_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const loginMutationFn = async (
  data: LoginRequest
): Promise<LoginResponse> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const getUsersQueryFn = async (): Promise<User[]> => {
  const response = await API.get(`${API_BASE_URL}/users`);
  return response.data;
};
