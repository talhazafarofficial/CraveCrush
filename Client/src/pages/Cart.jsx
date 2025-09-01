import { useContext, useState, useEffect } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, openOrderModal, setOpenOrderModal } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { showNotification } = useContext(NotificationContext);
  const navigate = useNavigate();

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    email: '',
    address: user?.address || '',
    mobile: user?.mobileNumber || '',
    note: ''
  });
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState('');

  // Automatically open modal if cart has items and modal is not open
  // Open modal if cart has items and requested by navigation (from sidebar or after reload)
  // Open modal if cart has items and requested by context (from sidebar or after reload)
  useEffect(() => {
    if (cart.length > 0) {
      if (openOrderModal || !showModal) {
        setOrderData({
          name: '',
          email: '',
          address: user?.address || '',
          mobile: user?.mobileNumber || '',
          note: ''
        });
        setOrderError('');
        setShowModal(true);
        if (openOrderModal) setOpenOrderModal(false);
      }
    }
    // If cart is empty, close modal
    if (cart.length === 0 && showModal) {
      setShowModal(false);
    }
    // eslint-disable-next-line
  }, [cart, openOrderModal]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOpenOrderModal = () => {
    setOrderData({
      name: '',
      email: '',
      address: user?.address || '',
      mobile: user?.mobileNumber || '',
      note: ''
    });
    setOrderError('');
    setShowModal(true);
  };

  const handleOrderInput = e => {
    setOrderData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setOrderError('');
    const token = localStorage.getItem('token');
    try {
      const payload = {
        items: cart.map(i => ({
          item: i.item,
          quantity: i.quantity
        })),
        address: orderData.address,
        mobile: orderData.mobile,
        note: orderData.note
      };
      if (!user) {
        payload.name = orderData.name;
        payload.email = orderData.email;
      }
      await axios.post(
        'http://localhost:5000/api/orders',
        payload,
        user ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );
      clearCart();
      setShowModal(false);
      setOrderData({
        name: '',
        email: '',
        address: user?.address || '',
        mobile: user?.mobileNumber || '',
        note: ''
      });
      setOrderError('');
      setPlacing(false);
      if (user) {
        navigate('/dashboard');
      } else {
        navigate('/');
      }
      showNotification('Order placed successfully! Check your inbox for approval.', 'success');
    } catch (err) {
      setOrderError(err.response?.data?.error || 'Order failed');
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <div className="text-center text-gray-500">
          Your cart is empty
        </div>
      ) : (
        <div className="max-w-3xl mx-auto shadow-xl rounded-lg bg-white p-6 space-y-6">
          {cart.map(item => (
            <div key={item.item} className="flex justify-between items-center border-b pb-4">
              <div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.price} × {item.quantity}</p>
              </div>
              <button onClick={() => removeFromCart(item.item)} className="text-red-500 hover:text-red-700">
                Remove
              </button>
            </div>
          ))}
          <div className="text-right text-xl font-bold">Total: PKR{total.toFixed(2)}</div>
          <button onClick={handleOpenOrderModal} className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 text-lg">
            Place Order
          </button>
        </div>
      )}

      {/* Order Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center text-red-500">Order Details</h2>
            <form onSubmit={submitOrder} className="space-y-4">
              {!user && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      name="name"
                      value={orderData.name}
                      onChange={handleOrderInput}
                      required
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      name="email"
                      type="email"
                      value={orderData.email}
                      onChange={handleOrderInput}
                      required
                      className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                      placeholder="Enter your email"
                    />
                  </div>
                </>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="address"
                  value={orderData.address}
                  onChange={handleOrderInput}
                  required
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter delivery address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  name="mobile"
                  value={orderData.mobile}
                  onChange={handleOrderInput}
                  required
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter mobile number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                <textarea
                  name="note"
                  value={orderData.note}
                  onChange={handleOrderInput}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Any notes for your order?"
                />
              </div>
              {orderError && <div className="text-red-500 text-sm text-center">{orderError}</div>}
              <button
                type="submit"
                className={`w-full bg-red-500 text-white py-3 rounded-lg text-lg font-semibold transition-colors ${placing ? 'opacity-60 cursor-not-allowed' : 'hover:bg-red-600 cursor-pointer'}`}
                style={{ cursor: placing ? 'not-allowed' : 'pointer' }}
                disabled={placing}
              >
                {placing ? (
                  <span>
                    <svg className="inline mr-2 w-5 h-5 animate-spin text-white" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                    Placing Order...
                  </span>
                ) : 'Confirm Order'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;