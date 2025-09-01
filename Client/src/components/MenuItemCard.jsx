const MenuItem = ({ item, addToCart }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <img src={item.imageUrl} className="h-40 w-full object-cover rounded mb-4" />
      <h3 className="text-lg font-bold">{item.title}</h3>
      <p className="text-sm text-gray-600">{item.description}</p>
      <p className="text-red-500 font-semibold mt-2">${item.price}</p>
      <button onClick={() => addToCart(item)} className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600">
        Add to Cart
      </button>
    </div>
  );
};

export default MenuItem;