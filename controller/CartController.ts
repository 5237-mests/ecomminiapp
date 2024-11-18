export const handleCartQuantity = async (requestBody: object) => {
  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set content type to JSON
      },
      body: JSON.stringify(requestBody), // Convert the body into a JSON string
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Failed to add item to cart, status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error(data.error);
    } else {
      // Handle the successful response
      console.log('Cart updated successfully:', data.cartItem.quantity);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error adding item to cart:', error.message);
    }
  }
};

export const fetchcart = async () => {
  try {
    const response = await fetch('/api/cart', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        userId: 'cm2w8sjta00009lg4w2152lwo',
      },
    });
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      return data.cartItems;
    } else {
      console.error('Failed to fetch cart items');
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};
