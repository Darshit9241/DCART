import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";
import products from "../ProductData";
import { addItem } from "../../redux/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaCodeCompare } from "react-icons/fa6";
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { addToCompare, removeFromCompare } from "../../redux/compareSlice";
import { toast } from "react-toastify";

const fetchProductById = (id) => {
  return products.find((product) => product.id === parseInt(id));
};

const Carousel = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden relative">
        <img
          src={images[currentIndex]}
          alt="Carousel"
          className="w-full h-[500px] object-cover transition-opacity duration-300"
        />
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-3 py-2 text-xl"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white px-3 py-2 text-xl"
        >
          ›
        </button>
      </div>
      <div className="flex justify-center mt-2 gap-2">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="Thumbnail"
            onClick={() => setCurrentIndex(index)}
            className={`w-14 h-14 object-cover border-2 rounded cursor-pointer ${currentIndex === index ? "border-[#FF7004]" : "border-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default function ProductDetail({ onCartOpen, onCartClick }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("Select Color");
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
  const compareList = useSelector((state) => state.compare);

  useEffect(() => {
    const fetchedProduct = fetchProductById(productId);
    setProduct(fetchedProduct);
  }, [productId]);

  if (!product) return <p>Loading...</p>;

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(quantity - 1);
  const handleColorChange = (color) => setSelectedColor(color);

  const carouselImages = [
    "../../images/product/img1.jpg",
    "../../images/product/img2.jpg",
    "../../images/product/img3.jpg",
    "../../images/product/img4.jpg",
    "../../images/product/img5.jpg",
  ];

  const handleAddToCart = (product) => {
    dispatch(addItem({ ...product, quantity }));
    onCartClick();
    onCartOpen();
  };

  const isWished = wishlist.some((item) => item.id === product.id);

  const toggleFavorite = (product) => {
    if (isWished) {
      dispatch(removeFromWishlist(product));
      toast.info(`Removed from wishlist`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`Added to wishlist`);
    }
  };

  const toggleCompare = (product) => {
    const isCompared = compareList.some((item) => item.id === product.id);
    if (isCompared) {
      dispatch(removeFromCompare(product));
      toast.info(`${product.name} removed from comparison`);
    } else {
      if (compareList.length >= 4) {
        toast.warning("You can only compare up to 4 products");
        return;
      }
      dispatch(addToCompare(product));
      toast.success(`${product.name} added to comparison`);
    }
  };

  const colors = ["Red", "Blue", "Green", "Black"];

  return (
    <>
      <div className="flex flex-col justify-center items-center py-20 bg-[#F4F5F8]">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <h1 className="text-xl pt-2 text-gray-500">
          Home / product / {product.name}
        </h1>
      </div>

      <div className="py-10 px-4 sm:px-8 md:px-16 lg:px-40">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Image Section */}
          <div className="w-full md:w-1/2">
            <Carousel images={carouselImages} />
          </div>

          {/* Details Section */}
          <div className="w-full md:w-1/2 relative">
            <div className="flex items-center gap-2 pb-3">
              {product.isNew && (
                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">
                  New Arrival
                </span>
              )}
              {product.isBestSeller && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full">
                  Best Seller
                </span>
              )}
            </div>

            <h1 className="font-bold text-sm md:text-base">
              SKT: <span>{product.id}</span>
            </h1>
            <h1 className="font-bold pt-2 text-sm md:text-base">
              Availability: <span>1 in Stock</span>
            </h1>
            <h1 className="font-bold pt-2 text-sm md:text-base">
              Discount: <span>{product.discount}</span>
            </h1>
            <p className="font-bold text-xl sm:text-2xl pt-4">{product.name}</p>

            <div className="flex gap-5 font-semibold pt-4 text-[20px]">
              <h2>Old Price: <span className="line-through">${product.oldPrice}</span></h2>
              <h2>Price: <span className="text-green-600">${product.price}</span></h2>
            </div>

            <p className="pt-4 text-sm text-gray-500">
              A long established fact that a reader will be distracted by the readable content...
            </p>

            {/* Color Swatches */}
            <div className="pt-4">
              <p className="font-semibold text-base pb-2">Color:</p>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <div
                    key={color}
                    className={`w-8 h-8 rounded-full border-2 cursor-pointer flex items-center justify-center ${selectedColor === color ? "border-[#FF7004]" : "border-gray-300"
                      }`}
                    style={{ backgroundColor: color.toLowerCase() }}
                    onClick={() => handleColorChange(color)}
                  />
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-wrap gap-4 pt-6 items-center">
              <div className="bg-gray-600 text-white flex items-center text-xl rounded-md">
                <button onClick={decrementQuantity} className="px-3 py-2 border-r border-white">-</button>
                <div className="px-3 py-2">{quantity}</div>
                <button onClick={incrementQuantity} className="px-3 py-2 border-l border-white">+</button>
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="bg-gray-800 text-white py-2 px-6 rounded-md text-sm font-bold hover:bg-gray-900 transition-all"
              >
                Add To Cart
              </button>
            </div>

            {/* Wishlist & Compare */}
            <div className="flex gap-5 pt-5">
              <div
                className={`cursor-pointer transition-all duration-300 ${isWished ? "text-red-500" : "text-gray-500"
                  }`}
                onClick={() => toggleFavorite(product)}
              >
                {isWished ? <FaHeart className="text-2xl" /> : <FaRegHeart className="text-2xl" />}
              </div>
              <div
                className={`cursor-pointer transition-all duration-300 ${compareList.some((item) => item.id === product.id)
                  ? "text-blue-500"
                  : "text-gray-500"
                  }`}
                onClick={() => toggleCompare(product)}
              >
                <FaCodeCompare className="text-xl size-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-md flex justify-center py-3">
        <button
          onClick={() => handleAddToCart(product)}
          className="bg-[#FF7004] hover:bg-orange-600 text-white font-bold py-2 px-8 rounded-full"
        >
          Add to Cart - ${product.price}
        </button>
      </div>
    </>
  );
}
