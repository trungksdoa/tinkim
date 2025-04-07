import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { groupAPI } from "./groupAPI";

interface Group {
  id: number;
  name: string;
  address?: string;
}

interface GroupResponse {
  data: Group[];
  message?: string;
}

interface SingleGroupResponse {
  data: Group;
  message?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
}

const groupKeys = {
  all: ["groups"] as const,
  lists: () => [...groupKeys.all, "list"] as const,
  detail: (id: number) => [...groupKeys.all, "detail", id] as const,
};

export const useGroups = () => {
  return useQuery<GroupResponse, ErrorResponse>({
    queryKey: groupKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(groupAPI.gets);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useGroup = (id: number) => {
  return useQuery<SingleGroupResponse, ErrorResponse>({
    queryKey: groupKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(groupAPI.get(id));
      return response.data;
    },
  });
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Group>({
    mutationFn: async (group) => {
      await axiosInstance.post(groupAPI.create, group);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};

export const useCreateBulkGroups = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Group[]>({
    mutationFn: async (groups) => {
      await axiosInstance.post(groupAPI.createBulk, groups);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};

export const useUpdateGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Group>({
    mutationFn: async (group) => {
      await axiosInstance.put(groupAPI.update(group.id), group);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, number>({
    mutationFn: async (id) => {
      await axiosInstance.delete(groupAPI.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: groupKeys.lists() });
    },
  });
};