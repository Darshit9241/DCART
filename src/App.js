// App.js
import React, { useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import Header from "./component/header/Header";
import Navbar from "./component/navbar/Navbar";
import Footer from "./component/footer/Footer";

import SignUp from "./component/signup/SignUp";
import Login from "./component/login/Login";
import Product from "./component/product/Product";
import CartBox from "./component/cartbox/CartBox";
import Cart from "./cart/Cart";
import Payment from "./component/paymentPage/Payment";
import OrderDetail from "./component/orderdetailpage/Order-Detail";
import NotFoundPage from "./component/404/NotFoundPage";
import WishList from "./wishlist/WishList";
import Compare from "./compare/Compare";
import Box from "./box/Box";

import "react-toastify/dist/ReactToastify.css";
import About from "./about/About";
import Contact from "./contact/Contact";
import ViewAllOrder from "./allorderpage/View-All-Order";
import AddProduct from "./component/addproduct/AddProduct";
import DynemicProductDetail from "./component/dynemicproductdetail/DynemicProductDetail";
import Home from "./component/home/Home";
import ProductDetail from "./component/productdetail/ProductDetail";
import CouponPage from "./component/couponpage/CouponPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from './component/admin/AdminLogin';
import AdminSignup from './component/admin/AdminSignup';
import AdminProtectedRoute from './component/AdminProtectedRoute';

function PrivateRoute() {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItems = useSelector((state) => state.cart.items);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseCart = () => setIsCartOpen(false);

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />
      <Header onCartClick={handleOpenCart} cartItemCount={cartItems.length} />
      <Navbar />

      <Routes>


        {/* Public Routes */}
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        {/* <Route path="/product/:id" element={<DynemicProductDetail onCartOpen={handleOpenCart} onCartClick={handleOpenCart} />} /> */}
        <Route path="/product/:productId" element={<ProductDetail onCartOpen={handleOpenCart} onCartClick={handleOpenCart} />} />
        <Route path="/product" element={<Product onCartOpen={handleOpenCart} onCartClick={handleOpenCart} />} />
        <Route path="/" element={<Home />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/WishList" element={<WishList onCartOpen={handleOpenCart} />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/view-all-order" element={<ViewAllOrder />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/cart/payment" element={<Payment />} />
          <Route path="/order-detail" element={<OrderDetail />} />
          <Route path="/Coupon" element={<CouponPage />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin-signup" element={<AdminSignup />} />
          <Route element={<AdminProtectedRoute />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>


      <CartBox
        isOpen={isCartOpen}
        closeSidebar={handleCloseCart}
        cartItems={cartItems}
      />

      <div className="hidden md:flex">
        <Box onCartOpen={handleOpenCart} />
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </>
  );
}
