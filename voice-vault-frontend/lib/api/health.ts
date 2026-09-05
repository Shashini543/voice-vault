import { apiClient } from "./client";

export const checkHealth = async () => {
    const response = await apiClient.get("/api/health");
    return response.data;
};