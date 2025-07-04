import { useAuth } from "@clerk/clerk-react";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const useSupabaseClient = () => {
  const { getToken } = useAuth();

  const getClient = async () => {
    const token = await getToken({ template: "supabase" });

    return createBrowserClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  };

  return { getClient };
};
