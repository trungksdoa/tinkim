import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { roleAPI } from "./roleAPI";

interface Role {
  id: number;
  name: string;
}

interface RoleResponse {
  data: Role[];
  message?: string;
}

interface SingleRoleResponse {
  data: Role;
  message?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
}

const roleKeys = {
  all: ["roles"] as const,
  lists: () => [...roleKeys.all, "list"] as const,
  detail: (id: number) => [...roleKeys.all, "detail", id] as const,
};

export const useRoles = () => {
  return useQuery<RoleResponse, ErrorResponse>({
    queryKey: roleKeys.lists(),
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(roleAPI.gets);
        return response.data;
      } catch (error) {
        throw {
          message: "Failed to fetch roles",
          status: 500,
        };
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useRole = (id: number) => {
  return useQuery<SingleRoleResponse, ErrorResponse>({
    queryKey: roleKeys.detail(id),
    queryFn: async () => {
      try {
        const response = await axiosInstance.get(roleAPI.get(id));
        return response.data;
      } catch (error) {
        throw {
          message: "Failed to fetch role",
          status: 500,
        };
      }
    },
  });
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Role>({
    mutationFn: async (role) => {
      try {
        await axiosInstance.post(roleAPI.create, role);
      } catch (error) {
        throw {
          message: "Failed to create role",
          status: 500,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Role>({
    mutationFn: async (role) => {
      try {
        await axiosInstance.put(roleAPI.update(role.id), role);
      } catch (error) {
        throw {
          message: "Failed to update role",
          status: 500,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, number>({
    mutationFn: async (id) => {
      try {
        await axiosInstance.delete(roleAPI.delete(id));
      } catch (error) {
        throw {
          message: "Failed to delete role",
          status: 500,
        };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roleKeys.lists() });
    },
  });
};