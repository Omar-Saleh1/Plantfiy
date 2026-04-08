import { deletePostItem, myPosts } from "@/app/postFunctionAction/actions";
import { getUserToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { 
  BarChart2, 
  Bookmark, 
  FileText, 
  Home, 
  MessageSquare, 
  PenSquare, 
  Plus, 
  Trash2, 
  Activity,
  User,
  Heart,
  MessageCircle,
  Eye,
  Settings,
  Leaf
} from "lucide-react";
import Link from "next/link";
import React from "react";
import { DeletePostButton } from "@/app/postFunctionAction/DeletePostButton";
import { LikePostButton } from "@/app/postFunctionAction/LikePostButton";
import { toast } from "sonner";

interface Post {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  commentsCount?: number;
  likes?: string[];
  user?: {
    _id?: string;
    id?: string;
    name?: string;
  };
}

export default async function MyPostsPage() {
  const token = await getUserToken();
  let currentUserId: string | null = null;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      currentUserId = decoded.id || decoded.userId || decoded._id || null;
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }

  let posts: Post[] = [];
  try {
    const res = await myPosts();
    // Support normal pagination payload or simple array
    const allPosts = Array.isArray(res.data) ? res.data : res.data?.posts || [];
    if (currentUserId) {
      posts = allPosts.filter((post: Post) => post.user?._id === currentUserId || post.user?.id === currentUserId);
    } else {
      posts = allPosts;
    }
  } catch (error) {
    console.error("Failed to fetch my posts:", error);
  }

  // To match the design's bottom showcase, we can split posts.
  // We'll treat the first valid post as the "Latest Post" big card at the bottom (or just use the newest one).
  const gridPosts = posts.length > 0 ? posts.slice(0, posts.length > 1 ? posts.length - 1 : posts.length) : [];
  const featuredPost = posts.length > 1 ? posts[posts.length - 1] : null;


  return (
    <div className="bg-[#f8f9f8] min-h-screen font-sans text-[#112d1b]">
      <div className="flex max-w-[1400px] mx-auto px-6 gap-10 py-10 w-full">
        
        {/* Left Sidebar */}
        <aside className="w-[260px] flex-shrink-0 bg-[#f3f5f4] rounded-[24px] p-8 h-fit hidden lg:flex flex-col">
          <div className="mb-8 flex items-center gap-4">
             <div className="w-12 h-12 bg-[#1a3826] rounded-full flex items-center justify-center shrink-0">
               <Leaf className="w-6 h-6 text-white" />
             </div>
             <div>
               <h2 className="text-[17px] font-extrabold tracking-tight text-[#112d1b] leading-tight">
                   Plant Parent
               </h2>
               <p className="text-[11px] text-[#647167] font-bold">Community Contributor</p>
             </div>
          </div>

          <nav className="flex flex-col gap-2 mb-10 text-[#56645a] font-semibold text-[14px]">
            <Link href="/forum" className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] hover:bg-white transition-colors">
               <Home className="w-[18px] h-[18px]" strokeWidth={2.5} /> My Feed
            </Link>
            <Link href="/forum/my-posts" className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] bg-white text-[#112d1b] shadow-sm font-bold transition-colors">
               <MessageSquare className="w-[18px] h-[18px]" strokeWidth={2.5} /> My Posts
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] hover:bg-white transition-colors">
               <Bookmark className="w-[18px] h-[18px]" strokeWidth={2.5} /> Saved
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] hover:bg-white transition-colors">
               <BarChart2 className="w-[18px] h-[18px]" strokeWidth={2.5} /> Engagement
            </Link>
            <Link href="#" className="flex items-center gap-3 px-4 py-3.5 rounded-[12px] hover:bg-white transition-colors">
               <FileText className="w-[18px] h-[18px]" strokeWidth={2.5} /> Drafts
            </Link>
          </nav>

          <Link href="/forum/create" className="mt-auto w-full flex items-center justify-center gap-2 bg-[#0d2a1a] text-white py-4 rounded-full font-bold text-[14px] shadow-sm hover:bg-[#1a3826] transition-colors">
             <Plus className="w-4 h-4 bg-white/20 rounded-full" strokeWidth={3} />
             Create New Post
          </Link>
        </aside>

        {/* Main Area */}
        <main className="flex-1 w-full max-w-full lg:max-w-[calc(100%-300px)]">
           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
             <div>
               <h1 className="text-[2.5rem] font-extrabold tracking-tight mb-2 text-[#112d1b] leading-none">
                 My Posts
               </h1>
               <p className="text-[#647167] text-[15px] font-medium">
                 You have <span className="font-bold">{posts.length}</span> active posts in the community
               </p>
             </div>
             
             {/* Tab Toggle */}
             <div className="flex p-1.5 bg-white rounded-full shadow-sm border border-gray-100">
                <button className="px-6 py-2 rounded-full bg-white text-[#112d1b] font-bold text-sm shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)]">
                  Posts
                </button>
                <button className="px-6 py-2 rounded-full text-[#647167] hover:text-[#112d1b] font-semibold text-sm transition-colors">
                  Drafts
                </button>
                <button className="px-6 py-2 rounded-full text-[#647167] hover:text-[#112d1b] font-semibold text-sm transition-colors">
                  Saved
                </button>
             </div>
           </div>

           {/* Engagement Banner */}
           <div className="bg-[#1a3826] rounded-[24px] p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 text-white shadow-md relative overflow-hidden">
             {/* Decorative faint background element */}
             <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
                 <Leaf className="w-64 h-64 translate-x-10 -translate-y-10" />
             </div>
             
             <div className="flex items-center gap-5 relative z-10">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0 border border-white/5">
                   <Activity className="w-6 h-6 text-[#a6dac1]" strokeWidth={2.5} />
                </div>
                <div>
                   <h3 className="font-bold text-[17px] mb-1">Community Engagement</h3>
                   <p className="text-white/70 text-[13px] font-medium">Your interactions increased by 15% this week</p>
                </div>
             </div>

             <div className="w-full md:w-[320px] relative z-10">
                <div className="flex justify-between items-end mb-2 text-[12px] font-bold">
                   <span className="text-white/90 tracking-wide">Content Health</span>
                   <span className="text-white">85%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/20 overflow-hidden">
                   <div className="h-full w-[85%] bg-[#a6dac1] rounded-full"></div>
                </div>
             </div>
           </div>

           {/* Grid Layout for Posts */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {gridPosts.map((post, index) => (
                 <div key={post._id} className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 flex flex-col group relative">
                    
                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10">
                       <span className={`px-4 py-1.5 rounded-full text-[11px] font-black tracking-wide flex items-center gap-1.5 shadow-sm 
                          ${index % 2 === 0 ? "bg-[#d4ebd9] text-[#1e6137]" : "bg-[#e8f3ee] text-[#2c7755]"}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${index % 2 === 0 ? "bg-[#1e6137]" : "bg-transparent border border-current"}`}></span>
                          {index % 2 === 0 ? "Live" : "Under Review"}
                       </span>
                    </div>

                    <div className="w-full h-[220px] bg-[#f4f6f4] relative overflow-hidden shrink-0">
                       {post.imageUrl ? (
                          <img 
                            src={post.imageUrl} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Leaf className="w-16 h-16" />
                          </div>
                       )}
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                       <h3 className="text-[20px] font-extrabold text-[#112d1b] leading-tight mb-3">
                          {post.title}
                       </h3>
                       <p className="text-[#647167] text-[15px] font-medium leading-relaxed line-clamp-3 mb-6">
                          {post.content}
                       </p>

                       <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex items-center gap-5 text-[#647167] font-bold text-[13px]">
                             <LikePostButton
                               postId={post._id}
                               initialLikesCount={post.likes?.length || 0}
                               isInitiallyLiked={!!currentUserId && !!post.likes?.includes(currentUserId)}
                               className="flex items-center gap-1.5 hover:text-[#0a2618] transition-colors disabled:opacity-50 group cursor-pointer"
                             />
                             <div className="flex items-center gap-1.5">
                               <MessageCircle className="w-[18px] h-[18px] fill-current opacity-80 text-gray-400" />
                               {post.commentsCount || 0}
                             </div>
                             <div className="flex items-center gap-1.5">
                               <Eye className="w-[18px] h-[18px] text-gray-400" strokeWidth={2.5} />
                               {(Math.random() * 2 + 0.1).toFixed(1)}k
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                             <button className="w-10 h-10 rounded-full bg-[#f4f6f4] text-[#112d1b] flex items-center justify-center hover:bg-[#e9ece9] transition-colors">
                                <PenSquare className="w-4 h-4" strokeWidth={2.5} />
                             </button>
                             <DeletePostButton  postId={post._id} className="w-10 h-10 rounded-full bg-[#fcedec] text-[#d94a4a] flex items-center justify-center hover:bg-[#f6d7d7] transition-colors disabled:opacity-50">
                               <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                             </DeletePostButton>
                          </div>
                       </div>
                    </div>
                 </div>
              ))}

              {posts.length === 0 && (
                <div className="col-span-1 md:col-span-2 text-center py-20 bg-white rounded-[24px] border border-dashed border-gray-300">
                  <p className="text-gray-500 font-medium">You haven't created any posts yet.</p>
                </div>
              )}
           </div>

           {/* Latest / Featured Post (Wide Card) */}
           {featuredPost && (
             <div className="bg-[#f4f6f4] rounded-[32px] p-4 flex flex-col md:flex-row items-center gap-8 mb-10 overflow-hidden relative">
                <div className="w-full md:w-[280px] h-[220px] rounded-[24px] overflow-hidden shrink-0 bg-white">
                   {featuredPost.imageUrl ? (
                      <img 
                        src={featuredPost.imageUrl} 
                        alt={featuredPost.title} 
                        className="w-full h-full object-cover"
                      />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center bg-[#e4e8e4]">
                         <Leaf className="w-12 h-12 text-[#1a3826]/30" />
                      </div>
                   )}
                </div>

                <div className="flex-1 py-4 pr-6">
                   <div className="inline-block bg-white text-[#112d1b] px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm mb-4">
                      Latest Posts
                   </div>
                   
                   <h3 className="text-[26px] font-extrabold text-[#112d1b] mb-4 leading-tight">
                      {featuredPost.title}
                   </h3>
                   
                   <p className="text-[#647167] text-[15px] font-medium leading-relaxed mb-8 line-clamp-2">
                      {featuredPost.content}
                   </p>
                   
                   <div className="flex items-center gap-6">
                     <button className="bg-[#0d2a1a] text-white px-8 py-3.5 rounded-full font-bold text-[14px] hover:bg-[#1a3826] transition-colors">
                        Edit Post
                     </button>
                     <button className="text-[#112d1b] font-bold text-[14px] hover:text-[#2c7755] transition-colors">
                        Detailed Statistics
                     </button>
                   </div>
                </div>
             </div>
           )}

        </main>
      </div>
    </div>
  );
}
