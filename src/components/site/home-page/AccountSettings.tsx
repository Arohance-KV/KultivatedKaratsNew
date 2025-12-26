import { useEffect, useState } from "react";
import { UIsideBar } from "./Solitare";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
// import { IUser } from "@/utils/interfaces"; // COMMENTED OUT - OLD
import { Check, Loader2, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import { resetCustomerData, setCustomerData } from "@/redux/slices/websiteSlice"; // COMMENTED OUT - OLD
// import { googleLogout } from "@react-oauth/google"; // COMMENTED OUT - OLD

// NEW: Import auth slice
import { fetchProfile, updateProfile, logout as logoutAction } from "@/redux1/authSlice";
import type { AppDispatch, RootState } from "@/redux1/store";

const OPTIONS = [ "Shipping Details", "Orders", "Video Calls", "Giftcards/vouchers", "Personal details" ];

const formSchema = z.object({
    city: z.string().min(1, "Field is required!"),
    state: z.string().min(1, "Field is required!"),
    postalCode: z.string().min(6, "Postal code must be at least 6 characters!"),
    addressLine1: z.string().min(1, "Field is required!"),
    addressLine2: z.string().optional(),
    company: z.string().optional(),
    phoneNumber: z
        .string()
        .min(10, { message: "Phone number must be at least 10 digits" })
        .max(15, { message: "Phone number can't exceed 15 digits" })
        .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }).optional(),
});

export const AccountSettings = () => {
    const shippingAddressFrom = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    // OLD: const customerData: IUser = useSelector((state: any) => state.website.customerData);
    // NEW: Get user from auth slice
    const dispatch = useDispatch<AppDispatch>();
    const { user: customerData, isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

    const navigate = useNavigate();

    // NEW: Fetch profile on component mount
    useEffect(() => {
        if (isAuthenticated && !customerData) {
            dispatch(fetchProfile());
        }
    }, [dispatch, isAuthenticated, customerData]);

    useEffect(() => {
        if (!isAuthenticated) navigate("/auth");
    }, [ isAuthenticated ]);

    const [ currentOption, setCurrentOption ] = useState(4);
    const [ isLogoutButtonLoading, setIsLogoutButtonLoading ] = useState(false);
    const [ isShippingAddressButtonLoading, setIsShippingAddressButtonLoading ] = useState(false);

    // OLD: onShippingFormSubmit function commented out
    /*
    const onShippingFormSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        console.log("Form submited");
        setIsShippingAddressButtonLoading(true);
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-details`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "updateType": "self"
                },
                credentials: 'include',
                body: JSON.stringify({ user: { address: { ...values, postalCode: Number(values?.postalCode) } } })
            });
    
            if (!response.ok) {
                console.log(response)
                throw new Error("HTTP error! status: "+response.status);
            }
    
            console.log(response);
            
            const data = await response.json();
            
            dispatch(setCustomerData(data.data));
            console.log(data);
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsShippingAddressButtonLoading(false);
        } 
    }
    */

    // NEW: onShippingFormSubmit using new API
    const onShippingFormSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        console.log("Form submited");
        setIsShippingAddressButtonLoading(true);
        try {
            await dispatch(updateProfile({
                // Map form values to user profile structure
                // Note: You may need to adjust this based on your actual API structure
                phone: values.phoneNumber || customerData?.phone,
                // If your API supports address update, add it here
                // address: { ...values, postalCode: Number(values?.postalCode) }
            })).unwrap();
            console.log("Profile updated successfully");
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsShippingAddressButtonLoading(false);
        } 
    }

    const { handleSubmit } = shippingAddressFrom; 

    // OLD: logout function commented out
    /*
    const logout = async () => {
        setIsLogoutButtonLoading(true);
        try {
            googleLogout();
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
            });

            if (!response.ok) throw new Error("HTTP error! status: "+response.status);

            const data = await response.json();
            
            // navigate("/admin/auth");
            dispatch(resetCustomerData());
            localStorage.setItem("cart", JSON.stringify([]));
            localStorage.setItem("wishList", JSON.stringify([]));
            localStorage.setItem("videoCallCart", JSON.stringify([]));
            console.log(data);
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsLogoutButtonLoading(false);
        }
    }
    */

    // NEW: logout function using new API
    const logout = async () => {
        setIsLogoutButtonLoading(true);
        try {
            dispatch(logoutAction());
            localStorage.setItem("cart", JSON.stringify([]));
            localStorage.setItem("wishList", JSON.stringify([]));
            localStorage.setItem("videoCallCart", JSON.stringify([]));
            navigate("/auth");
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsLogoutButtonLoading(false);
        }
    }

    // Show loading state
    if (loading && !customerData) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin h-12 w-12" />
            </div>
        );
    }

    return (
        <div className='w-full relative pb-14 inria-serif-regular'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div id='solitare-main' className="opacity-0 mt-64 gap-4 flex items-center w-[80%] justify-self-center rounded-tr-[100px] aspect-video">
                <div className="flex-[0.4] flex flex-col gap-8 justify-center items-center h-full w-full">
                    <div id='solitare-main' className="flex-[0.5] rounded-tr-[50px] h-[45%] bg-transparent border-2 border-[#BFA6A1] w-[90%]">
                    </div>
                    <div id='solitare-main' className="flex-[0.5] rounded-tr-[50px] h-[45%] text-white flex flex-col relative justify-evenly pl-8 bg-[#E1C6B3] w-[90%]">
                        <p onClick={(e) => {
                            e.preventDefault();
                            setCurrentOption(0);
                        }}>
                            Shipping details
                        </p>
                        <p onClick={(e) => {
                            e.preventDefault();
                            setCurrentOption(1);
                        }}>
                            Orders
                        </p>
                        <p onClick={(e) => {
                            e.preventDefault();
                            setCurrentOption(2);
                        }}>
                            Video calls
                        </p>
                        <p onClick={(e) => {
                            e.preventDefault();
                            setCurrentOption(3);
                        }}>
                            Giftcards/vouchers
                        </p>
                        <Button onClick={ async (e) => {
                            e.preventDefault();
                            await logout();
                        }} className="absolute right-5 bottom-5" variant={"ghost"}>
                            {isLogoutButtonLoading ? <Loader2 className="animate-spin" /> : <LogOut />}
                        </Button>
                    </div>
                </div>
                <div className="flex-[0.6] h-full w-full inria-serif-regular relative flex justify-end flex-col">
                    <div id='solitare-main' className="bg-[#E1C6B3] flex flex-col py-4 pt-10 px-8 rounded-tr-[100px] h-[100%] relative w-[100%]">
                        <div className="relative py-14 text-xl text-white flex w-fit items-center gap-4 self-end">
                            <div className="flex justify-center items-center">
                                <div className="w-56 h-[2px] bg-gradient-to-l from-white to-transparent"></div>
                                <div className="w-3 h-3 bg-white rounded-full"></div>
                            </div>
                            {OPTIONS[currentOption]}
                        </div>
                        <div className="flex-1">
                            {OPTIONS[currentOption] == "Shipping Details" && <div className="h-full">
                                <Form {...shippingAddressFrom}>
                                    <form className="flex-1 inria-serif-regular h-full text-white w-full p-[5%]" onSubmit={shippingAddressFrom?.handleSubmit(onShippingFormSubmit)}>
                                        <div className="flex-1 flex flex-col gap-6 ">
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem className='w-full h-1/2 flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>City</p>
                                                                <Input {...field} className='col-span-3' defaultValue={""} placeholder="" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem className='w-full h-1/2 flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>State</p>
                                                                <Input {...field} className='col-span-3' defaultValue={""} placeholder="" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="postalCode"
                                                render={({ field }) => (
                                                    <FormItem className='w-full h-1/2 flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Postal Code</p>
                                                                <Input {...field} className='col-span-3' defaultValue={""} placeholder="" type="number" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="addressLine1"
                                                render={({ field }) => (
                                                    <FormItem className='w-full h-1/2 flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Address Line 1</p>
                                                                <Input {...field} className='col-span-3' defaultValue={""} placeholder="" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="addressLine2"
                                                render={({ field }) => (
                                                    <FormItem className='w-full h-1/2 flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Address Line 2</p>
                                                                <Input defaultValue={""} {...field} className='col-span-3' placeholder="" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="company"
                                                render={({ field }) => (
                                                    <FormItem className='w-full h-1/2 flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Company</p>
                                                                <Input {...field} className='col-span-3' defaultValue={""} placeholder="" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="phoneNumber"
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
                                            <Button type="submit" variant={"ghost"} className="mt-14" >Save changes</Button>
                                        </div>
                                    </form>
                                </Form>    
                            </div>}
                            {OPTIONS[currentOption] == "Orders" && <div className="overflow-y-scroll flex flex-col gap-4 max-h-[450px] w-full">
                                {/* NOTE: Orders functionality - needs to be implemented based on your API */}
                                <p className="text-white">No orders available</p>
                                {/* OLD CODE COMMENTED:
                                {customerData?.orders?.map(order => (
                                    <div className="justify-between text-[#BFA6A1] p-[5%] rounded-md border border-[#BFA6A1] bg-white flex m-[10px]">
                                        <div className="bg-white flex flex-col gap-4">
                                            <p>Order ID: {order?.orderId}</p>
                                            <p>{order?.note}</p>
                                        </div>
                                        <div className="bg-white flex flex-col gap-4">
                                            <p>Status: {order?.orderStatus}</p>
                                            <p>Order total: {order?.total}</p>
                                        </div>
                                    </div>
                                ))}
                                */}
                            </div>}
                            {OPTIONS[currentOption] == "Video Calls" && <div className="max-h-full overflow-y-scroll">
                                {/* NOTE: Video Calls functionality - needs to be implemented based on your API */}
                                <p className="text-white">No video calls available</p>
                                {/* OLD CODE COMMENTED:
                                {customerData?.videoCalls?.map((videoCall) => (
                                    <div className="justify-between text-[#BFA6A1] p-[5%] rounded-md border border-[#BFA6A1] bg-white flex m-[10px]">
                                        <div className="bg-white flex flex-col gap-4">
                                            <p>Name: {videoCall?.name}</p>
                                            <p>Phone no: {videoCall?.phoneNo + ""}</p>
                                        </div>
                                        <div className="bg-white flex flex-col gap-4">
                                            <p>Status: {videoCall?.status}</p>
                                            <p>Email: {videoCall?.email}</p>
                                            <p>Created at: {videoCall?.createdAt}</p>
                                        </div>
                                    </div>
                                ))}
                                */}
                            </div>}
                            {OPTIONS[currentOption] == "Giftcards/vouchers" && <div className="text-white flex w-full h-[calc(100%-66px)]">
                                <div className="flex-1 max-h-[calc(100%-66px)]">
                                    <p className="self-center justify-self-center my-4">Giftcards</p>
                                    <div className="flex flex-col gap-4 w-full max-h-[calc(500%-66px)]">
                                        {/* NOTE: Giftcards functionality - needs to be implemented based on your API */}
                                        <p>No giftcards available</p>
                                        {/* OLD CODE COMMENTED:
                                        {customerData?.giftCards?.map(giftCard => {
                                            return (
                                            <div className="justify-between text-[#BFA6A1] p-[5%] rounded-md border border-[#BFA6A1] bg-white flex m-[10px]">
                                                <div className="bg-white flex flex-col gap-4">
                                                    <p>Recipient name : {giftCard?.recipientName}</p>
                                                    <p>Message : {giftCard?.message}</p>
                                                </div>
                                                <div className="bg-white flex flex-col gap-4">
                                                    <p className="text-nowrap flex gap-2">
                                                        Used: {giftCard?.used ? <Check /> : <X />}
                                                    </p>
                                                    <p>Price: {giftCard?.price}</p>
                                                </div>
                                            </div>
                                            );
                                        })}
                                        */}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className=" self-center justify-self-center my-4">Vouchers</p>
                                    <div className="overflow-y-scroll w-full h-[calc(100%-66px)]">
                                        <p>No vouchers available</p>
                                    </div>
                                </div>
                            </div>}
                            {OPTIONS[currentOption] == "Personal details" && <div className="h-full">
                                <Form {...shippingAddressFrom}>
                                    <form className="inria-serif-regular justify-between h-full text-white w-full p-[5%]" onSubmit={() => {}}>
                                        <div className="flex flex-col justify-evenly h-full overflow-y-visible">
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="phoneNumber"
                                                render={({ field }) => (
                                                    <FormItem className='w-full flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Phone number</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.phone || ""} placeholder="" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem className='w-full flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>First Name</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.firstName || ""} placeholder="" disabled />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem className='w-full flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Last Name</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.lastName || ""} placeholder="" disabled />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="postalCode"
                                                render={({ field }) => (
                                                    <FormItem className='w-full flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Email</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.email || ""} placeholder="" disabled />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" variant={"ghost"} className="mt-14" onClick={(e) => {
                                                e.preventDefault();
                                                handleSubmit(onShippingFormSubmit)();
                                            }} >{isShippingAddressButtonLoading ? <Loader2 className="animate-spin" /> : "Save changes"}</Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>}
                        </div>
                        <div id='solitare-main' className="-top-[5%] -z-1 -right-[5%] rounded-tr-[100px] h-[100%] absolute bg-transparent border-2 border-[#BFA6A1] w-[100%]">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
