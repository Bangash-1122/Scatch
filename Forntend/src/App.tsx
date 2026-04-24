import Home from './pages/Home'
import Shop from './pages/Shop' 
import Admin from './pages/Admin'
import OwnerLogin from './pages/OwnerLogin'
import CreateProduct from './pages/CreateProduct'
import Cart from './pages/Cart'
import Layout from './components/Layout/Layout'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="owner-login" element={<OwnerLogin />} />
          <Route path="admin" element={<Admin />} />
          <Route path="admin/create-product" element={<CreateProduct />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
