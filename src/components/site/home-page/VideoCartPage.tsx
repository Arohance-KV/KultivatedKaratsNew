import { Loader, Loader2, LucidePhone, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { UIsideBar } from "./Solitare";
// import { useNavigate } from "react-router-dom";
import { ICartItem, IProduct, IUser, IWishListItem } from "@/utils/interfaces";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { updateCart, updateVideoCallCart } from "@/utils/utilityFunctions";
import { toast } from "sonner";
import { Dispatch, UnknownAction } from "@reduxjs/toolkit";
import { ToastSuccess, ToastWarning } from "@/utils/UtilityComponents";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { setCustomerData } from "@/redux/slices/websiteSlice";

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

const phoneSchema = z.object({
    phone: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(15, { message: "Phone number can't exceed 15 digits" })
        .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
});

const getHTML = ({ items } : { items: ICartItem[]}) => {
    
    let html = "";

    items.forEach(item => {
        html += `Product: ${item?.product?.name} <br />Quantity: ${item?.quantity}`
    });
    
    return html
}

export const VideoCartPage = () => {

    const form = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
        phone: "",
        },
    });

    const [ isSubmitLoading, setIsSubmitLoading ] = useState(false);

    const onSubmit = async (data: z.infer<typeof phoneSchema>) => {
        setIsSubmitLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-phone`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ phoneNumber: data?.phone })
            });

            const responseJson = await response.json();

            console.log(responseJson);

            if ( !response )
                throw Error("Phone updation failed");

            dispatch(setCustomerData({ ...responseJson?.data }!));
            toast.success("Phone number updated successfully!", { icon: <ToastSuccess />, className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white" });
            
        } catch (error) {
            console.log(error);
            toast.error("Failed to update phone number!", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <ToastWarning /> });
        } finally { 
            setIsSubmitLoading(false);
            setPhoneDialogOpen(false);
        }
        // Add your phone submission logic here
    };
    const navigate = useNavigate();
    const [ phoneDialogOpen, setPhoneDialogOpen ] = useState(false);
    const customerData: IUser = useSelector((state: any) => state.website.customerData);
    const [ videoCallCartData, setVideoCallCartData ] = useState<Array<ICartItem>>([]);
    const [ cart, setCart ] = useState<Array<ICartItem>>([]);
    const [ wishList, setWishList ] = useState<Array<IWishListItem>>([]);
    // console.log(typeof wishListData, wishListData?.length, typeof JSON.parse(localStorage.getItem("wishList")!));
    const [ isCreateButtonLoading, setIsCreateButtonLoading ] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setVideoCallCartData(customerData?._id ? customerData?.videoCallCart : JSON.parse(localStorage.getItem("videoCallCart")!));
        setCart(customerData?._id ? customerData?.cart : JSON.parse(localStorage.getItem("cart")!)); 
        console.log(cart, videoCallCartData, customerData, videoCallCartData?.[0]);
        setWishList(customerData?.wishList);
    }, [ customerData ]);


    return (
        <div className='w-full relative min-h-screen pb-14'>
            <Dialog open={phoneDialogOpen} onOpenChange={() => setPhoneDialogOpen(!phoneDialogOpen)}>
                {/* <DialogTrigger asChild> */}
                    {/* <Button variant="outline">Edit Profile</Button> */}
                {/* </DialogTrigger> */}
                <DialogContent className="sm:max-w-[425px] border border-[#A68A7E] text-[#A68A7E] bg-white">
                    <DialogHeader>
                        <DialogTitle>Enter your phone number</DialogTitle>
                        <DialogDescription>
                            Enter your phone number below to continue!
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form className="flex flex-col gap-y-4 inria-serif-regular" onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input type="tel" placeholder="e.g. 9876543210" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-800/40 font-bold"/>
                                    </FormItem>
                                )}
                            />
                            <Button disabled={isSubmitLoading} variant={"ghost"} className="border-[#A68A7E] hover:text-white hover:bg-[#A68A7E] border bg-white text-[#A68A7E] w-auto" type="submit">{isSubmitLoading ? <Loader2 className="animate-spin w-4 aspect-square"/> : "Save phone number"} <LucidePhone /></Button>
                        </form>
                    </Form>
                    <DialogFooter>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div id='solitare-main' className="sm:bg-[#E1C6B3] px-8 opacity-0 sm:mt-56 mt-14 gap-4 flex flex-col items-center sm:w-[80%] w-full justify-self-center sm:rounded-tr-[100px] min-h-screen sm:aspect-video">
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
                                <CartItem item={ { name: videoCartItem?.product?.name, code: videoCartItem?.product?.productId, price: (videoCartItem?.product?.price * videoCartItem?.quantity), product: videoCartItem?.product, cart: cart, wishList: wishList, customerData: customerData, dispatch: dispatch, currentVideoCallCart: videoCallCartData } }/>
                            // </div>
                        );
                    })}
                </div>
                <div className="flex-[0.2] w-[95%] items-center flex justify-end">
                    <Button disabled={videoCallCartData?.length <= 0} className="border border-[#E1C6B3]  bg-white text-[#E1C6B3] hover:bg-gray-700/20 hover:text-white" onClick={async () => {
                        if ( customerData?._id == null || !customerData )
                            return navigate("/auth");
                        if ( !customerData?.phoneNumber || customerData?.phoneNumber == undefined || customerData?.phoneNumber == null || Number.isNaN(customerData?.phoneNumber))
                            return setPhoneDialogOpen(true);
                        setIsCreateButtonLoading(true);
                        try {
                            const updateUserResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-details`, {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                credentials: "include",
                                body: JSON.stringify({ user: { videoCallCart: [], videoCalls: [ ...customerData?.videoCalls, {
                                    name: `${customerData?.firstName} ${customerData?.lastName}`,
                                    phoneNumber: customerData?.phoneNumber,
                                    status: "Pending",
                                    email: customerData?.email,
                                    videoCallCart: customerData?.videoCallCart
                                } ] } }),
                            });
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

                            const userData = await updateUserResponse?.json();
                            console.log(userData);

                            if ( !response.ok || !updateUserResponse.ok)
                                throw Error("Failed to create video call session!");
                            
                            dispatch(setCustomerData(userData?.data));

                            setVideoCallCartData(userData?.data?.videoCallCart);

                            return toast.success("Video call booked successfully!", { description: "Please wait for a response from our side on your phone number!", className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <ToastSuccess /> });

                        } catch (error) {
                            console.log(error);
                            toast.error("Failed to book video call session!", { description: "Please try again!", className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <ToastWarning /> });
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
        <div className="max-w-[100%] grid grid-cols-6 h-28 gap-4 relative">
            <Button disabled={isRemoveItemLoadingButton} variant={"ghost"} className="rounded-full py-3 px-1 w-0 h-0 right-0 top-0 translate-x-1/2 -translate-y-1/2 absolute bg-white text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" onClick={async (e) => {
                e.preventDefault();
                setIsRemoveItemLoadingButton(true);
                await updateVideoCallCart({ containsGemstone: item?.product?.containsGemstone , product: item?.product!, quantity: 1, color: "white", karat: 14, totalPrice: item?.price }, false, false, item.cart, item?.dispatch, item?.customerData?._id ? true : false, item?.currentVideoCallCart, item?.wishList);
                setIsRemoveItemLoadingButton(false);
                return toast.success("Product deleted from cart successfully!", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <Trash2 className="w-4 h-4 stroke-red-500" /> });
            }}><Minus className="w-2 h-2" /></Button>
            <img className="border col-span-2 border-[#A68A7E] object-cover rounded-md bg-white h-full" src={item?.product?.imageUrl?.[0]?.url}/>
            <div className="col-span-4 h-full text-[#A68A7E] p-4 rounded-md bg-white sm:gap-4 border flex flex-col border-[#A68A7E] ">
                <div className="flex justify-evenly text-xs sm:text-base flex-col flex-1 gap-2">
                    <p>Name: {item?.name}</p>
                    {/* <p>Code: {item?.code}</p> */}
                </div> 
                <div className="flex text-xs gap-0 sm:text-base justify-between flex-1 sm:gap-4">
                    <p className="self-end">Amount: ₹{Math.round(item?.product?.price)}</p>
                    <Button disabled={isCartAddedButtonLoading} className="bg-white text-[#A68A7E] border h-auto text-xs sm:text-base border-[#A68A7E] hover:text-white hover:bg-gray-800/20" onClick={ async (e) => {
                        setIsCartAddedButtonLoading(true);
                        e.preventDefault();
                        if( isInCart )
                        {
                            await updateCart({ containsGemstone: item?.product?.containsGemstone , product: item.product!, quantity: 1, color: "white", karat: 14, totalPrice: item?.price }, false, false, item?.cart, item?.dispatch, item.customerData?._id ? true : false, item?.wishList, item?.currentVideoCallCart );
                            setIsCartAddedButtonLoading(false);
                            setIsInCart(false);
                            return toast.success("Product deleted from cart successfully!", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <Trash2 className="w-4 h-4 stroke-red-500" /> });
                        }
                        await updateCart({ containsGemstone: item?.product?.containsGemstone , product: item.product!, quantity: 1, color: "white", karat: 14, totalPrice: item?.price }, true, false, item.cart, item?.dispatch, item?.customerData?._id ? true : false, item?.wishList, item?.currentVideoCallCart);
                        setIsCartAddedButtonLoading(false);
                        setIsInCart(true);
                        return toast.success("Product added to cart successfully!", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <ToastSuccess /> });
                    }}>{isCartAddedButtonLoading ? <Loader className="w-4 h-4 animate-spin" /> : isInCart ? <><span className="sm:visible hidden">Remove from cart</span><ShoppingCart className="sm:hidden visible w-2 aspect-square" /> <Minus /></> : <>Add to cart <Plus /></>}</Button>
                </div>
            </div>
        </div>
    );
};