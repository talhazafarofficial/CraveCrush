import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import axios from 'axios';
import { RiUserLine, RiMailLine, RiMapPinLine, RiHistoryLine, RiRefreshLine } from 'react-icons/ri';
// Floating Cancel Order Container
function CancelOrderContainer() {
  const [latestOrder, setLatestOrder] = useState(null);
  const [show, setShow] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/orders/my/history', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data && data.length > 0) {
          const order = data[0];
          const created = new Date(order.createdAt);
          const now = new Date();
          const diff = now - created;
          // Only show if not cancelled or rejected
          if (order.status !== 'cancelled' && order.status !== 'rejected' && diff < 10 * 60 * 1000) {
            setLatestOrder(order);
            setShow(true);
            setTimeout(() => setShow(false), 10 * 60 * 1000 - diff);
          }
        }
      } catch (e) {
        // ignore
      }
    };
    fetchLatest();
  }, []);

  const handleCancel = async () => {
    setCancelling(true);
    setCancelError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/orders/${latestOrder._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShow(false);
      window.location.reload(); // or better: refetch order state
    } catch (err) {
      setCancelError(err.response?.data?.error || 'Cancel failed');
      setCancelling(false);
    }
  };

  if (!show || !latestOrder) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 bg-white border border-red-200 shadow-lg rounded-lg p-6 w-80 animate-fadeIn">
      <h3 className="text-lg font-bold text-red-500 mb-2">Cancel Order</h3>
      <div className="mb-2 text-gray-700">
        <div><b>Order #</b> {latestOrder._id.slice(-5)}</div>
        <div><b>Status:</b> {latestOrder.status}</div>
        <div><b>Placed:</b> {new Date(latestOrder.createdAt).toLocaleTimeString()}</div>
        <ul className="text-sm text-gray-600 mt-2 mb-2">
          {latestOrder.items.map(i => (
            <li key={i.item._id}>{i.item.title} × {i.quantity}</li>
          ))}
        </ul>
      </div>
      {cancelError && <div className="text-red-500 text-sm mb-2">{cancelError}</div>}
      <button
        onClick={handleCancel}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 font-semibold"
        disabled={cancelling}
      >
        {cancelling ? 'Cancelling...' : 'Cancel Order'}
      </button>
      <div className="text-xs text-gray-400 mt-2">You can cancel within 10 minutes of placing your order.</div>
    </div>
  );
}

const Dashboard = () => {
  const { user, setUser } = useContext(AuthContext);
  const [tab, setTab] = useState('orders');
  // Profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    address: user?.address || '',
    mobileNumber: user?.mobileNumber || ''
  });
  const [profileError, setProfileError] = useState('');
  const [saving, setSaving] = useState(false);
  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [reorderMsg, setReorderMsg] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    setProfileData({
      name: user?.name || '',
      address: user?.address || '',
      mobileNumber: user?.mobileNumber || ''
    });
  }, [user]);

  useEffect(() => {
    if (tab === 'orders') {
      fetchOrders();
    }
    // eslint-disable-next-line
  }, [tab]);

  const handleProfileInput = e => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setProfileError('');
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        'http://localhost:5000/api/users/me',
        profileData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(data);
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/orders/my/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch {
      setOrders([]);
    }
    setOrdersLoading(false);
  };

  const handleReorder = (items) => {
    items.forEach(({ item, quantity }) => {
      addToCart({
        item: item._id,
        title: item.title,
        price: item.price,
        quantity,
        imageUrl: item.imageUrl,
        description: item.description
      });
    });
    setReorderMsg('Items added to cart!');
    setTimeout(() => setReorderMsg(''), 2000);
  };

  // Cancel any order (not just latest)
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelOrderError, setCancelOrderError] = useState('');
  const handleCancelOrder = async (orderId) => {
    setCancellingOrderId(orderId);
    setCancelOrderError('');
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      setCancelOrderError(err.response?.data?.error || 'Cancel failed');
    }
    setCancellingOrderId(null);
  };

  // Floating Cancel Order Component (optional, can be added as needed)

  return (
    
    <div className="min-h-screen bg-gray-50 p-6 relative">
      <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2 shadow">
            <RiUserLine className="text-3xl text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Welcome, {user?.name || 'User'}!</h1>
          <div className="text-gray-500 text-lg">Manage your profile & orders</div>
        </div>
      <div className="bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
        
        <div className="flex border-b">
          <button
            className={`flex-1 py-3 px-4 text-lg font-semibold ${tab === 'profile' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
            onClick={() => setTab('profile')}
          >
            <RiUserLine className="inline mr-2" />Profile
          </button>
          <button
            className={`flex-1 py-3 px-4 text-lg font-semibold ${tab === 'orders' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-500'}`}
            onClick={() => setTab('orders')}
          >
            <RiHistoryLine className="inline mr-2" />Order History
          </button>
        </div>
        <div className="p-6">
          {tab === 'profile' && (
            <form onSubmit={saveProfile} className="space-y-6 max-w-lg mx-auto">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileInput}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileInput}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  name="mobileNumber"
                  value={profileData.mobileNumber}
                  onChange={handleProfileInput}
                  className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
                  placeholder="Enter your mobile number"
                />
              </div>
              {profileError && <div className="text-red-500 text-sm text-center">{profileError}</div>}
              <button
                type="submit"
                className="w-full bg-red-500 text-white py-3 rounded-lg hover:bg-red-600 text-lg font-semibold"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
          {tab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div className="text-center text-gray-500">Loading orders...</div>
              ) : orders.length === 0 ? (
                <div className="text-center text-gray-500">No orders found.</div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => {
                    const created = new Date(order.createdAt);
                    const now = new Date();
                    const diff = now - created;
                    const canCancel = (order.status === 'pending' || order.status === 'approved') && diff < 10 * 60 * 1000;
                    return (
                      <div key={order._id} className="bg-gray-50 p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">Order #{order._id.slice(-5)}</span>
                          <span className={`text-sm font-medium ${order.status === 'cancelled' ? 'text-red-500' : 'text-green-600'}`}>{order.status}</span>
                        </div>
                        <ul className="text-sm text-gray-600 mb-2">
                          {order.items.map(i => (
                            <li key={i.item._id}>{i.item.title} × {i.quantity}</li>
                          ))}
                        </ul>
                        <div className="text-xs text-gray-400 mb-2">Ordered at: {new Date(order.createdAt).toLocaleString()}</div>
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleReorder(order.items)}
                            className="text-sm text-blue-500 hover:underline flex items-center"
                          >
                            <RiRefreshLine className="mr-1" /> Reorder
                          </button>
                          {canCancel && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="text-sm text-red-500 hover:underline flex items-center"
                              disabled={cancellingOrderId === order._id}
                            >
                              {cancellingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {cancelOrderError && <div className="text-red-500 text-center mt-2">{cancelOrderError}</div>}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Floating Cancel Order Component */}
      <CancelOrderContainer />
      {/* Reorder notification at the bottom, styled to match theme */}
      {reorderMsg && (
        <div className="fixed left-1/2 bottom-4 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg text-center text-base font-semibold z-50 animate-fadeIn">
          {reorderMsg}
        </div>
      )}
    </div>
  );
};

export default Dashboard;