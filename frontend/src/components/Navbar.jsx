import { Link, useLocation } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import { Moon, Sun, Menu } from "lucide-react"
import { Button } from "./ui/button"

export default function Navbar() {
  const { theme, toggleTheme } = useAppStore()
  const location = useLocation()

  const links = [
    { name: "Home", path: "/" },
    { name: "Analyse", path: "/analyse" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "How It Works", path: "/how-it-works" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          {/* Custom SVG branding */}
          <div className="flex items-center justify-center bg-primary rounded-full w-8 h-8">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white"><circle cx="12" cy="12" r="10"/><path d="M12 2v20"/><path d="M12 12 4.5 7.5"/><path d="M12 12l7.5-4.5"/></svg>
          </div>
          <span className="font-bold text-xl text-primary tracking-tight">PomeGuard</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors py-5 hover:text-primary ${
                location.pathname === link.path ? "text-primary border-b-2 border-primary" : "text-muted-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          <Link to="/analyse" className="hidden md:block">
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">Start Analysis</Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
