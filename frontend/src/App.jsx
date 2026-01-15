import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import AddListing from "./pages/AddListing";
import Sellers from "./pages/Sellers";
import SellerListings from "./pages/SellerListings";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyAccount from "./pages/MyAccount";
import VehicleDetail from "./pages/VehicleDetail";
import Favorites from "./pages/Favorites";

export default function App() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">

      <Header />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pridat-inzerat" element={<AddListing />} />
          <Route path="/upravit-inzerat/:id" element={<AddListing />} />
          <Route path="/predajcovia" element={<Sellers />} />
          <Route path="/predajcovia/:id" element={<SellerListings />} />
          <Route path="/registracia" element={<Register />} />
          <Route path="/prihlasenie" element={<Login />} />
          <Route path="/moj-ucet" element={<MyAccount />} />
          <Route path="/oblubene" element={<Favorites />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
        </Routes>
      </main>

      <Footer />

    </div>
  );
}
