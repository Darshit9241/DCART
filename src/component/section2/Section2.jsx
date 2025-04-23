import React from "react";

export default function Section2() {
  const items = ["Bedroom", "Living", "Dining", "Lounge", "Office Chair"];

  return (
    <div className="flex justify-center cursor-pointer bg-gradient-to-br from-white-50 to-white">
      <div className="flex flex-wrap justify-center gap-10 md:gap-16 py-16 md:py-28">
        {items.map((label, index) => (
          <div
            key={index}
            className="h-[150px] w-[150px] md:h-[200px] md:w-[200px] rounded-full flex items-center justify-center
              bg-white/30 backdrop-blur-lg border border-gray-200 shadow-md transition-all duration-300
              hover:scale-110 hover:border-black hover:shadow-2xl hover:bg-[#e7e7e7] group"
          >
            <div className="flex flex-col items-center">
              <img
                src={`../../images/section2/img${index + 1}.jpg`}
                alt={label}
                className="w-[50px] h-[50px] md:w-[60px] md:h-[60px] mb-2 md:mb-4 rounded-full border border-white shadow-sm group-hover:scale-110 transition-transform duration-300"
              />
              <h1 className="text-lg md:text-xl font-semibold text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
                {label}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
