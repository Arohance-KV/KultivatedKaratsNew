import { z } from "zod";
// import { Input } from "../ui/input";
import { UIsideBar } from "./home-page/Solitare"
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
// import { Button } from "../ui/button";
import { useEffect,
    //  useState
     } from "react";
// import { Loader2, LucideMail } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { setUser } from "@/redux/slices/userSlice";
import { useDispatch, useSelector } from "react-redux";
// import { setCustomerData } from "@/redux/slices/websiteSlice";
// import { GoogleLogin } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import { ICartItem, IUser } from "@/utils/interfaces";
import { setCustomerData } from "@/redux/slices/websiteSlice";
import { toast } from "sonner";
import { ToastSuccess } from "@/utils/UtilityComponents";
import { updateCart } from "@/utils/utilityFunctions";
// import { updateCart, updateVideoCallCart, updateWishList } from "@/utils/utilityFunctions";
// import { InputOTP, InputOTPGroup, InputOTPSlot } from "../ui/input-otp";
// import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";


export const otpFormSchema = z.object({
    phoneNumber: z.coerce.number(({ invalid_type_error: "Please enter a valid number." })).min( 10, { message: "Phone no should be 10 digits!"}),
})

export const loginFormSchema = z.object({
    phoneNumber: z.coerce.number(({ invalid_type_error: "Please enter a valid number." })).min( 10, { message: "Phone no should be 10 digits!"}),
    otp: z.string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "OTP must be a number" }),
});

export const signUpFormSchema = z.object({
    email: z.string().email("Invalid email, enter a valid email address!"),
    // password: z.string().min(8, { message: "Password must be 8 characters long"}).refine((password) => /[a-z]/.test(password), { message: "Password must contain at least one lower case character!"}).refine((password) => /[A-Z]/.test(password), { message: "Password must contain at least one upper case character!"}).refine((password) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(password), { message: "Password must contain at least one special character!"}).refine((password) => /[0-9]/.test(password), { message: "Password must contain at least one numberic value!"}),
    firstName: z.string().min(1, { message: "Mandatory field!"}),
    lastName: z.string().min(1, { message: "Mandatory field!"}),
    phoneNumber: z.coerce.number(({ invalid_type_error: "Please enter a valid number." })).min( 10, { message: "Phone no should be 10 digits!"}),
    otp: z.string()
    .min(6, "OTP must be 6 digits")
    .max(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val), { message: "OTP must be a number" }),
});

export const Auth = () => {

    const customerData: IUser = useSelector((state: any) => state.website.customerData);

    useEffect(() => {
        // if ( customerData?._id != null) navigate("/account-details"); 
        if ( customerData?._id != null) navigate("/"); 
    }, [ customerData ]);
    
    const dispatch = useDispatch();

    // const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    //     resolver: zodResolver(loginFormSchema),
    //     defaultValues: {
    //         // email: "",
    //         // password: ""
    //     }
    // });

    // const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    //     resolver: zodResolver(signUpFormSchema),
    //     defaultValues: {
    //         email: "",
    //         // password: "",
    //         firstName: "",
    //         lastName: "",
    //         // phoneNo: "",
    //     }
    // });

    // const sendOtpForm = useForm<z.infer<typeof otpFormSchema>>({
    //     resolver: zodResolver(otpFormSchema),
    // });

    const navigate = useNavigate();

    // const [ isAuthButtonLoading, setIsAuthButtonLoading ] = useState(false);  

    // const onSignupFormSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    //     setIsAuthButtonLoading(true);
    //     console.log(values);

    //     try {
    //         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/register`, {
    //           method: "POST",
    //           headers: {
    //               "Content-Type": "application/json",
    //           },
    //           credentials: 'include',
    //           body: JSON.stringify({userData: {...values, role: "Customer"}})
    //         });
      
    //         const data = await response.json();
    //         console.log(data);
      
    //         if ( !response.ok ){
    //           // productCreateForm.setError(data.type, { type: "manual", message: data?.errorMessage });
    //           if ( data?.errors[0]?.type !== undefined )
    //             data.errors.map((err: any) => {
    //               signUpForm.setError(err.type, { type: "manual", message: err.message });
    //             });
    //             console.log(data.errors);
    //           throw new Error(`${data.statusCode}, ${data}`);
    //         }

    //         dispatch(setCustomerData(data.data));
    //         navigate("/");
    //     } catch (error: any) {
    //         console.error(error);
    //         // toast.error("Failed to create user!", { description: (error?.errors[0]?.message || ""), icon: <ToastFaliure /> });
    //     } finally {
    //         setIsAuthButtonLoading(false);
    //     }
    // };

    // const onLoginFormSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    //     setIsAuthButtonLoading(true);
    //     try {
            
    //         // @ts-ignore
    //         const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/login`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: 'include',
    //             body: JSON.stringify({ phone: values?.phoneNumber, otp: values?.otp })
    //         });
    
    //         if (!response.ok) {
    //             const errData = await response.json();
    //             console.log(errData)
    //         //     loginForm.setError(errData.errors[0].type, {type: "manual", message: errData.errors[0].errMsg})
    //             throw new Error("HTTP error! status: "+response.status);
    //         }
    
    //         console.log(response);
            
    //         const data = await response.json();
    
    //         // if ( data.data.user.role !== "Admin" ) {
    //         //     loginForm.setError("email", { type: "manual", message: "Unauthorized user!"})
    //         //     throw new Error("Unauthorized user");
    //         // }
    //         console.log(data);
            
    //         dispatch(setCustomerData(data?.data?.user));
    //         navigate("/");
    //     } catch (error) {
    //         console.error("Error: ", error);
    //     } finally {
    //         setIsAuthButtonLoading(false);
    //     } 
    // };

    // const onSendOtpFormSubmit = async (values: z.infer<typeof otpFormSchema>) => {
    //     setIsSendOtpLoading(true);
    //     try {
    //         const response = await fetch (`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}otp/send`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             credentials: 'include',
    //             body: JSON.stringify({ phone: values?.phoneNumber })
    //         });

    //         if (!response.ok) {
    //             console.log(response)
    //             throw new Error("HTTP error! status: "+response.status);
    //         } 

    //         const data = await response.json();

    //         console.log(data);
    //         setIsSendOtp(false);
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setIsSendOtpLoading(false);
    //     }
    // }

    // const [ isSignUp, setIsSignUp ] = useState(false);

    // const [ isSendOtp, setIsSendOtp ] = useState(true);

    // const [ isSendOtpLoading, setIsSendOtpLoading ] = useState(false);

    return (
        <div className='w-full relative pb-14'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div className="sm:bg-[#E1C6B3] sm:mt-56 mt-14 flex flex-col gap-8 justify-center items-center w-[60%] justify-self-center rounded-lg h-auto pb-8 aspect-video">
            <p className="text-[#A68A7E] text-4xl mt-[6%] text-center font-[Inria_Serif]">{"Sign in or create account"}</p>
            {/* <Button className="rounded-full text-white inria-serif-regular flex justify-center items-center gap-2 flex-row-reverse hover:bg-[#A68A7E] hover:text-[#E1C6B3] bg-white/30" variant={"ghost"} type="button" onClick={(e) => {
                e.preventDefault();
            }}><img src="/googleLogo.png" className="h-full aspect-square"/> Continue with google</Button> */}
                <GoogleLogin shape="circle" onSuccess={ async (credintialResponse) => {
                    try {
                        console.log(credintialResponse);
                        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/google/login`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: 'include',
                            body: JSON.stringify({ token: credintialResponse?.credential })
                        });
                
                        if (!response.ok) {
                            console.log(response)
                            throw new Error("HTTP error! status: "+response.status);
                        }
                
                        console.log(response);
                        
                        const data = await response.json();
                        
                        console.log(data);

                        const guestCart = JSON.parse(localStorage.getItem('cart')!);
                        // const guestVideoCallCart = JSON.parse(localStorage.getItem('videoCallCart')!);
                        // const guestWishList = JSON.parse(localStorage.getItem('wishList')!);

                        console.log(guestCart, guestCart?.length);

                        guestCart.forEach( async (item : ICartItem) => {
                            console.log(item, data?.data?.user?.cart);
                            return guestCart?.filter((cartItem : ICartItem) => cartItem?.product?._id == item?.product?._id)?.length > 0 ? updateCart(item, true, true, data?.data?.user?.cart, dispatch, true, data?.data?.user?.wishList, data?.data?.user?.videoCallCart) : updateCart(item, true, false, data?.data?.user?.cart, dispatch, true, data?.data?.user?.wishList, data?.data?.user?.videoCallCart);
                        });

                        // guestWishList.forEach((item : IWishListItem) => {
                        //     if ( guestWishList?.filter((wishListItem : IWishListItem) => wishListItem?.product?._id == item?.product?._id)?.length > 0 )
                        //         return
                        //     updateWishList(item, true, data?.data?.user?.wishList, dispatch, true, data?.data?.user?.cart, data?.data?.user?.videoCallCart);
                        // });

                        // guestVideoCallCart.forEach((item : ICartItem) => {
                        //     if ( guestVideoCallCart?.filter((cartItem : ICartItem) => cartItem?.product?._id == item?.product?._id)?.length > 0 )
                        //         return;
                        //     updateVideoCallCart(item, true, false, data?.data?.user?.cart, dispatch, true, data?.data?.user?.videoCallCart, data?.data?.user?.wishList);
                        // });

                        // const currentUserResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/current-user`, {
                        //     method: "GET",
                        //     headers: {
                        //         "Content-Type": "application/json",
                        //     },
                            // credentials: "include"
                        // });
                        // console.log(currentUserResponse);
              
                        // if (!currentUserResponse.ok) {
                        //   if ( currentUserResponse.statusText == "Unauthorized" || currentUserResponse.status == 401 ) {
                            // console.log(await createGuestUser());
                        //   }
                        //   throw new Error("HTTP error! status: "+currentUserResponse.status+", "+currentUserResponse.statusText);
                        // }
                        // const currentUserData = await currentUserResponse.json();
              
                        // console.log("currentUserData?.data: ", currentUserData?.data, "data?.data: ", data?.data);
              
                        // if (data.data.role !== "Customer") throw new Error(`Error: ${401}, Unauthorised user`);
                        // dispatch(setCustomerData(currentUserData.data));
              
                        dispatch(setCustomerData(data?.data?.user));
                        toast.success("Logged In successfully!", { icon: <ToastSuccess />, className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white" });
                        navigate("/");

                    } catch (error) {
                        console.log(error);
                    }
                }}/>
                {/* <p className="inria-serif-regular text-[#A68A7E] -my-4 text-xl">or</p> */}
                <div className="sm:w-[30%] w-full">
                    
                </div>
            </div>
        </div>
    )
};