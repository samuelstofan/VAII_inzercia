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
import Messages from "./pages/Messages";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faq from "./pages/Faq";
import AdminUsers from "./pages/AdminUsers";
import ReportListing from "./pages/ReportListing";

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
          <Route path="/spravy" element={<Messages />} />
          <Route path="/o-nas" element={<About />} />
          <Route path="/kontakt" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/nahlasenie-inzeratu" element={<ReportListing />} />
          <Route path="/admin/uzivatelia" element={<AdminUsers />} />
        </Routes>
      </main>

      <Footer />

    </div>
  );
}
