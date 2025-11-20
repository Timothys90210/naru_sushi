import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function MobileMenu({ menuItems }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'tween',
        duration: 0.3
      }
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.3
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.3
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <>
      {/* Hamburger Button - Only visible on mobile */}
      <button
        onClick={toggleMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <HiX className="w-6 h-6 text-gray-800" />
        ) : (
          <HiMenu className="w-6 h-6 text-gray-800" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Overlay */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={overlayVariants}
              onClick={toggleMenu}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            />

            {/* Slide-in Menu */}
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed top-0 left-0 h-full w-64 bg-white shadow-2xl z-40 lg:hidden overflow-y-auto"
            >
              <div className="p-6 pt-16">
                {/* Logo/Brand */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Naru Sushi</h2>
                  <p className="text-sm text-gray-600">Fresh & Delicious</p>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-4">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.href}
                      onClick={toggleMenu}
                      className="block py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-lg font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}