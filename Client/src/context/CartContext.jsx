import { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [openOrderModal, setOpenOrderModal] = useState(false);

  const addToCart = item => {
    setCart(prev => {
      const exists = prev.find(i => i.item === item.item);
      if (exists) {
        return prev.map(i => i.item === item.item ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = id => {
    setCart(prev => prev.filter(i => i.item !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart, openOrderModal, setOpenOrderModal }}>
      {children}
    </CartContext.Provider>
  );
};