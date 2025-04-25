import React, { useState } from "react";
import Product from "../product/Product";
import Banner from "../banner/Banner";
import Section2 from "../section2/Section2";
import Cart from "../cartbox/CartBox"; // hypothetical cart component

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleOpenCart = () => setIsCartOpen(true);

  return (
    <>
      <Banner />
      <Section2 />
      <Product onCartOpen={handleOpenCart} />
      {isCartOpen && <Cart />} {/* using isCartOpen */}
    </>
  );
}
