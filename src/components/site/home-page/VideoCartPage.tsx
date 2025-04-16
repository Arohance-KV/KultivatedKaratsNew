import { Loader, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { UIsideBar } from "./Solitare";
// import { useNavigate } from "react-router-dom";
import { ICartItem, IProduct, IUser, IWishListItem } from "@/utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateCart, updateVideoCallCart } from "@/utils/utilityFunctions";
import { toast } from "sonner";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { ToastSuccess } from "@/utils/UtilityComponents";

// const videoCalls = [
//     {
//         name: "Ring", 
//         code: "123",
//         price: 5000,
//         isInCart: true
//     },
//     {
//         name: "Earing", 
//         code: "1234",
//         price: 2500,
//         isInCart: false
//     },
//     {
//         name: "Ring", 
//         code: "123",
//         price: 5000,
//         isInCart: false
//     },

// ]

const getHTML = ({ items } : { items: ICartItem[]}) => {
    
    let html = "";

    items.forEach(item => {
        html += `Product: ${item?.product?.name} <br />Quantity: ${item?.quantity}`
    });
    
    return html
}

export const VideoCartPage = () => {

    const customerData: IUser = useSelector((state: any) => state.website.customerData);
    const [ videoCallCartData, setVideoCallCartData ] = useState<Array<ICartItem>>([]);
    const [ cart, setCart ] = useState<Array<ICartItem>>([]);
    const [ wishList, setWishList ] = useState<Array<IWishListItem>>([]);
    // console.log(typeof wishListData, wishListData?.length, typeof JSON.parse(localStorage.getItem("wishList")!));
    const [ isCreateButtonLoading, setIsCreateButtonLoading ] = useState(false);;
    const dispatch = useDispatch();

    useEffect(() => {
        setVideoCallCartData(customerData?._id ? customerData?.videoCallCart : JSON.parse(localStorage.getItem("videoCallCart")!));
        setCart(customerData?._id ? customerData?.cart : JSON.parse(localStorage.getItem("cart")!)); 
        console.log(cart, videoCallCartData, customerData, videoCallCartData?.[0]);
        setWishList(customerData?.wishList);
    }, [ customerData ]);


    return (
        <div className='w-full relative pb-14'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div id='solitare-main' className="sm:bg-[#E1C6B3] px-8 opacity-0 mt-56 gap-4 flex flex-col items-center sm:w-[80%] w-full justify-self-center rounded-tr-[100px] aspect-video">
                <div className="w-full sm:mt-14 text-center text-white ">
                    <p className="inria-serif-regular text-[#E1C6B3] sm:text-white sm:text-6xl">
                        Video call cart                    
                    </p>
                </div>
                <div className="grid sm:grid-cols-2 grid-cols-1 sm:grid-rows-3 gap-4 flex-1 w-full">
                    {videoCallCartData?.length <= 0 ? <div className="flex justify-center items-center font-[inherit] text-white row-span-full col-span-full">
                        No items in your video call cart!
                    </div> : videoCallCartData?.map((videoCartItem: ICartItem) => {
                        return (
                            // <div className="">
                                <CartItem item={ { name: videoCartItem?.product?.name, code: videoCartItem?.product?.code, price: (videoCartItem?.totalPrice * videoCartItem?.quantity), product: videoCartItem?.product, cart: cart, wishList: wishList, customerData: customerData, dispatch: dispatch, currentVideoCallCart: videoCallCartData } }/>
                            // </div>
                        );
                    })}
                </div>
                <div className="flex-[0.2] w-[95%] items-center flex justify-end">
                    <Button disabled={videoCallCartData?.length <= 0} className="border border-[#E1C6B3]  bg-white text-[#E1C6B3] hover:bg-gray-700/20 hover:text-white" onClick={async () => {
                        setIsCreateButtonLoading(true);
                        try {
                            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}email/send-email`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                credentials: 'include',
                                body: JSON.stringify({ email: { from: import.meta.env.VITE_TO_EMAIL, to: [ import.meta.env.VITE_TO_EMAIL, "maheksampat@gmail.com" ], subject: `Video call enquiry from : ${customerData?.email}`, html: getHTML({ items: customerData?.videoCallCart }) }})
                            });
                        
                            const data = await response.json();
                            console.log(data);
                
                        } catch (error) {
                            console.log(error);
                        } finally {
                            setIsCreateButtonLoading(false);
                        }
                    }}>{isCreateButtonLoading ? <Loader2 className="animate-spin" /> : "Create a video call session"}</Button>
                </div>
            </div>
        </div>
    );
};

export const CartItem = ({item} : { item : {name: string, code: string, price: number, product: IProduct, cart: ICartItem[], wishList: IWishListItem[], customerData: IUser, dispatch: Dispatch<UnknownAction>, currentVideoCallCart: ICartItem[] } }) => {
    
    const [ isCartAddedButtonLoading, setIsCartAddedButtonLoading ] = useState(false);
    const [ isRemoveItemLoadingButton, setIsRemoveItemLoadingButton ] = useState(false);
    
    const [ isInCart, setIsInCart ] = useState(item?.cart?.filter(cartItem => cartItem?.product?._id == item?.product?._id)?.length > 0);

    console.log(item);

    return (
        <div className="flex h-28 gap-4 \ relative">
            <Button disabled={isRemoveItemLoadingButton} variant={"ghost"} className="rounded-full py-3 px-1 w-0 h-0 right-4 top-4 absolute bg-white text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" onClick={async (e) => {
                e.preventDefault();
                setIsRemoveItemLoadingButton(true);
                await updateVideoCallCart({ product: item?.product!, quantity: 1, color: "white", karat: 14, totalPrice: 0 }, false, false, item.cart, item?.dispatch, item?.customerData?._id ? true : false, item?.currentVideoCallCart, item?.wishList);
                setIsRemoveItemLoadingButton(false);
                // setIsInVideoCallCart(false);
                return toast.success("Product deleted from cart successfully!", { className: "font-[quicksand]", icon: <Trash2 className="w-4 h-4 stroke-red-500" /> });
                            // setIsInVideoCallCart(false);
                return toast.success("Product deleted from cart successfully!", { className: "font-[quicksand]", icon: <Trash2 className="w-4 h-4 stroke-red-500" /> });            
            }}><Minus className="w-2 h-2" /></Button>
            <img className="border border-[#A68A7E] rounded-md bg-white h-full flex-[0.25]" src={item?.product?.imageUrl[0]?.url}/>
            <div className="flex-[0.75] h-full text-[#A68A7E] p-4 rounded-md bg-white gap-4 border flex border-[#A68A7E] ">
                <div className="flex justify-evenly flex-col flex-1 gap-4">
                    <p>Name: {item?.name}</p>
                    <p>Code: {item?.product?.code}</p>
                </div> 
                <div className="flex-col flex justify-evenly flex-1 gap-4">
                    <p>Price: {Math.round(item?.product?.price)}</p>
                    <Button disabled={isCartAddedButtonLoading} className="bg-white text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" onClick={ async (e) => {
                        setIsCartAddedButtonLoading(true);
                        e.preventDefault();
                        if( isInCart )
                        {
                            await updateCart({ product: item.product!, quantity: 1, color: "white", karat: 14, totalPrice: 0 }, false, false, item?.cart, item?.dispatch, item.customerData?._id ? true : false, item?.wishList, item?.currentVideoCallCart );
                            setIsCartAddedButtonLoading(false);
                            setIsInCart(false);
                            return toast.success("Product deleted from cart successfully!", { className: "font-[quicksand]", icon: <Trash2 className="w-4 h-4 stroke-red-500" /> });
                        }
                        await updateCart({ product: item.product!, quantity: 1, color: "white", karat: 14, totalPrice: 0 }, true, false, item.cart, item?.dispatch, item?.customerData?._id ? true : false, item?.wishList, item?.currentVideoCallCart);
                        setIsCartAddedButtonLoading(false);
                        setIsInCart(true);
                        return toast.success("Product added to cart successfully!", { className: "font-[quicksand]", icon: <ToastSuccess /> });
                    }}>{isCartAddedButtonLoading ? <Loader className="w-4 h-4 animate-spin" /> : isInCart ? <>Remove from cart <Minus /></> : <>Add to cart <Plus /></>}</Button>
                </div>
            </div>
        </div>
    );
};