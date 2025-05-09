import axios from "axios";
import type { User } from "../types/user";

const API_JSON_PLACEHOLDER_BASE_URL = "https://jsonplaceholder.typicode.com";
const API_BASE_URL = "http://localhost:4000";

export const apiService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get(
        `${API_JSON_PLACEHOLDER_BASE_URL}/users`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
  login: async (email: string, password: string): Promise<string> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      const { token } = response.data;
      return token;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
};
