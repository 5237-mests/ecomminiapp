'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Modal Component
const OrderDetailModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6">
        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="space-y-4">
          <p>
            <strong>Order ID:</strong> {order.order_id}
          </p>
          <p>
            <strong>User ID:</strong> {order.user_id}
          </p>
          <p>
            <strong>Total Price:</strong> ${order.total_price}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Order Date:</strong>{' '}
            {new Date(order.order_date).toLocaleString()}
          </p>
          <p>
            <strong>Delivery Type:</strong> {order.delivery_type}
          </p>
          <div>
            <h3 className="text-lg font-semibold mt-4 mb-2">Order Items:</h3>
            <ul className="list-disc list-inside">
              {order.orderItems.map((item) => (
                <li key={item.order_item_id} className="ml-4">
                  <div>
                    <strong>Product:</strong> {item.product.name}
                  </div>
                  <div>
                    <strong>Description:</strong> {item.product.description}
                  </div>
                  <div>
                    <strong>Price:</strong> ${item.product.price}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {item.quantity}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Fetch orders from API
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/order');
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      }
    };

    fetchOrders();
  }, []);

  // Handle opening the modal
  const openModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Handle closing the modal
  const closeModal = () => {
    setSelectedOrder(null);
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">User ID</th>
              <th className="py-2 px-4 border-b">Total Price</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Order Date</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">{order.order_id}</td>
                <td className="py-2 px-4 border-b">{order.user_id}</td>
                <td className="py-2 px-4 border-b">${order.total_price}</td>
                <td className="py-2 px-4 border-b">{order.status}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(order.order_date).toLocaleString()}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => openModal(order)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Component for Order Details */}
      <OrderDetailModal
        isOpen={isModalOpen}
        onClose={closeModal}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrdersPage;
