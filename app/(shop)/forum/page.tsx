import { getUserToken } from "@/lib/auth";
import { 
  Home, 
  MessageSquare, 
  Bookmark, 
  Leaf, 
  BadgeCheck, 
  Plus, 
  Search, 
  LayoutGrid, 
  Trees, 
  Stethoscope, 
  Scissors, 
  Heart, 
  MessageCircle, 
  Bookmark as BookmarkIcon,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { DeletePostButton } from "@/app/postFunctionAction/DeletePostButton";
import { LikePostButton } from "@/app/postFunctionAction/LikePostButton";
import { jwtDecode } from "jwt-decode";
import Post from "@/types/post";


export default async function Posts() {
  const token = await getUserToken();

  let posts: any[] = [];
  let currentUserId: string | null = null;
  
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      currentUserId = decoded.id || decoded.userId || decoded._id || null;
    } catch (e) {
      console.error("Failed to decode token", e);
    }
  }
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API}/api/v1/posts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    
    if (res.ok) {
      const data = await res.json();
      posts = data.data?.posts || [];
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
  }


  return (
    <div className="bg-[#fbfbfb] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Left Sidebar */}
          <aside className="hidden md:flex flex-col col-span-3 h-[calc(100vh-[120px])] sticky top-8">
            <div className="bg-[#f4f6f4] rounded-[2rem] p-6 lg:p-8 flex flex-col h-full border border-gray-100">
              <div className="mb-8 lg:mb-10">
                <h2 className="text-[17px] font-extrabold text-[#0a2618]">Community Hub</h2>
                <p className="text-xs font-semibold text-gray-500 mt-1">Grow together</p>
              </div>

              <nav className="flex flex-col gap-1.5 lg:gap-2 flex-grow">
                <Link href="#" className="flex items-center gap-3 bg-white text-[#0a2618] px-4 py-3.5 rounded-2xl font-bold shadow-sm text-sm">
                  <Home className="w-[18px] h-[18px]" />
                  Home
                </Link>
                <Link href="#" className="flex items-center gap-3 text-gray-500 hover:bg-white/60 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-colors">
                  <MessageSquare className="w-[18px] h-[18px]" />
                  My Posts
                </Link>
                <Link href="#" className="flex items-center gap-3 text-gray-500 hover:bg-white/60 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-colors">
                  <Bookmark className="w-[18px] h-[18px]" />
                  Saved
                </Link>
                <Link href="#" className="flex items-center gap-3 text-gray-500 hover:bg-white/60 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-colors">
                  <Leaf className="w-[18px] h-[18px] relative -top-0.5" />
                  Plant Library
                </Link>
                <Link href="#" className="flex items-center gap-3 text-gray-500 hover:bg-white/60 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-colors">
                  <BadgeCheck className="w-[18px] h-[18px]" />
                  Experts
                </Link>
              </nav>

              <Link href="/forum/create" className="mt-8 bg-[#0a2618] text-white flex items-center justify-center gap-2 py-4 rounded-[1.25rem] font-bold text-sm shadow-md hover:bg-[#153b26] transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Plus className="w-5 h-5 flex-shrink-0 bg-white/20 rounded-full p-0.5" />
                Create Post
              </Link>
            </div>
          </aside>

          {/* Main Content */}
          <main className="col-span-1 md:col-span-6 flex flex-col gap-8 w-full max-w-full">
            
            {/* Header & Search */}
            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-5 mt-2">
              <div>
                <h1 className="text-[2.5rem] font-extrabold text-[#0a2618] italic tracking-tight leading-tight mb-2">
                  The Botanical Feed
                </h1>
                <p className="text-gray-500 text-[15px] font-medium">
                  Stories and advice from the garden community.
                </p>
              </div>
              
              <div className="relative w-full xl:w-[280px]">
                <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search discussions..." 
                  className="w-full bg-[#f4f6f4] border border-gray-200/60 rounded-full py-3.5 pl-11 pr-4 text-[13px] font-bold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0a2618]/20 transition-all"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              <button className="flex items-center gap-2 bg-[#0a2618] text-white px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap shadow-sm hover:bg-[#153b26] transition-colors">
                <LayoutGrid className="w-[14px] h-[14px]" />
                All
              </button>
              <button className="flex items-center gap-2 bg-[#f4f6f4] text-gray-600 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#e8ebe8] transition-colors whitespace-nowrap border border-gray-100">
                <Trees className="w-[14px] h-[14px]" />
                Houseplants
              </button>
              <button className="flex items-center gap-2 bg-[#f4f6f4] text-gray-600 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#e8ebe8] transition-colors whitespace-nowrap border border-gray-100">
                <Leaf className="w-[14px] h-[14px]" />
                Succulents
              </button>
              <button className="flex items-center gap-2 bg-[#f4f6f4] text-gray-600 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#e8ebe8] transition-colors whitespace-nowrap border border-gray-100">
                <Stethoscope className="w-[14px] h-[14px]" />
                Plant Doctor
              </button>
              <button className="flex items-center gap-2 bg-[#f4f6f4] text-gray-600 px-5 py-2.5 rounded-full text-xs font-bold hover:bg-[#e8ebe8] transition-colors whitespace-nowrap border border-gray-100">
                <Scissors className="w-[14px] h-[14px]" />
                Propagation
              </button>
            </div>

            {/* Posts Feed */}
            <div className="flex flex-col gap-6">
              {posts?.map((post, index) => {
                const isFirst = index === 0;

                return (
                  <div
                    key={post._id}
                    className="bg-white rounded-[2rem] shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] border border-gray-100/80 p-6 flex flex-col gap-4 relative transition-transform hover:-translate-y-0.5 duration-300"
                  >
                    {isFirst ? (
                      // Large Card Layout
                      <>
                        {post.imageUrl && (
                          <div className="relative w-full h-[280px] sm:h-[360px] mb-2 rounded-[1.5rem] overflow-hidden bg-gray-100 group">
                            <img
                              src={post.imageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            />
                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-widest text-[#0a2618] uppercase shadow-sm">
                              Member Spotlight
                            </div>
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-4 mt-2">
                          <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden shrink-0 border-2 border-white shadow-sm">
                            <div className="w-full h-full bg-[#204a33] text-white flex items-center justify-center font-bold text-lg">
                              {post.user?.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-4">
                               <h2 className="text-[22px] font-extrabold text-[#0a2618] mb-2 leading-[1.3]">
                                 {post.title}
                               </h2>
                               <button className="p-1 text-gray-400 hover:text-[#0a2618] transition-colors shrink-0">
                                  <BookmarkIcon className="w-5 h-5 fill-current" />
                               </button>
                               {currentUserId && currentUserId === post.user?._id && (
                                 <DeletePostButton postId={post._id} className="p-1 text-red-400 hover:text-red-600 transition-colors shrink-0 disabled:opacity-50">
                                    <Trash2 className="w-5 h-5" />
                                 </DeletePostButton>
                               )}
                            </div>
                            
                            <p className="text-gray-500 text-[15px] leading-relaxed line-clamp-2 md:line-clamp-3">
                              {post.content}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2 pl-[64px] border-gray-50 text-gray-500 text-sm font-semibold">
                          <div className="flex items-center gap-6">
                            <LikePostButton
                              postId={post._id}
                              initialLikesCount={post.likes?.length || 0}
                              isInitiallyLiked={currentUserId ? post.likes?.includes(currentUserId) : false}
                            />
                            <button className="flex items-center gap-2 hover:text-[#0a2618] transition-colors group">
                              <MessageCircle className="w-[18px] h-[18px] fill-gray-300 group-hover:fill-[#0a2618] transition-colors" />
                              <span className="text-[13px]">{post.commentsCount || 0} Comments</span>
                            </button>
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.1em] text-gray-400 font-bold flex gap-1.5 items-center">
                            <span>{new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date(post.createdAt))}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span>{post.user?.name?.toUpperCase() || 'UNKNOWN'}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Small Card Layout
                      <div className="flex flex-col md:flex-row justify-between items-start gap-6 relative">
                         <div className="flex-1 flex flex-col pt-1">
                           <div className="flex items-center gap-3 mb-3">
                              <span className="bg-[#fceded] text-[#d94a4a] px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest uppercase shadow-sm">
                                Help Needed
                              </span>
                              <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wide">
                                {new Intl.DateTimeFormat('en-US', { hour: 'numeric' }).formatToParts(new Date()).find(p => p.type === 'hour')?.value || '5'} hours ago
                              </span>
                           </div>

                           <h2 className="text-[22px] font-extrabold text-[#0a2618] mb-3 leading-tight pr-4">
                             {post.title}
                           </h2>
                           
                           <p className="text-gray-500 text-[15px] leading-relaxed line-clamp-3 mb-6 pr-2 lg:pr-8">
                             {post.content}
                           </p>
                           
                             {currentUserId && (currentUserId === post.user?._id || currentUserId === post.user?.id) && (
                               <div className="absolute top-0 right-0 flex gap-2">
                                 <DeletePostButton postId={post._id} className="p-1.5 text-red-300 hover:text-red-500 bg-red-50/50 hover:bg-red-50 rounded-full transition-colors shrink-0 disabled:opacity-50">
                                    <Trash2 className="w-4 h-4" />
                                 </DeletePostButton>
                               </div>
                             )}

                           <div className="flex items-center gap-4 mt-auto">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                  <div className="w-full h-full bg-[#204a33] text-white flex items-center justify-center font-bold text-xs">
                                    {post.user?.name?.charAt(0)?.toUpperCase() || "U"}
                                  </div>
                                </div>
                                <span className="font-bold text-[13px] text-[#0a2618]">{post.user?.name || "Unknown"}</span>
                              </div>
                              <div className="flex items-center gap-4 text-gray-400 font-bold text-[13px]">
                                <LikePostButton
                                  postId={post._id}
                                  initialLikesCount={post.likes?.length || 0}
                                  isInitiallyLiked={!!currentUserId && !!post.likes?.includes(currentUserId)}
                                />
                                <div className="flex items-center gap-1.5 group cursor-pointer hover:text-[#0a2618] transition-colors">
                                  <MessageCircle className="w-[18px] h-[18px] fill-gray-300 group-hover:fill-[#0a2618] transition-colors" />
                                  <span>{post.commentsCount || 0}</span>
                                </div>
                              </div>
                           </div>
                         </div>
                         
                         {post?.imageUrl && (
                           <div className="w-full md:w-[200px] h-[200px] shrink-0 rounded-[1.5rem] overflow-hidden bg-gray-100 group shadow-sm md:ml-4">
                              <img
                                src={post.imageUrl}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                              />
                           </div>
                         )}
                      </div>
                    )}
                  </div>
                );
              })}

              {posts.length === 0 && (
                <div className="text-center py-24 bg-white rounded-[2rem] border border-dashed border-gray-200 shadow-sm">
                  <Leaf className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                  <h3 className="text-[17px] font-extrabold text-[#0a2618] mb-2">No posts yet</h3>
                  <p className="text-[15px] text-gray-500 font-medium">Be the first to create a discussion!</p>
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden lg:flex flex-col col-span-3 gap-6 sticky top-8 h-fit">
            
            {/* Growth Pulse */}
            <div className="bg-[#c2e2cc] rounded-[2rem] p-7 relative overflow-hidden text-[#0a2618] shadow-sm">
              <div className="absolute -right-4 -bottom-4 opacity-10">
                 <Leaf className="w-40 h-40" />
              </div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.15em] mb-5 text-[#0a2618]/70">Growth Pulse</h3>
              
              <div className="flex items-end gap-3 mb-5 relative z-10">
                <span className="text-[2.75rem] font-black leading-none">88%</span>
                <span className="bg-white/60 text-[#0a2618] text-[10px] font-black tracking-wide px-2.5 py-1 rounded-full mb-1.5 backdrop-blur-sm">
                  +12% vs last week
                </span>
              </div>
              
              <div className="w-full bg-white/40 h-2 rounded-full mb-6 relative z-10">
                 <div className="bg-[#0a2618] w-[88%] h-full rounded-full shadow-sm"></div>
              </div>

              <p className="font-semibold text-[13px] italic relative z-10 leading-relaxed font-serif text-[#0a2618]/90 pr-4">
                 "142 new leaves grown this week by our community members."
              </p>
            </div>

            {/* Online Experts */}
            <div className="bg-[#f4f6f4] rounded-[2rem] p-7 border border-gray-100 shadow-sm">
              <h3 className="font-extrabold text-[#0a2618] text-[17px] mb-6">Online Experts</h3>
              
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                      <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Expert" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-3 h-3 bg-green-500 rounded-full absolute bottom-0 right-0 border-2 border-[#f4f6f4]"></div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0a2618] text-[13.5px]">Dr. Elena Green</h4>
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-400 mt-1">Pathology Specialist</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-sm">
                      <img src="https://i.pravatar.cc/150?u=a042581f4e29026024e" alt="Expert" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-3 h-3 bg-[#4ade80] rounded-full absolute bottom-0 right-0 border-2 border-[#f4f6f4]"></div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-[#0a2618] text-[13.5px]">Marcus Root</h4>
                    <p className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-400 mt-1">Landscape Designer</p>
                  </div>
                </div>
              </div>
              
              <button className="w-full mt-7 py-3 rounded-full border border-[#0a2618] text-[#0a2618] font-bold text-xs tracking-wide hover:bg-[#0a2618] hover:text-white transition-colors duration-300 shadow-sm">
                ASK AN EXPERT
              </button>
            </div>
          </aside>
        </div>

        {/* Footer (Simplified as in image) */}
        <footer className="mt-20 pt-8 border-t border-gray-200/60 pb-8 mt-auto flex justify-between items-center text-[10px] font-bold text-gray-400 uppercase tracking-widest max-w-[1400px] mx-auto w-full px-2">
           <div className="text-xl font-extrabold italic text-[#0a2618] lowercase tracking-tighter" style={{ fontFamily: 'Georgia, serif', fontVariant: 'small-caps'}}>
             Botanical Editorial
           </div>
           
           <div className="hidden md:flex gap-8">
             <Link href="#" className="hover:text-gray-600 transition-colors">Privacy</Link>
             <Link href="#" className="hover:text-gray-600 transition-colors">Terms</Link>
             <Link href="#" className="hover:text-gray-600 transition-colors">Shipping</Link>
             <Link href="#" className="hover:text-gray-600 transition-colors">Contact</Link>
           </div>
           
           <div className="text-[10px] text-gray-300">
             © 2024 Botanical Editorial.
           </div>
        </footer>
      </div>
    </div>
  );
}