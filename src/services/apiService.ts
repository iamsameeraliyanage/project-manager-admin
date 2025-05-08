import axios from "axios";
import type { User } from "../types/User";

const API_BASE_URL = "https://jsonplaceholder.typicode.com";

export const apiService = {
  getUsers: async (): Promise<User[]> => {
    try {
      const response = await axios.get(`${API_BASE_URL}/users`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  },
};
