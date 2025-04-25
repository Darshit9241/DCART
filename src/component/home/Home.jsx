import React, { useState, useEffect } from "react";
import Product from "../product/Product";
import Banner from "../banner/Banner";
import Section2 from "../section2/Section2";
import Cart from "../cartbox/CartBox"; // hypothetical cart component
import OfferModal from "../modal/OfferModal";

export default function Home() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    // Check if this is the first visit
    const hasVisited = localStorage.getItem("hasVisitedBefore");
    
    if (!hasVisited) {
      // First time visitor - show offer modal
      setShowOfferModal(true);
      // Set flag in localStorage to not show on future visits
      localStorage.setItem("hasVisitedBefore", "true");
    }
  }, []);

  const handleOpenCart = () => setIsCartOpen(true);
  const handleCloseOfferModal = () => setShowOfferModal(false);

  return (
    <>
      <Banner />
      <Section2 />
      <Product onCartOpen={handleOpenCart} />
      {isCartOpen && <Cart />} {/* using isCartOpen */}
      
      {/* Offer Modal for first-time visitors */}
      <OfferModal 
        showModal={showOfferModal} 
        onClose={handleCloseOfferModal} 
      />
    </>
  );
}
