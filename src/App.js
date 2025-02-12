//App.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.js";
import About from "./pages/About.js";
import NotFound from "./pages/NotFound.js";
import Navbar from "./components/Navbar.js";

function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
