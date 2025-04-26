import './index.css';
import { HomePageNavBar } from './components/site/home-page/HomePageNavBar';
import { Outlet, useLocation } from 'react-router-dom';
import { Footer } from './components/site/Footer';
// import { ReactLenis, useLenis } from 'lenis/react'
import { useEffect } from 'react';
import { setCategories, setCollections, setCustomerData, setProductData } from './redux/slices/websiteSlice.ts';
import { useDispatch } from 'react-redux';
// import { useDispatch } from "react-redux";
import AnimatedCursor from "react-animated-cursor";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]); // Scroll to top on pathname change

  return null; // This component doesn't render anything visually
}

function App() {

  // const lenis = useLenis(({ scroll }) => {
    // called every scroll
  // });

  const dispatch = useDispatch();

  useEffect(() => {
    // console.log(recentlyViewed);
      (async function() {
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}products/get-all-products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });
            // console.log(response);

            if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
            
            const data = await response.json();
            dispatch(setProductData(data.data));
            console.log(data.data);
            
        } catch (error) {
            console.log(error);
        }
    })();
    (async function verify() {
      try {
        console.log(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}`);
          // @ts-ignore
          const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/current-user`, {
              method: "GET",
              headers: {
                  "Content-Type": "application/json",
              },
              credentials: "include"
          });
          console.log(response);

          if (!response.ok) {
            if ( response.statusText == "Unauthorized" || response.status == 401 ) {
              // console.log(await createGuestUser());
            }
            throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
          }
          const data = await response.json();

          console.log(data);

          // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
          dispatch(setCustomerData(data.data));
      } catch (error) {
          console.error("Error: ", error);
          // console.log(userData);
          if(!(localStorage.getItem("cart")))
            localStorage.setItem("cart", JSON.stringify([]));
          if(!(localStorage.getItem("wishList")))
            localStorage.setItem("wishList", JSON.stringify([]));
      }
    })();
    (async function () {
      try {
        
      } catch (error) {
        
      }
    })();
    (async function () {
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}categories/get-all-categories`);
        
            const data = await response.json();
        
            if ( !response.ok )
              throw new Error("Error : "+ response);
        
            console.log(data.data);
            // toast.success("Categories fetched successfully!", { className: "font-[quicksand]", icon: <ToastSuccess />})
            dispatch(setCategories(data.data));

          } catch (error) {
            console.log(error);
            // toast.error("Failed to fetch categories!", { className: "font-[quicksand]", icon: <ToastWarning /> });
          }
    })();
    (async function () {
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}collections/get-all-collections`{
              method: 'GET',
              referrerPolicy: 'no-referrer' // Example: This removes the referer completely
            });
        
            const data = await response.json();
        
            if ( !response.ok )
              throw new Error("Error : "+ response);
        
            console.log(data.data);
            // toast.success("Categories fetched successfully!", { className: "font-[quicksand]", icon: <ToastSuccess />})
            dispatch(setCollections(data.data));

          } catch (error) {
            console.log(error);
            // toast.error("Failed to fetch categories!", { className: "font-[quicksand]", icon: <ToastWarning /> });
          }
    })();
    // console.log(`state: ${useSelector((state: any) => state)}`);
    (async function () {
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}banners/get-all-banners-from-a-type/partner-banner`);
        
            const data = await response.json();
        
            if ( !response.ok )
              throw new Error("Error : "+ response);

            // dispatch(setPartnerBanners(data.data));
            console.log(data.data);
            // toast.success("Categories fetched successfully!", { className: "font-[quicksand]", icon: <ToastSuccess />})
          } catch (error) {
            console.log(error);
            // toast.error("Failed to fetch categories!", { className: "font-[quicksand]", icon: <ToastWarning /> });
          }
    })();
    (async function () {
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}banners/get-all-banners-from-a-type/hero-section-banner`);
        
            const data = await response.json();
        
            if ( !response.ok )
              throw new Error("Error : "+ response);

            console.log(data.data);
            // dispatch(setHeroBanners(data.data));
            // toast.success("Categories fetched successfully!", { className: "font-[quicksand]", icon: <ToastSuccess />})
          } catch (error) {
            console.log(error);
            // toast.error("Failed to fetch categories!", { className: "font-[quicksand]", icon: <ToastWarning /> });
          }
    })();
    if(localStorage.getItem("recentlyViewedCart")) return;
    localStorage.setItem("recentlyViewedCart", JSON.stringify([]));
  }, []);
  
  return (
    <div className=''>
      {/* <ReactLenis root> */}
      <ScrollToTop />
        <HomePageNavBar />
          <Outlet />
          <AnimatedCursor 
            innerSize={8}
            outerSize={8}
            // color='#A68A7E'
            // color='166, 138, 126'
            // color='#A68A7E'
            outerAlpha={0.5}
            innerScale={0.1}
            outerScale={7}
            outerStyle={{
              mixBlendMode: 'exclusion'
            }}
            innerStyle={{
              backgroundColor: "#A68A7E",
            }}
            clickables={[
              'a',
              'input[type="text"]',
              'input[type="email"]',
              'input[type="number"]',
              'input[type="submit"]',
              'input[type="image"]',
              'label[for]',
              'select',
              'textarea',
              'button',
              '.link'
            ]}
        />
        <AnimatedCursor
          color="#fff"
          innerStyle={{
            backgroundColor: "#A68A7E"
          }}
          innerSize={8}
          outerSize={35}
          innerScale={1}
          outerScale={1.7}
          outerAlpha={0}
          outerStyle={{
            mixBlendMode: 'exclusion'
          }}
        />
        <Footer />
      {/* </ReactLenis> */}
    </div>
  );
}

export default App;