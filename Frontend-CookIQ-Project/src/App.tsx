import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar, Footer } from './components/Layout';
import { ProductList, ProductDetail } from './pages/Shop';
import { Cart, Checkout, OrderTracking } from './pages/CartCheckout';
import { BlogList, BlogDetail, WriteBlog } from './pages/Blog';
import { Login, Register } from './pages/Auth';
import { AdminDashboard } from './pages/Admin';
import { ArrowRight, ShoppingCart, Star, Calendar, User } from 'lucide-react';
import { UserProfile } from './pages/UserProfile';

// Hero Slider Component
const HeroSlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1920&auto=format&fit=crop",
      title: "Thực Phẩm Xanh - Sống An Lành",
      subtitle: "Chuyên cung cấp các loại hạt dinh dưỡng, yến mạch và sữa tươi nhập khẩu chất lượng cao.",
      buttonText: "Mua ngay"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1628102491629-778571d893a3?q=80&w=1920&auto=format&fit=crop",
      title: "Sữa Tươi Thanh Trùng 100%",
      subtitle: "Hương vị thuần khiết từ trang trại đến bàn ăn của bạn.",
      buttonText: "Khám phá"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?q=80&w=1920&auto=format&fit=crop",
      title: "Yến Mạch & Ngũ Cốc",
      subtitle: "Bữa sáng dinh dưỡng, tràn đầy năng lượng cho ngày mới.",
      buttonText: "Xem chi tiết"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[500px] w-full overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Image */}
          <div className="absolute inset-0 bg-black/30 z-10"></div>
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in-up drop-shadow-lg">
              {slide.title}
            </h2>
            <p className="text-lg md:text-2xl mb-8 max-w-2xl drop-shadow-md">
              {slide.subtitle}
            </p>
            <Link
              to="/products"
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg transition-transform transform hover:scale-105 shadow-lg flex items-center"
            >
              {slide.buttonText} <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      ))}
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? "bg-green-500" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Home Page Component
const Home: React.FC = () => {
  const { products, blogs, addToCart } = useStore();
  
  // Get featured products (e.g., first 8 items)
  const featuredProducts = products.slice(0, 8);
  
  // Get latest approved blogs (first 3)
  const latestBlogs = blogs.filter(b => b.status === 'approved').slice(0, 3);

  return (
    <div className="bg-gray-50 pb-16">
      {/* 1. Hero Slider */}
      <HeroSlider />

      {/* 2. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Sản Phẩm Nổi Bật</h2>
          <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Lựa chọn tốt nhất cho sức khỏe của bạn và gia đình.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
              <div className="relative aspect-[1/1] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <button 
                  onClick={() => addToCart(product)}
                  className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-lg text-green-600 hover:bg-green-600 hover:text-white transition-all transform translate-y-12 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 z-10"
                >
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <div className="flex items-center mb-2">
                   {[...Array(5)].map((_, i) => (
                     <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                   ))}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                  <Link to={`/product/${product.id}`} className="hover:text-green-600 transition-colors">
                    {product.name}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600">{product.price.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
           <Link to="/products" className="inline-flex items-center justify-center px-8 py-3 border border-green-600 text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 transition-colors">
             Xem tất cả sản phẩm
           </Link>
        </div>
      </section>

      {/* 3. Promotional Banner */}
      <section className="bg-green-600 py-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
           <div className="text-white mb-8 md:mb-0 md:w-1/2">
             <h2 className="text-3xl font-bold mb-4">Cam Kết Chất Lượng</h2>
             <p className="text-lg opacity-90 mb-6">CookIQ cam kết mang đến những sản phẩm 100% tự nhiên, không chất bảo quản, an toàn tuyệt đối cho sức khỏe người tiêu dùng.</p>
             <ul className="space-y-2">
               <li className="flex items-center"><Star className="mr-2" /> Nguồn gốc xuất xứ rõ ràng</li>
               <li className="flex items-center"><Star className="mr-2" /> Quy trình kiểm định nghiêm ngặt</li>
               <li className="flex items-center"><Star className="mr-2" /> Giao hàng nhanh chóng</li>
             </ul>
           </div>
           <div className="md:w-1/3">
             <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop" alt="Quality" className="rounded-lg shadow-2xl border-4 border-white/20" />
           </div>
        </div>
      </section>

      {/* 4. Latest Blog Posts */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Bài Viết Mới Nhất</h2>
          <div className="w-20 h-1 bg-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Chia sẻ kiến thức dinh dưỡng và bí quyết nấu ăn.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {latestBlogs.map((blog) => (
            <div key={blog.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col">
              <div className="h-48 overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                  <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {blog.authorName}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  <Link to={`/blog/${blog.id}`} className="hover:text-green-600 transition-colors">
                    {blog.title}
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">
                  {blog.content}
                </p>
                <Link to={`/blog/${blog.id}`} className="text-green-600 font-medium hover:underline inline-flex items-center mt-auto">
                  Đọc tiếp <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const Layout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow bg-gray-50">
      <Outlet />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/write" element={<WriteBlog />} />
            <Route path="/blog/:id" element={<BlogDetail />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </Router>
    </StoreProvider>
  );
}

export default App;