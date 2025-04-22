import { useEffect, useState } from "react";
import { ICartItem, IUser, IWishListItem } from "../../../utils/interfaces";
import { UIsideBar } from "./Solitare";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Loader, Minus, Plus, Trash2 } from "lucide-react";
// import { toast } from "sonner";
import { updateCart, updateWishList } from "@/utils/utilityFunctions";
import { Dispatch } from "@reduxjs/toolkit";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ToastSuccess } from "@/utils/UtilityComponents";
// import { ToastSuccess } from "@/utils/UtilityComponents";

export const WishListPage = () => {

    const customerData: IUser = useSelector((state: any) => state.website.customerData);
    const [ wishListData, setWishListData ] = useState<Array<IWishListItem>>([]);
    const [ cart, setCart ] = useState<Array<ICartItem>>([]);
    // console.log(typeof wishListData, wishListData?.length, typeof JSON.parse(localStorage.getItem("wishList")!));

    useEffect(() => {
        setWishListData(customerData?._id ? customerData?.wishList : JSON.parse(localStorage.getItem("wishList")!));
        setCart(customerData?._id ? customerData?.cart : JSON.parse(localStorage.getItem("cart")!)); 
        console.log(cart, wishListData, customerData, wishListData?.[0]);
    }, [ customerData ]);

    const dispatch = useDispatch();

    return (
        <div className='w-full relative sm:min-h-auto min-h-screen pb-14'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div id='solitare-main' className="sm:bg-[#E1C6B3] px-8 opacity-0 sm:mt-56 mt-14 gap-10 flex flex-col items-center sm:w-[80%] w-full justify-self-center rounded-tr-[100px] aspect-video">
                <div className="w-full sm:mt-14 text-center text-white ">
                    <p className="inria-serif-regular text-[#E1C6B3] sm:text-white sm:text-6xl">
                        Wish List                    
                    </p>
                </div>
                <div style={{
                     
                }} className="grid grid-cols-2 overflow-y-scroll h-auto max-h-[100%] no-scrollbar gap-4 flex-1 w-full">
                    {wishListData?.map((item : IWishListItem) => <WishListItem cartItem={{...item, containsGemstone: item?.product?.containsGemstone, quantity: 1, totalPrice: item?.product?.price}} cartItems={cart} dispatch={dispatch} customerData={customerData} />)}
                </div>
            </div>
        </div>    
    );
};



                                

const WishListItem = ( { cartItems, cartItem, dispatch, customerData } : { cartItem: ICartItem, cartItems: ICartItem[], dispatch: Dispatch, customerData: IUser } ) => {
    const isInCart = cartItems.filter(item => cartItem?.product?._id == item?.product?._id).length > 0;
    const [ isCartButtonLoading, setIsCartButtonLoading ] = useState(false);
 
    const [ isRemoveItemLoadingButton, setIsRemoveItemLoadingButton ] = useState(false);

    return ( 
        // <div className="">
                <div className="flex col-span-1 sm:h-28  gap-4 ">
                    <img src={cartItem?.product?.imageUrl?.[0]?.url} className="border border-[#A68A7E] rounded-md bg-white h-full aspect-square object-cover flex-[0.25]"/>
                    {/* <img src={""} className="border border-[#A68A7E] rounded-md bg-white h-full w-auto object-cover flex-[0.25]"/> */}
                    <div className="flex-[0.75] h-full text-[#A68A7E] p-4 rounded-md  border flex border-[#A68A7E] bg-white">
                        <div className="flex justify-evenly flex-col text-[8px] sm:text-[16px] flex-1">
                            <p>Name: {cartItem?.product?.name}</p>
                            <p>Code: {cartItem?.product?.code}</p>
                        </div>
                        <div className="flex-col flex justify-evenly sm:text-[16px] text-[8px] flex-1">
                            <p>Price: {(cartItem?.product?._id) ? Math.round(cartItem?.product?.price) : <Skeleton className="w-8 h-4 rounded-md bg-red-100/10" />}</p>
                            <Button className="bg-white sm:flex hidden justify-center items-center text-[#A68A7E] border  border-[#A68A7E] hover:text-white hover:bg-gray-800/20" onClick={ async (e) => {
                                setIsCartButtonLoading(true);
                                e.preventDefault();
                                if( isInCart )
                                    {
                                        await updateCart({ containsGemstone: cartItem?.product?.containsGemstone , product: cartItem?.product!, quantity: 1, color: "white", karat: 14, totalPrice: cartItem?.product?.price }, false, false, cartItems, dispatch, customerData?._id ? true : false, customerData?.wishList, customerData?.videoCallCart);
                                        setIsCartButtonLoading(false)
                                        // setIsInCart(false);
                                        return toast.success("Product deleted from cart successfully!", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <Trash2 className="w-4 h-4 stroke-red-500" /> });
                                    }
                                    await updateCart({ containsGemstone: cartItem?.product?.containsGemstone , product: cartItem?.product!, quantity: 1, color: "white", karat: 14, totalPrice: cartItem?.product?.price }, true, false, cartItems, dispatch, customerData?._id ? true : false, customerData?.wishList, customerData?.videoCallCart);
                                    setIsCartButtonLoading(false);
                                    // setIsInCart(true);
                                    return toast.success("Product added to cart successfully!", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <ToastSuccess /> });    
                                }}>{isCartButtonLoading ? <Loader className="animate-spin w-4 h-4"/> : isInCart ? <>Remove from cart <Minus /></>: <>Add to cart <Plus /></>}</Button>
                        </div>
                        <Button disabled={isRemoveItemLoadingButton} variant={"ghost"} className="rounded-full py-3 px-1 w-0 h-0 bg-white text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" onClick={async (e) => {
                            e.preventDefault();
                            await updateWishList({product: cartItem?.product!, color: "white", karat: 14}, false, customerData?.wishList, dispatch, customerData?._id ? true : false, customerData?.cart, customerData?.videoCallCart);
                            setIsRemoveItemLoadingButton(false);
                            // setIsInWishList(false);
                        }}><Minus className="w-2 h-2" /></Button>
                    </div>
                </div>
        // </div>
    );
}