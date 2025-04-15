import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top whenever the location changes (route change)
    window.scrollTo(0, 0);
  }, [location]);

  return null;
};

export default ScrollToTop;
