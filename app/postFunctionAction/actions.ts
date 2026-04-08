"use server";

import { getUserToken } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createPost(payload: any) {
  const token = await getUserToken();
  // We throw if no token, meaning unauthorized
  if (!token) throw new Error("User not logged in. Token missing.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json().catch(() => {
    throw new Error("Invalid response from posts API.");
  });

  if (!res.ok) {
    const msg = data?.message ?? "Failed to create post";
    throw new Error(msg);
  }

  // usually revalidate forum/discussions
  revalidatePath("/forum");

  return data;
}

export async function uploadPostImage(postId: string, formData: FormData) {
  const token = await getUserToken();
  if (!token) throw new Error("User not logged in. Token missing.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/posts/${postId}/image`, {
    method: "PUT", // Server threw 404 on POST, likely expects PATCH or PUT for updating an existing resource's image
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
    cache: "no-store",
  });

  // some backends might return 204 or non-json if nothing to return, so handle carefully:
  let data;
  let text = "";
  try {
    text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error(`Status ${res.status} - Invalid JSON response: ${text.substring(0, 100)}`);
  }

  if (!res.ok) {
    const msg = data?.message ?? `Failed to upload image. Status: ${res.status}`;
    throw new Error(msg);
  }

  revalidatePath("/forum");
  return data;
}

export async function myPosts() {
  const token = await getUserToken();
  if (!token) throw new Error("User not logged in. Token missing.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/posts`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => {
    throw new Error("Invalid response from posts API.");
  });

  if (!res.ok) {
    const msg = data?.message ?? "Failed to get my posts";
    throw new Error(msg);
  }

  return data;
}

export async function deletePostItem(postId: string) {
  const token = await getUserToken();
  if (!token) throw new Error("User not logged in. Token missing.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/posts/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await res.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      if (res.ok) {
        throw new Error("Invalid format from posts API: " + text.substring(0, 100));
      }
    }
  }

  if (!res.ok) {
    const errorMsg = data?.message || `Server returned ${res.status}. ${text.includes('<!DOCTYPE html>') ? 'Internal Server Error check BE console.' : text.substring(0, 100)}`;
    throw new Error(errorMsg);
  }

  revalidatePath("/forum");
  return data;
}

export async function likePostItem(postId: string) {
  const token = await getUserToken();
  if (!token) throw new Error("User not logged in. Token missing.");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/posts/${postId}/like`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const text = await res.text();
  let data: any = {};
  if (text) {
    try {
      data = JSON.parse(text);
    } catch (e) {
      if (res.ok) {
        throw new Error("Invalid format from posts API: ");
      }
    }
  }

  if (!res.ok) {
    const errorMsg = data?.message || `Server returned ${res.status}. ${text.includes('<!DOCTYPE html>') ? 'Internal Server Error check BE console.' : text.substring(0, 100)}`;
    throw new Error(errorMsg);
  }

  revalidatePath("/forum");
  return data;
}