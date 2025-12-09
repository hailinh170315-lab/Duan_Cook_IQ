import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';
import { ArrowLeft, Mail, Lock, User, CheckCircle } from 'lucide-react';

const AuthLayout: React.FC<{ children: React.ReactNode; image: string; title: string }> = ({ children, image, title }) => (
  <div className="min-h-screen flex">
    {/* Left Side - Image */}
    <div className="hidden lg:flex w-1/2 bg-green-50 relative overflow-hidden">
      <img src={image} alt="Auth Background" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-green-900 bg-opacity-40 flex items-center justify-center p-12">
        <div className="text-white max-w-lg">
          <h1 className="text-5xl font-bold mb-6">{title}</h1>
          <p className="text-xl opacity-90 leading-relaxed">
            Chào mừng bạn đến với CookIQ. Nơi cung cấp những sản phẩm dinh dưỡng, hữu cơ tốt nhất cho sức khỏe gia đình bạn.
          </p>
          <div className="mt-8 flex space-x-2">
            <div className="w-12 h-1 bg-white rounded-full opacity-100"></div>
            <div className="w-3 h-1 bg-white rounded-full opacity-50"></div>
            <div className="w-3 h-1 bg-white rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </div>

    {/* Right Side - Form */}
    <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8 sm:p-12 lg:p-16 relative">
      <Link to="/" className="absolute top-8 left-8 text-gray-500 hover:text-green-600 flex items-center transition-colors">
        <ArrowLeft className="w-5 h-5 mr-2" /> Về trang chủ
      </Link>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  </div>
);

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, users } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      // Tìm user vừa đăng nhập để kiểm tra quyền
      const currentUser = users.find(u => u.email === email);
      
      if (currentUser?.roles === UserRole.ADMIN) {
        navigate('/admin'); // Admin sang trang quản trị
      } else {
        navigate('/'); // User thường về trang chủ
      }
    } else {
      alert('Email hoặc mật khẩu không đúng!');
    }
  };

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1516594798947-e65505dbb29d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" title="Sống Xanh Ăn Sạch">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Đăng nhập</h2>
        <p className="text-gray-500 mt-2">Chào mừng trở lại! Vui lòng nhập thông tin.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="admin@gmail.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="••••••"
            />
          </div>
        </div>

        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02]">
          Đăng nhập
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="font-semibold text-green-600 hover:text-green-500">
            Đăng ký miễn phí
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useStore();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (register(name, email, password)) {
      alert('Đăng ký thành công! Đang chuyển hướng...');
      navigate('/');
    } else {
      alert('Email đã tồn tại!');
    }
  };

  return (
    <AuthLayout image="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" title="Tham Gia Cùng Chúng Tôi">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Tạo tài khoản</h2>
        <p className="text-gray-500 mt-2">Bắt đầu hành trình sống khỏe cùng CookIQ.</p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="Nguyễn Văn A"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="email@example.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              placeholder="••••••"
            />
          </div>
        </div>

        <div className="flex items-start">
           <div className="flex items-center h-5">
             <CheckCircle className="h-4 w-4 text-green-600" />
           </div>
           <div className="ml-3 text-sm">
             <p className="text-gray-500">Tôi đồng ý với <a href="#" className="font-medium text-green-600 hover:text-green-500">Điều khoản dịch vụ</a> và <a href="#" className="font-medium text-green-600 hover:text-green-500">Chính sách bảo mật</a>.</p>
           </div>
        </div>

        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-[1.02]">
          Đăng ký
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Đã có tài khoản?{' '}
          <Link to="/login" className="font-semibold text-green-600 hover:text-green-500">
            Đăng nhập
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};
