import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Analyse from "./pages/Analyse"
import Dashboard from "./pages/Dashboard"
import HowItWorks from "./pages/HowItWorks"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import History from "./pages/History"
import ScanDetail from "./pages/ScanDetail"
import { useAppStore } from "@/store/useAppStore"
import { Toaster } from "sonner"

const ProtectedRoute = ({ children }) => {
  const { session } = useAppStore()
  const location = useLocation()
  if (!session) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />
  }
  return children
}

const PublicRoute = ({ children }) => {
  const { session } = useAppStore()
  if (session) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}

function App() {
  const { initializeAuth } = useAppStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="how-it-works" element={<HowItWorks />} />
          <Route path="analyse" element={<ProtectedRoute><Analyse /></ProtectedRoute>} />
          <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="scan/:id" element={<ProtectedRoute><ScanDetail /></ProtectedRoute>} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" richColors />
    </>
  )
}

export default App
