import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import Cart from "../Cart/Cart";
import Popup from "../PopUp/Popup";
import Categories from "../Categories/Categories";
import DishCard from "../Dishcard/DishCard";

const Menu = ({ userEmail, userName }) => {
  const [dishes, setDishes] = useState([]);
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("Pizza");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [popupName, setPopupName] = useState(userName || "");
  const [popupEmail, setPopupEmail] = useState(userEmail || "");
  const [popupAddress, setPopupAddress] = useState("");


  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&localityLanguage=en`
          );
          const data = await res.json();
          setCity(data.city || "Unknown");
        } catch {
          setCity("Unknown");
        }
      });
    } else setCity("Unknown");
  }, []);


  useEffect(() => {
    if (!category) return;
    fetch(`http://localhost:4500/dishes/${city || "Unknown"}/${category}`)
      .then((res) => res.json())
      .then((data) => setDishes(data))
      .catch(() => setDishes([]));
  }, [city, category]);

  const categories = ["Pizza", "Burger", "Pasta", "Sushi", "Sandwich"];


  const addToCart = (dish) => {
    const exist = cart.find((item) => item.name === dish.name);
    if (exist) {
      setCart(
        cart.map((item) =>
          item.name === dish.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...dish, quantity: 1 }]);
    }
  };

  
  const handleBuyNow = () => setShowPopup(true);

  
  const handleConfirm = async () => {
    if (!popupName || !popupEmail || !popupAddress) {
      alert("Please fill all fields!");
      return;
    }
    if (!cart.length) {
      alert("Cart is empty!");
      return;
    }

    try {
      const payload = {
        userEmail: popupEmail.toLowerCase(),
        userName: popupName,
        address: popupAddress,
        cart,
      };

      const res = await fetch("http://localhost:4500/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem("userEmail", popupEmail.toLowerCase());
        localStorage.setItem("userName", popupName);

        alert("✅ Order placed successfully!");
        setShowPopup(false);
        setPopupAddress("");
        setCart([]);
      } else {
        alert("❌ " + (data.message || "Error placing order"));
      }
    } catch (err) {
      console.error("Order error:", err);
      alert("❌ Error placing order");
    }
  };

  return (
    <section className="max-w-[1200px] mx-auto my-10 px-5 relative">
    
      <div
        className="fixed top-5 right-5 cursor-pointer z-50"
        onClick={() => setShowCart(!showCart)}
      >
        <FaShoppingCart className="text-3xl text-gray-800" />
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cart.length}
          </span>
        )}
      </div>

    
      {showCart && <Cart cart={cart} onBuyNow={handleBuyNow} />}


      {showPopup && (
        <Popup
          popupName={popupName}
          popupEmail={popupEmail}
          popupAddress={popupAddress}
          setPopupName={setPopupName}
          setPopupEmail={setPopupEmail}
          setPopupAddress={setPopupAddress}
          handleConfirm={handleConfirm}
          onCancel={() => setShowPopup(false)}
        />
      )}


      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Our Menu {city && `- ${city}`}</h1>
        <p className="mt-2 text-gray-600">
          Fresh, delicious and made just for you 🍴
        </p>
      </div>

  
      <Categories
        categories={categories}
        selectedCategory={category}
        onSelect={setCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dishes.length > 0 ? (
          dishes.map((food, i) => (
            <DishCard key={i} food={food} onAddToCart={addToCart} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No dishes found.
          </p>
        )}
      </div>
    </section>
  );
};

export default Menu;
