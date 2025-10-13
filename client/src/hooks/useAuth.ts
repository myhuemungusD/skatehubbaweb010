import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data, isLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const token = localStorage.getItem('sessionToken');
      if (!token) {
        throw new Error('No session token');
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      return response.json();
    },
    retry: false,
  });

  return {
    user: data?.user,
    isLoading,
    isAuthenticated: !!data?.user,
  };
}