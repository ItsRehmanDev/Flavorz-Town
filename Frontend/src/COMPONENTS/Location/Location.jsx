import React, { useEffect, useState } from "react";

const Location = () => {
  const [city, setCity] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await res.json();
            setCity(data.city || "Unknown");
          } catch {
            setCity("Unknown");
          }
        },
        () => setCity("Unknown"),
        { timeout: 8000 }
      );
    } else {
      setCity("Unknown");
    }
  }, []);

  return (
    <section className="max-w-[1100px] mx-auto my-20 px-6">
      <div className="bg-white/80 backdrop-blur-lg border border-gray-100 rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&q=80"
          alt="map"
          className="w-full h-[300px] md:h-full object-cover"
        />

       
        <div className="p-8 bg-gray-900 text-white flex flex-col justify-center">
          <h1 className="text-3xl font-extrabold mb-4">Food Delivery 🚚</h1>
          <p className="text-gray-300 leading-relaxed mb-6 text-sm">
            Looking for takeout nearby? Select <b>home delivery</b> at checkout
            and enjoy our fast, reliable service.
          </p>

          <h2 className="text-xl font-semibold mb-3">Zones & Pricing</h2>
          <ul className="space-y-2 text-sm">
            <li className="text-gray-200">📍 Zone 1 — Min €10.00</li>
            <li className="text-gray-200">📞 Phones: 661-474-446</li>
          </ul>

          <div className="mt-8">
            <span className="text-gray-400">Detected city:</span>{" "}
            <span className="font-bold text-lg text-white">
              {city || "Unknown"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
