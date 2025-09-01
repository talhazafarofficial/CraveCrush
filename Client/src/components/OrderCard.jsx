const OrderCard = ({ order }) => {
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-semibold mb-2">Order #{order._id.slice(-5)}</h3>
      <ul className="text-sm text-gray-600">
        {order.items.map((i) => (
          <li key={i.item._id}>{i.item.title} × {i.quantity}</li>
        ))}
      </ul>
    </div>
  );
};

export default OrderCard;