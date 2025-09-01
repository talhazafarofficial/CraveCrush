const CartItem = ({ item, removeFromCart }) => {
  return (
    <div className="flex justify-between items-center border-b py-4">
      <div>
        <p className="font-medium">{item.title}</p>
        <p className="text-sm text-gray-600">{item.quantity} x ${item.price}</p>
      </div>
      <button onClick={() => removeFromCart(item.item)} className="text-red-500 hover:underline">Remove</button>
    </div>
  );
};

export default CartItem;