import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productSliceReducer from "./productSlice";
import categorySliceReducer from "./categorySlice";
import collectionSliceReducer from "./collectionSlice";
import cartSliceReducer from "./cartSlice";
import authSliceReducer from "./authSlice";    
import discountSliceReducer from "./discountSlice";
import orderSliceReducer from "./orderSlice";
import paymentSliceReducer from "./paymentSlice";
import bannerSliceReducer from "./bannerSlice";
import mobileBannerSliceReducer from "./mobileBannerSlice";
import blogSliceReducer from "./blogSlice";
import wishlistSliceReducer from "./wishlistSlice";

// For backward compatibility - alias website state to category and collection slices
const websiteSliceReducer = combineReducers({
  categories: categorySliceReducer,
  collections: collectionSliceReducer,
  productData: (state: any = [], _action: any) => state,
  reels: (state: any = [], _action: any) => state,
  testimonials: (state: any = [], _action: any) => state,
  blogs: blogSliceReducer,
  customerData: (state: any = {}, _action: any) => state,
  heroBanners: (state: any = [], _action: any) => state,
});

export const store = configureStore({
    reducer: combineReducers({
        auth: authSliceReducer,
        product: productSliceReducer,
        category: categorySliceReducer,
        collection: collectionSliceReducer,
        cart: cartSliceReducer,
        order: orderSliceReducer,
        discount: discountSliceReducer,
        payment: paymentSliceReducer,
        banner: bannerSliceReducer,
        mobileBanner: mobileBannerSliceReducer,
        blog: blogSliceReducer,
        wishlist: wishlistSliceReducer,
        website: websiteSliceReducer,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;