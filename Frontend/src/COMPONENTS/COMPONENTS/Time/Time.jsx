import React from "react";

const Time = () => {
  const timings = [
    { day: "Sunday - Monday", hours: "12:00 AM - 12:00 PM" },
    { day: "Tuesday - Wednesday", hours: "11:00 AM - 10:00 PM" },
    { day: "Thursday - Friday", hours: "1:00 AM - 12:00 PM" },
    { day: "Saturday", hours: "2:00 AM - 3:00 PM" },
  ];

  return (
    <section className="max-w-[900px] mx-auto my-20 px-6">
   
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-gray-900 drop-shadow-sm">
          Opening Hours ⏰
        </h2>
        <p className="mt-3 text-gray-500">
          We’re here to serve you all week long!
        </p>
      </div>

      
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border border-gray-100">
        {timings.map((slot, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl hover:bg-gray-50 transition-all"
          >
            <h3 className="text-lg font-semibold text-gray-800">
              {slot.day}
            </h3>
            <p className="text-gray-600 mt-1">{slot.hours}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Time;
