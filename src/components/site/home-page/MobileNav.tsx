import { MenuIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
// import { MenuIcon, XIcon } from '@heroicons/react/solid'; // Or any other icon library

export const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const menuItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Collection', href: '/collections' },
    { name: 'Products', href: '/products' },
    { name: 'Store locator', href: '/store-locator' },
    { name: 'Giftcard', href: '/giftcards' },
    { name: 'Video calls', href: '/video-cart' },
    { name: 'login/signup', href: '/auth' },    
  ];

  return (
    <div className="relative h-full w-14">
      {/* Hamburger Button */}
      
      <button
        onClick={toggleMenu}
        className="bg-white rounded-md p-2"
      >
        {isOpen ? (
          <XIcon className="h-6 w-6 text-gray-700" aria-hidden="true" />
        ) : (
          <MenuIcon className="h-6 w-6 text-gray-700" aria-hidden="true" />
        )}
      </button>

      {/* Menu Overlay */}
      <div
        className={`fixed top-0 left-0 w-full bg-opacity-50 z-40 transition-opacity duration-300 ease-in-out ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={toggleMenu} // Close menu when clicking outside
      ></div>

      {/* Menu Panel (Top to Bottom) */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-full bg-[#E1C6B3] z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Close Button inside the menu */}
        <div className="p-4 flex justify-end">
          <button onClick={toggleMenu} className="focus:outline-none">
            <XIcon className="h-6 w-6 text-gray-700" aria-hidden="true" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4">
          <ul className="space-y-2 flex flex-col justify-center items-center !text-white inria-serif-regular text-3xl">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="block py-2 px-4 z-0 hover:bg-gray-100 rounded-md"
                  onClick={toggleMenu} // Close menu on item click (optional)
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};