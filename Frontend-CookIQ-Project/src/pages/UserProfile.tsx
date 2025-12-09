import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { fileApi } from '../services/api';
import { User, Mail, Camera, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const UserProfile: React.FC = () => {
  const { user, updateUserProfile } = useStore();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setFullName(user.fullName || user.name || '');
    setAvatarUrl(user.avatarUrl || '');
  }, [user, navigate]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await fileApi.upload(file);
      setAvatarUrl(res.data.url);
    } catch (error) {
      console.error("Upload avatar failed", error);
      alert("Lỗi tải ảnh đại diện");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUserProfile(fullName, avatarUrl);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 h-32 w-full relative"></div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-center -mt-16 mb-6">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-md overflow-hidden flex items-center justify-center">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-gray-300" />
                )}
              </div>
              
              <label className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full cursor-pointer hover:bg-gray-700 transition shadow-lg border-2 border-white">
                <Camera className="w-4 h-4" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
              </label>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-800 mb-1">{user.fullName}</h2>
          <p className="text-center text-gray-500 mb-8">{user.email}</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Không thể thay đổi)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all disabled:opacity-50"
            >
              <Save className="w-5 h-5 mr-2" />
              {isUploading ? 'Đang tải ảnh...' : 'Lưu thay đổi'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};