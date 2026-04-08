"use client"
import { deletePostItem } from "./actions"
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface DeletePostButtonProps {
  postId: string;
  className?: string;
  children?: React.ReactNode;
}

export function DeletePostButton({ postId, className,children}: DeletePostButtonProps) {
  const [loading, setLoading] = useState(false);

  if (!postId?.trim()) {
    return null;
  }

  async function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    try {
      setLoading(true)
      await deletePostItem(postId)
      toast.success("Post deleted successfully")
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete post")
    } finally {
      setLoading(false)
    }
  }
   
  return (
    <button
      type="button"
      onClick={handleRemove}
      disabled={loading}
      className={className || "w-full flex items-center justify-center gap-2 bg-[#0d2a1a] hover:bg-[#1a3826] text-white py-3.5 rounded-full text-sm font-bold transition-all mt-auto shadow-sm active:scale-[0.98] disabled:opacity-70"}
      title="Delete"
    >
      {children || (
        <>
          <Trash2 className="w-4 h-4" />
          {loading ? "Removing..." : "Remove"}
        </>
      )}
    </button>
  );
}
