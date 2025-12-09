import React, { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { BlogPost, BlogCategory, UserRole, BlogCategoryLabel } from '../types';
import { generateBlogContent } from '../services/geminiService';
import { MessageSquare, Calendar, User, Wand2, Upload, X, ArrowLeft } from 'lucide-react';
import { fileApi } from '../services/api';

export const BlogList: React.FC = () => {
  const { blogs } = useStore();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  // Only show approved blogs to public
  const publicBlogs = blogs.filter(b => b.status === 'approved');
  const filteredBlogs = categoryParam
    ? publicBlogs.filter(b => b.category === categoryParam)
    : publicBlogs;

  const getAvatarLetter = (name: string) => name ? name.charAt(0).toUpperCase() : 'U';

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          {categoryParam
            ? BlogCategoryLabel[categoryParam as BlogCategory]
            : 'Bài viết mới nhất'}
        </h2>
        <Link
          to={categoryParam ? `/blog/write?category=${encodeURIComponent(categoryParam)}` : "/blog/write"}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Viết bài mới
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBlogs.map(blog => (
          <div key={blog.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition flex flex-col h-full">
            <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover flex-shrink-0" />
            <div className="p-6 flex flex-col flex-1">
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                {BlogCategoryLabel[blog.category]}
              </span>
              <h3 className="mt-2 text-xl font-semibold text-gray-900 line-clamp-2">
                <Link to={`/blog/${blog.id}`} className="hover:text-green-600">{blog.title}</Link>
              </h3>
              <p className="mt-3 text-base text-gray-500 line-clamp-3">{blog.content.substring(0, 100)}...</p>
              <div className="mt-auto mr-auto pt-5 flex items-center justify-end border-t border-gray-100">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                    {getAvatarLetter(blog.authorName)}
                  </div>
                </div>

                <div className="text-right ml-3">
                  <p className="text-sm font-medium text-gray-900">{blog.authorName}</p>
                  <div className="text-xs text-gray-500">
                    <time dateTime={blog.createdAt}>{new Date(blog.createdAt).toLocaleDateString('vi-VN')}</time>
                  </div>
                </div>


              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const BlogDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { blogs, addComment, user } = useStore();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const blog = blogs.find(b => b.id === id);

  if (!blog) return <div className="text-center py-20">Bài viết không tồn tại</div>;

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      setIsSubmitting(true); // Bắt đầu gửi
      await addComment(blog.id, commentText); // Chờ Store xử lý xong
      setCommentText('');
      setIsSubmitting(false); // Kết thúc
    }
  };

  const getAvatarLetter = (name: string) => name ? name.charAt(0).toUpperCase() : 'U';

  const getAvatarColor = (name: string) => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <img src={blog.image} alt={blog.title} className="w-full h-96 object-cover rounded-xl shadow-lg mb-8" />
      <div className="flex items-center text-sm text-gray-500 mb-4 space-x-4">
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
          {BlogCategoryLabel[blog.category]}
        </span>
        <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {new Date(blog.createdAt).toLocaleDateString('vi-VN')}</span>
        <span className="flex items-center"><User className="w-4 h-4 mr-1" /> {blog.authorName}</span>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-6">{blog.title}</h1>
      <div className="prose prose-green max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
        {blog.content}
      </div>

      <div className="mt-16 border-t pt-10">
        <h3 className="text-2xl font-bold mb-8 flex items-center text-gray-800">
          <MessageSquare className="mr-3 text-green-600" />
          Bình luận ({blog.comments?.length || 0})
        </h3>

        <div className="space-y-8 mb-10">
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((c) => (
              <div key={c.id} className="flex space-x-4">
                {c.userAvatar ? (
                  <img
                    src={c.userAvatar}
                    alt={c.userName}
                    className="flex-shrink-0 w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                  />
                ) : (
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm ${getAvatarColor(c.userName)}`}>
                    {getAvatarLetter(c.userName)}
                  </div>
                )}
                <div className="flex-1 bg-gray-50 p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-bold text-gray-900">{c.userName}</h4>
                    <span className="text-xs text-gray-400">
                      {new Date(c.createdAt).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{c.content}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-4">Chưa có bình luận nào.</p>
          )}
        </div>

        {user ? (
          <form onSubmit={handleComment} className="flex space-x-4 items-start bg-white p-6 border rounded-xl shadow-sm">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || user.fullName}
                className="flex-shrink-0 w-10 h-10 rounded-full object-cover border border-gray-200 shadow-sm"
              />
            ) : (
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-sm ${getAvatarColor(user.name || user.fullName)}`}>
                {getAvatarLetter(user.name || user.fullName)}
              </div>
            )}
            <div className="flex-1">
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                className="w-full border-gray-300 rounded-lg border p-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all outline-none resize-none"
                rows={3}
                placeholder="Chia sẻ suy nghĩ của bạn..."
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!commentText.trim() || isSubmitting} // Disable khi đang gửi
                  className={`px-6 py-2 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors disabled:opacity-50 ${isSubmitting ? 'cursor-wait' : ''}`}
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-gray-100 rounded-lg p-6 text-center">
            <p className="text-gray-600">Vui lòng <Link to="/login" className="text-green-600 font-bold hover:underline">đăng nhập</Link> để bình luận.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export const WriteBlog: React.FC = () => {
  const { user, addBlog } = useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Get category from URL or default to NUTRITION
  const paramCategory = searchParams.get('category');
  const initialCategory = Object.values(BlogCategory).includes(paramCategory as BlogCategory)
    ? (paramCategory as BlogCategory)
    : BlogCategory.DINH_DUONG;

  const [title, setTitle] = useState('');
  const [category] = useState<BlogCategory>(initialCategory); // No setter needed for category as it's fixed
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl mb-4">Bạn cần đăng nhập để viết bài</h2>
        <Link to="/login" className="px-4 py-2 bg-green-600 text-white rounded">Đăng nhập ngay</Link>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!title) {
      alert("Vui lòng nhập tiêu đề để AI có thể gợi ý nội dung.");
      return;
    }
    setIsGenerating(true);
    const generatedText = await generateBlogContent(title, category);
    setContent(generatedText);
    setIsGenerating(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert("File quá lớn. Vui lòng chọn ảnh dưới 5MB.");
        return;
      }
      try {
        const res = await fileApi.upload(file);
        setImage(res.data.url); // Lưu URL trả về từ server
      } catch (error) {
        console.error("Lỗi upload", error);
        alert("Không thể tải ảnh lên server.");
      }
    }
  };

  const removeImage = () => {
    setImage('');
  };

  const handleCancel = () => {
    // Navigate back to the blog list of the current category
    navigate(`/blog?category=${encodeURIComponent(category)}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      alert("Vui lòng chọn ảnh bìa cho bài viết.");
      return;
    }
    addBlog({ title, category, content, image });
    alert(user.roles === UserRole.ADMIN ? "Đã đăng bài viết!" : "Bài viết đã được gửi và đang chờ duyệt.");
    navigate(`/blog?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8">Viết bài mới</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
          <input required type="text" value={title} onChange={e => setTitle(e.target.value)} className="block w-full border-gray-300 rounded-md shadow-sm border p-3 focus:ring-green-500 focus:border-green-500" placeholder="Nhập tiêu đề bài viết..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
          <input
            type="text"
            value={category}
            readOnly
            disabled
            className="block w-full border-gray-300 rounded-md shadow-sm border p-3 bg-gray-100 text-gray-600 cursor-not-allowed"
          />
          <p className="mt-1 text-xs text-gray-500">Danh mục được cố định dựa trên trang bạn đang xem.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh Bìa</label>

          {!image ? (
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-green-500 hover:bg-green-50 transition-colors">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none">
                    <span>Tải ảnh lên</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  <p className="pl-1">hoặc kéo thả vào đây</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF lên tới 5MB</p>
              </div>
            </div>
          ) : (
            <div className="relative mt-2 rounded-md overflow-hidden border border-gray-200 group">
              <img src={image} alt="Cover preview" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                <button
                  type="button"
                  onClick={removeImage}
                  className="opacity-0 group-hover:opacity-100 bg-red-600 text-white p-2 rounded-full transform scale-75 group-hover:scale-100 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-medium text-gray-700">Nội dung</label>
            <button type="button" onClick={handleGenerate} disabled={isGenerating} className="text-sm flex items-center text-purple-600 hover:text-purple-700 disabled:opacity-50">
              <Wand2 className="w-4 h-4 mr-1" />
              {isGenerating ? "Đang viết..." : "Viết bằng AI (Gemini)"}
            </button>
          </div>
          <textarea required value={content} onChange={e => setContent(e.target.value)} rows={12} className="block w-full border-gray-300 rounded-md shadow-sm border p-3 focus:ring-green-500 focus:border-green-500" placeholder="Nội dung bài viết..." />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-md font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Huỷ
          </button>
          <button
            type="submit"
            className="flex-[2] bg-green-600 text-white py-3 px-4 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            Đăng bài viết
          </button>
        </div>
      </form>
    </div>
  );
};