
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bookmark, Settings, Map } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from "@/contexts/UserContext";
import SearchBox from './SearchBox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/services';
import MapDialog from './MapDialog';

const Navbar = () => {
  const {
    isLoggedIn,
    user,
    logout
  } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMapDialogOpen, setIsMapDialogOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const { data: activities = [] } = useQuery({
    queryKey: ['activities'],
    queryFn: fetchActivities,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const handleLoginClick = () => {
    navigate('/auth');
  };
  
  const getInitials = () => {
    if (!user?.name) return 'U';
    const nameParts = user.name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`;
    }
    return user.name.substring(0, 2);
  };
  
  return <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center justify-center mr-2">
            <Link to="/" className="flex items-center gap-[15px]">
              <img
                src="/LittlebranchLogo.svg"
                alt="Little Branch Logo"
                className="h-12 w-auto object-fill"
              />
            </Link>
          </div>
          {/* Search Box (visible only on medium and larger screens) */}

          <div className="hidden md:block">
            <SearchBox />
          </div>
          {/* Main navigation - desktop */}
          <div className="hidden md:flex items-center space-x-1">
            
            {/* Map button */}
            {/* <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-gray-600 hover:text-kids-blue hover:bg-kids-blue/10" 
              onClick={() => setIsMapDialogOpen(true)}
              aria-label="View map"
            >
              <Map size={20} />
            </Button> */}
            
            {isLoggedIn ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full" aria-label="User menu">
                    <Avatar className="h-9 w-9 bg-kids-blue/10">
                      <AvatarFallback className="text-xs font-medium text-kids-blue">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="font-normal">
                      <div className="font-medium">{user?.name}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    My Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/saved')}>
                    <Bookmark className="mr-2 h-4 w-4" />
                    Saved Activities
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <Button onClick={handleLoginClick} className="ml-2 bg-kids-orange hover:bg-kids-orange/90">
                Login
              </Button>}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* Map button for mobile */}
            {/* <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 text-gray-600 hover:text-kids-blue hover:bg-kids-blue/10" 
              onClick={() => setIsMapDialogOpen(true)}
              aria-label="View map"
            >
              <Map size={20} />
            </Button> */}
            
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-gray-900 focus:outline-none" aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && <div className="md:hidden bg-white border-t">
          <div className="container mx-auto px-4 py-3">
            <div className="mb-4">
              <SearchBox />
            </div>
            <div className="space-y-1">
              <Link to="/" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-kids-blue bg-kids-blue/5' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/activities" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/activities') ? 'text-kids-blue bg-kids-blue/5' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
                Activities
              </Link>
              {isLoggedIn && <>
                  <Link to="/saved" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/saved') ? 'text-kids-blue bg-kids-blue/5' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
                    Saved
                  </Link>
                  <Link to="/profile" className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/profile') ? 'text-kids-blue bg-kids-blue/5' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => setIsMenuOpen(false)}>
                    My Profile
                  </Link>
                </>}
              {isLoggedIn ? <button onClick={() => {
            logout();
            setIsMenuOpen(false);
          }} className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  <LogOut className="h-5 w-5 mr-2 text-kids-blue" />
                  Log Out
                </button> : <button onClick={() => {
            navigate('/auth');
            setIsMenuOpen(false);
          }} className="flex w-full items-center px-3 py-2 rounded-md text-base font-medium text-kids-blue hover:bg-kids-blue/5">
                  <User className="h-5 w-5 mr-2" />
                  Login
                </button>}
            </div>
          </div>
        </div>}
        
      {/* Map Dialog */}
      <MapDialog 
        isOpen={isMapDialogOpen} 
        onClose={() => setIsMapDialogOpen(false)} 
        activities={activities} 
      />
    </nav>;
};
export default Navbar;
