import { Outlet } from "react-router-dom"
import { useEffect } from "react"
import { useAppStore } from "@/store/useAppStore"
import Navbar from "./Navbar"

export default function Layout() {
  const initTheme = useAppStore((state) => state.initTheme)

  useEffect(() => {
    initTheme()
  }, [initTheme])

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
    </div>
  )
}
