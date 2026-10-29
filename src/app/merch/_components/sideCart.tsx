import IconButton from "@/components/buttons/icon-button";
import NextImage from "@/components/next-image";
import Typography from "@/components/typography";
import { useCartStore } from "@/hooks/use-cart";
import api from "@/lib/api";
import { cartType } from "@/types/entity/cart";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface SideCartProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideCart: React.FC<SideCartProps> = ({ isOpen, onClose }) => {
  const {
    cartItems,
    updateCartItemAmount,
    removeCartItem,
    initializeCart,
    setCartItems,
  } = useCartStore();

  const handleIncrement = (updateItem: cartType) => {
    const item = cartItems.find(
      (item) =>
        item.id === updateItem.id &&
        item.variant.id === updateItem.variant.id &&
        item.size.id === updateItem.size.id,
    );
    if (item) {
      updateCartItemAmount(updateItem, 1);
    }
  };

  const handleDecrement = (updateItem: cartType) => {
    const item = cartItems.find(
      (item) =>
        item.id === updateItem.id &&
        item.variant.id === updateItem.variant.id &&
        item.size.id === updateItem.size.id,
    );

    if (item) {
      updateCartItemAmount(item, -1);
      if (item.amount <= 1) {
        removeCartItem(item);
      }
    }
  };

  const handleDelete = (removeItem: cartType) => {
    removeCartItem(removeItem);
  };

  const calculateTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        return total + parseFloat(item.price) * item.amount;
      }, 0)
      .toLocaleString("id-ID");
  };

  useEffect(() => {
    initializeCart();
  }, [initializeCart]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  // Validate cart items when opening
  useEffect(() => {
    if (isOpen && cartItems.length > 0) {
      const checkItem = async (item: cartType) => {
        try {
          const res = await api.get(`/api/v1/product/${item.id}`);
          const p = res.data.data;
          // If product exists and has stock, return true (keep)
          return p && p.stock > 0;
        } catch (_e) {
          return false;
        }
      };

      const runValidation = async () => {
        const results = await Promise.all(
          cartItems.map((item) => checkItem(item)),
        );
        const newCartItems = cartItems.filter((_, index) => results[index]);

        if (newCartItems.length !== cartItems.length) {
          setCartItems(newCartItems);
        }
      };

      runValidation();
    }
  }, [isOpen]); // Depend on isOpen to trigger check on open

  return (
    <div
      className={`fixed inset-0 z-[99999] transition-opacity duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0"}`}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[400px] bg-[#1A2E35] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div className="w-full text-center">
            <Typography
              variant="h3"
              className="font-semibold text-white tracking-wide"
            >
              My Carts
            </Typography>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-400 absolute right-6"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in duration-500">
              <div className="bg-white/5 p-6 rounded-full">
                <ShoppingCart size={48} className="text-gray-500 opacity-100" />
              </div>
              <div className="space-y-2">
                <Typography variant="h3" className="text-white font-semibold">
                  Your Cart is Empty
                </Typography>
                <Typography
                  variant="p"
                  className="text-gray-400 text-sm max-w-[200px] mx-auto"
                >
                  Let's find your favorite merch and add them to your cart!
                </Typography>
              </div>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2 bg-[#8EAC50] text-white font-bold rounded-lg hover:bg-[#7D9945] transition-colors"
              >
                Shop Now
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={`${item.id}-${item.variant.id}-${item.size.id}`}
                className="flex items-start space-x-4"
              >
                <div className="relative w-28 h-36 bg-white rounded-tr-2xl rounded-bl-2xl overflow-hidden flex-shrink-0">
                  <NextImage
                    src={
                      item.image && item.image.trim() !== ""
                        ? item.image
                        : "/images/logo-new.png"
                    }
                    className="w-full h-full object-cover"
                    width={112}
                    height={144}
                    alt={item.name}
                    serverStaticImg
                    unoptimized={true}
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <Typography
                    variant="bt"
                    className="text-lg font-bold text-white block mb-2"
                  >
                    {item.name}
                  </Typography>

                  <div className="grid grid-cols-2 gap-x-2 pb-3">
                    {item.variant.value !== "Default" && (
                      <div>
                        <Typography
                          variant="p"
                          className="text-sm text-gray-400 font-medium"
                        >
                          Variant
                        </Typography>
                        <Typography
                          variant="p"
                          className="text-sm font-medium text-white"
                        >
                          {item.variant.value}
                        </Typography>
                      </div>
                    )}
                    <div>
                      <Typography
                        variant="p"
                        className="text-sm text-gray-400 font-medium"
                      >
                        Size
                      </Typography>
                      <Typography
                        variant="p"
                        className="text-sm font-medium text-white"
                      >
                        {item.size.value}
                      </Typography>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="bg-[#101F24] px-3 py-1.5 rounded-md border border-gray-800">
                      <Typography
                        variant="p"
                        className="text-xs font-bold text-[#A3E635]"
                      >
                        IDR {parseFloat(item.price).toLocaleString("id-ID")}
                      </Typography>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleDelete(item)}
                        className="text-danger-500"
                      >
                        <Trash2 size={20} />
                      </button>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        icon={Minus}
                        onClick={() => handleDecrement(item)}
                        className="h-8 w-8 border-[1px] border-success-500 text-success-500 hover:bg-success-600 hover:text-white"
                      />
                      <Typography
                        variant="p"
                        className="text-white font-semibold"
                      >
                        {item.amount}
                      </Typography>
                      <IconButton
                        size="xs"
                        variant="ghost"
                        icon={Plus}
                        onClick={() => handleIncrement(item)}
                        className="h-8 w-8 border-[1px] border-success-500 text-success-500 hover:bg-success-600 hover:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 bg-[#1A2E35] border-t border-gray-700 space-y-4">
            <div className="flex justify-between items-center">
              <Typography variant="h3" className="text-white font-bold">
                Total
              </Typography>
              <Typography variant="h3" className="text-white font-bold text-xl">
                IDR {calculateTotalPrice()}
              </Typography>
            </div>

            <Link href="/merch/checkout" className="block w-full">
              <button className="w-full bg-[#8EAC50] hover:bg-[#7D9945] text-[#1A2E35] font-bold py-4 rounded-xl flex items-center justify-center space-x-2 transition-colors active:scale-95">
                <ShoppingCart size={24} className="text-white" />
                <span className="text-white text-lg font-bold">Checkout</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SideCart;
