// src/context/StoreContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Product, BlogPost, Order, CartItem, UserRole, ProductCategory, BlogCategory, PaymentMethod, OrderStatus } from '../types';
import { authApi, productApi, blogApi, orderApi } from '../services/api';

interface StoreContextType {
  user: User | null;
  products: Product[];
  blogs: BlogPost[];
  cart: CartItem[];
  orders: Order[];
  users: User[]; // Chỉ admin mới thấy list này
  login: (email: string, pass: string) => Promise<boolean>;
  register: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  placeOrder: (details: { address: string; phone: string; paymentMethod: PaymentMethod }) => Promise<Order>;
  addBlog: (blog: any) => Promise<void>;
  approveBlog: (id: string) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  addProduct: (product: any) => Promise<void>;
  updateProduct: (product: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addComment: (blogId: string, content: string) => void; // Backend chưa có comment, ta để mock tạm hoặc bỏ qua
  updateUserProfile: (name: string, avatarUrl: string) => Promise<void>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // --- Helpers để chuẩn hóa dữ liệu từ Backend ---
  const mapProductFromBackend = (p: any): Product => ({
    ...p,
    category: p.categoryId as ProductCategory, // Mapping đơn giản, thực tế cần check
    quantity: p.stockQuantity,
    image: (p.images && p.images.length > 0) ? p.images[0] : 'https://via.placeholder.com/150'
  });

  const mapBlogFromBackend = (b: any): BlogPost => ({
    ...b,
    image: b.coverImageUrl,
    status: b.approved ? 'approved' : 'pending',
    authorName: b.authorName || 'Unknown',  // Backend hiện đã trả tên tác giả
    comments: b.comments || [] // Backend chưa có comment
  });

  // --- 1. Load Data ban đầu ---
  const fetchProducts = async () => {
    try {
      const res = await productApi.getAll(0, 100);
      // res.data.content vì Backend trả về Page<Product>
      if (res.data && res.data.content) {
        setProducts(res.data.content.map(mapProductFromBackend));
      }
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    }
  };

  const fetchBlogs = async () => {
    try {
      // Load public blogs
      const res = await blogApi.getPublic();
      let allBlogs = res.data.map(mapBlogFromBackend);

      // Nếu là Admin, load thêm pending blogs
      if (user?.roles === UserRole.ADMIN) {
        const pendingRes = await blogApi.getPending();
        const pendingBlogs = pendingRes.data.map(mapBlogFromBackend);

        // Lọc trùng lặp (phòng trường hợp admin xem)
        const existingIds = new Set(allBlogs.map(b => b.id));
        const uniquePending = pendingBlogs.filter(b => !existingIds.has(b.id));

        allBlogs = [...allBlogs, ...uniquePending];
      }
      setBlogs(allBlogs);
    } catch (error) {
      console.error("Lỗi tải bài viết:", error);
    }
  };

  const updateUserProfile = async (fullName: string, avatarUrl: string) => {
    if (!user) return;
    try {
      const res = await authApi.updateProfile({ fullName, avatarUrl });
      const updatedUser = res.data;

      // Update State
      const mappedUser = { ...updatedUser, name: updatedUser.fullName };
      setUser(mappedUser);

      // Update LocalStorage để F5 không mất
      const token = localStorage.getItem('token');
      localStorage.setItem('user', JSON.stringify(updatedUser)); // Backend trả về User object

      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Update profile error:", error);
      alert("Cập nhật thất bại.");
    }
  };

  // Khôi phục session khi F5
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Map fullName -> name cho frontend cũ
      setUser({ ...parsedUser, name: parsedUser.fullName });
    }
    fetchProducts();
    // fetchBlogs sẽ gọi trong useEffect phụ thuộc vào user để load quyền admin
  }, []);

  useEffect(() => {
    fetchBlogs();
    if (user?.roles === UserRole.ADMIN) {
      fetchUsers();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      const res = await authApi.getAllUsers();
      setUsers(res.data.map((u: any) => ({ ...u, name: u.fullName })));
    } catch (error) {
      console.error("Error fetching users", error);
    }
  }

  // --- 2. Auth Actions ---
  const login = async (email: string, pass: string) => {
    try {
      const res = await authApi.login(email, pass);
      const { token, ...userData } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      const mappedUser = { ...userData, name: userData.fullName };
      setUser(mappedUser);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    try {
      await authApi.register(name, email, pass);
      return true;
    } catch (error) {
      console.error("Register failed:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart([]);
    setOrders([]);
  };

  // --- 3. Product Actions (Admin) ---
  const addProduct = async (productData: any) => {
    try {
      // Convert frontend data to backend DTO
      const payload = {
        name: productData.name,
        slug: productData.name.toLowerCase().replace(/ /g, '-'), // Tạo slug đơn giản
        shortDescription: productData.shortDescription,
        description: productData.description,
        price: productData.price,
        currency: "VND",
        categoryId: productData.category, // Gửi string enum
        images: [productData.image], // Convert string to List<String>
        stockQuantity: productData.quantity,
        unit: "Hộp",
        tags: []
      };
      await productApi.create(payload);
      fetchProducts(); // Reload list
    } catch (error) {
      console.error("Add product failed:", error);
      alert("Thêm sản phẩm thất bại");
    }
  };

  const updateProduct = async (productData: any) => {
    try {
      const payload = {
        name: productData.name,
        slug: productData.name.toLowerCase().replace(/ /g, '-'),
        shortDescription: productData.shortDescription,
        description: productData.description,
        price: productData.price,
        currency: "VND",
        categoryId: productData.category,
        images: [productData.image],
        stockQuantity: productData.quantity,
        unit: "Hộp",
        tags: []
      };
      await productApi.update(productData.id, payload);
      fetchProducts();
    } catch (error) {
      console.error("Update failed", error);
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await productApi.delete(id);
      fetchProducts();
    } catch (error) {
      console.error("Delete failed", error);
    }
  }

  // --- 4. Blog Actions ---
  const addBlog = async (blogData: any) => {
    if (!user) return;
    try {
      const payload = {
        title: blogData.title,
        category: blogData.category, // Enum khớp backend
        coverImageUrl: blogData.image,
        content: blogData.content,
        authorId: user.id
      };
      await blogApi.create(payload);
      fetchBlogs();
    } catch (error) {
      console.error("Create blog failed", error);
    }
  };

  const approveBlog = async (id: string) => {
    try {
      await blogApi.approve(id);
      fetchBlogs();
    } catch (error) {
      console.error("Approve failed", error);
    }
  }

  const deleteBlog = async (id: string) => {
    try {
      // Logic frontend đang dùng chung hàm delete cho cả reject và delete
      // Ta cần check status hoặc thử gọi cả 2 (hoặc tách hàm ở UI)
      // Ở đây giả sử xóa bài approved
      await blogApi.deleteApproved(id);
      // Nếu lỗi 404/500 thử gọi reject (nếu là bài pending)
      // Tốt nhất ở UI nên phân biệt nút "Từ chối" và "Xóa"
      fetchBlogs();
    } catch (error) {
      try {
        await blogApi.reject(id);
        fetchBlogs();
      } catch (e) {
        console.error("Delete blog failed", e);
      }
    }
  }

  // --- 5. User Management (Admin) ---
  const deleteUser = async (id: string) => {
    try {
      await authApi.deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error("Delete user failed", error);
    }
  }

  // --- 6. Cart & Order (Local State - Backend chưa có API Order) ---
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  // Thêm hàm fetchOrders cho admin
  const fetchOrders = async () => {
    try {
      const res = await orderApi.getAllOrders();
      setOrders(res.data);
    } catch (error) {
      console.error("Lỗi tải danh sách đơn hàng", error);
    }
  };

  const placeOrder = async (details: { address: string; phone: string; paymentMethod: PaymentMethod }) => {
    if (!user) throw new Error("Vui lòng đăng nhập để đặt hàng");

    // Chuẩn bị dữ liệu đúng format Backend yêu cầu (CreateOrderRequest)
    const payload = {
      customerName: user.fullName || user.name,
      phone: details.phone,
      address: details.address,
      paymentMethod: details.paymentMethod,
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const res = await orderApi.create(payload);
      const newOrder = res.data;

      // Đặt hàng xong thì xóa giỏ hàng
      setCart([]);

      // Cập nhật list order local (để nếu qua trang tracking thấy ngay)
      setOrders(prev => [newOrder, ...prev]);

      return newOrder;
    } catch (error) {
      console.error("Lỗi đặt hàng:", error);
      throw error; // Ném lỗi ra để trang Checkout bắt được
    }
  };

  // Hàm Admin cập nhật trạng thái
  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await orderApi.updateStatus(id, status);
      fetchOrders(); // Reload list
    } catch (error) {
      console.error("Update status failed", error);
    }
  };

  // Reload orders khi admin login
  useEffect(() => {
    if (user?.roles === UserRole.ADMIN) {
      fetchOrders();
    }
  }, [user]);

  // Mock api add comments
  const addComment = async (blogId: string, content: string) => {
    if (!user) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }

    try {
      // 1. Gọi API Backend (Backend trả về object BlogPost đã có comment mới)
      const res = await blogApi.addComment(blogId, user.id, content);

      // 2. Chuẩn hóa dữ liệu vừa nhận được (Mapping giống như lúc fetch)
      // Lưu ý: res.data chính là bài viết mới nhất từ backend
      const updatedBlog = mapBlogFromBackend(res.data);

      // 3. Cập nhật trực tiếp vào State "blogs" mà KHÔNG cần fetch lại toàn bộ
      setBlogs(prevBlogs => prevBlogs.map(b =>
        b.id === blogId ? updatedBlog : b
      ));

      console.log("Đã cập nhật bình luận mới ngay lập tức");

    } catch (error) {
      console.error("Lỗi khi gửi bình luận:", error);
      alert("Không thể gửi bình luận. Vui lòng thử lại.");
    }
  };

  return (
    <StoreContext.Provider value={{
      user, users, products, blogs, cart, orders,
      login, register, logout,
      addToCart, removeFromCart, clearCart, placeOrder,
      addBlog, approveBlog, deleteBlog, addComment,
      deleteUser, addProduct, updateProduct, deleteProduct,
      updateUserProfile, fetchOrders, updateOrderStatus,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};