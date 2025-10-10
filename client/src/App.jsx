import { Route, Routes } from "react-router-dom"
import Footer from "./components/navigation/Footer"
import Header from "./components/navigation/Header"
import HomePage from "./pages/HomePage"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Checkout from "./pages/Checkout"
import Cart from "./pages/Cart"


function App() {
  return (
    <>

     <Header />

     <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/login' element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/cart" element={<Cart />} />
     </Routes>

     <Footer />
    </>
  )
}

export default App
