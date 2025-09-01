import { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { RiCloseLine, RiShoppingCartLine } from 'react-icons/ri';

const CartSidebar = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, clearCart, setOpenOrderModal } = useContext(CartContext);
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleConfirm = () => {
    setIsRedirecting(true);
    onClose();
    setTimeout(() => {
      setOpenOrderModal(true);
      navigate('/cart');
      setIsRedirecting(false); // ✅ reset so button works again
    }, 300);
  };

  return (
    <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2 text-xl font-bold text-red-500">
          <RiShoppingCartLine /> Cart
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl"><RiCloseLine /></button>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">Your cart is empty</div>
        ) : (
          <>
            <div className="space-y-4 flex-1 overflow-y-auto">
              {cart.map(item => (
                <div key={item.item} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-xs text-gray-500">{item.price} × {item.quantity}</div>
                  </div>
                  <button onClick={() => removeFromCart(item.item)} className="text-red-500 hover:text-red-700 text-sm">Remove</button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-right font-bold text-lg">Total: PKR{total.toFixed(2)}</div>
            <button
              className="w-full mt-4 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
              onClick={handleConfirm}
              disabled={isRedirecting}
            >
              Confirm Order
            </button>
            <button
              className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 transition"
              onClick={clearCart}
              disabled={cart.length === 0}
            >
              Clear Cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CartSidebar;
