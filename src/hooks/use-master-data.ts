import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import api from "@/lib/api";
import { ApiResponse } from "@/types/api";

// Types
export interface Division {
  id: string;
  division: string;
  subdivisions: Subdivision[];
}

export interface Subdivision {
  id: string;
  name: string;
  division_id: string;
}

export interface LovolDivision {
  id: string;
  name: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Faculty {
  id: string;
  name: string;
}

export interface PbmBatch {
  id: string;
  name: string;
}

// Hooks

export function useGetDivision() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<Division[]>>
  >({
    queryKey: ["divisionList"],
    queryFn: async () => {
      const response = await api.get("/api/v1/master/division");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    divisionList: data?.data.data,
    subdivisions:
      data?.data.data?.flatMap((division) => division.subdivisions) || [],
    isLoading,
    error,
  };
}

export function useGetLovolDivision() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<LovolDivision[]>>
  >({
    queryKey: ["divisionList", "lovol"],
    queryFn: async () => {
      const response = await api.get("/api/v1/master/division-lovol");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    divisionList: data?.data.data,
    isLoading,
    error,
  };
}

export function useGetDepartment() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<Department[]>>
  >({
    queryKey: ["departmentList"],
    queryFn: async () => {
      const response = await api.get("/api/v1/master/department");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    departmentList: data?.data.data,
    isLoading,
    error,
  };
}

export function useGetFaculty() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<Faculty[]>>
  >({
    queryKey: ["facultyList"],
    queryFn: async () => {
      const response = await api.get("/api/v1/master/faculty");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    facultyList: data?.data.data,
    isLoading,
    error,
  };
}

export function useGetPbmBatch() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<PbmBatch[]>>
  >({
    queryKey: ["pbm-batch"],
    queryFn: async () => {
      const response = await api.get("/api/v1/master/pbm-batch");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    batchList: data?.data.data,
    isLoading,
    error,
  };
}
// ... existing code ...

export interface ProductCategory {
  id: string;
  value: string;
}

// ... existing code ...

export function useGetProductCategories() {
  const { data, isLoading, error } = useQuery<
    AxiosResponse<ApiResponse<ProductCategory[]>>
  >({
    queryKey: ["product-category"],
    queryFn: async () => {
      const response = await api.get("/api/v1/master/product-category");
      return response;
    },
    staleTime: Infinity,
  });

  return {
    categories: data?.data.data,
    isLoading,
    error,
  };
}
