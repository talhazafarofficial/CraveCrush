import { useEffect, useState, useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const { addToCart } = useContext(CartContext);
  const { showNotification } = useContext(NotificationContext);

  const fetchOrders = async () => {
    const { data } = await axios.get('http://localhost:5000/api/orders/my/history', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    setOrders(data);
  };

  const handleReorder = (items) => {
    items.forEach(({ item, quantity }) => {
      addToCart({
        item: item._id,
        title: item.title,
        price: item.price,
        quantity,
      });
    });
  showNotification('Items added to cart!', 'success');
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-6">My Orders</h2>
      <div className="space-y-4 max-w-4xl mx-auto">
        {orders.map(order => (
          <div key={order._id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Order #{order._id.slice(-5)}</h3>
              <span className={`text-sm font-medium ${order.status === 'cancelled' ? 'text-red-500' : 'text-green-600'}`}>{order.status}</span>
            </div>
            <ul className="text-sm text-gray-600 mb-3">
              {order.items.map(i => (
                <li key={i.item._id}>
                  {i.item.title} × {i.quantity}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-400 mb-2">Ordered at: {new Date(order.createdAt).toLocaleString()}</p>
            <button onClick={() => handleReorder(order.items)} className="mt-2 text-sm text-blue-500 hover:underline">
              Reorder
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;