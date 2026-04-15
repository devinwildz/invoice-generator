"use client";

import { useState, useMemo } from "react";
import {
  useAdminUsers,
  useUpdateUser,
  useCreateUser,
  useDeleteUser,
} from "@/hooks/useAdminUsers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { UsersTableSkeleton } from "@/components/admin/skeletons";
import { useToast } from "@/components/ui/toast-provider";
import { Search, Pencil, Trash2, ChevronLeft, ChevronRight, Users, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

const ROLES = ["all", "admin", "customer"];
const STATUSES = ["all", "active", "inactive"];
const PAGE_SIZE = 8;

function RoleBadge({ role }) {
  return (
    <Badge
      variant={role === "admin" ? "default" : "secondary"}
      className={cn(
        role === "admin" &&
          "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300 border-violet-200 dark:border-violet-500/20"
      )}
    >
      {role === "admin" ? "Admin" : "Customer"}
    </Badge>
  );
}

function StatusBadge({ status }) {
  return (
    <Badge variant={status === "active" ? "success" : "warning"}>
      {status === "active" ? "Active" : "Inactive"}
    </Badge>
  );
}

function UserAvatar({ user }) {
  const initial = (user.full_name || user.email || "U").charAt(0).toUpperCase();
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-bold text-white shadow-sm">
      {initial}
    </div>
  );
}

export default function UsersClient() {
  const toast = useToast();
  const { data: users, isLoading, isError } = useAdminUsers();
  const updateUser = useUpdateUser();
  const createUser = useCreateUser();
  const deleteUser = useDeleteUser();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("full_name");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);

  // Edit modal state
  const [editUser, setEditUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ full_name: "", email: "", role: "customer" });

  // Add modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({ full_name: "", email: "", role: "customer" });

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Filter + sort
  const filtered = useMemo(() => {
    if (!users) return [];
    return users
      .filter((u) => {
        const q = search.toLowerCase();
        const matchSearch =
          (u.full_name || "").toLowerCase().includes(q) ||
          (u.email || "").toLowerCase().includes(q);
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        // Status filter is currently dummy if status column doesn't exist yet, 
        // but we'll leave it for UI consistency if the user adds it later.
        const matchStatus = statusFilter === "all" || (u.status || "active") === statusFilter;
        return matchSearch && matchRole && matchStatus;
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        const va = a[sortField] ?? "";
        const vb = b[sortField] ?? "";
        return va > vb ? dir : va < vb ? -dir : 0;
      });
  }, [users, search, roleFilter, statusFilter, sortField, sortDir]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSort(field) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
    setPage(1);
  }

  function SortIcon({ field }) {
    if (sortField !== field) return <span className="ml-1 opacity-30">↕</span>;
    return <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  // Reset page when filters change
  function handleSearch(val) {
    setSearch(val);
    setPage(1);
  }

  // Edit modal
  function openEdit(user) {
    setEditUser(user);
    setEditFormData({
      full_name: user.full_name || "",
      email: user.email || "",
      role: user.role || "customer",
    });
  }

  async function confirmEdit() {
    if (!editUser) return;
    await updateUser.mutateAsync({ 
      userId: editUser.id, 
      userData: editFormData 
    });
    toast.push(
      `${editFormData.full_name || "User"}'s profile updated.`,
      "success"
    );
    setEditUser(null);
  }

  // Add modal
  function openAdd() {
    setAddFormData({ full_name: "", email: "", role: "customer" });
    setIsAddOpen(true);
  }

  async function confirmAdd() {
    if (!addFormData.email || !addFormData.full_name) {
      toast.push("Please fill in all required fields.", "error");
      return;
    }
    await createUser.mutateAsync(addFormData);
    toast.push(
      `User ${addFormData.full_name} has been added successfully.`,
      "success"
    );
    setIsAddOpen(false);
  }

  // Delete
  async function confirmDelete() {
    if (!deleteTarget) return;
    await deleteUser.mutateAsync(deleteTarget.id);
    toast.push(`${deleteTarget.full_name || "User"} has been removed.`, "success");
    setDeleteTarget(null);
  }

  if (isLoading) return <UsersTableSkeleton />;

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
        <p className="text-sm font-medium text-foreground">
          Failed to load users
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Please refresh the page to try again.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="admin-users-search"
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
            aria-label="Search users"
          />
        </div>

        {/* Role filter */}
        <select
          id="admin-users-role-filter"
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          aria-label="Filter by role"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r === "all" ? "All Roles" : r.charAt(0).toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>

        {/* Status filter */}
        <select
          id="admin-users-status-filter"
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          aria-label="Filter by status"
          className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>

        {/* Add User Button */}
        <Button 
          onClick={openAdd}
          className="bg-violet-600 hover:bg-violet-700 text-white gap-2 h-10 px-4"
        >
          <UserPlus size={16} />
          <span>Add User</span>
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {paginated.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Users size={32} className="mb-3 text-muted-foreground/40" />
            <p className="text-sm font-medium text-foreground">
              No users found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader className="dark:bg-slate-950/50">
              <TableRow>
                <TableHead>
                  <button
                    onClick={() => handleSort("full_name")}
                    className="flex items-center font-semibold hover:text-foreground"
                  >
                    User <SortIcon field="full_name" />
                  </button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <button
                    onClick={() => handleSort("created_at")}
                    className="flex items-center font-semibold hover:text-foreground"
                  >
                    Joined <SortIcon field="created_at" />
                  </button>
                </TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Actions
                </TableHead>
                <TableHead className="text-right">Manage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((user) => (
                <TableRow
                  key={user.id}
                  className="transition-colors hover:bg-muted/40"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <UserAvatar user={user} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {user.full_name || "Unknown"}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden text-xs text-muted-foreground md:table-cell">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <RoleBadge role={user.role} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={user.status || "active"} />
                  </TableCell>
                  <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                    -
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${user.full_name}`}
                        onClick={() => openEdit(user)}
                        className="h-8 w-8 text-muted-foreground cursor-pointer dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-foreground"
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${user.full_name}`}
                        onClick={() => setDeleteTarget(user)}
                        className="h-8 w-8 text-muted-foreground cursor-pointer hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Showing {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}{" "}
            users
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              aria-label="Previous page"
              className="h-8 w-8"
            >
              <ChevronLeft size={14} />
            </Button>
            <span className="text-xs font-medium">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              aria-label="Next page"
              className="h-8 w-8"
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onOpenChange={(o) => !o && setEditUser(null)}>
        <DialogContent className="dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the profile information for{" "}
              <span className="font-semibold text-foreground">
                {editUser?.full_name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-3">
              <UserAvatar user={editUser || {}} />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {editUser?.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {editUser?.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input 
                  value={editFormData.full_name}
                  onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input 
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="edit-role-select"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Role
                </label>
                <select
                  id="edit-role-select"
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  className="h-10 w-full rounded-md dark:bg-slate-900 border border-input cursor-pointer px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option className="dark:bg-slate-800" value="customer">Customer</option>
                  <option className="dark:bg-slate-800" value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm" className="flex-1 dark:bg-slate-600 hover:dark:bg-slate-700">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="sm"
                className="flex-1 bg-violet-600 dark:bg-violet-600"
                onClick={confirmEdit}
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add User Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account for the platform.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Full Name
                </label>
                <Input 
                  value={addFormData.full_name}
                  onChange={(e) => setAddFormData({ ...addFormData, full_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-foreground">
                  Email Address
                </label>
                <Input 
                  type="email"
                  value={addFormData.email}
                  onChange={(e) => setAddFormData({ ...addFormData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="add-role-select"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Role
                </label>
                <select
                  id="add-role-select"
                  value={addFormData.role}
                  onChange={(e) => setAddFormData({ ...addFormData, role: e.target.value })}
                  className="h-10 w-full rounded-md dark:bg-slate-900 border border-input cursor-pointer px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option className="dark:bg-slate-800" value="customer">Customer</option>
                  <option className="dark:bg-slate-800" value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <DialogClose asChild>
                <Button variant="outline" size="sm" className="flex-1 dark:bg-slate-600 hover:dark:bg-slate-700">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                size="sm"
                className="flex-1 bg-violet-600 dark:bg-violet-600"
                onClick={confirmAdd}
                disabled={createUser.isPending}
              >
                {createUser.isPending ? "Creating…" : "Create User"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-foreground">
                {deleteTarget?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex gap-3">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="flex-1 dark:bg-slate-600 hover:dark:bg-slate-700">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              className="flex-1"
              onClick={confirmDelete}
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? "Deleting…" : "Delete User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
