"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/** Fetch all users from the public.users table */
async function fetchAdminUsers() {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

/** Update a user's profile in the public.users table */
async function updateUser({ userId, userData }) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("users")
    .update({ 
      full_name: userData.full_name,
      email: userData.email,
      role: userData.role
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Delete a user record from the public.users table */
async function deleteUser(userId) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (error) throw error;
  return userId;
}

/** Create a new user record in the public.users table */
async function createUser(userData) {
  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase
    .from("users")
    .insert([
      {
        full_name: userData.full_name,
        email: userData.email,
        role: userData.role || "customer",
        status: "active",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchAdminUsers,
    staleTime: 60 * 1000, 
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}
