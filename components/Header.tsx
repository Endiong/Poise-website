import React, { useState, useRef, useEffect } from 'react';
import { NAV_LINKS } from '../constants';
import { AuthMode } from '../App';

interface HeaderProps {
  isLoggedIn: boolean;
  onNavigateToAuth: (mode: AuthMode) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onNavigateToAuth, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [menuStyle, setMenuStyle] = useState({});
  const navRef = useRef<HTMLElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = (menu: string, e: React.MouseEvent<HTMLButtonElement>) => {
    setActiveMenu(menu);
    const target = e.currentTarget;
    if (navRef.current) {
      const navRect = navRef.current.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      setMenuStyle({
        '--popover-width': `${menu === 'products' ? 600 : menu === 'resources' ? 600 : 500}px`,
        '--popover-height': `${menu === 'products' ? 200 : menu === 'resources' ? 410 : 340}px`,
        '--arrow-x': `${targetRect.left - navRect.left + targetRect.width / 2}px`,
        '--arrow-y': `${targetRect.bottom - navRect.top}px`,
      });
    }
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header ref={navRef} onMouseLeave={handleMouseLeave} className="relative bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a href="#" className="flex items-center text-gray-900">
              <span className="hidden sm:inline text-2xl font-logo tracking-tight">poisé</span>
            </a>
          </div>
          
          <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center space-x-8">
            {Object.keys(NAV_LINKS).map((key) => (
              <button
                key={key}
                onMouseEnter={(e) => handleMouseEnter(key, e)}
                className="text-gray-600 hover:text-gray-900 capitalize relative"
              >
                {NAV_LINKS[key as keyof typeof NAV_LINKS].title}
                {activeMenu === key && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black"></div>}
              </button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setIsProfileMenuOpen(prev => !prev)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800"
                  aria-expanded={isProfileMenuOpen}
                  aria-haspopup="true"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://i.pravatar.cc/150?u=margaret"
                    alt="User avatar"
                  />
                </button>
                {isProfileMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsProfileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => onNavigateToAuth('login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigateToAuth('signup')}
                  className="px-4 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-colors"
                >
                  Create Account
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div
        style={menuStyle}
        className={`
          absolute top-[calc(var(--arrow-y)+10px)] left-[calc(var(--arrow-x)-var(--popover-width)/2)]
          w-[var(--popover-width)] h-[var(--popover-height)]
          bg-white rounded-xl shadow-2xl border border-gray-200
          transition-all duration-300 ease-in-out
          origin-top
          ${activeMenu ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}
      >
        <MegaMenuContent menuKey={activeMenu} />
      </div>
    </header>
  );
};

const MegaMenuContent: React.FC<{ menuKey: string | null }> = ({ menuKey }) => {
  const [hoveredItemClass, setHoveredItemClass] = useState('');

  if (!menuKey) return null;

  const menuData = NAV_LINKS[menuKey as keyof typeof NAV_LINKS];

  if (!menuData) return null;

  const gridColsClass = menuKey === 'products' ? 'grid-cols-2' : 'grid-cols-2';

  return (
    <div className={`p-4 grid ${gridColsClass} gap-4 h-full overflow-hidden`}>
        <div className="col-span-1 flex flex-col gap-2">
            {menuData.items.map((item, index) => (
                <a
                    href="#"
                    key={index}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-100 transition-colors group"
                    onMouseEnter={() => setHoveredItemClass(item.graphicClass)}
                >
                    <div className="p-2 bg-white rounded-md shadow-sm border border-gray-200 mr-4">
                        {item.icon}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                </a>
            ))}
        </div>
        <div className="col-span-1 rounded-lg overflow-hidden">
            <div className={`w-full h-full transition-colors duration-300 ${hoveredItemClass || 'bg-gray-100'}`}>
                {/* Visual graphic can be added here */}
            </div>
        </div>
    </div>
  );
};


export default Header;
