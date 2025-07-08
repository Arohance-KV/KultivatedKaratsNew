import { ICartItem, IUser } from "@/utils/interfaces";
import { UIsideBar } from "./Solitare";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { clearCart, sendEmail, updateCart } from "@/utils/utilityFunctions";
import { Loader2, LucidePhone, Minus, Trash2, X } from "lucide-react";
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

    const voucherOrGiftCardRef = useRef("");
    const voucherOrGiftCardPinRef = useRef("");
    const [ couponError, setCouponError ] = useState("");
    const couponDiscountRef = useRef<number>(0);
    const [ couponApplied, setCouponApplied ] = useState<{
        status: boolean,
        couponCode: string,
        amount: number
    }>({ status: false, couponCode: "", amount: 0 });
    const [ voucherApplied, setVoucherApplied ]= useState<{
        status: boolean,
        GVorVoucherCode: string,
        GVorVoucherPin?: number,
        amount: number,
    }>({
        status: false,
        GVorVoucherCode: "",
        amount: 0
    });

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

    // useEffect(() => {
    //     setCartTotal(cartItems?.reduce((total, cartItem) => {
    //         return total + (cartItem?.totalPrice * cartItem?.quantity)
    //     }, 0) - couponApplied?.amount);
    // }, [ couponApplied, voucherApplied ]);

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
                                <p>Price : ₹{Math.round(cartTotal)}</p>
                            </div>
                            {couponApplied?.amount > 0 && <p className="uppercase w-[90%] mb-4 justify-self-center self-center flex justify-between">({couponApplied?.couponCode}) <span>- {couponApplied?.amount}</span></p>}
                            {voucherApplied?.amount > 0 && <p className="uppercase w-[90%] mb-4 justify-self-center self-center flex justify-between">({voucherApplied?.GVorVoucherPin ? "Paytm coupon" : "giftcard/voucher"}) <span>- {voucherApplied?.amount}</span></p>}
                            <div className="w-[90%] mb-4 flex justify-between justify-self-center self-center">
                                <p className="">+ 3% GST</p>
                                <p>₹{(Math.round((cartTotal) * (3 / 100)))}</p>
                            </div>
                            <div className="w-[90%] mb-4 self-center flex justify-between">
                                <p>Cart total</p>
                                <p>₹{Math.round((cartTotal + (cartTotal * (3 / 100))) - couponApplied?.amount - voucherApplied?.amount)}</p>
                            </div>
                            <div className="flex flex-col gap-4 justify-center items-center">
                                <div className="relative w-[80%]">
                                    <Input disabled={couponApplied.amount > 0 || applyCouponButtonLoading || couponApplied?.status} onChange={(e) => {
                                        setCouponApplied({ ...couponApplied, couponCode: e.target.value });
                                    }} value={couponApplied?.couponCode} className="justify-self-center w-full border border-dashed" placeholder="Enter coupon code" />
                                    {couponApplied?.status && <Button onClick={() => {
                                        setCouponApplied({ ...couponApplied, couponCode: "", status: false });
                                        voucherOrGiftCardRef.current = "";
                                    }} className="absolute border bg-white -translate-x-1/2 -translate-y-1/2 left-0 top-0 !h-auto !p-1 rounded-full">
                                        <X className="w-[4px] aspect-square" />
                                    </Button>}
                                    <Button disabled={couponDiscountRef?.current > 0 || applyCouponButtonLoading || couponApplied?.status } onClick={ async (e) => {
                                        e.preventDefault();
                                        setApplyCouponButtonLoading(true);
                                        const code = couponApplied?.couponCode;
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
                                                
                                                let discountAmount = (data?.data?.type == "fixed") ? (Number(data?.data?.discount) || 0) : ((Number(data?.data?.discount) * cartTotal) > data?.data?.upperLimit ? data?.data?.upperLimit : (Number(data?.data?.discount) * cartTotal));
                                                console.log(discountAmount)


                                                if ( (cartTotal - voucherApplied?.amount) < discountAmount)
                                                    discountAmount = cartTotal;
                                                console.log(data.data);
                                                setCouponApplied({ ...couponApplied, status: true, amount: discountAmount });
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
                                <div className="relative w-[80%] flex flex-col gap-2">
                                    <div className="flex sm:gap-4 gap-2 relative">
                                        <Input value={voucherApplied?.GVorVoucherCode} onChange={(e) => {
                                            setVoucherApplied({ ...voucherApplied, GVorVoucherCode: e.target.value});
                                            console.log(voucherOrGiftCardRef.current);
                                            if ( (e.target.value! + "").toLowerCase().startsWith("paytm") )
                                                return setIsPaytmcode(true);
                                            setIsPaytmcode(false);
                                        }} className="justify-self-center w-full border border-dashed" placeholder="Enter Voucher code/Giftcard code" />
                                        {voucherApplied?.status && <Button onClick={() => {
                                            setVoucherApplied({ amount: 0, GVorVoucherPin: 0, GVorVoucherCode: "", status: false });
                                            // voucherOrGiftCardRef.current = "";
                                        }} className="absolute border bg-white -translate-x-1/2 -translate-y-1/2 left-0 top-0 !h-auto !p-1 rounded-full">
                                            <X className="w-[4px] aspect-square" />
                                        </Button>}
                                        {isPaytmCode && <Input maxLength={10} value={voucherApplied?.GVorVoucherPin} onChange={(e) => {
                                            setVoucherApplied({ ...voucherApplied, GVorVoucherPin: Number(e.target.value)});
                                            console.log(voucherOrGiftCardPinRef.current);
                                        }} className="justify-self-center w-full border border-dashed" placeholder="Enter PIN" />}
                                        <Button className="border absolute border-dashed top-0 right-0" onClick={ async (e) => {
                                            if ( customerData?._id == null )
                                                return navigate("/auth");
                                            if ( !customerData?.phoneNumber || customerData?.phoneNumber == undefined || customerData?.phoneNumber == null || Number.isNaN(customerData?.phoneNumber))
                                                return setPhoneDialogOpen(true);
                                            e.preventDefault();
                                            setVoucherError("");
                                            setApplyVoucherCodeLoading(true);
                                            try {
                                                if ( isPaytmCode ) {
                                                    setVoucherError("");
                                                    const encryptedPinResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}paytm/encrypt-pin`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type" : "application/json"
                                                        },
                                                        credentials: "include",
                                                        body: JSON.stringify({ pin: (voucherApplied?.GVorVoucherPin + "") }),
                                                    });

                                                    const encryptedPinData = await encryptedPinResponse.json();

                                                    if ( !encryptedPinResponse.ok ) throw Error("Failed to encrypt PIN, please try again")

                                                    const encryptedPin = encryptedPinData.data;

                                                    const response =  await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}paytm/validate-giftcard`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type" : "application/json"
                                                        },
                                                        credentials: "include",
                                                        body: JSON.stringify({
                                                            "requestBody": {
                                                                "request": {
                                                                    "brandMID": "PaytmGvTestBrand",
                                                                    "cardNumber": voucherApplied?.GVorVoucherCode,
                                                                    "cardPIN": encryptedPin,
                                                                    "orderId": "MERCHANT-ORDER-ID-1689584367474",
                                                                    "sourceMerchantMid": "PaytmGvTestReseller",
                                                                    // "amount": 100,
                                                                    "redemptionMetaData": {
                                                                    "redeemerName": `${customerData?.firstName} ${customerData?.lastName}`,
                                                                    "redeemerMobileNumber": customerData?.phoneNumber || "",
                                                                    "redeemerEmailId": customerData?.email || "",
                                                                    // "redemptionStoreId":"pantaloonstore12345",
                                                                    // "redemptionStoreName":"Pantaloon sec 18 Noida",
                                                                    // "invoiceNumber":"12345678",
                                                                    "invoiceAmount": cartTotal
                                                                    },
                                                                    "source": "BRAND"
                                                                }
                                                            }
                                                        }),
                                                    });

                                                    const responseJSON = await response.json();

                                                    if ( !response.ok ) throw Error("Failed to redeem giftcard, please try again")
                                                        
                                                    console.log(responseJSON.data.statusMessage);

                                                    if ( responseJSON.data.status == "FAILURE" ) {
                                                        setVoucherError(responseJSON.data.statusMessage);
                                                        return;
                                                    }
                                                    if ( Number(responseJSON?.data?.response?.availableAmount) > cartTotal )
                                                        return setVoucherError("Giftcard amount greater than cart amount!");
                                                    // setVoucherOrGiftCardValid(true);
                                                    setVoucherError("");
                                                    setVoucherApplied({ ...voucherApplied, status: responseJSON?.data?.status == "FAILURE" ? false : true, amount: responseJSON?.data?.response?.availableAmount || 0 });
                                                }
                                            } catch (error) {
                                                console.log(error);
                                            } finally {
                                                setApplyVoucherCodeLoading(false);
                                                // setVoucherError("");
                                            }
                                        }} variant={"ghost"}>{applyVoucherCodeLoading ? <Loader2 className="animate-spin w-4 aspect-square" /> : `Apply`}</Button>
                                    </div>
                                    {voucherError != "" && <p id="coupon-error" className="w-full inria-serif-regular text-red-500 text-xs">{voucherError}</p>}
                                </div>
                                <Button disabled={ cartItems?.length! <= 0 || isPlaceOrderButtonLoading } className="text-white bg-[#E1C6B3] w-[80%] self-center my-4 hover:bg-[#A68A7E] hover:text-white" onClick={ async (e) => {
                                    if ( customerData?._id == null )
                                         return navigate("/auth");
                                    if ( !customerData?.phoneNumber || customerData?.phoneNumber == undefined || customerData?.phoneNumber == null || Number.isNaN(customerData?.phoneNumber))
                                        return setPhoneDialogOpen(true);
                                    e.preventDefault();
                                    setIsPlaceOrderButtonLoading(true);
                                    if ( customerData?.address?.city == null )
                                        return navigate("/set-shipping");
                                    // if ( customerData?.address?.city == null )
                                    //     return navigate("/set-shipping");
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
                                            "amount": (Math.round((cartItems?.reduce((total, item) => {
                                                return total + item?.totalPrice * item?.quantity;
                                            }, 0)!) - couponApplied?.amount - voucherApplied?.amount) * 100),
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

                                                    const encryptedPinResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}paytm/encrypt-pin`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type" : "application/json"
                                                        },
                                                        credentials: "include",
                                                        body: JSON.stringify({ pin: voucherOrGiftCardPinRef?.current }),
                                                    });

                                                    const encryptedPinData = await encryptedPinResponse.json();

                                                    if ( !encryptedPinResponse.ok ) throw Error("Failed to encrypt PIN, please try again")

                                                    const encryptedPin = encryptedPinData.data;

                                                    const GVresponse =  await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}paytm/redeem-giftcard`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type" : "application/json"
                                                        },
                                                        credentials: "include",
                                                        body: JSON.stringify({
                                                            "requestBody": {
                                                                "request": {
                                                                    "brandMID": "PaytmGvTestBrand",
                                                                    "cardNumber": voucherApplied?.GVorVoucherCode,
                                                                    "cardPIN": encryptedPin,
                                                                    "orderId": "MERCHANT-ORDER-ID-1689584367474",
                                                                    "sourceMerchantMid": "PaytmGvTestReseller",
                                                                    "amount": voucherApplied?.amount,
                                                                    "redemptionMetaData": {
                                                                    "redeemerName": `${customerData?.firstName} ${customerData?.lastName}`,
                                                                    "redeemerMobileNumber": customerData?.phoneNumber || "",
                                                                    "redeemerEmailId": customerData?.email || "",
                                                                    "invoiceAmount": cartTotal
                                                                    },
                                                                    "source": "BRAND"
                                                                }
                                                            }
                                                        }),
                                                    });

                                                    if ( !GVresponse.ok ) throw Error("Failed to redeem giftcard");

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
                                            modal: {
                                                ondismiss: async function () {
                                                    console.log("Modal closed by user");
                                                    // const response =  await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}paytm/redeem-giftcard`, {
                                                    //     method: "POST",
                                                    //     headers: {
                                                    //         "Content-Type" : "application/json"
                                                    //     },
                                                    //     credentials: "include",
                                                    //     body: JSON.stringify({
                                                    //         "requestBody": {
                                                    //             "request": {
                                                    //                 "brandMID": "PaytmGvTestBrand",
                                                    //                 "cardNumber": voucherOrGiftCardRef.current,
                                                    //                 // "cardPIN": encryptedPin,
                                                    //                 "orderId": "MERCHANT-ORDER-ID-1689584367474",
                                                    //                 "sourceMerchantMid": "PaytmGvTestReseller",
                                                    //                 "amount": 100,
                                                    //                 "redemptionMetaData": {
                                                    //                 "redeemerName": `${customerData?.firstName} ${customerData?.lastName}`,
                                                    //                 "redeemerMobileNumber": customerData?.phoneNumber || "",
                                                    //                 "redeemerEmailId": customerData?.email || "",
                                                    //                 // "redemptionStoreId":"pantaloonstore12345",
                                                    //                 // "redemptionStoreName":"Pantaloon sec 18 Noida",
                                                    //                 // "invoiceNumber":"12345678",
                                                    //                 "invoiceAmount": cartTotal
                                                    //                 },
                                                    //                 "source": "BRAND"
                                                    //             }
                                                    //         }
                                                    //     }),
                                                    // });

                                                    // const responseJSON = await response.json();

                                                    // if ( !response.ok ) throw Error("Failed to redeem giftcard, please try again")
                                                        
                                                    // console.log(responseJSON.data.statusMessage);

                                                    // if ( responseJSON.data.status == "FAILURE" ) {
                                                    //     setVoucherError(responseJSON.data.statusMessage);
                                                    //     return;
                                                    // }
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
                <img src={cartItem?.product?.imageUrl?.[0]?.url} className="object-cover rounded-[inherit] h-full w-full" alt="" />
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
                <div className="flex-1 sm:text-base text-sm flex flex-col justify-around items-start">
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