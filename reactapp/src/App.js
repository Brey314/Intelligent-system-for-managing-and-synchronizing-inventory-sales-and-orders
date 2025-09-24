import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Search from "./pages/Search";
import ShoppingCart from "./pages/shoppingCart";


function App() {
  return (

    <Router>

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/search" element={<Search />} />
      <Route path="/shoppingCart" element={<ShoppingCart />} />


    </Routes>
    </Router>


  );
}

export default App;
