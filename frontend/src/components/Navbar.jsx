import { Link, useLocation, useNavigate } from "react-router-dom"
import { useEffect, useState, useRef } from "react"
import { useAppStore } from "@/store/useAppStore"
import { Moon, Sun, Menu, Bell, CheckCircle2, LogOut, User, History, ChevronDown } from "lucide-react"
import { Button } from "./ui/button"
import { getNotifications, markNotificationAsRead } from "@/services/api"
import { supabase } from "@/lib/supabaseClient"
import { toast } from "sonner"

export default function Navbar() {
  const { theme, toggleTheme, notifications, setNotifications, markNotificationRead, user, profile } = useAppStore()
  const location = useLocation()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const lastUnreadCount = useRef(0)
  const notifRef = useRef(null)
  const userMenuRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false)
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  useEffect(() => {
    if (!user) return
    const fetchNotifs = async () => {
      try {
        const data = await getNotifications()
        setNotifications(data)
        const unreads = data.filter(n => !n.read)
        if (unreads.length > lastUnreadCount.current) {
          const newest = unreads[0]
          if (newest) {
            toast(newest.type === 'disease_alert' ? "Disease Alert" : "Environmental Alert", {
              description: newest.message,
              icon: <Bell className="h-4 w-4" />,
            })
          }
        }
        lastUnreadCount.current = unreads.length
      } catch (error) {
        console.error("Failed to fetch notifications", error)
      }
    }
    fetchNotifs()
    const interval = setInterval(fetchNotifs, 5000)
    return () => clearInterval(interval)
  }, [user, setNotifications])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id)
      markNotificationRead(id)
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out")
    navigate("/")
  }

  const publicLinks = [
    { name: "Home", path: "/" },
    { name: "How It Works", path: "/how-it-works" },
  ]

  const authLinks = [
    { name: "Analyse", path: "/analyse" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "History", path: "/history" },
  ]

  const links = user ? [...publicLinks, ...authLinks] : publicLinks

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 text-foreground">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
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

        <div className="flex items-center space-x-2">
          {/* Notification Bell — only for logged-in users */}
          {user && (
            <div className="relative" ref={notifRef}>
              <Button variant="ghost" size="icon" onClick={() => setShowNotifications(!showNotifications)}>
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-destructive border border-background"></span>
                )}
              </Button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-background border rounded-md shadow-lg overflow-hidden z-50">
                  <div className="p-3 border-b bg-muted/50 flex justify-between items-center">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                    <span className="text-xs text-muted-foreground">{unreadCount} unread</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-muted-foreground">No notifications yet</div>
                    ) : (
                      notifications.map(notification => (
                        <div key={notification.id} className={`p-4 border-b text-sm transition-colors ${notification.read ? "bg-background opacity-70" : "bg-muted/20"}`}>
                          <div className="flex justify-between items-start gap-2">
                            <div className="space-y-1">
                              <p className="font-medium leading-none">{notification.type === 'disease_alert' ? "Disease Alert" : "Weather Alert"}</p>
                              <p className="text-xs text-muted-foreground">{notification.message}</p>
                              <p className="text-[10px] text-muted-foreground">{new Date(notification.timestamp).toLocaleString()}</p>
                            </div>
                            {!notification.read && (
                              <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => handleMarkAsRead(notification.id)}>
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Auth section */}
          {user ? (
            <div className="relative" ref={userMenuRef}>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-full pl-2 pr-3"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium max-w-[100px] truncate hidden sm:block">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </Button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-background border rounded-md shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b bg-muted/30">
                    <p className="text-sm font-medium leading-none">{profile?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{user.email}</p>
                  </div>
                  <div className="py-1">
                    <Link to="/history" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors">
                      <History className="h-4 w-4" /> Scan History
                    </Link>
                    <Link to="/dashboard" onClick={() => setShowUserMenu(false)} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors">
                      <User className="h-4 w-4" /> Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="rounded-full">Sign Up</Button>
              </Link>
            </div>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
