"use client"
import { likePostItem } from "./actions"
import { useState } from "react";
import { toast } from "sonner";
import { Heart } from "lucide-react";

interface LikePostButtonProps {
  postId: string;
  initialLikesCount: number;
  isInitiallyLiked?: boolean;
  className?: string;
  iconClassName?: string;
  showText?: boolean;
}

export function LikePostButton({ 
  postId, 
  initialLikesCount,
  isInitiallyLiked = false,
  className,
  iconClassName,
  showText = true
}: LikePostButtonProps) {
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(isInitiallyLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    if (loading) return;
    
    // Optimistic UI updates
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    
    try {
      setLoading(true);
      await likePostItem(postId);
    } catch (error: any) {
      // Revert optimistic update
      setLiked(liked);
      setLikesCount(liked ? likesCount : likesCount);
      toast.error(error?.message || "Failed to like post");
    } finally {
      setLoading(false);
    }
  }
   
  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading}
      className={className || "flex items-center gap-2 hover:text-[#0a2618] transition-colors group disabled:opacity-50 cursor-pointer text-gray-500"}
      title={liked ? "Unlike" : "Like"}
    >
      <Heart className={iconClassName || `w-[18px] h-[18px] transition-colors ${liked ? "fill-red-500 stroke-red-500 text-red-500" : "fill-transparent stroke-current group-hover:fill-red-50 group-hover:stroke-red-500 group-hover:text-red-500"}`} />
      {showText && <span className="text-[13px] font-bold">{likesCount}</span>}
    </button>
  );
}
