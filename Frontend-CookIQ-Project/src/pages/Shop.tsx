import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Product, ProductCategory } from '../types';
import { ShoppingCart, Search, Filter } from 'lucide-react';

export const ProductList: React.FC = () => {
  const { products, addToCart } = useStore();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const filteredProducts = categoryParam
    ? products.filter(p => p.category === categoryParam)
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        {categoryParam ? categoryParam : 'Tất cả sản phẩm'}
      </h2>
      
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">Không tìm thấy sản phẩm nào trong danh mục này.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 xl:aspect-w-7 xl:aspect-h-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover object-center group-hover:opacity-75"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  <Link to={`/product/${product.id}`}>{product.name}</Link>
                </h3>
                <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-lg font-bold text-green-600">{product.price.toLocaleString('vi-VN')}đ</p>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products, addToCart } = useStore();
  const product = products.find(p => p.id === id);

  if (!product) return <div className="text-center py-20">Sản phẩm không tồn tại</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
        <div className="aspect-w-4 aspect-h-3 rounded-lg overflow-hidden bg-gray-100">
          <img src={product.image} alt={product.name} className="object-center object-cover w-full h-full" />
        </div>
        <div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
          <div className="mt-3">
            <h2 className="sr-only">Product information</h2>
            <p className="text-3xl text-green-600 font-bold">{product.price.toLocaleString('vi-VN')}đ</p>
          </div>
          <div className="mt-6">
            <h3 className="sr-only">Description</h3>
            <div className="text-base text-gray-700 space-y-6">{product.description}</div>
          </div>
          <div className="mt-8 flex">
            <button
              onClick={() => addToCart(product)}
              className="flex-1 bg-green-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-500">
               <p>Danh mục: <span className="font-medium text-gray-900">{product.category}</span></p>
               <p className="mt-2">Cam kết: 100% Tự nhiên - Không chất bảo quản</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
