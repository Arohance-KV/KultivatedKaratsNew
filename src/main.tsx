import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import { HomePage } from './components/site/home-page/HomePage.tsx';
import { About } from './components/site/home-page/About.tsx';
import { Solitare } from './components/site/home-page/Solitare.tsx';
import { GiftCards } from './components/site/home-page/GiftCards.tsx';
import { StoreLocator } from './components/site/home-page/StoreLocator.tsx';
import { Provider } from "react-redux";
import { Collections } from './components/site/home-page/Collections.tsx';
import { DashboardMain } from './components/adminPanel/DashboardMain.tsx';
import { DashboardHomePage } from './components/adminPanel/DashboardHomePage.tsx';
import { VideoCartPage } from './components/site/home-page/VideoCartPage.tsx';
import { VideoCallBookingPage } from './components/site/home-page/VideoCallBookingPage.tsx';
import { Auth } from './components/site/Auth.tsx';
import { store } from './redux/store.ts';
import { ProductPage } from './components/site/product-page/ProductPage.tsx';
import { WishListPage } from './components/site/home-page/WishlistPage.tsx';
import { CartPage } from './components/site/home-page/CartPage.tsx';
import { AccountSettings } from './components/site/home-page/AccountSettings.tsx';
import { PaymentSuccess } from './components/site/home-page/PaymentSuccess.tsx';
import { BlogPage } from './components/site/home-page/BlogPage.tsx';
import { BlogsPage } from './components/site/home-page/BlogsPage.tsx';
import { SetShipping } from './components/site/home-page/SetShipping.tsx';
import { Products } from './components/site/home-page/Products.tsx';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GoldCoins } from './components/site/home-page/GoldCoins.tsx';
import { GoldCoinPage } from './components/site/home-page/GoldCoinPage.tsx';
import { Categories } from './components/site/home-page/Categories.tsx';
import { TC } from './components/site/home-page/TermsConditions.tsx';
import { PrivacyPolicy } from './components/site/home-page/PrivacyPolicy.tsx';
import { ContactUs } from './components/site/home-page/ContactUs.tsx';
import { ProductCare } from './components/site/home-page/ProductCare.tsx';
import { ShippingPolicy } from './components/site/home-page/ShippingPolicy.tsx';
import { Toaster } from './components/ui/sonner.tsx';
import { Test } from './components/site/home-page/Text.tsx';
// import { DashboardProductsPage } from './components/adminPanel/DashboardProductsPage.tsx';
// import { DashboardCouponsPage } from './components/adminPanel/DashboardCouponsPage.tsx';
// import { DashboardVouchersPage } from './components/adminPanel/DashboardVouchersPage.tsx';
// import { DashboardOrdersPage } from './components/adminPanel/DashboardOrdersPage.tsx';
// import { DashboardBlogsPage } from './components/adminPanel/DashboardBlogsPage.tsx';

const router = createBrowserRouter(
  createRoutesFromElements(
      <Route path="/">
          {/* <Route path="admin" element={<DashboardMain />}> */}
            <Route path="admin" element={<DashboardMain />}>
                <Route path="dashboard" element={<DashboardHomePage />} />
            {/* </Route> */}
          </Route>
          <Route path="" element={<App />}>
              <Route path='auth' element={<Auth />} />
              <Route path="" element={<HomePage />} />
              <Route path="/about" element={<About />} />
              <Route path="/solitare" element={<Solitare />} />
              <Route path="/store-locator" element={<StoreLocator />} />
              <Route path="/giftcards" element={<GiftCards />} />
              <Route path="/collections" element={<Collections />} />
              <Route path="/products" element={<Products />} />
              <Route path="/test" element={<Test />} />
              <Route path="/video-cart" element={<VideoCartPage />} />
              <Route path="/store-locator" element={<StoreLocator />} />
              <Route path="/gold-coins" element={<GoldCoins />} />
              <Route path="/wishlist" element={<WishListPage />} />
              <Route path="/video-cart/book" element={<VideoCallBookingPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/product/:productId" element={<ProductPage />} />
              <Route path="/gold-coin/:goldCoinWeight" element={<GoldCoinPage />} />
              <Route path="/account-details/" element={<AccountSettings />} />
              <Route path="/payment-success/" element={<PaymentSuccess />} />
              <Route path="/blogs/" element={<BlogsPage />} />
              <Route path="/blogs/:id" element={<BlogPage />} />
              <Route path="/set-shipping" element={<SetShipping />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/terms-and-conditions" element={<TC />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/product-care" element={<ProductCare />} />
              {/* <Route path="admin" element={<DashboardMain />}>
                <Route path="home" element={<DashboardHomePage />}></Route>
                <Route path="products" element={<DashboardProductsPage />}></Route>
                <Route path="coupons" element={<DashboardCouponsPage />}></Route>
                <Route path="vouchers" element={<DashboardVouchersPage />}></Route>
                <Route path="orders" element={<DashboardOrdersPage />}></Route>
                <Route path="blogs" element={<DashboardBlogsPage />}></Route>
              </Route> */}
          </Route>
      </Route>
  )
);

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          {/* <ScrollToTop /> */}
          <RouterProvider router={router} />
          <Toaster />
        </GoogleOAuthProvider>
          {/* <AnimatedCursor /> */}
      </Provider>
  </StrictMode>
);

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )