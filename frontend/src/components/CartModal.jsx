import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiShoppingCart, HiTrash } from 'react-icons/hi';

export default function CartModal({ isOpen, onClose, cartItems, updateQuantity, removeItem }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5.00;
  const total = subtotal + deliveryFee;

  const modalVariants = {
    hidden: {
      x: '100%',
      transition: { type: 'tween', duration: 0.3 }
    },
    visible: {
      x: 0,
      transition: { type: 'tween', duration: 0.3 }
    }
  };

  const desktopModalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 }
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={isMobile ? modalVariants : desktopModalVariants}
            className={`
              fixed z-50 bg-white shadow-2xl
              ${isMobile 
                ? 'top-0 right-0 h-full w-full sm:w-96' 
                : 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg w-full max-w-2xl max-h-[90vh]'
              }
              flex flex-col
            `}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <HiShoppingCart className="w-6 h-6 text-gray-700" />
                <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
                <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-sm">
                  {cartItems.length}
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <HiX className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Cart Items - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <HiShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg">Your cart is empty</p>
                  <p className="text-gray-400 text-sm mt-2">Add some delicious sushi!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      {/* Item Image */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                        loading="lazy"
                      />

                      {/* Item Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">${item.price.toFixed(2)}</p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="font-medium w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            aria-label="Remove item"
                          >
                            <HiTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary - Sticky Footer */}
            {cartItems.length > 0 && (
              <div className="border-t bg-white p-4 space-y-3">
                {/* Summary Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span>
                      {deliveryFee === 0 ? (
                        <span className="text-green-600 font-medium">FREE</span>
                      ) : (
                        `$${deliveryFee.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  {deliveryFee > 0 && (
                    <p className="text-xs text-gray-500">
                      Free delivery on orders over $50
                    </p>
                  )}
                  <div className="border-t pt-2 flex justify-between text-lg font-bold text-gray-800">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Proceed to Checkout
                </button>

                {/* Continue Shopping Link */}
                <button
                  onClick={onClose}
                  className="w-full text-gray-600 py-2 text-sm hover:text-gray-800 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}