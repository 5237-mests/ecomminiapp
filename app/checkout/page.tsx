'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const CheckoutPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(
    'https://checkout.chapa.co/checkout/payment/K3GipCiSqbMjx0jDDd3hAaUaMinWHqZsu4LYGXNvh4xum',
  ); // To store the payment URL after order placement

  // Fetch cart items from the backend or local storage
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        // Replace with your API endpoint to get cart items
        const response = await axios.get('/api/cart');
        setCartItems(response.data.cartItems);
        calculateTotal(response.data.cartItems);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  // Calculate the total price of the cart
  const calculateTotal = (items) => {
    const total = items.reduce(
      (acc, item) => acc + item.quantity * item.product.price,
      0,
    );
    setTotalPrice(total);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      const orderData = {
        ...data,
        cartItems,
        totalPrice,
      };

      // Replace with your API endpoint to create an order and get payment URL
      const response = await axios.post('/api/checkout', orderData);
      console.log(response.data);

      // Assume response structure includes paymentData.data.checkout_url
      //   const checkoutUrl = response.data.paymentData?.data?.checkout_url;
      const checkoutUrl =
        'https://checkout.chapa.co/checkout/payment/G8ZZHLYk0r0wzea5Y9DAWOhXs7qmKawvNUAQBQ09s12Ph';
      if (checkoutUrl) {
        setPaymentUrl(checkoutUrl); // Set the payment URL to display the iframe
      } else {
        alert('Order placed, but payment URL is missing.');
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      {!paymentUrl ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>

          {/* Cart Summary */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <table className="min-w-full bg-white border border-gray-200 mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Product</th>
                    <th className="py-2 px-4 border-b">Quantity</th>
                    <th className="py-2 px-4 border-b">Price</th>
                    <th className="py-2 px-4 border-b">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.product_id} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border-b">
                        {item.product.name}
                      </td>
                      <td className="py-2 px-4 border-b">{item.quantity}</td>
                      <td className="py-2 px-4 border-b">
                        ${item.product.price}
                      </td>
                      <td className="py-2 px-4 border-b">
                        ${item.quantity * item.product.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="text-right font-bold">
              <p>Total Price: ${totalPrice}</p>
            </div>
          </div>

          {/* Checkout Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded-lg shadow-lg"
          >
            <h2 className="text-lg font-semibold mb-4">Delivery Information</h2>

            {/* Name Input */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Full Name</label>
              <input
                type="text"
                {...register('fullName', { required: 'Full Name is required' })}
                className="w-full p-2 border rounded"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Address Input */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Delivery Address</label>
              <input
                type="text"
                {...register('address', {
                  required: 'Delivery Address is required',
                })}
                className="w-full p-2 border rounded"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                {...register('phone', { required: 'Phone number is required' })}
                className="w-full p-2 border rounded"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone.message}</p>
              )}
            </div>

            {/* Delivery Type */}
            <div className="mb-4">
              <label className="block font-medium mb-2">Delivery Type</label>
              <select
                {...register('deliveryType', {
                  required: 'Delivery Type is required',
                })}
                className="w-full p-2 border rounded"
              >
                <option value="delivery">Delivery</option>
                <option value="takeaway">Takeaway</option>
                <option value="ontable">On Table</option>
              </select>
              {errors.deliveryType && (
                <p className="text-red-500 text-sm">
                  {errors.deliveryType.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 mt-4 rounded text-white ${
                isSubmitting ? 'bg-gray-500' : 'bg-green-600 hover:bg-green-700'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </>
      ) : (
        // Display the payment iframe once the payment URL is available
        <div className="mt-8">
          <h1 className="text-2xl font-bold mb-4">Payment</h1>
          <iframe
            src={paymentUrl}
            className="w-full h-screen border"
            title="Payment Checkout"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
