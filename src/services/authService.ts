import { Mutation, useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { userAPI } from "./userAPI";
import {Employee} from '@/types/employee'
interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  data: {
    token: string;
    user: {
      id: number;
      email: string;
    };
  };
}

interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  gender: string;
}


interface ErrorResponse {
  message: string;
  status: number;
}

const authKeys = {
  user: ["auth", "user"] as const,
  token: ["auth", "token"] as const,
};

const setAuthToken = (token: string) => {
  document.cookie = `authToken=${token}; path=/; secure; samesite=strict`;
};

const removeAuthToken = () => {
  document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

// Also need to modify the middleware to check sessionStorage instead of cookies

export const useLogin = () => {
  return useMutation<LoginResponse, ErrorResponse, LoginCredentials>({
    mutationFn: async (
      credentials: LoginCredentials
    ): Promise<LoginResponse> => {
      try {
        const response = await axiosInstance.post(userAPI.login, credentials);
        return response.data;
      } catch (error: any) {
        throw {
          message:  "Login failed",
          status: 500,
        };
      }
    },
    onSuccess: (data) => {
      console.log(data);
      setAuthToken(data.data?.token);
      localStorage.setItem("user", JSON.stringify(data.data?.user));
    },
    onError: () => {
      removeAuthToken();
      localStorage.removeItem("user");
    },
  });
};

export const useRegister = () => {
  return useMutation<Employee, ErrorResponse, RegisterCredentials>({
    mutationFn: async (credentials: RegisterCredentials) => {
      try {
        const response = await axiosInstance.post(userAPI.register, credentials);
        return response.data;
      } catch (error) {
        throw error;
      }
    },
  });
}
export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      try {
        await axiosInstance.post(userAPI.logout);
      } catch (error) {
        throw error;
      }
    },
    onSuccess: () => {
      removeAuthToken();
      localStorage.removeItem("user");
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.user,
    queryFn: () => {
      const userStr = localStorage.getItem("user");
      if (!userStr) return null;
      return JSON.parse(userStr);
    },
    staleTime: Infinity, // Data never goes stale since it's managed through localStorage
    gcTime: Infinity, // Keep the data cached indefinitely
  });
};
