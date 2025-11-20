import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import { CartProvider } from "./hooks/useCart";
import "./App.css";

// Code splitting with React lazy loading
const MenuPage = lazy(() => import("./components/MenuPage"));
const AboutPage = lazy(() => import("./components/AboutPage"));
const FAQPage = lazy(() => import("./components/FAQPage"));
const OrderList = lazy(() => import("./components/OrderList"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<MenuPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/admin" element={<OrderList />} />
              </Routes>
            </Suspense>
          </main>
          <Cart />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
