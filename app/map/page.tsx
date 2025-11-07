"use client";
import React from "react";
import NavBar from "../components/NavBar";

const MapPage: React.FC = () => {
  return (
    <section
      id="map"
      className="w-screen min-h-screen flex items-center justify-center"
    >
        <NavBar />
      <img
        src="/map.svg"
        alt="Event Map"
        className="object-contain w-full h-auto scale-150 sm:scale-100 md:scale-75 transition-transform duration-300"
      />
    </section>
  );
};

export default MapPage;