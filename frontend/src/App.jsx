import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Analyse from "./pages/Analyse"
import Dashboard from "./pages/Dashboard"
import HowItWorks from "./pages/HowItWorks"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="analyse" element={<Analyse />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="how-it-works" element={<HowItWorks />} />
      </Route>
    </Routes>
  )
}

export default App
