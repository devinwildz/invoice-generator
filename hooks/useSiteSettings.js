"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/** Fetch the single site settings row */
async function fetchSiteSettings() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;
  return data;
}

/** Update site settings */
async function updateSiteSettings(updates) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("site_settings")
    .update(updates)
    .eq("id", 1)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: fetchSiteSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useUpdateSiteSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateSiteSettings,
    onSuccess: (data) => {
      queryClient.setQueryData(["site-settings"], data);
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
    },
  });
}
