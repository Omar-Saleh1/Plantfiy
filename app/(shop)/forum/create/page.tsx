"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Home, MessageSquare, Bookmark, BookOpen, UserCheck, 
  Bell, User, Bold, Italic, List, Link as LinkIcon, Quote, 
  Image as ImageIcon, UploadCloud, CheckCircle2, Lightbulb 
} from "lucide-react";
import { createPost, uploadPostImage } from "@/app/postFunctionAction/actions";
import { toast } from "sonner";
import Link from "next/link";

export default function CreatePostPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Form State
  const [files, setFiles] = useState<File[]>([]);
const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Succulents");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState(["care", "succulents"]);

  const categories = ["Houseplants", "Succulents", "Outdoor", "Propagation"];

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files!)]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!title || !content) {
      toast.error("Please fill in both title and content.");
      return;
    }

    startTransition(async () => {
      try {
        const payload = {
          title,
          content,
          category,
          tags,
        };

        // 1. Create the post first
        const response = await createPost(payload);
        
        // Try to find the post ID from different common backend response structures
        const postId = response?.data?.post?._id || response?.data?._id || response?.post?._id || response?._id;

        // 2. If there are files and we have a postId, upload the image
        if (files.length > 0 && postId) {
          try {
            const formData = new FormData();
            formData.append("image", files[0]); // Send under the key 'image' 
            await uploadPostImage(postId, formData);
          } catch (uploadError: any) {
            toast.error("Post created but failed to upload image: " + uploadError.message);
            router.push("/forum");
            return;
          }
        }

        toast.success("Post published to community successfully!");
        router.push("/forum");

      } catch (error: any) {
        toast.error(error.message || "Failed to create post");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9f8] font-sans text-[#112d1b]">
      {/* Top Navbar */}
    
      <div className="flex max-w-[1400px] mx-auto px-6 gap-10">
        
        {/* Left Sidebar */}
        <aside className="w-[260px] flex-shrink-0 bg-[#f3f5f4] rounded-[24px] p-8 h-fit hidden lg:block">
          <div className="mb-8">
             <h2 className="text-[17px] font-extrabold tracking-tight mb-1 flex items-center gap-2">
                 Community Hub
             </h2>
             <p className="text-[13px] text-[#647167] font-medium">Grow together</p>
          </div>

          <nav className="flex flex-col gap-2 mb-10 text-[#56645a] font-semibold text-[15px]">
            
            <Link href="/forum" className="flex items-center gap-3 px-4 py-3 rounded-[12px] hover:bg-white transition-colors">
               <Home className="w-[18px] h-[18px]" strokeWidth={2.5} /> Home
            </Link>
            <Link href="/forum/myPosts" className="flex items-center gap-3 px-4 py-3 rounded-[12px] hover:bg-white transition-colors">
               <MessageSquare className="w-[18px] h-[18px]" strokeWidth={2.5} /> My Posts
            </Link>
            <Link href="/saved" className="flex items-center gap-3 px-4 py-3 rounded-[12px] hover:bg-white transition-colors">
               <Bookmark className="w-[18px] h-[18px]" strokeWidth={2.5} /> Saved
            </Link>
            <Link href="/library" className="flex items-center gap-3 px-4 py-3 rounded-[12px] hover:bg-white transition-colors">
               <BookOpen className="w-[18px] h-[18px]" strokeWidth={2.5} /> Plant Library
            </Link>
            <Link href="/experts" className="flex items-center gap-3 px-4 py-3 rounded-[12px] hover:bg-white transition-colors">
               <UserCheck className="w-[18px] h-[18px]" strokeWidth={2.5} /> Experts
            </Link>
          </nav>

          <button className="w-full bg-[#0d2a1a] text-white py-4 rounded-full font-bold text-[15px] shadow-sm hover:bg-[#1a3826] transition-colors">
             Create Post 
          </button>
        </aside>

        {/* Main Form Area */}
        <main className="flex-1 max-w-[700px] pb-24">
           <h1 className="text-[40px] font-extrabold tracking-tight mb-2">Create New Post</h1>
           <p className="text-[#56645a] text-[17px] mb-10 font-medium">
             Share your botanical wisdom or ask the community for advice.
           </p>

           {/* Post Title */}
           <div className="mb-8">
             <label className="block text-[#112d1b] font-bold text-[15px] mb-3">
               Post Title
             </label>
             <input 
               type="text"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="e.g., My Monstera Deliciosa is thriving! Tips for beginners"
               className="w-full bg-[#f3f5f4] text-[#112d1b] placeholder:text-[#a0b3a7] py-4 px-5 rounded-[16px] outline-none border-none focus:ring-2 focus:ring-[#0d2a1a]/20 font-medium text-[15px]" 
             />
           </div>

           {/* Category & Tags Row */}
           <div className="flex flex-col sm:flex-row gap-6 mb-8 mt-2">
             <div className="flex-1 bg-[#f3f5f4] rounded-[24px] p-6">
                <label className="block text-[#112d1b] font-bold text-[15px] mb-4">
                  Select Category
                </label>
                <div className="flex flex-wrap gap-2.5">
                   {categories.map((cat) => (
                     <button 
                       key={cat}
                       onClick={() => setCategory(cat)}
                       className={`px-5 py-2 rounded-full text-[13px] font-bold tracking-wide transition-colors ${
                         category === cat 
                           ? "bg-[#0d2a1a] text-white" 
                           : "bg-white text-[#112d1b] hover:bg-[#e9ece9]"
                       }`}
                     >
                       {cat}
                     </button>
                   ))}
                </div>
             </div>
             
             <div className="flex-1 bg-[#f3f5f4] rounded-[24px] p-6">
                <label className="block text-[#112d1b] font-bold text-[15px] mb-4">
                  Tags
                </label>
                <input 
                   type="text"
                  //  onKeyDown={handleAddTag}
                   value={tagInput}
                   onChange={(e) => setTagInput(e.target.value)}
                   placeholder="Add tags (care, growth, lighting...)"
                   className="w-full bg-white text-[#112d1b] py-3.5 px-4 rounded-[12px] outline-none border-none font-medium text-[13px] mb-4 shadow-sm placeholder-[#a0b3a7]"
                />
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                     <span key={tag} className="flex items-center gap-1.5 bg-[#d4ebd9] text-[#1e6137] px-3 py-1.5 rounded-full text-[12px] font-bold">
                        #{tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-black">
                           &times;
                        </button>
                     </span>
                  ))}
                </div>
             </div>
           </div>

           {/* Rich Text Editor Mock */}
           <div className="bg-white rounded-[24px] mb-8 shadow-sm overflow-hidden flex flex-col h-[320px] transition-shadow focus-within:ring-2 focus-within:ring-[#0d2a1a]/20">
             <div className="flex items-center gap-5 px-6 py-4 bg-[#f8f9f8] border-b border-[#eaeceb] text-[#56645a]">
               <button className="hover:text-[#112d1b]"><Bold className="w-[18px] h-[18px]" strokeWidth={2.5} /></button>
               <button className="hover:text-[#112d1b]"><Italic className="w-[18px] h-[18px]" strokeWidth={2.5} /></button>
               <button className="hover:text-[#112d1b]"><List className="w-[18px] h-[18px]" strokeWidth={2.5} /></button>
               <button className="hover:text-[#112d1b]"><LinkIcon className="w-[18px] h-[18px]" strokeWidth={2.5} /></button>
               <button className="hover:text-[#112d1b]"><Quote className="w-[18px] h-[18px]" strokeWidth={2.5} /></button>
               <button className="hover:text-[#112d1b]"><ImageIcon className="w-[18px] h-[18px]" strokeWidth={2.5} /></button>
             </div>
             <textarea 
               value={content}
               onChange={(e) => setContent(e.target.value)}
               placeholder="Write your thoughts here..."
               className="flex-1 w-full bg-transparent p-6 outline-none resize-none font-medium text-[15px] text-[#112d1b] placeholder:text-[#a0b3a7] leading-relaxed"
             />
           </div>

           {/* Drag & Drop Upload */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#f3f5f4] border-2 border-dashed border-[#d2dbd6] rounded-[24px] flex flex-col items-center justify-center p-12 text-center mb-6 hover:border-[#a0b3a7] transition-colors cursor-pointer group"
          >
            <UploadCloud className="w-10 h-10 text-[#6ea482] mb-3 group-hover:scale-110 transition-transform duration-300" strokeWidth={2} />
            <h4 className="text-[17px] font-bold text-[#112d1b] tracking-tight mb-1">
              Drag and drop your plant photos
            </h4>
            <p className="text-[13px] text-[#647167] font-medium">
              JPG, PNG, or WEBP up to 10MB
            </p>
          </div>

          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />

          {files.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-10">
              {files.map((file, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[#d2dbd6] shadow-sm">
                  <img 
                    src={URL.createObjectURL(file)} 
                    alt="preview" 
                    className="w-full h-full object-cover" 
                  />
                  <button 
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="absolute top-1.5 right-1.5 bg-white/90 p-1.5 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}

           {/* Actions below form */}
           <div className="flex items-center justify-end gap-8 pt-4">
             <button className="text-[15px] font-bold text-[#56645a] hover:text-[#112d1b] transition-colors">
               Save Draft
             </button>
             <button 
                onClick={handleSubmit}
                disabled={isPending}
                className="bg-[#0d2a1a] text-white px-10 py-4 rounded-full font-bold text-[16px] shadow-sm hover:bg-[#1a3826] transition-colors disabled:opacity-50"
             >
               {isPending ? "Posting..." : "Post Content"}
             </button>
           </div>
        </main>

        {/* Right Sidebar */}
        <div className="w-[320px] flex-shrink-0 hidden xl:block mt-8">
           
           {/* Editorial Box */}
           <div className="bg-[#244837] rounded-[24px] p-8 mb-6 relative overflow-hidden shadow-lg shadow-[#244837]/20">
              <h3 className="text-white text-[20px] font-bold mb-6 tracking-wide">Editorial Guidelines</h3>
              <ul className="space-y-5 text-[#b9ebd1] font-medium text-[14px]">
                 <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                     <CheckCircle2 className="w-4 h-4 text-[#244837]" strokeWidth={3} />
                   </div>
                   Use clear, high-resolution photos.
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                     <CheckCircle2 className="w-4 h-4 text-[#244837]" strokeWidth={3} />
                   </div>
                   Be specific about lighting and soil conditions.
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center flex-shrink-0 mt-0.5">
                     <CheckCircle2 className="w-4 h-4 text-[#244837]" strokeWidth={3} />
                   </div>
                   Be kind and encouraging to fellow growers.
                 </li>
              </ul>
              
              {/* Leaf Accents */}
              <div className="absolute right-[-20px] bottom-[-20px] opacity-20 text-white pointer-events-none w-32 h-32 rounded-full border-[10px] border-white/10" />
           </div>

           {/* Inspirational Image */}
           <div className="mb-6 rounded-[24px] overflow-hidden bg-white shadow-sm p-4 h-[300px]">
              <div className="w-full h-[180px] bg-[#d3dfd8] rounded-[16px] mb-4 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1614594975525-e45190c55d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Healthy Plants" 
                  className="w-full h-full object-cover grayscale-[20%] contrast-110"
                />
              </div>
              <p className="text-[13px] text-[#56645a] font-medium italic leading-relaxed px-2">
                "Plants give us oxygen for the lungs and for the soul." — Shared by our community.
              </p>
           </div>

           {/* Growth Tip Box */}
           <div className="bg-white rounded-[24px] p-5 shadow-sm flex gap-4 items-center border border-zinc-100/50">
             <div className="w-12 h-12 bg-[#bbf0cc] rounded-[12px] flex items-center justify-center flex-shrink-0">
               <Lightbulb className="w-6 h-6 text-[#1a3826]" />
             </div>
             <div>
               <h4 className="text-[#112d1b] font-extrabold text-[14px] mb-0.5">Tip for Growth</h4>
               <p className="text-[#647167] text-[12px] font-medium leading-snug">
                 Posts with at least 2 photos get 80% more engagement!
               </p>
             </div>
           </div>

        </div>

      </div>



      
    </div>
  );
}
