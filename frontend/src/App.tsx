import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Search from "./pages/Search"
import Cart from "./pages/Cart"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/search" element={<Search />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
      </Routes>
    </Router>
  )
}

export default App