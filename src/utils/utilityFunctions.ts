import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { ICartItem, IWishListItem } from "./interfaces.ts";
import { setCustomerData } from "../redux/slices/websiteSlice.ts";
import { z } from "zod";
import { formSchema } from "@/components/site/home-page/Solitare.tsx";

export const sendEmail = async (email: { from: string, to: string[], subject: string, html: string }) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}email/send-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: 'include',
            body: JSON.stringify({ email: email })
        });
    
        const data = await response.json();
        console.log(data);
        return { data };
    } catch (error) {
        console.log(error);
        return { error };
    }
};

export const updateWishList = async ( wishListItem: IWishListItem, isAdd: boolean, currentWishlist: IWishListItem[], dispatch: Dispatch<UnknownAction>, isUserPresent: boolean, cart?: ICartItem[], videoCallCart?: ICartItem[] ) => {
    console.log(videoCallCart);
    // const dispatch = useDispatch();
    // const currentWishlist = useSelector((state:any) => state?.website?.customerData?.wishList);
    let newWishList = [ ...currentWishlist, wishListItem ];
    
    if ( !isAdd ) {
        newWishList = currentWishlist?.filter((item: IWishListItem) => item?.product?._id !== wishListItem?.product?._id);
    } 

    if ( !isUserPresent ) {
        console.log(newWishList);
        localStorage.setItem("wishList", JSON.stringify(newWishList));
        dispatch(setCustomerData({cart : cart, wishList: newWishList}));
        return true;
    }

    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-wishlist`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedWishList: newWishList }),
            credentials: "include"
        });
        console.log(response);

        if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
        
        const data = await response.json();

        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
        dispatch(setCustomerData(data.data));
        return true;
    } catch (error) {
        console.error("Error: ", error);
        // console.log(userData);
        return false;
    }
};

export const updateCart = async ( cartItem: ICartItem, isAdd: boolean, sameItem: boolean,  currentCart: ICartItem[], dispatch: Dispatch<UnknownAction>, isUserPresent: boolean, wishList?: IWishListItem[], videoCallCart?: ICartItem[] ) => {

    let newCart;

    if ( isAdd )
        if ( sameItem ) 
            newCart = [ currentCart.map((item: ICartItem) => item?.product?._id == cartItem?.product?._id ? { product: item.product, quantity: item.quantity + 1 } : item) ];
        else 
            newCart = [ ...currentCart, cartItem ];
    else
        if ( sameItem ) 
            newCart = [ currentCart.map((item: ICartItem) => item?.product?._id == cartItem?.product?._id ? { product: item.product, quantity: item.quantity - 1 } : item) ];
        else 
            newCart = currentCart?.filter((item: ICartItem) => item?.product?._id !== cartItem?.product?._id);
        
    if ( !isUserPresent ) {
        console.log(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        dispatch(setCustomerData({cart : newCart, wishList: wishList, videoCallCart: videoCallCart}));
        return true;
    }

    console.log(cartItem, newCart);

    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-cart`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedCart: newCart }),
            credentials: "include"
        });
        console.log(response);

        if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
        
        const data = await response.json();

        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
        dispatch(setCustomerData(data.data));
        return true;
    } catch (error) {
        console.error("Error: ", error);
        // console.log(userData);
        return false;
    }
};

export const updateVideoCallCart = async ( cartItem: ICartItem, isAdd: boolean, sameItem: boolean,  currentCart: ICartItem[], dispatch: Dispatch<UnknownAction>, isUserPresent: boolean, videoCallCart: ICartItem[], wishList?: IWishListItem[],  ) => {

    let newCart;

    if ( isAdd )
        if ( sameItem ) 
            newCart = [ videoCallCart.map((item: ICartItem) => item?.product?._id == cartItem?.product?._id ? { product: item.product, quantity: item.quantity + 1, totalPrice: item?.totalPrice } : item) ];
        else 
            newCart = [ ...videoCallCart, cartItem ];
    else
        if ( sameItem ) 
            newCart = [ videoCallCart.map((item: ICartItem) => item?.product?._id == cartItem?.product?._id ? { product: item.product, quantity: item.quantity - 1, totalPrice: item?.totalPrice } : item) ];
        else 
            newCart = videoCallCart?.filter((item: ICartItem) => item?.product?._id !== cartItem?.product?._id);
        
    if ( !isUserPresent ) {
        console.log(newCart);
        localStorage.setItem("videoCallCart", JSON.stringify(newCart));
        dispatch(setCustomerData({cart : currentCart, wishList: wishList, videoCallCart: newCart}));
        return true;
    }

    // console.log(updateCart);

    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-video-call-cart`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedCart: newCart }),
            credentials: "include"
        });
        console.log(response);

        if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
        
        const data = await response.json();

        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
        dispatch(setCustomerData(data.data));
        return true;
    } catch (error) {
        console.error("Error: ", error);
        // console.log(userData);
        return false;
    }
};

export const clearCart = async ( dispatch: Dispatch<UnknownAction>, isUserPresent: boolean) => {

    let newCart;

    if ( !isUserPresent ) {
        console.log(newCart);
        localStorage.setItem("cart", JSON.stringify([]));
        dispatch(setCustomerData({cart : []}));
        return true;
    }

    // console.log(updateCart);

    try {
        // @ts-ignore
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-cart`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ updatedCart: [] }),
            credentials: "include"
        });
        console.log(response);

        if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
        
        const data = await response.json();

        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
        dispatch(setCustomerData(data.data));
        return true;
    } catch (error) {
        console.error("Error: ", error);
        // console.log(userData);
        return false;
    }
};

export const getSolitareHtml = (values: z.infer<typeof formSchema>) => {
    
    const currentDate = new Intl.DateTimeFormat('en-US', { dateStyle: 'full' }).format(new Date());
    
    return `<div style="color: #A68A7E; display: flex; gap: 16px; flex-direction: column; border-radius: 20px; border: 1px solid #A68A7E; padding: 10px; width: auto;">
      <p>Email: ${values?.email}</p>
      <p>Phone Number: ${values?.phoneNo}</p>
      <p>Shape: ${values?.shape}</p>
      <p>Carat: ${values?.carat}</p>
      <p>Gold Weight: ${values?.goldWeight}</p>
      <p>Multi Diamonds: ${values?.noOfDiamonds}</p>
      <p>Additional requirements: ${values?.additionalRequirements ? values?.additionalRequirements! : "none"}</p>
      <p>Date: ${currentDate}</p>
    </div>`
};

// export const getErrorFromStatusCode : string = ( statusCode: string) => {

// }