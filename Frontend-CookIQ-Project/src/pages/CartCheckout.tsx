import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, CreditCard, MapPin, Phone, Truck, CheckCircle } from 'lucide-react';
import { PaymentMethod } from '../types';
import { orderApi } from '../services/api';
import { Order } from '../types';

export const Cart: React.FC = () => {
  const { cart, removeFromCart } = useStore();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">Giỏ hàng trống</h2>
        <Link to="/products" className="text-green-600 hover:underline">Quay lại mua sắm</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng của bạn</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={item.id} className="flex py-6 px-4">
              <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
              </div>
              <div className="ml-4 flex flex-1 flex-col">
                <div>
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <h3>{item.name}</h3>
                    <p className="ml-4">{item.price.toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
                <div className="flex flex-1 items-end justify-between text-sm">
                  <p className="text-gray-500">SL: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item.id)} className="font-medium text-red-600 hover:text-red-500 flex items-center">
                    <Trash2 className="w-4 h-4 mr-1" /> Xoá
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 py-6 px-4 bg-gray-50">
          <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
            <p>Tổng cộng</p>
            <p className="text-xl text-green-700">{total.toLocaleString('vi-VN')}đ</p>
          </div>
          <Link to="/checkout" className="w-full flex justify-center items-center rounded-md border border-transparent bg-green-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-green-700">
            Tiến hành đặt hàng
          </Link>
        </div>
      </div>
    </div>
  );
};

export const Checkout: React.FC = () => {
  const { cart, placeOrder, user } = useStore();
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.COD);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [loading, setLoading] = useState(false);

  if (cart.length === 0 && !isSuccess) {
    return <div className="text-center py-20">Giỏ hàng trống. <Link to="/" className="text-green-600">Mua ngay</Link></div>;
  }

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const order = await placeOrder({ address, phone, paymentMethod });
      setOrderId(order.id);
      setIsSuccess(true);
    } catch (error) {
      alert("Đặt hàng thất bại! Có thể do hết hàng hoặc lỗi hệ thống.");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Đặt hàng thành công!</h2>
        <p className="text-gray-600 mb-6">Mã đơn hàng của bạn: <span className="font-bold text-gray-900">{orderId}</span></p>
        <div className="flex justify-center space-x-4">
          <Link to="/order-tracking" className="px-6 py-2 bg-gray-100 rounded-md text-gray-700 hover:bg-gray-200">Kiểm tra đơn hàng</Link>
          <Link to="/" className="px-6 py-2 bg-green-600 rounded-md text-white hover:bg-green-700">Về trang chủ</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Thông tin thanh toán</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <form onSubmit={handleOrder} className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ nhận hàng</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><MapPin className="h-5 w-5 text-gray-400" /></div>
                <input required type="text" value={address} onChange={e => setAddress(e.target.value)} className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 border p-2" placeholder="Số nhà, đường, phường/xã..." />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-gray-400" /></div>
                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 border p-2" placeholder="09xxx..." />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Phương thức thanh toán</label>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value={PaymentMethod.COD} checked={paymentMethod === PaymentMethod.COD} onChange={() => setPaymentMethod(PaymentMethod.COD)} className="h-4 w-4 text-green-600" />
                  <span className="ml-3 font-medium text-gray-900">Thanh toán khi nhận hàng (COD)</span>
                </label>
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value={PaymentMethod.BANK_TRANSFER} checked={paymentMethod === PaymentMethod.BANK_TRANSFER} onChange={() => setPaymentMethod(PaymentMethod.BANK_TRANSFER)} className="h-4 w-4 text-green-600" />
                  <span className="ml-3 font-medium text-gray-900">Chuyển khoản ngân hàng</span>
                </label>
                <label className="flex items-center p-3 border rounded-md cursor-pointer hover:bg-gray-50">
                  <input type="radio" name="payment" value={PaymentMethod.QR_CODE} checked={paymentMethod === PaymentMethod.QR_CODE} onChange={() => setPaymentMethod(PaymentMethod.QR_CODE)} className="h-4 w-4 text-green-600" />
                  <span className="ml-3 font-medium text-gray-900">Quét mã QR (Trực tiếp)</span>
                </label>
              </div>
            </div>

            {paymentMethod === PaymentMethod.QR_CODE && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600 mb-2">Quét mã để thanh toán {total.toLocaleString('vi-VN')}đ</p>
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PAYMENT_COOKIQ_${total}`} alt="QR Payment" className="mx-auto" />
              </div>
            )}

            {paymentMethod === PaymentMethod.BANK_TRANSFER && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-sm font-bold text-blue-800">Vietcombank - CN Ha Noi</p>
                <p className="text-sm text-blue-800">STK: 1234 5678 9999</p>
                <p className="text-sm text-blue-800">Chủ TK: COOKIQ STORE</p>
                <p className="text-xs text-blue-600 mt-1">Nội dung: SDT MUA HANG</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Đang xử lý...' : `Đặt hàng - ${total.toLocaleString('vi-VN')}đ`}
            </button>
          </form>
        </div>
        <div>
          {/* Summary Side */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Đơn hàng</h3>
            <ul className="space-y-3">
              {cart.map(item => (
                <li key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.name} x {item.quantity}</span>
                  <span className="font-medium">{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                </li>
              ))}
            </ul>
            <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-gray-900">
              <span>Tổng thanh toán</span>
              <span>{total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OrderTracking: React.FC = () => {
  const { user } = useStore();
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Load đơn hàng của user khi vào trang
  useEffect(() => {
      if (user) {
          orderApi.getMyOrders()
            .then(res => {
                setMyOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
      }
  }, [user]);

  // Hàm render trạng thái có màu sắc
  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'PENDING': return <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">Chờ duyệt</span>;
          case 'CONFIRMED': return <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">Đã duyệt</span>;
          case 'SHIPPING': return <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Đang vận chuyển</span>;
          case 'DELIVERED': return <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold">Giao thành công</span>;
          case 'CANCELLED': return <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold">Đã hủy</span>;
          default: return status;
      }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Đơn hàng của tôi</h2>
      
      {!user ? (
          <p>Vui lòng đăng nhập để xem đơn hàng.</p>
      ) : loading ? (
          <p>Đang tải dữ liệu...</p>
      ) : myOrders.length === 0 ? (
          <p>Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-6">
          {myOrders.map(order => (
            <div key={order.id} className="bg-white shadow rounded-lg p-6 border-l-4 border-green-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                   <h3 className="text-lg font-bold text-gray-900">Mã: {order.id}</h3>
                   <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                </div>
                {getStatusBadge(order.status)}
              </div>
              
              <div className="border-t border-gray-100 pt-4">
                <p className="font-medium text-gray-700">Sản phẩm:</p>
                <ul className="list-disc list-inside text-sm text-gray-600 mt-1 mb-3">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                        {item.productName} (x{item.quantity}) - {item.price.toLocaleString('vi-VN')}đ
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between text-sm mt-4 font-bold">
                   <p>Tổng tiền: <span className="text-green-600 text-lg">{order.totalAmount.toLocaleString('vi-VN')}đ</span></p>
                </div>
                <p className="text-sm mt-2 text-gray-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1"/> {order.address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};