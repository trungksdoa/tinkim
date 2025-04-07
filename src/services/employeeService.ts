import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { Employee, EmployeeResponse } from "@/types/employee";
import { userAPI } from "./userAPI";
import { useLoading } from "@/contexts/LoadingContext";

interface SingleEmployeeResponse {
  data: Employee;
  message?: string;
}

interface EmployeesResponse {
  data: Employee[];
  message?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
}

const employeeKeys = {
  all: ["employees"] as const,
  lists: () => [...employeeKeys.all, "list"] as const,
  detail: (id: number) => [...employeeKeys.all, "detail", id] as const,
};

export const useEmployees = () => {
  return useQuery<EmployeeResponse, ErrorResponse>({
    queryKey: employeeKeys.lists(),
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(userAPI.gets);
        return response.data;
      } catch (error) {
        throw {
          message: "take data employee failed",
          status: 500,
        };
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount
  });
};

export const useEmployee = (id: number) => {
  return useQuery<SingleEmployeeResponse, ErrorResponse>({
    queryKey: employeeKeys.detail(id),
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(userAPI.get(id));
        return response.data;
      } catch (error) {
        throw {
          message: "take data employee failed",
          status: 500,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false, // Prevent refetch on window focus
    refetchOnMount: false, // Prevent refetch on component mount
  });
};

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ErrorResponse, number>({
    mutationFn: async (id) => {
      try {
        await axiosInstance.delete(userAPI.delete(id));
      } catch (error) {
        throw {
          message: "delete data employee failed",
          status: 500,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
    onError: (error) => {
      console.error(error);
    },
    retry: 1,
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ErrorResponse, Employee>({
    mutationFn: async (employee) => {
      try {
        await axiosInstance.post(userAPI.register, employee);
      } catch (error) {
        throw {
          message: "create data employee failed",
          status: 500,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
    onError: (error) => {
      console.error(error);
    },
    retry: 5,
  });
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const { setLoading } = useLoading();

  return useMutation<SingleEmployeeResponse, ErrorResponse, Employee>({
    mutationFn: async (employee) => {
      setLoading(true);
      try {
        const res = await axiosInstance.put(
          userAPI.update(employee.id),
          employee
        );
        return res.data;
      } catch (error) {
        throw {
          message: "update data employee failed",
          status: 500,
        };
      } finally {
        setLoading(false);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() });
    },
    onError: (error) => {
      console.error(error);
    },
    retry: 5,
  });
};
