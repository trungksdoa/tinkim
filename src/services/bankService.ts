import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "./axios";
import { bankAPI } from "./bankAPI";

interface Bank {
  id: number;
  name: string;
  code: string;
}

interface BankResponse {
  data: Bank[];
  message?: string;
}

interface SingleBankResponse {
  data: Bank;
  message?: string;
}

interface ErrorResponse {
  message: string;
  status: number;
}

const bankKeys = {
  all: ["banks"] as const,
  lists: () => [...bankKeys.all, "list"] as const,
  detail: (id: number) => [...bankKeys.all, "detail", id] as const,
};

export const useBanks = () => {
  return useQuery<BankResponse, ErrorResponse>({
    queryKey: bankKeys.lists(),
    queryFn: async () => {
      const response = await axiosInstance.get(bankAPI.gets);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useBank = (id: number) => {
  return useQuery<SingleBankResponse, ErrorResponse>({
    queryKey: bankKeys.detail(id),
    queryFn: async () => {
      const response = await axiosInstance.get(bankAPI.get(id));
      return response.data;
    },
  });
};

export const useCreateBank = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Bank>({
    mutationFn: async (bank) => {
      await axiosInstance.post(bankAPI.create, bank);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
    },
  });
};

export const useUpdateBank = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, Bank>({
    mutationFn: async (bank) => {
      await axiosInstance.put(bankAPI.update(bank.id), bank);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
    },
  });
};

export const useDeleteBank = () => {
  const queryClient = useQueryClient();
  return useMutation<void, ErrorResponse, number>({
    mutationFn: async (id) => {
      await axiosInstance.delete(bankAPI.delete(id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.lists() });
    },
  });
};