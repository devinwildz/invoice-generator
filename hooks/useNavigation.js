"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/** Fetch all menus from the public.site_menus table */
async function fetchMenus() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("site_menus")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}

/** Create a new menu item */
async function createMenu(menuData) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("site_menus")
    .insert([menuData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Update an existing menu item */
async function updateMenu({ id, ...updates }) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("site_menus")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Delete a menu item */
async function deleteMenu(id) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("site_menus")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return id;
}

export function useMenus() {
  return useQuery({
    queryKey: ["site-menus"],
    queryFn: fetchMenus,
  });
}

export function useCreateMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-menus"] });
    },
  });
}

export function useUpdateMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-menus"] });
    },
  });
}

export function useDeleteMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteMenu,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-menus"] });
    },
  });
}
