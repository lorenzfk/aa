"use client"

import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Globe, LogOut, Menu, Trophy, User } from "lucide-react"
import Link from "next/link"
import { LoginModal } from "@/components/auth/login-modal"
import { SignupModal } from "@/components/auth/signup-modal"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { 
    isLoggedIn, 
    user, 
    logout, 
    toggleWorldMap,
    worldMapOpen,
    setShowLoginModal, 
    setShowSignupModal,
    blenderInterfaceVisible,
    setCurrentSkill,
    toggleBlenderInterface
  } = useAppStore()
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogoClick = () => {
    if (blenderInterfaceVisible) {
      toggleBlenderInterface()
    }
    setCurrentSkill(null)
    router.push('/')
  }

  const handleWorldMapClick = () => {
    if (blenderInterfaceVisible) {
      toggleBlenderInterface()
    }
    setCurrentSkill(null)
    toggleWorldMap()
    setMobileMenuOpen(false)
  }

  return (
    <>
      <div className="h-16" /> {/* Spacer to prevent content from hiding behind fixed header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-[1400px] px-6 flex h-16 items-center gap-12">
          <button 
            onClick={handleLogoClick}
            className="flex items-center space-x-2 shrink-0 hover:opacity-90 transition-opacity"
          >
            <span className="text-2xl font-bold bg-gradient-to-r from-duolingo-green to-duolingo-blue bg-clip-text text-transparent">
              BlenderDuo
            </span>
          </button>
          
          <div className="flex-1">
            {isLoggedIn && (
              <nav className="hidden md:flex gap-10">
                <Link 
                  href="/learn"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Learn
                </Link>
                <button 
                  onClick={handleWorldMapClick}
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                >
                  <Globe className="h-4 w-4" />
                  World Map
                </button>
                <Link 
                  href="/achievements"
                  className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-2"
                >
                  <Trophy className="h-4 w-4" />
                  Achievements
                </Link>
              </nav>
            )}
          </div>
          
          <div className="flex items-center gap-6">
            {!isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => setShowLoginModal(true)}
                  className="hidden sm:flex"
                >
                  Log In
                </Button>
                <Button 
                  className="bg-duolingo-green hover:bg-duolingo-green/90 text-white"
                  onClick={() => setShowSignupModal(true)}
                >
                  Sign Up
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-4">
                  <div className="font-medium">{user?.username}</div>
                  <div className="flex items-center gap-2 bg-duolingo-green/20 dark:bg-duolingo-green/20 px-4 py-1.5 rounded-full">
                    <Trophy className="h-4 w-4 text-duolingo-green dark:text-duolingo-green" />
                    <span className="text-duolingo-green dark:text-duolingo-green text-sm font-medium">
                      {user?.progress.skillPoints || 0} XP
                    </span>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full overflow-hidden">
                      <Avatar>
                        <AvatarImage src={user?.avatar} alt={user?.username} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
            
            <ModeToggle />
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 mt-6">
                  {isLoggedIn ? (
                    <>
                      <div className="flex items-center gap-4 pb-4 border-b">
                        <Avatar>
                          <AvatarImage src={user?.avatar} alt={user?.username} />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user?.username}</div>
                          <div className="flex items-center gap-1 text-sm text-duolingo-green">
                            <Trophy className="h-3 w-3" />
                            <span>{user?.progress.skillPoints || 0} XP</span>
                          </div>
                        </div>
                      </div>
                      <nav className="flex flex-col gap-4">
                        <Link 
                          href="/learn"
                          className="flex items-center gap-2 text-sm font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Learn
                        </Link>
                        <button 
                          onClick={handleWorldMapClick}
                          className="flex items-center gap-2 text-sm font-medium text-left"
                        >
                          <Globe className="h-4 w-4" />
                          World Map
                        </button>
                        <Link 
                          href="/achievements"
                          className="flex items-center gap-2 text-sm font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Trophy className="h-4 w-4" />
                          Achievements
                        </Link>
                        <Link 
                          href="/profile"
                          className="flex items-center gap-2 text-sm font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <User className="h-4 w-4" />
                          Profile
                        </Link>
                        <button 
                          onClick={() => {
                            logout()
                            setMobileMenuOpen(false)
                          }}
                          className="flex items-center gap-2 text-sm font-medium text-destructive"
                        >
                          <LogOut className="h-4 w-4" />
                          Log out
                        </button>
                      </nav>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => {
                          setShowLoginModal(true)
                          setMobileMenuOpen(false)
                        }}
                        className="justify-start"
                      >
                        Log In
                      </Button>
                      <Button 
                        className="bg-duolingo-green hover:bg-duolingo-green/90 text-white"
                        onClick={() => {
                          setShowSignupModal(true)
                          setMobileMenuOpen(false)
                        }}
                      >
                        Sign Up
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Modals */}
      <LoginModal />
      <SignupModal />
    </>
  )
}