import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { UserRole, ProductCategory, BlogCategory, BlogCategoryLabel } from '../types';
import { ShoppingCart, User, Menu, X, ChevronDown, Search, LogOut, Settings, Shield, UserCircle, ShoppingBag } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, cart, logout } = useStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-green-600 tracking-wide">CookIQ</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium">Trang chủ</Link>

            {/* Sản Phẩm Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-green-600 font-medium focus:outline-none">
                Sản Phẩm <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {Object.values(ProductCategory).map((cat) => (
                  <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            {/* Blog Dropdown */}
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-green-600 font-medium focus:outline-none">
                Blog <ChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {Object.values(BlogCategory).map((cat) => (
                  <Link
                    key={cat}
                    to={`/blog?category=${encodeURIComponent(cat)}`} // URL vẫn dùng DINH_DUONG
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50"
                  >
                    {BlogCategoryLabel[cat]} {/* Hiển thị: Blog dinh dưỡng */}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/order-tracking" className="text-gray-700 hover:text-green-600 font-medium">Kiểm tra đơn hàng</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 font-medium">Giới thiệu</Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600 font-medium">Liên hệ</Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-green-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-700 hover:text-green-600">
                  {/* Logic: Nếu có avatarUrl thì hiện ảnh, không thì hiện icon User cũ */}
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                  <span className="max-w-[100px] truncate font-medium">{user.name || user.fullName}</span>
                </button>
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm leading-5">Đăng nhập với</p>
                    <p className="text-sm font-bold leading-5 text-gray-900 truncate">{user.email}</p>
                  </div>

                  <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                    <UserCircle className="w-4 h-4 mr-3 text-gray-500" /> Thông tin cá nhân
                  </Link>

                  {user.roles === UserRole.ADMIN && (
                    <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-green-700 hover:bg-green-50 font-medium">
                      <Settings className="w-4 h-4 mr-3" /> Quản trị hệ thống
                    </Link>
                  )}

                  <Link to="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                    <Shield className="w-4 h-4 mr-3 text-gray-500" /> Quyền riêng tư & Bảo mật
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <Link to="/order-tracking" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-green-50">
                    <ShoppingBag className="w-4 h-4 mr-3 text-gray-500" /> Đơn hàng của tôi
                  </Link>

                  <div className="border-t border-gray-100 my-1"></div>

                  <button onClick={handleLogout} className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-3" /> Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="px-6 py-2 rounded-full bg-green-600 text-white hover:bg-green-700 transition-colors font-medium shadow-sm">
                Đăng nhập
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 rounded-md text-gray-700">
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md">Trang chủ</Link>
            <div className="px-3 py-2 text-base font-medium text-gray-500">Sản Phẩm</div>
            {Object.values(ProductCategory).map((cat) => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="block pl-6 px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md">
                - {BlogCategoryLabel[cat]}
              </Link>
            ))}
            <div className="px-3 py-2 text-base font-medium text-gray-500">Blog</div>
            {Object.values(BlogCategory).map((cat) => (
              <Link key={cat} to={`/blog?category=${encodeURIComponent(cat)}`} className="block pl-6 px-3 py-2 text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md">
                - {cat}
              </Link>
            ))}
            <Link to="/order-tracking" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-md">Kiểm tra đơn hàng</Link>

            {user ? (
              <>
                <div className="border-t border-gray-200 mt-2 pt-2 px-3">
                  <div className="flex items-center mb-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-2">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>

                  <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md">Thông tin cá nhân</Link>
                  {user.roles === UserRole.ADMIN && (
                    <Link to="/admin" className="block px-3 py-2 text-base font-medium text-green-700 hover:bg-green-50 rounded-md">Quản trị hệ thống</Link>
                  )}
                  <Link to="#" className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-md">Quyền riêng tư & Bảo mật</Link>

                  <button onClick={handleLogout} className="w-full text-left mt-2 block px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md">
                    Đăng xuất
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="block w-full text-center mt-4 px-5 py-3 rounded-md bg-green-600 text-white font-medium">Đăng nhập / Đăng ký</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-green-500 mb-4">CookIQ</h3>
            <p className="text-sm text-gray-400">
              Cung cấp thực phẩm hữu cơ, sạch và an toàn cho sức khỏe gia đình bạn.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Về chúng tôi</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-green-400">Giới thiệu</Link></li>
              <li><Link to="/contact" className="hover:text-green-400">Liên hệ</Link></li>
              <li><Link to="/terms" className="hover:text-green-400">Điều khoản sử dụng</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/order-tracking" className="hover:text-green-400">Tra cứu đơn hàng</Link></li>
              <li><Link to="/faq" className="hover:text-green-400">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Đăng ký nhận tin</h4>
            <div className="flex">
              <input type="email" placeholder="Email của bạn" className="px-4 py-2 w-full rounded-l-md bg-gray-700 text-white focus:outline-none" />
              <button className="px-4 py-2 bg-green-600 rounded-r-md hover:bg-green-700">Gửi</button>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} CookIQ. All rights reserved.
        </div>
      </div>
    </footer>
  );
};