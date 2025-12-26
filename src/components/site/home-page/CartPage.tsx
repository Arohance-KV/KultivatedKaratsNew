import { ICartItem, IUser } from "@/utils/interfaces";
import { UIsideBar } from "./Solitare";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { clearCart, sendEmail } from "@/utils/utilityFunctions";
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
import { removeCartItem } from "@/redux1/cartSlice";
import { applyCouponCode, applyVoucherCode, redeemPaytmGiftCard } from "@/utils/cartHelpers";
import { processPayment, validatePayment, createOrderInDB, encryptPaytmPin, redeemPaytmGiftCardAfterPayment } from "@/utils/paymentHelpers";

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
        const totalQuantity = cartItems?.reduce((total, item) => total + item?.quantity, 0) || 0;
        return (
            `<div style="width: 90%; height: auto; margin: 1rem; padding: 1rem; border: 1px solid #A68A7E; border-radius: 8px; color: #A68A7E;">
                <img src="/logo.svg">
                <p>Email: ${customerData?.email}</p>
                <p>Phone number: ${customerData?.phoneNumber}</p>
                <p>Name: ${customerData?.firstName} ${customerData?.lastName}</p>
                <p>Cart: [Total items : ${totalQuantity}]</p>
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
                                ${cartItem?.addChain && `Chain gold karat: ${cartItem?.chainGoldCarat}`}
                            </p>
                            <br>
                            <p>
                                ${cartItem?.ringSize! > 0 && `Ring size: ${cartItem?.ringSize}`}
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
                                Total: ${cartItem?.totalPrice * cartItem?.quantity}
                            </p>
                        </div>`
                    );
                }).join('')}
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
                            {cartItems?.map((cartItem: ICartItem) => (<CartItem dispatch={dispatch} cartItem={cartItem} cartItems={cartItems} setCartItems={setCartItems} />))}
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
                                    }} className="absolute border bg-white -translate-x-1/2 -translate-y-1/2 left-0 top-0 !h-auto !p-1 rounded-full">
                                        <X className="w-[4px] aspect-square" />
                                    </Button>}
                                    <Button disabled={couponDiscountRef?.current > 0 || applyCouponButtonLoading || couponApplied?.status } 
                                        onClick={ async (e) => {
                                            e.preventDefault();
                                            setApplyCouponButtonLoading(true);
                                            const code = couponApplied?.couponCode;
                                            setCouponError("");
                                            if ( code && code != "" ) {
                                                try {
                                                    const result = await applyCouponCode(dispatch, code, cartTotal, voucherApplied?.amount || 0);
                                                    if (result) {
                                                        setCouponApplied({ 
                                                            ...couponApplied, 
                                                            status: true, 
                                                            amount: result.amount,
                                                            couponCode: code
                                                        });
                                                    } else {
                                                        setCouponError("Failed to apply coupon");
                                                    }
                                                } catch (error: any) {
                                                    console.log(error);
                                                    setCouponError(error.message || "Failed to apply coupon");
                                                } finally {
                                                    setApplyCouponButtonLoading(false);
                                                }
                                            } else {
                                                console.log("request not sent, coupon code: "+code);
                                                setApplyCouponButtonLoading(false);
                                            }
                                        }} 
                                        className="border absolute border-dashed top-0 right-0" 
                                        variant={"ghost"}>
                                        {applyCouponButtonLoading ? <Loader2 className="stroke-[#A68A7E] animate-spin" /> : "Apply"}
                                    </Button>
                                    {couponError != "" && <p id="coupon-error" className="self-start mt-2 inria-serif-regular text-red-500 text-xs">{couponError}</p>}
                                </div>
                                <div className="relative w-[80%] flex flex-col gap-2">
                                    <div className="flex sm:gap-4 gap-2 relative">
                                        <Input disabled={voucherApplied?.status} value={voucherApplied?.GVorVoucherCode} onChange={(e) => {
                                            setVoucherApplied({ ...voucherApplied, GVorVoucherCode: e.target.value});
                                            if ( (e.target.value! + "").toLowerCase().startsWith("paytm") )
                                                return setIsPaytmcode(true);
                                            setIsPaytmcode(false);
                                        }} className="justify-self-center w-full border border-dashed" placeholder="Enter Voucher code/Giftcard code" />
                                        {voucherApplied?.status && <Button onClick={() => {
                                            setVoucherApplied({ amount: 0, GVorVoucherPin: undefined, GVorVoucherCode: "", status: false });
                                        }} className="absolute border bg-white -translate-x-1/2 -translate-y-1/2 left-0 top-0 !h-auto !p-1 rounded-full">
                                            <X className="w-[4px] aspect-square" />
                                        </Button>}
                                        {isPaytmCode && <Input maxLength={10} disabled={voucherApplied?.status} value={voucherApplied?.GVorVoucherPin} onChange={(e) => {
                                            setVoucherApplied({ ...voucherApplied, GVorVoucherPin: Number(e.target.value)});
                                        }} className="justify-self-center w-full border border-dashed" placeholder="Enter PIN" />}
                                        <Button disabled={applyVoucherCodeLoading || voucherApplied?.status} className="border absolute border-dashed top-0 right-0" onClick={ async (e) => {
                                            if ( customerData?._id == null )
                                                return navigate("/auth");
                                            if ( !customerData?.phoneNumber || customerData?.phoneNumber == undefined || customerData?.phoneNumber == null || Number.isNaN(customerData?.phoneNumber))
                                                return setPhoneDialogOpen(true);
                                            e.preventDefault();
                                            setVoucherError("");
                                            setApplyVoucherCodeLoading(true);
                                            try {
                                                let result = null;
                                                if ( isPaytmCode ) {
                                                    result = await redeemPaytmGiftCard(
                                                        voucherApplied?.GVorVoucherCode,
                                                        voucherApplied?.GVorVoucherPin?.toString() || "",
                                                        customerData,
                                                        cartTotal
                                                    );
                                                    if (result) {
                                                        setVoucherApplied({ ...voucherApplied, status: true, amount: result.amount, GVorVoucherPin: result.pin ? Number(result.pin) : undefined });
                                                    }
                                                } else {
                                                    result = await applyVoucherCode(
                                                        dispatch,
                                                        voucherApplied?.GVorVoucherCode,
                                                        cartTotal,
                                                        customerData?._id,
                                                        couponApplied?.amount || 0
                                                    );
                                                    if (result) {
                                                        setVoucherApplied({ ...voucherApplied, status: true, GVorVoucherCode: result.code, amount: result.amount, GVorVoucherPin: undefined });
                                                    }
                                                }
                                            } catch (error) {
                                                console.log(error);
                                            } finally {
                                                setApplyVoucherCodeLoading(false);
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
                                    
                                    try {
                                        const subtotal = cartItems?.reduce((total, item) => {
                                            return total + item?.totalPrice * item?.quantity;
                                        }, 0) || 0;
                                        const gst = subtotal * (3 / 100);
                                        const finalAmount = Math.round((subtotal + gst) - couponApplied?.amount - voucherApplied?.amount);

                                        // Initialize Razorpay payment with handler
                                        const razorpayInstance = await processPayment(
                                            cartItems,
                                            cartTotal,
                                            customerData,
                                            couponApplied?.amount || 0,
                                            voucherApplied?.amount || 0,
                                            async (res: any) => {
                                                try {
                                                    // Validate payment
                                                    const validationData = await validatePayment({
                                                        razorpay_order_id: res.razorpay_order_id,
                                                        razorpay_payment_id: res.razorpay_payment_id,
                                                        razorpay_signature: res.razorpay_signature,
                                                    });

                                                    if (!validationData) {
                                                        throw new Error("Payment validation failed");
                                                    }

                                                    // Create order in database
                                                    const orderData = await createOrderInDB({
                                                        order: {
                                                            orderId: Math.round(Math.random() * 100000000 + 1),
                                                            customerId: customerData?._id || "",
                                                            total: finalAmount,
                                                            deliveryAddress: customerData?.address || {} as any,
                                                            orderStatus: "Pending",
                                                            cart: customerData?.cart,
                                                        }
                                                    });

                                                    if (!orderData) {
                                                        throw new Error("Failed to create order");
                                                    }

                                                    // Handle Paytm gift card redemption if applicable
                                                    if (voucherApplied?.status && voucherApplied?.GVorVoucherPin) {
                                                        const encryptedPin = await encryptPaytmPin(String(voucherApplied.GVorVoucherPin));
                                                        if (encryptedPin) {
                                                            await redeemPaytmGiftCardAfterPayment({
                                                                brandMID: "PaytmGvTestBrand",
                                                                cardNumber: voucherApplied?.GVorVoucherCode,
                                                                cardPIN: encryptedPin,
                                                                orderId: "MERCHANT-ORDER-ID-1689584367474",
                                                                sourceMerchantMid: "PaytmGvTestReseller",
                                                                amount: voucherApplied?.amount,
                                                                redemptionMetaData: {
                                                                    redeemerName: `${customerData?.firstName} ${customerData?.lastName}`,
                                                                    redeemerMobileNumber: String(customerData?.phoneNumber || ""),
                                                                    redeemerEmailId: customerData?.email || "",
                                                                    invoiceAmount: cartTotal
                                                                },
                                                                source: "BRAND"
                                                            });
                                                        }
                                                    }

                                                    // Send confirmation emails
                                                    await sendEmail({ 
                                                        from: import.meta.env.VITE_FROM_EMAIL, 
                                                        to: [ customerData?.email, "rohraaaryan@gmail.com" ], 
                                                        subject: "Order placed at kultivated karats!", 
                                                        html: "Thank you for placing order at kultivated karats." 
                                                    });
                                                    await sendEmail({ 
                                                        from: import.meta.env.VITE_FROM_EMAIL, 
                                                        to: [ "info@kultivatedkarats.com", "sampathraj@ketandiamonds.com", "manishkumar@ketandiamonds.com", "deepaksagar@ketandiamonds.com", "mehek@kultivatedkarats.com", "rohraaaryan@gmail.com", "kultivatedkaratsarohance@gmail.com" ], 
                                                        subject: "Order received from kultivatedkarats.com!", 
                                                        html: getOrderEmailHtml() 
                                                    });

                                                    // Complete order flow
                                                    dispatch(setCustomerData(orderData?.data));
                                                    await clearCart(dispatch, customerData?._id ? true : false);
                                                    navigate("/payment-success");
                                                } catch (error) {
                                                    console.error("Payment handler error:", error);
                                                    toast.error("Error processing payment. Please contact support.", {
                                                        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white"
                                                    });
                                                }
                                            }
                                        );

                                        if (!razorpayInstance) {
                                            setIsPlaceOrderButtonLoading(false);
                                        }
                                    } catch (error) {
                                        console.error("Payment processing error:", error);
                                        toast.error("Error initiating payment. Please try again.", {
                                            className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white"
                                        });
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


const CartItem = ({ cartItem, cartItems, dispatch, setCartItems } : { cartItem: ICartItem, cartItems: ICartItem[], dispatch: Dispatch, setCartItems: React.Dispatch<React.SetStateAction<ICartItem[]>> }) => {

    const [ isRemoveItemLoadingButton, setIsRemoveItemLoadingButton ] = useState(false);

    if (typeof cartItem == "object")

    return (    
        <div className="sm:text-base text-sm w-full relative overflow-y-visible! flex gap-4">
            <div className="relative sm:h-32 h-20 border-2 border-[#BFA6A1] aspect-square rounded-md">
                <img src={cartItem?.product?.imageUrl?.[0]?.url} className="object-cover rounded-[inherit] h-full w-full" alt="" />
                <Button disabled={isRemoveItemLoadingButton} variant={"ghost"} className="absolute z-30 rounded-full py-3 px-1 w-0 h-0 -translate-y-1/2 translate-x-1/2 right-0 top-0 bg-white text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" onClick={async (e) => {
                    e.preventDefault();
                    setIsRemoveItemLoadingButton(true);
                    try {
                        const productId = cartItem.product?._id || "";
                        const result = await dispatch(removeCartItem(productId) as any);
                        if (result.type === removeCartItem.fulfilled.type) {
                            setCartItems(cartItems.filter(item => item.product?._id !== cartItem.product?._id));
                            toast.success("Product deleted from cart successfully!", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", icon: <Trash2 className="w-4 h-4 stroke-red-500" /> });
                        } else {
                            toast.error("Failed to remove product from cart", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white" });
                        }
                    } catch (error) {
                        toast.error("Error removing product", { className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white" });
                    } finally {
                        setIsRemoveItemLoadingButton(false);
                    }
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