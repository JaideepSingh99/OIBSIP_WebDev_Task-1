import { Trash2 } from "lucide-react";

const CartItem = ({ item, index, removeFromCart }) => {
  const pizza = item?.pizza;

  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b">
      <div className="flex-1">
        <h4 className="font-semibold text-lg">{pizza?.name || "Custom Pizza"}</h4>
        <p className="text-sm text-neutral-content">
          Size: <span className="font-medium">{item.size}</span> &nbsp;|&nbsp;
          Qty: <span className="font-medium">{item.quantity}</span>
        </p>
        {item.price && (
          <p className="text-sm mt-1 text-success font-semibold">
            ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
          </p>
        )}
      </div>

      <button
        className="btn btn-sm btn-outline btn-error tooltip"
        data-tip="Remove"
        onClick={() => removeFromCart(index)}
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default CartItem;