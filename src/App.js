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
import Cart from "./component/cart/Cart";
import OrderInfo from "./orderinfo/OrderInfo";
import PaymentPage from "./component/paymentPage/PaymentPage";
import OrderDetail from "./component/orderdetailpage/OrederDetail";
import NotFoundPage from "./component/404/NotFoundPage";
import WishList from "./wishlist/WishList";
import Compare from "./compare/Compare";
import Box from "./box/Box";

import "react-toastify/dist/ReactToastify.css";
import About from "./about/About";
import Contact from "./contact/Contact";
import AllOrdersPage from "./allorderpage/AllOrdersPage";
import AddProduct from "./component/addproduct/AddProduct";
import DynemicProductDetail from "./component/dynemicproductdetail/DynemicProductDetail";
import Home from "./component/home/Home";
import ProductDetail from "./component/productdetail/ProductDetail";
import CouponPage from "./component/couponpage/CouponPage";

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
        <Route path="/product/:id" element={<DynemicProductDetail onCartOpen={handleOpenCart} onCartClick={handleOpenCart} />} />
        <Route path="/product/:productId" element={<ProductDetail onCartOpen={handleOpenCart} onCartClick={handleOpenCart} />} />
        <Route path="/product" element={<Product onCartOpen={handleOpenCart} onCartClick={handleOpenCart} />} />
        <Route path="/" element={<Home />} />

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/AddProduct" element={<AddProduct />} />
          <Route path="/WishList" element={<WishList onCartOpen={handleOpenCart} />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/allorderspage" element={<AllOrdersPage />} />
          <Route path="/orderinfo" element={<OrderInfo />} />
          <Route path="/orderinfo/payment" element={<PaymentPage />} />
          <Route path="/orderinfo/payment/order-detail" element={<OrderDetail />} />
          <Route path="/Coupon" element={<CouponPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>


      <Cart
        isOpen={isCartOpen}
        closeSidebar={handleCloseCart}
        cartItems={cartItems}
      />

      <Box onCartOpen={handleOpenCart} />
      <div className="mt-20">
        <Footer />
      </div>
    </>
  );
}
