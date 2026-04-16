"use client";

import { useState } from "react";
import { 
  useMenus, 
  useCreateMenu, 
  useUpdateMenu, 
  useDeleteMenu 
} from "@/hooks/useNavigation";
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
import { useToast } from "@/components/ui/toast-provider";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink,
  MoveUp,
  MoveDown,
  Layout
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MenusClient() {
  const toast = useToast();
  const { data: menus, isLoading } = useMenus();
  const createMenu = useCreateMenu();
  const updateMenu = useUpdateMenu();
  const deleteMenu = useDeleteMenu();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    label: "",
    href: "",
    position: "header",
    category: "",
    display_order: 0,
  });

  const headerMenus = (menus || []).filter(m => m.position === "header");
  const footerMenus = (menus || []).filter(m => m.position === "footer");

  const openAdd = (position = "header") => {
    setEditingItem(null);
    setFormData({
      label: "",
      href: "",
      position,
      category: position === "footer" ? "Navigation" : "",
      display_order: (position === "header" ? headerMenus : footerMenus).length,
    });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({
      label: item.label,
      href: item.href,
      position: item.position,
      category: item.category || "",
      display_order: item.display_order,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await updateMenu.mutateAsync({ id: editingItem.id, ...formData });
        toast.push("Menu item updated successfully.", "success");
      } else {
        await createMenu.mutateAsync(formData);
        toast.push("Menu item created successfully.", "success");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.push("Error saving menu item.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      await deleteMenu.mutateAsync(id);
      toast.push("Menu item deleted.", "success");
    }
  };

  if (isLoading) return <div>Loading menus...</div>;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Menus */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Header Menu</h3>
          </div>
          <Button size="sm" onClick={() => openAdd("header")} className="gap-2 bg-violet-600">
            <Plus size={16} /> Add Link
          </Button>
        </div>
        
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <MenuTable 
            items={headerMenus} 
            onEdit={openEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </section>

      {/* Footer Menus */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-violet-500" />
            <h3 className="text-lg font-semibold">Footer Menu</h3>
          </div>
          <Button size="sm" onClick={() => openAdd("footer")} className="gap-2 bg-violet-600">
            <Plus size={16} /> Add Link
          </Button>
        </div>
        
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <MenuTable 
            items={footerMenus} 
            isFooter 
            onEdit={openEdit} 
            onDelete={handleDelete} 
          />
        </div>
      </section>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="dark:bg-slate-800">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit" : "Add"} Menu Link</DialogTitle>
            <DialogDescription>
              Configure the link appearance and destination.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Link Label</label>
                <Input 
                  required
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder="e.g. Pricing"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Position</label>
                <select 
                  className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                >
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">URL / Path</label>
              <Input 
                required
                value={formData.href}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                placeholder="e.g. /pricing or https://..."
              />
            </div>

            {formData.position === "footer" && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">Footer Category</label>
                <Input 
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g. Legal, Navigation"
                />
                <p className="text-[10px] text-muted-foreground">Used to group links in the footer columns.</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Display Order</label>
              <Input 
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <DialogClose asChild>
                <Button type="button" variant="outline" className="flex-1 dark:bg-slate-600 hover:dark:bg-slate-700">Cancel</Button>
              </DialogClose>
              <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700">
                {editingItem ? "Save Changes" : "Create Link"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MenuTable({ items, onEdit, onDelete, isFooter }) {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        No links added yet.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="dark:bg-slate-800">
        <TableRow>
          <TableHead className="w-[40%]">Label</TableHead>
          <TableHead className="w-[30%]">URL</TableHead>
          {isFooter && <TableHead>Category</TableHead>}
          <TableHead className="text-center">Order</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium text-foreground capitalize">{item.label}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="truncate max-w-[150px]">{item.href}</span>
                <ExternalLink size={10} />
              </div>
            </TableCell>
            {isFooter && (
              <TableCell>
                <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:text-slate-400">
                  {item.category || "General"}
                </span>
              </TableCell>
            )}
            <TableCell className="text-center font-mono text-xs text-muted-foreground">
              {item.display_order}
            </TableCell>
            <TableCell>
              <div className="flex justify-end gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground dark:hover:bg-slate-800 hover:bg-slate-200 hover:text-foreground"
                  onClick={() => onEdit(item)}
                >
                  <Pencil size={14} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
