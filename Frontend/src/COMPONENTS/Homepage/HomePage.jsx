import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../Nav/Nav";
import Banner from "../Banner/Banner";
import About from "../About/About";
import Menu from "../Menu/Menu";
import Time from "../Time/Time";
import Location from "../Location/Location";
import Footer from "../Footer/Footer";

function HomePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (!email) navigate("/login");
  }, [navigate]);

  return (
    <div className="bg-white min-h-screen">
      <Nav />
      <main className="pt-20">
        <Banner />
        <About />
        <Menu />
        <Time />
        <Location />
        <Footer />
      </main>
    </div>
  );
}

export default HomePage;
