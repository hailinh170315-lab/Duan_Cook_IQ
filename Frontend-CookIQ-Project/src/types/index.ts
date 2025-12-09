// src/types/index.ts

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  fullName: string; // Backend dùng fullName thay vì name
  name?: string;    // Frontend cũ dùng name, ta sẽ map fullName sang name
  roles: UserRole;  // Backend trả về Enum
  avatarUrl?: string;
  createdAt?: string;
}

export enum ProductCategory {
  FRESH_MILK = 'Sữa tươi',
  OATS = 'Yến mạch',
  NUTS_DRIED_FRUIT = 'Hạt và quả khô',
}

// Map category ID string từ backend sang Enum hiển thị (tạm thời)
export const mapCategoryToEnum = (catId: string): ProductCategory => {
  // Logic đơn giản: Nếu backend lưu string giống enum thì dùng luôn, 
  // nếu không bạn cần mapping map cụ thể.
  // Ở đây giả sử bạn gửi string enum lên backend.
  return catId as ProductCategory;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string; // Backend dùng categoryId
  category?: ProductCategory; // Frontend dùng để hiển thị
  price: number;
  stockQuantity: number; // Backend
  quantity: number; // Frontend cũ dùng quantity (map từ stockQuantity)
  shortDescription: string;
  description: string;
  images: string[]; // Backend trả về List<String>
  image: string;    // Frontend cũ dùng 1 ảnh (map từ images[0])
  currency?: string;
  unit?: string;
  tags?: string[];
  isActive?: boolean;
}

export interface CartItem extends Product {
  quantity: number; // Số lượng trong giỏ hàng (khác stockQuantity)
}

export enum PaymentMethod {
  COD = 'COD',
  BANK_TRANSFER = 'BANK',
  QR_CODE = 'QR',
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  address: string;
  phone: string;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}

export enum BlogCategory {
  DINH_DUONG = 'DINH_DUONG', // Khớp với Backend Enum
  NAU_AN = 'NAU_AN',
}

export const BlogCategoryLabel: Record<BlogCategory, string> = {
  [BlogCategory.DINH_DUONG]: 'Blog dinh dưỡng',
  [BlogCategory.NAU_AN]: 'Blog nấu ăn',
};

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string; // Backend hiện tại chưa trả về authorName trong object Blog, có thể cần fetch user hoặc BE update
  category: BlogCategory;
  coverImageUrl: string; // Backend
  image?: string; // Frontend map từ coverImageUrl
  approved: boolean; // Backend
  status: 'pending' | 'approved'; // Frontend map từ boolean
  createdAt: string;
  comments: Comment[];
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    image: string;
}

// Update Order interface để khớp backend
export interface Order {
  id: string;
  userId: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number; // Backend là totalAmount
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
}