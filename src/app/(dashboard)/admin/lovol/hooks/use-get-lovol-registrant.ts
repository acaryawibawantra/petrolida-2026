import api from "@/lib/api";
import { LovolRegistrantResponse } from "@/types/lovol";
import { useQuery } from "@tanstack/react-query";

export const useGetLovolRegistrant = (id: string) => {
  return useQuery({
    queryKey: ["lovol-registrant", id],
    queryFn: async () => {
      const response = await api.get<LovolRegistrantResponse>(
        `/api/v1/oprec-lovol/${id}`,
      );
      return response.data.data;
    },
    enabled: !!id,
  });
};
