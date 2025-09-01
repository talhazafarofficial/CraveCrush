import { useEffect, useState, useRef, useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import axios from 'axios';
import { RiCheckLine, RiCloseLine, RiAddLine, RiEdit2Line, RiDeleteBin6Line } from 'react-icons/ri';

const AdminDashboard = () => {
  // Edit modal states
  const [editModal, setEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ title: '', description: '', price: '', category: '', imageUrl: '' });
  const [editError, setEditError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Other states
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectOrderId, setRejectOrderId] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [addItem, setAddItem] = useState({ title: '', description: '', price: '', category: '', imageUrl: '' });
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef();
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');

  const token = localStorage.getItem('token');

  // Edit modal functions
  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      description: item.description || '',
      price: item.price,
      category: item.category,
      imageUrl: item.imageUrl || ''
    });
    setEditError('');
    setEditModal(true);
  };

  const handleEditChange = e => {
    setEditForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      await axios.put(`http://localhost:5000/api/menu/${editItem._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditModal(false);
      setEditItem(null);
      fetchMenu();
    } catch (err) {
      setEditError(err.response?.data?.error || 'Failed to update item');
    }
  };

  const { showNotification } = useContext(NotificationContext);
  // Delete menu item
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    setDeleteLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMenu();
      showNotification('Menu item deleted.', 'success');
    } catch (err) {
      showNotification(err.response?.data?.error || 'Failed to delete item', 'error');
    }
    setDeleteLoading(false);
  };

  // Fetch orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders/admin/all', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch {
      setOrders([]);
    }
    setOrdersLoading(false);
  };

  // Approve order
  const approveOrder = async id => {
    setActionLoading(true);
    setActionError('');
    try {
      await axios.patch(`http://localhost:5000/api/orders/admin/approve/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchOrders();
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to approve order');
    }
    setActionLoading(false);
  };

  // Open reject modal
  const openRejectModal = (id) => {
    setRejectOrderId(id);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // Confirm reject
  const confirmReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    setActionError('');
    try {
      await axios.patch(`http://localhost:5000/api/orders/admin/reject/${rejectOrderId}`, {
        reason: rejectReason
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowRejectModal(false);
      setRejectOrderId(null);
      setRejectReason('');
      fetchOrders();
    } catch (err) {
      setActionError(err.response?.data?.error || 'Failed to reject order');
    }
    setActionLoading(false);
  };

  // Fetch menu items
  const fetchMenu = async () => {
    setMenuLoading(true);
    try {
      const { data } = await axios.get('http://localhost:5000/api/menu');
      setMenuItems(data);
    } catch {
      setMenuItems([]);
    }
    setMenuLoading(false);
  };

  // Add menu item with image upload or URL
  const handleAddMenuItem = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    let imageUrl = addItem.imageUrl;
    try {
      if (imageFile) {
        setUploading(true);
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await axios.post('http://localhost:5000/api/menu/upload', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        imageUrl = uploadRes.data.url;
        setUploading(false);
      } else if (!imageUrl) {
        setAddError('Please upload an image or provide an image URL.');
        return;
      }
      await axios.post('http://localhost:5000/api/menu', { ...addItem, imageUrl }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddSuccess('Menu item added!');
      setAddItem({ title: '', description: '', price: '', category: '', imageUrl: '' });
      setImageFile(null);
      setImagePreview('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchMenu();
    } catch (err) {
      setAddError(err.response?.data?.error || 'Failed to add item');
      setUploading(false);
    }
  };

  useEffect(() => {
    if (tab === 'orders') fetchOrders();
    if (tab === 'menu') fetchMenu();
    // eslint-disable-next-line
  }, [tab]);

  return (
    <div className="min-h-screen py-12 px-4 bg-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>
      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 rounded-l-lg font-semibold ${tab === 'orders' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('orders')}
        >Orders</button>
        <button
          className={`px-6 py-2 rounded-r-lg font-semibold ${tab === 'menu' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}
          onClick={() => setTab('menu')}
        >Menu Management</button>
      </div>

      {tab === 'orders' && (
        <div className="space-y-6 max-w-5xl mx-auto">
          {actionError && <div className="text-center text-red-500 mb-2">{actionError}</div>}
          {ordersLoading ? <div className="text-center">Loading orders...</div> : orders.length === 0 ? <p className="text-center">No orders pending.</p> : (
            orders.map(order => (
              <div key={order._id} className="p-6 shadow border rounded bg-gray-50">
                <h3 className="font-semibold mb-2">
                  From: {order.user?.name || order.guestName || 'Unknown User'} | {order.user?.email || order.guestEmail || 'No Email'}
                </h3>
                <p>
                  Items: {order.items.map(i => (
                    <span key={i.item._id}>
                      {i.item.title} × {i.quantity} |
                    </span>
                  ))}
                </p>
                <p>Note: {order.note || 'No note'}</p>
                <div className="mt-4 space-x-2">
                  <button onClick={() => approveOrder(order._id)} className="bg-green-500 text-white px-4 py-2 rounded inline-flex items-center" disabled={actionLoading}><RiCheckLine className="mr-1" />{actionLoading ? 'Processing...' : 'Approve'}</button>
                  <button onClick={() => openRejectModal(order._id)} className="bg-red-500 text-white px-4 py-2 rounded inline-flex items-center" disabled={actionLoading}><RiCloseLine className="mr-1" />Reject</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'menu' && (
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Add Menu Item</h2>
          <form onSubmit={handleAddMenuItem} className="bg-gray-50 p-6 rounded shadow space-y-4">
            <div>
              <input
                className="w-full border p-2 rounded"
                placeholder="Title"
                value={addItem.title}
                onChange={e => setAddItem(i => ({ ...i, title: e.target.value }))}
                required
              />
            </div>
            <div>
              <textarea
                className="w-full border p-2 rounded"
                placeholder="Description"
                value={addItem.description}
                onChange={e => setAddItem(i => ({ ...i, description: e.target.value }))}
              />
            </div>
            <div className="flex gap-2">
              <input
                className="w-1/2 border p-2 rounded"
                placeholder="Price"
                type="number"
                min="0"
                value={addItem.price}
                onChange={e => setAddItem(i => ({ ...i, price: e.target.value }))}
                required
              />
              <select
                className="w-1/2 border p-2 rounded"
                value={addItem.category}
                onChange={e => setAddItem(i => ({ ...i, category: e.target.value }))}
                required
              >
                <option value="">Category</option>
                <option value="deals">Deals</option>
                <option value="burger">Burger</option>
                <option value="pizza">Pizza</option>
                <option value="drinks">Drinks</option>
                <option value="desert">Dessert</option>
              </select>
            </div>
            <div>
              <input
                type="file"
                accept="image/*"
                className="w-full border p-2 rounded mb-2"
                ref={fileInputRef}
                onChange={e => {
                  setImageFile(e.target.files[0]);
                  if (e.target.files[0]) {
                    setImagePreview(URL.createObjectURL(e.target.files[0]));
                  } else {
                    setImagePreview(addItem.imageUrl);
                  }
                }}
              />
              <input
                type="text"
                className="w-full border p-2 rounded mb-2"
                placeholder="Or enter image URL"
                value={addItem.imageUrl}
                onChange={e => {
                  setAddItem(i => ({ ...i, imageUrl: e.target.value }));
                  if (!imageFile) setImagePreview(e.target.value);
                }}
              />
              {uploading && <div className="text-blue-500 text-sm">Uploading image...</div>}
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded border" onError={e => { e.target.onerror = null; e.target.src = '/vite.svg'; }} />
                  <div className="text-xs text-gray-500">Image Preview</div>
                </div>
              )}
            </div>
            {addError && <div className="text-red-500 text-sm">{addError}</div>}
            {addSuccess && <div className="text-green-600 text-sm">{addSuccess}</div>}
            <button type="submit" className="w-full bg-red-500 text-white py-2 rounded flex items-center justify-center"><RiAddLine className="mr-1" />Add Item</button>
          </form>
          <h2 className="text-xl font-bold mt-8 mb-4">Current Menu</h2>
          {menuLoading ? <div>Loading menu...</div> : (
            <div className="space-y-2">
              {menuItems.map(item => (
                <div key={item._id} className="flex justify-between items-center bg-white p-3 rounded shadow">
                  <div>
                    <span className="font-semibold">{item.title}</span> <span className="text-gray-500">(PKR{item.price})</span> <span className="text-xs text-gray-400">[{item.category}]</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(item)} className="text-blue-500 hover:text-blue-700 p-1" title="Edit"><RiEdit2Line /></button>
                    <button onClick={() => handleDelete(item._id)} className="text-red-500 hover:text-red-700 p-1" title="Delete" disabled={deleteLoading===item._id}><RiDeleteBin6Line /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Edit Menu Item Modal */}
          {editModal && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative animate-fadeIn">
                <button
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
                  onClick={() => setEditModal(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-red-500">Edit Menu Item</h2>
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Title"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                  />
                  <textarea
                    className="w-full border p-2 rounded"
                    placeholder="Description"
                    name="description"
                    value={editForm.description}
                    onChange={handleEditChange}
                  />
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Price"
                    type="number"
                    min="0"
                    name="price"
                    value={editForm.price}
                    onChange={handleEditChange}
                    required
                  />
                  <select
                    className="w-full border p-2 rounded"
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Category</option>
                    <option value="deals">Deals</option>
                    <option value="burger">Burger</option>
                    <option value="pizza">Pizza</option>
                    <option value="drinks">Drinks</option>
                    <option value="desert">Dessert</option>
                  </select>
                  <input
                    className="w-full border p-2 rounded"
                    placeholder="Image URL"
                    name="imageUrl"
                    value={editForm.imageUrl}
                    onChange={handleEditChange}
                  />
                  {editError && <div className="text-red-500 text-sm">{editError}</div>}
                  <button type="submit" className="w-full bg-red-500 text-white py-2 rounded">Save Changes</button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative animate-fadeIn">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowRejectModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-red-500">Reject Order</h2>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for rejection</label>
            <textarea
              className="w-full border p-3 rounded-lg focus:ring-2 focus:ring-red-500"
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="Enter reason..."
              rows={3}
              disabled={actionLoading}
            />
            {actionError && <div className="text-red-500 text-sm mt-2">{actionError}</div>}
            <div className="flex justify-end mt-4 gap-2">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
                onClick={() => setShowRejectModal(false)}
                disabled={actionLoading}
              >Cancel</button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={confirmReject}
                disabled={!rejectReason.trim() || actionLoading}
              >{actionLoading ? 'Processing...' : 'Reject'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;