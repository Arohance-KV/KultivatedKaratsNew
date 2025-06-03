import { ICartItem, IUser } from "@/utils/interfaces";
import { UIsideBar } from "./Solitare";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { clearCart, sendEmail, updateCart } from "@/utils/utilityFunctions";
import { Loader2, LucidePhone, Minus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Dispatch } from "@reduxjs/toolkit";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { setCustomerData } from "@/redux/slices/websiteSlice";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ToastSuccess, ToastWarning } from "@/utils/UtilityComponents";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const phoneSchema = z.object({
    phone: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(15, { message: "Phone number can't exceed 15 digits" })
        .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
});

export const CartPage = () => {

    const form = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
        defaultValues: {
        phone: "",
        },
    });

    const [ isPaytmCode, setIsPaytmcode ]= useState(false);

    const [ isSubmitLoading, setIsSubmitLoading ] = useState(false);
    const [ phoneDialogOpen, setPhoneDialogOpen ] = useState(false);

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

    const [ isPlaceOrderButtonLoading, setIsPlaceOrderButtonLoading ] = useState(false);

    const customerData: IUser = useSelector((state: any) => state.website.customerData);
    // const [ cartItems, setCartItems ] = useState<ICartItem[]>([]);
    const [ cartItems, setCartItems ] = useState<ICartItem[]>([]);
    const [ cartTotal, setCartTotal ] = useState<number>(-1);

    useEffect(() => {
        setCartItems(customerData?.cart);
        setCartTotal(cartItems?.reduce((total, cartItem) => {
            return total + (cartItem?.totalPrice * cartItem?.quantity)
        }, 0));
    }, [ customerData ]);

    useEffect(() => {
        setCartTotal(cartItems?.reduce((total, cartItem) => {
            return total + (cartItem?.totalPrice * cartItem?.quantity)
        }, 0));
    }, [ cartItems ]);

    // const [ isOrderPlacing, setIsOrderPlacing ] = useState(false);
    const [ applyCouponButtonLoading, setApplyCouponButtonLoading ] = useState(false);
    const [ applyVoucherCodeLoading, setApplyVoucherCodeLoading ] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => console.log("Razorpay script loaded");
        document.body.appendChild(script);
    }, []);

    const couponRef = useRef<string>("");
    const voucherOrGiftCardRef = useRef(null);
    const voucherOrGiftCardPinRef = useRef(null);
    const [ couponError, setCouponError ] = useState("");
    const couponDiscountRef = useRef<number>(0);

    // const [ couponApplied, setCouponApplied ] = useState(false);
    // const [ voucherApplied, setVoucherApplied ]= useState(false);

    const [ voucherError, setVoucherError ] = useState("");

    const getOrderEmailHtml = () => {
        return (
            `<div style="width: 90%; height: auto; margin: 1rem; padding: 1rem; border: 1px solid #A68A7E; border-radius: 8px; color: #A68A7E;">
                <img src="/logo.svg">
                <p>Email: ${customerData?.email}</p>
                <p>Phone number: ${customerData?.phoneNumber}</p>
                <p>Name: ${customerData?.firstName} ${customerData?.lastName}</p>
                <p>Cart: [Total items : ${cartItems?.length + 1}]</p>
                <div style="display: flex; flex-direction: column;">
                ${cartItems?.map((cartItem: ICartItem, index) => {
                    return (
                        `<div style="display: flex; flex-direction: column; gap: 16px">
                            <h1>Item no ${index + 1}:</h1>
                            <p>
                                Name: ${cartItem?.product?.name}
                            </p>
                            <br>
                            <p>
                                Quantity: ${cartItem?.quantity}
                            </p>
                            <br>
                            <p>
                                ${cartItem?.containsGemstone && `Gem stone option: ${cartItem?.isGemStone ? "Gemstone" : "Labgrown diamond"}`}
                            </p>
                            <br>
                            <p>
                                ${cartItem?.addChain && `Add pendant chain: ${cartItem?.addChain ? "Yes" : "No"}`}
                            </p>
                            <br>
                            <p>
                                ${cartItem?.addChain && `Chain gold karat: {cartItem?.chainGoldCarat}`}
                            </p>
                            <br>
                            <p>
                                ${cartItem?.ringSize! > 0 && `Ring size: {cartItem?.ringSize}`}
                            </p>
                            <br>
                            <p>
                                Gold colour: ${cartItem?.color}
                            </p>
                            <br>
                            <p>
                                Gold karat: ${cartItem?.karat}
                            </p>
                            <br>
                            <p>
                                Total: ${cartItem?.totalPrice}
                            </p>
                        </div>`
                    );
                })}
            </div>`
        );
    };

    return (
        <div className='w-full playfair-display! relative pb-14'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
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
            <div id='solitare-main' className="sm:bg-[#E1C6B3] opacity-0 sm:mt-56 gap-4 flex flex-col items-center sm:w-[80%] w-full justify-self-center sm:rounded-tr-[100px] overflow-y-scroll no-scrollbar h-screen">
                <div className="w-full mt-14 text-center  flex flex-col gap-8 h-full text-[#A68A7E] sm:text-white ">
                    <p className="inria-serif-regular text-6xl">
                        Cart                    
                    </p>
                    <div className="w-[90%] max-h-full gap-4 h-full mx-[5%] pb-8 flex sm:flex-row flex-col">
                        <div className="flex-[0.6] sm:h-auto min-h-[50vh] py-4 flex gap-4 overflow-y-scroll no-scrollbar flex-col">
                            {cartItems?.map((cartItem: ICartItem) => (<CartItem customerData={customerData} dispatch={dispatch} cartItem={cartItem} cartItems={cartItems} setCartItems={setCartItems} />))}
                        </div>
                        <div className="text inria-serif-regular text-[#A68A7E] flex flex-col border-2 bg-white border-[#BFA6A1] rounded-md h-full flex-[0.4]">
                            <p className="p-4 flex justify-start text-xl">Order summary</p>
                            <div className="flex justify-between p-4 flex-1 ">
                                <p>Total items : {cartItems?.reduce((total, item) => {
                                    return total + item?.quantity;
                                }, 0)}</p>
                                <p>Price : ₹{Math.round(cartTotal + couponDiscountRef?.current)}</p>
                            </div>
                            {couponDiscountRef?.current > 0 && <p className="uppercase w-[90%] mb-4 justify-self-center self-center flex justify-between">({couponRef?.current}) <span>- {couponDiscountRef?.current}</span></p>}
                            <div className="w-[90%] mb-4 flex justify-between justify-self-center self-center">
                                <p className="">+ 3% GST</p>
                                <p>₹{(Math.round((cartTotal) * (3 / 100)))}</p>
                            </div>
                            <div className="w-[90%] mb-4 self-center flex justify-between">
                                <p>Cart total</p>
                                <p>₹{Math.round(cartTotal + (cartTotal * (3 / 100)))}</p>
                            </div>
                            <div className="flex flex-col gap-4 justify-center items-center">
                                <div className="relative w-[80%]">
                                    <Input disabled={couponDiscountRef?.current > 0} onChange={(e) => {
                                        console.log(e?.target?.value);
                                        // if ( couponRef?.current != null )
                                        couponRef.current = e?.target?.value;
                                        console.log(couponRef?.current)
                                    }} className="justify-self-center w-full border border-dashed" placeholder="Enter coupon code" />
                                    <Button disabled={couponDiscountRef?.current > 0 || applyCouponButtonLoading} onClick={ async (e) => {
                                        e.preventDefault();
                                        setApplyCouponButtonLoading(true);
                                        const code = couponRef?.current;
                                        setCouponError("");
                                        if ( code && code != "" ) {
                                            try {
                                                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}coupons/verify-coupon`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                    },
                                                    credentials: "include",
                                                    body: JSON.stringify({
                                                        code: code,
                                                        cart: customerData?.cart,
                                                    }),
                                                });
                                                // console.log(response);
                                                const data = await response.json();
                                    
                                                if (!response.ok) {
                                                    console.log(data);
                                                    setCouponError(data?.errors?.[0] || "");
                                                    throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
                                                }
                                                
                                                console.log(data.data);
                                                couponDiscountRef.current = data?.data?.discount;
                                                setCartTotal((cartTotal - couponDiscountRef?.current));
                                                // setProductData(data.data)
                                            } catch (error) {
                                                console.log(error);
                                            } finally {
                                                setApplyCouponButtonLoading(false);
                                            }
                                        }
                                            console.log("request not sent, coupon code: "+code)
                                        }
                                    } className="border absolute border-dashed top-0 right-0" variant={"ghost"}>{applyCouponButtonLoading ? <Loader2 className="stroke-[#A68A7E] animate-spin" /> : "Apply"}</Button>
                                    {couponError != "" && <p id="coupon-error" className="self-start mt-2 inria-serif-regular text-red-500 text-xs">{couponError}</p>}
                                </div>
                                <div className="relative w-[80%] flex sm:gap-4 gap-2 ">
                                    <Input ref={voucherOrGiftCardRef} onChange={(e) => {
                                        console.log(e.target.value);
                                        if ( (e.target.value! + "").toLowerCase().startsWith("paytm") ) {
                                            // console.log(true);
                                           return setIsPaytmcode(true);
                                        }
                                        setIsPaytmcode(false);
                                    }} className="justify-self-center w-full border border-dashed" placeholder="Enter Voucher code/Giftcard code" />
                                    {isPaytmCode && <Input ref={voucherOrGiftCardPinRef} onChange={(e) => {
                                        console.log(e.target.value);
                                    }} className="justify-self-center w-full border border-dashed" placeholder="Enter PIN" />}
                                    <Button className="border absolute border-dashed top-0 right-0" onClick={ async (e) => {
                                        if ( customerData?._id == null )
                                            return navigate("/auth");
                                        if ( !customerData?.phoneNumber || customerData?.phoneNumber == undefined || customerData?.phoneNumber == null || Number.isNaN(customerData?.phoneNumber))
                                            return setPhoneDialogOpen(true);
                                        e.preventDefault();
                                        setApplyVoucherCodeLoading(true);
                                        setVoucherError("");
                                        try {
                                            if ( isPaytmCode ) {
                                                setVoucherError("Invalid coupon or PIN!");
                                        //         const response =  await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}paytm/redeem-giftcard`, {
                                        //             method: "POST",
                                        //             headers: {
                                        //                 "Content-Type" : "application/json"
                                        //             },
                                        //             credentials: "include",
                                        //             body: JSON.stringify({ requestBody: {
                                        //                 "request": {
                                        //                 "brandMID": "Kultivated Karats",
                                        //                 "cardNumber": voucherOrGiftCardRef?.current?.value!,
                                        //                 "cardPIN": voucherOrGiftCardPinRef?.current?.value!,
                                        //                 // "orderId": "MERCHANT-ORDER-ID-1689584367474",
                                        //                 "sourceMerchantMid": "Levis1",
                                        //                 // "amount": 500,
                                        //                 "redemptionMetaData": {
                                        //                 "redeemerName": `${customerData?.firstName} ${customerData?.lastName}`,
                                        //                 "redeemerMobileNumber": `${customerData?.phoneNumber || null}`,
                                        //                 "redeemerEmailId": `${customerData?.email || ""}`,
                                        //                 // "redemptionStoreId":"pantaloonstore12345",
                                        //                 // "redemptionStoreName":"Pantaloon sec 18 Noida",
                                        //                 // "invoiceNumber":"12345678",
                                        //                 "invoiceAmount": cartTotal
                                        //                 }},
                                        //                 "source": "BRAND"
                                        //             }, clientId: "3e1a147b-d0fb-4208-8f8b-5fc390b29ac0", secretKey: "dd6f4141-2c56-49c9-9d87-bdfe18deec7f"}),
                                        //         });

                                        //         const responseJSON = await response.json();

                                        //         console.log(responseJSON);
                                            }
                                        } catch (error) {
                                            console.log(error);
                                        } finally {
                                            setTimeout(() => {
                                                setApplyVoucherCodeLoading(false);
                                                setVoucherError("Invalid coupon or PIN!");
                                            }, 1000);
                                        }
                                    }} variant={"ghost"}>{applyVoucherCodeLoading ? <Loader2 className="animate-spin w-4 aspect-square" /> : `Apply`}</Button>
                                </div>
                                {voucherError != "" && <p id="coupon-error" className="self-start w-[80%] inria-serif-regular text-red-500 text-xs">{voucherError}</p>}
                                <Button disabled={ cartItems?.length! <= 0 || isPlaceOrderButtonLoading } className="text-white bg-[#E1C6B3] w-[80%] self-center my-4 hover:bg-[#A68A7E] hover:text-white" onClick={ async (e) => {
                                    if ( customerData?._id == null )
                                         return navigate("/auth");
                                    if ( !customerData?.phoneNumber || customerData?.phoneNumber == undefined || customerData?.phoneNumber == null || Number.isNaN(customerData?.phoneNumber))
                                        return setPhoneDialogOpen(true);
                                    e.preventDefault();
                                    setIsPlaceOrderButtonLoading(true);
                                    if ( customerData?.address?.city == null )
                                        return navigate("/set-shipping");
                                    if ( customerData?.address?.city == null )
                                        return navigate("/set-shipping");
                                    try {
                                        
                                        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}payment/create-an-order/`, {
                                            method: "POST",
                                            headers: {
                                                "Content-Type": "application/json",
                                            },
                                            body: JSON.stringify({ options: {
                                                amount: (Math.round(cartTotal + ( cartTotal * (3 / 100))) * 100),
                                                // amount: (Math.round(100) * 100),
                                                currency: "INR",
                                            }}),
                                            credentials: "include"
                                        });
                                        // console.log(response);
                            
                                        if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
                                        
                                        const data = await response.json();
                                        // console.log(data, window.Razorpay);

                                        var options = {
                                            "key_id": import.meta.env.VITE_RAZORPAY_KEY_ID,
                                            "key": import.meta.env.VITE_RAZORPAY_KEY_ID,
                                            "amount": (Math.round(cartItems?.reduce((total, item) => {
                                                return total + item?.totalPrice * item?.quantity;
                                            }, 0)!) * 100),
                                            "currency": "INR",
                                            "name": "Kultivated karats",
                                            "description": "Test Transaction",
                                            "image": "https://example.com/your_logo",
                                            "order_id": data?.data?.id, 
                                            "handler": async function (res : any){
                                                try {
                                                    console.log(res);
                                                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}payment/order/validate`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({ 
                                                            razorpay_order_id: res.razorpay_order_id,
                                                            razorpay_payment_id: res.razorpay_payment_id, 
                                                            razorpay_signature: res.razorpay_signature,
                                                        }),
                                                        credentials: "include"
                                                    });
                                                    // console.log(response);
                                                    
                                                    if (!response.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
                                                    
                                                    console.log(res);

                                                    const data = await response.json();
                                                    console.log(data, response);

                                                    console.log(response);
                                                    const orderResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}orders/create-an-order`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                        },
                                                        body: JSON.stringify({ 
                                                            order: {
                                                                orderId: Math.round(Math.random() * 100000000 + 1),
                                                                customerId: customerData?._id,
                                                                total: (Math.round(cartItems?.reduce((total, item) => {
                                                                    return total + item?.totalPrice * item?.quantity;
                                                                }, 0)!) || 0),
                                                                // total: 0,
                                                                deliveryAddress: customerData?.address,
                                                                orderStatus: "Pending",
                                                                cart: customerData?.cart,
                                                            }
                                                        }),
                                                        credentials: "include"
                                                    });
                                                    // console.log(response);
                                                    
                                                    if (!orderResponse.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
                                                    
                                                    console.log(orderResponse);
                                                    
                                                    const orderData = await orderResponse.json();



                                                    const emailToCusomter = await sendEmail({ from: import.meta.env.VITE_FROM_EMAIL, to: [ customerData?.email, "rohraaaryan@gmail.com" ], subject : "Order placed at kultivated karats!", html:"Thank you for placing order at kultivated karats." });
                                                    const emailToOwner = await sendEmail({ from: import.meta.env.VITE_FROM_EMAIL, to: [ "info@kultivatedkarats.com", "sampathraj@ketandiamonds.com", "manishkumar@ketandiamonds.com", "deepaksagar@ketandiamonds.com", "mehek@kultivatedkarats.com", "rohraaaryan@gmail.com", "kultivatedkaratsarohance@gmail.com" ], subject : "Order received from kultivatedkarats.com!", html: getOrderEmailHtml() });

                                                    console.log(orderData, orderResponse, emailToCusomter, emailToOwner);
                                                    dispatch(setCustomerData(orderData?.data));
                                                    await clearCart(dispatch, customerData?._id ? true : false);
                                                    navigate("/payment-success");
                                                } catch (error) {
                                                    console.log(error);
                                                }
                                            },
                                            "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
                                                "name": `${customerData?.firstName} ${customerData?.lastName}`, //your customer's name
                                                "email": `${customerData?.email}`, 
                                                "contact": `${customerData?.phoneNumber || "0000000000"}`  //Provide the customer's phone number for better conversion rates 
                                            },
                                            // "notes": {
                                            //     "address": "Razorpay Corporate Office"
                                            // },
                                            "theme": {
                                                "color": "#BFA6A1"
                                            }
                                        };
                                        // var rzp1 = new Razorpay(options);
                                        const rzp = new (window as any).Razorpay(options);
                                        rzp.open();
                                        rzp.on("payment.failed", function (response: any) {
                                            console.log("payment failed")
                                            console.log(response)
                                        });
                                        // rzp.on("payment.success", async function (response: any) {

                                        // });

                                        e.preventDefault();
                                    } catch (error) {
                                        console.log(error);
                                    } finally {
                                        setIsPlaceOrderButtonLoading(false);
                                    }
                                }}>{isPlaceOrderButtonLoading ? <Loader2 className="animate-spin"/> : "Place order"}</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const CartItem = ({ cartItem, cartItems, dispatch, customerData, setCartItems } : { cartItem: ICartItem, cartItems: ICartItem[], dispatch: Dispatch, customerData: IUser, setCartItems: React.Dispatch<React.SetStateAction<ICartItem[]>> }) => {

    const [ isRemoveItemLoadingButton, setIsRemoveItemLoadingButton ] = useState(false);

    if (typeof cartItem == "object")

    return (    
        <div className="sm:text-base text-sm w-full relative overflow-y-visible! flex gap-4">
            <div className="relative sm:h-32 h-20 border-2 border-[#BFA6A1] aspect-square rounded-md">
                <img src={cartItem?.product?.imageUrl[0]?.url} className="object-cover rounded-[inherit] h-full w-full" alt="" />
                <Button disabled={isRemoveItemLoadingButton} variant={"ghost"} className="absolute z-30 rounded-full py-3 px-1 w-0 h-0 -translate-y-1/2 translate-x-1/2 right-0 top-0 bg-white text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" onClick={async (e) => {
                    e.preventDefault();
                    setIsRemoveItemLoadingButton(true);
                    const response = await updateCart({ containsGemstone: cartItem?.product?.containsGemstone , product: cartItem.product!, quantity: 1, color: "white", karat: 14, totalPrice: 0 }, false, false, cartItems, dispatch, customerData?._id ? true : false, customerData?.wishList, customerData?.videoCallCart);
                    setIsRemoveItemLoadingButton(false);
                    console.log(customerData?.cart, response)
                    setCartItems(customerData?.cart);
                    // setIsInVideoCallCart(false);
                    return toast.success("Product deleted from cart successfully!", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <Trash2 className="w-4 h-4 stroke-red-500" /> });            
                }}>{isRemoveItemLoadingButton ? <Loader2 className="w-2 h-2 animate-spin" /> : <Minus className="w-2 h-2" />}</Button>
            </div>
            <div className="flex-1 sm:bg-white border-2 border-[#BFA6A1] px-8 overflow-visible flex rounded-md text-[#A68A7E] inria-serif-regular">
                <div className="flex-1 sm:text-base text-sm flex flex-col justify-between items-start">
                    <p>{cartItem?.product?.name}</p>
                    {cartItem?.ringSize !==0 && <p>Ring size: {cartItem?.ringSize}</p>}
                    {/* {cartItem?.product?.productId! && <p>code: {cartItem?.product?.productId}</p>} */}

                </div>
                <div className="flex-1 flex flex-col justify-around items-end">
                    <p>₹{Math.round(cartItem?.totalPrice)}</p>
                    <p>Quantity: {cartItem?.quantity}</p>
                </div>
            </div>
        </div>
    );
}