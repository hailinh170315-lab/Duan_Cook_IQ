
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { UserRole, ProductCategory, Product, BlogCategoryLabel } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import { Trash2, ShoppingBag, CheckCircle, Package, FileText, Users, ArrowLeft, Clock, Eye, Edit, Plus, X } from 'lucide-react';
import { fileApi } from '../services/api';
import { useRef } from 'react';
import { OrderStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const { user, products, blogs, users, deleteProduct, addProduct, updateProduct, approveBlog, deleteBlog, deleteUser, orders, updateOrderStatus } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'products' | 'blogs' | 'users' | 'orders'>('products');


  // Thêm state để quản lý trạng thái upload
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Product Form State
  const initialProductState = {
    name: '',
    price: '',
    quantity: '',
    category: ProductCategory.FRESH_MILK,
    shortDescription: '',
    description: '',
    image: '',
  };
  const [productForm, setProductForm] = useState(initialProductState);
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!user || user.roles !== UserRole.ADMIN) {
    navigate('/');
    return null;
  }

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: productForm.name,
      price: Number(productForm.price),
      quantity: Number(productForm.quantity),
      category: productForm.category,
      shortDescription: productForm.shortDescription,
      description: productForm.description,
      image: productForm.image || `https://picsum.photos/400/400?random=${Date.now()}`
    };

    if (editingId) {
      // Update existing
      updateProduct({
        id: editingId,
        ...productData
      });
      alert("Cập nhật sản phẩm thành công!");
    } else {
      // Add new
      addProduct(productData);
      alert("Thêm sản phẩm thành công!");
    }

    // Reset
    setProductForm(initialProductState);
    setEditingId(null);
  };

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      shortDescription: product.shortDescription,
      description: product.description,
      image: product.image
    });
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setProductForm(initialProductState);
  };

  // Filter blogs
  const pendingBlogs = blogs.filter(b => b.status === 'pending');
  const approvedBlogs = blogs.filter(b => b.status === 'approved');

  //  Hàm xử lý khi chọn file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const res = await fileApi.upload(file);
      // Backend trả về: { "url": "http://localhost:8080/uploads/..." }
      const imageUrl = res.data.url;

      // Cập nhật form với URL ảnh mới nhận được
      setProductForm(prev => ({ ...prev, image: imageUrl }));

    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload ảnh thất bại!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <Link to="/" className="flex items-center px-4 py-2 bg-white text-green-600 border border-green-600 rounded-md hover:bg-green-50 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Về trang chủ
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button onClick={() => setActiveTab('products')} className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'products' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
            <Package className="w-4 h-4 mr-2" /> Sản Phẩm
          </button>
          <button onClick={() => setActiveTab('blogs')} className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'blogs' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
            <FileText className="w-4 h-4 mr-2" /> Quản lý Blog
            {pendingBlogs.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{pendingBlogs.length}</span>
            )}
          </button>
          <button onClick={() => setActiveTab('users')} className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'users' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
            <Users className="w-4 h-4 mr-2" /> Người dùng
          </button>
          <button onClick={() => setActiveTab('orders')} className={`flex items-center px-4 py-2 rounded-md transition-colors ${activeTab === 'orders' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
            <ShoppingBag className="w-4 h-4 mr-2" /> Đơn hàng
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6 min-h-[500px]">
          {/* Products Tab */}
          {activeTab === 'products' && (
            <div>
              <div className="mb-8 border-b pb-8 bg-gray-50 p-6 rounded-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {editingId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                  </h3>
                  {editingId && (
                    <button onClick={handleCancelEdit} className="flex items-center text-sm text-gray-500 hover:text-gray-700">
                      <X className="w-4 h-4 mr-1" /> Huỷ chỉnh sửa
                    </button>
                  )}
                </div>

                <form onSubmit={handleProductSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                    <input required placeholder="Nhập tên sản phẩm" value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} className="w-full border p-2 rounded focus:ring-green-500 focus:border-green-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
                    <input required placeholder="VD: 50000" type="number" value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} className="w-full border p-2 rounded focus:ring-green-500 focus:border-green-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
                    <input required placeholder="VD: 100" type="number" value={productForm.quantity} onChange={e => setProductForm({ ...productForm, quantity: e.target.value })} className="w-full border p-2 rounded focus:ring-green-500 focus:border-green-500" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                    <select value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value as ProductCategory })} className="w-full border p-2 rounded focus:ring-green-500 focus:border-green-500">
                      {Object.values(ProductCategory).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hình ảnh sản phẩm</label>

                    {/* Khu vực hiển thị preview ảnh */}
                    <div className="flex items-center space-x-4 mb-2">
                      {productForm.image ? (
                        <img src={productForm.image} alt="Preview" className="w-20 h-20 object-cover rounded border" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded border flex items-center justify-center text-gray-400 text-xs">
                          No Image
                        </div>
                      )}

                      {/* Input chọn file */}
                      <div className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                        />
                        {isUploading && <p className="text-xs text-blue-500 mt-1">Đang tải ảnh lên...</p>}
                      </div>
                    </div>

                    {/* Vẫn giữ input text ẩn hoặc hiện để debug URL nếu muốn, nhưng có thể bỏ đi */}
                    <input
                      type="hidden"
                      value={productForm.image}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn gọn</label>
                    <input required placeholder="Mô tả ngắn hiển thị trên thẻ sản phẩm" value={productForm.shortDescription} onChange={e => setProductForm({ ...productForm, shortDescription: e.target.value })} className="w-full border p-2 rounded focus:ring-green-500 focus:border-green-500" />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả đầy đủ</label>
                    <textarea required placeholder="Chi tiết về sản phẩm..." rows={4} value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} className="w-full border p-2 rounded focus:ring-green-500 focus:border-green-500" />
                  </div>

                  <div className="md:col-span-2 flex justify-end mt-2">
                    <button type="submit" className={`flex items-center px-6 py-2 text-white rounded font-medium transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}>
                      {editingId ? <><Edit className="w-4 h-4 mr-2" /> Cập nhật</> : <><Plus className="w-4 h-4 mr-2" /> Thêm mới</>}
                    </button>
                  </div>
                </form>
              </div>

              <h3 className="text-xl font-bold mb-4">Danh sách sản phẩm</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Tên sản phẩm</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Giá</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">SL</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Danh mục</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider w-1/4">Mô tả ngắn</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{p.id}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate" title={p.name}>
                          <div className="flex items-center">
                            <img src={p.image} alt="" className="w-8 h-8 rounded mr-2 object-cover bg-gray-200" />
                            <span className="truncate">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{p.price.toLocaleString()}đ</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" title={p.shortDescription}>
                          {p.shortDescription}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditClick(p)}
                            className="text-blue-600 hover:text-blue-900 mr-4 inline-flex items-center"
                            title="Chỉnh sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Bạn có chắc chắn muốn xoá sản phẩm này?')) deleteProduct(p.id);
                            }}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                            title="Xoá"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Blogs Tab */}
          {activeTab === 'blogs' && (
            <div className="space-y-10">
              {/* Section 1: Pending Blogs */}
              <div className="border border-yellow-200 rounded-lg overflow-hidden">
                <div className="bg-yellow-50 px-6 py-4 border-b border-yellow-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-yellow-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2" /> Bài viết chờ duyệt ({pendingBlogs.length})
                  </h3>
                </div>
                <div className="p-6">
                  {pendingBlogs.length === 0 ? (
                    <p className="text-gray-500 italic text-center">Không có bài viết nào đang chờ duyệt.</p>
                  ) : (
                    <div className="grid gap-6">
                      {pendingBlogs.map(blog => (
                        <div key={blog.id} className="bg-white border rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-medium">
                                {BlogCategoryLabel[blog.category]}
                              </span>
                              <span className="text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</span>
                            </div>
                            <h4 className="font-bold text-lg text-gray-900 mb-1">{blog.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">Tác giả: <span className="font-medium">{blog.authorName}</span></p>
                            <p className="text-gray-600 text-sm line-clamp-2 bg-gray-50 p-2 rounded">{blog.content}</p>
                          </div>
                          <div className="flex md:flex-col justify-end gap-2 shrink-0">
                            <button
                              onClick={() => approveBlog(blog.id)}
                              className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm font-medium"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" /> Duyệt bài
                            </button>
                            <button
                              onClick={() => deleteBlog(blog.id)}
                              className="flex items-center justify-center px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                            >
                              <Trash2 className="w-4 h-4 mr-2" /> Từ chối
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 2: Approved Blogs */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-600" /> Bài viết đã xuất bản ({approvedBlogs.length})
                  </h3>
                </div>
                <div className="p-6">
                  {approvedBlogs.length === 0 ? (
                    <p className="text-gray-500 italic text-center">Chưa có bài viết nào được xuất bản.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bài viết</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tác giả</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đăng</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {approvedBlogs.map(blog => (
                            <tr key={blog.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <Link to={`/blog/${blog.id}`} target="_blank" className="text-sm font-medium text-green-600 hover:underline flex items-center group">
                                  {blog.title} <Eye className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{blog.authorName}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                  {BlogCategoryLabel[blog.category]}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => deleteBlog(blog.id)} className="text-red-600 hover:text-red-900 transition-colors" title="Xoá bài viết">
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h3 className="text-xl font-bold mb-4">Quản lý người dùng</h3>
              <div className="overflow-x-auto border rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Fullname</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">CreatedAt</th>
                      <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{u.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* SỬA Ở ĐÂY: u.roles và UserRole.ADMIN */}
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.roles === UserRole.ADMIN ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {u.roles}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {/* SỬA Ở ĐÂY: u.roles và UserRole.ADMIN */}
                          {u.roles !== UserRole.ADMIN ? (
                            <button onClick={() => deleteUser(u.id)} className="text-red-600 hover:text-red-900 flex items-center justify-end w-full">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          ) : (
                            <span className="text-gray-400 cursor-not-allowed">Admin</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
          <div>
            <h3 className="text-xl font-bold mb-4">Quản lý Đơn hàng ({orders.length})</h3>
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                   <tr>
                     <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Mã Đơn</th>
                     <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Khách hàng</th>
                     <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Tổng tiền</th>
                     <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Trạng thái</th>
                     <th className="px-6 py-3 text-right text-xs font-bold text-gray-600 uppercase">Hành động</th>
                   </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                   {orders.map(order => (
                     <tr key={order.id} className="hover:bg-gray-50">
                       <td className="px-6 py-4 text-sm font-medium">{order.id.substring(0, 8)}...</td>
                       <td className="px-6 py-4 text-sm">
                         <p className="font-bold">{order.customerName}</p>
                         <p className="text-xs text-gray-500">{order.phone}</p>
                       </td>
                       <td className="px-6 py-4 text-sm font-bold text-green-600">
                         {order.totalAmount.toLocaleString('vi-VN')}đ
                       </td>
                       <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold 
                            ${order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                              order.status === OrderStatus.SHIPPING ? 'bg-purple-100 text-purple-800' :
                              order.status === OrderStatus.DELIVERED ? 'bg-green-100 text-green-800' :
                              order.status === OrderStatus.CANCELLED ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {order.status}
                          </span>
                       </td>
                       <td className="px-6 py-4 text-right text-sm space-x-2">
                         {/* CHỈ HIỆN NÚT THEO TRẠNG THÁI */}
                         {order.status === OrderStatus.PENDING && (
                           <>
                             <button 
                               onClick={() => updateOrderStatus(order.id, OrderStatus.CONFIRMED)}
                               className="text-white bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-xs"
                             >Duyệt</button>
                             <button 
                               onClick={() => updateOrderStatus(order.id, OrderStatus.CANCELLED)}
                               className="text-white bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-xs"
                             >Huỷ</button>
                           </>
                         )}
                         {order.status === OrderStatus.CONFIRMED && (
                            <button 
                               onClick={() => updateOrderStatus(order.id, OrderStatus.SHIPPING)}
                               className="text-white bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 text-xs"
                             >Giao hàng</button>
                         )}
                       </td>
                     </tr>
                   ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
