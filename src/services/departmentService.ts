import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { departmentAPI } from "./departmentAPI";

interface Department {
  id: number;
  name: string;
  address?: string;
}

interface DepartmentResponse {
  data: Department[];
  message?: string;
}

interface SingleDepartmentResponse {
  data: Department;
  message?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
}

const departmentKeys = {
  all: ["departments"] as const,
  lists: () => [...departmentKeys.all, "list"] as const,
  detail: (id: number) => [...departmentKeys.all, "detail", id] as const,
};

export const useDepartments = () => {
  return useQuery<DepartmentResponse, ErrorResponse>({
    queryKey: departmentKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(departmentAPI.gets);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useDepartment = (id: number) => {
  return useQuery<SingleDepartmentResponse, ErrorResponse>({
    queryKey: departmentKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(departmentAPI.get(id));
      return response.data;
    },
  });
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Department>({
    mutationFn: async (department) => {
      await axiosInstance.post(departmentAPI.create, department);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useCreateBulkDepartments = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Department[]>({
    mutationFn: async (departments) => {
      await axiosInstance.post(departmentAPI.createBulk, departments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Department>({
    mutationFn: async (department) => {
      await axiosInstance.put(departmentAPI.update(department.id), department);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, number>({
    mutationFn: async (id) => {
      await axiosInstance.delete(departmentAPI.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
};