import { createClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/clerk-react";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// Basic client — for non-authenticated/public use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Clerk-authenticated client — must be used inside a component
export const useSupabaseClient = () => {
  const { getToken } = useAuth();

  const getClient = async () => {
    const token = await getToken({ template: "supabase" });

    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
  };

  return { getClient };
};
