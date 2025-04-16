import { useEffect, useState } from "react";
import { UIsideBar } from "./Solitare";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "@/utils/interfaces";
import { Check, Loader2, LogOut, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { resetCustomerData } from "@/redux/slices/websiteSlice";
import { googleLogout } from "@react-oauth/google";

const OPTIONS = [ "Shipping Details", "Orders", "Video Calls", "Giftcards/vouchers", "Personal details" ];

const formSchema = z.object({
    city: z.string().min(1, "Field is required!"),
    state: z.string().min(1, "Field is required!"),
    postalCode: z.string().min(6, "Postal code must be at least 6 characters!"),
    addressLine1: z.string().min(1, "Field is required!"),
    addressLine2: z.string().min(1, "Field is required!"),
    company: z.string().optional(),
});

// const userDetailsFormSchema = z.object({
//     firstName: z.string().min(1, "Field is required!"),
//     lastName: z.string().min(1, "Field is required!"),
//     email: z.string().email("Please enter a valid email!"),
//     birthDate: z.string().optional(),
//     gender: z.string().optional(),
//     anivarsary: z.string().optional(),
//     spouseBirthday: z.string().optional(),
// });
// const orders : IOrder[] = [
//     {
//         orderId: "1",
//         customerId: "1",
//         total: 5000,
//         orderStatus: "Fulfilled",
//     },
//     {
//         orderId: "1",
//         customerId: "1",
//         total: 5000,
//         orderStatus: "Fulfilled",
//     },
//     {
//         orderId: "1",
//         customerId: "1",
//         total: 5000,
//         orderStatus: "Fulfilled",
//         note: "Hello"
//     },
// ];

// const videoCalls : {
//     name: String,
//     phoneNo: Number,
//     status: "Pending" | "Concluded" ,
//     email: String,
//     createdAt: String,
// }[] = [
//     {
//         name: "hello",
//         phoneNo: 1234567890,
//         status: "Pending",
//         email: "email",
//         createdAt: "Some time ago"
//     },
//     {
//         name: "hello",
//         phoneNo: 1234567890,
//         status: "Pending",
//         email: "email",
//         createdAt: "Some time ago"
//     },
//     {
//         name: "hello",
//         phoneNo: 1234567890,
//         status: "Pending",
//         email: "email",
//         createdAt: "Some time ago"
//     },
// ];

// const giftCard: IGiftCard = {
//     code: "code",
//     amount: 0,
//     occasion: "occasion",
//     recipientName: "name",
//     recipientEmail: "email",
//     recipientPhone: 0,
//     sender: "sender",
//     message: "message",
//     validUpto: "sometime in the future",
//     used: true,
//     price: 12,
//     imageUrl: {
//         url: "string",
//         publicId: "string"
//     }
// }

export const AccountSettings = () => {

    const shippingAddressFrom = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const customerData: IUser = useSelector((state: any) => state.website.customerData);

    const navigate = useNavigate();

    useEffect(() => {
        if ( customerData?._id == null) navigate("/auth"); 
    }, [ customerData ]);

    const [ currentOption, setCurrentOption ] = useState(4);

    const [ isLogoutButtonLoading, setIsLogoutButtonLoading ] = useState(false);

    const dispatch = useDispatch();

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

    return (
        <div className='w-full relative pb-14 inria-serif-regular'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div id='solitare-main' className="opacity-0 mt-64 gap-4 flex items-center w-[80%] justify-self-center rounded-tr-[100px] aspect-video">
                {/* <div className="w-full mt-14 text-center text-white ">
                    <p className="inria-serif-regular text-3xl">
                        Create your own solitare                    
                    </p>
                </div>
                 */}
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
                                    <form className="flex-1 inria-serif-regular h-full text-white w-full p-[5%]" onSubmit={() => {}}>
                                        <div className="flex-1 flex flex-col gap-6 ">
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem className='w-full h-1/2 flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>City</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.city} placeholder="" />
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
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.state} placeholder="" />
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
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.postalCode} placeholder="" type="number" />
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
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.line1} placeholder="" />
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
                                                                <Input defaultValue={customerData?.address?.line2} {...field} className='col-span-3' placeholder="" />
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
                                                                <p className='col-span-1'>Company</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.company} placeholder="" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" variant={"ghost"} className="mt-14" >Save changes</Button>
                                        </div>
                                    </form>
                                </Form>    
                            </div>}
                            {OPTIONS[currentOption] == "Orders" && <div className="overflow-y-scroll flex flex-col gap-4 max-h-[450px] w-full">
                                {/* {customerData?.orders?.map(order => ( */}
                                {customerData?.orders?.map(order => (
                                    <div className="justify-between text-[#BFA6A1] p-[5%] rounded-md border border-[#BFA6A1] bg-white flex m-[10px]">
                                        {/* {order?.total} */}
                                        <div className="bg-white flex flex-col gap-4">
                                            <p>
                                                Order ID: {order?.orderId}
                                            </p>
                                            <p>
                                                {order?.note}
                                            </p>
                                        </div>
                                        <div className="bg-white flex flex-col gap-4">
                                            <p>
                                                Status: {order?.orderStatus}
                                            </p>
                                            <p>
                                                Order total: {order?.total}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>}
                            {OPTIONS[currentOption] == "Video Calls" && <div className="max-h-full overflow-y-scroll">
                                {customerData?.videoCalls?.map((videoCall) => (
                                    <div className="justify-between text-[#BFA6A1] p-[5%] rounded-md border border-[#BFA6A1] bg-white flex m-[10px]">
                                        {/* {order?.total} */}
                                        <div className="bg-white flex flex-col gap-4">
                                            <p>
                                                Name: {videoCall?.name}
                                            </p>
                                            <p>
                                                Phone no: {videoCall?.phoneNo + ""}
                                            </p>
                                        </div>
                                        <div className="bg-white flex flex-col gap-4">
                                            <p>
                                                Status: {videoCall?.status}
                                            </p>
                                            <p>
                                                Email: {videoCall?.email}
                                            </p>
                                            <p>
                                                Created at: {videoCall?.createdAt}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>}
                            {OPTIONS[currentOption] == "Giftcards/vouchers" && <div className="text-white flex w-full h-[calc(100%-66px)]">
                                <div className="flex-1 max-h-[calc(100%-66px)]">
                                    <p className="self-center justify-self-center my-4">Giftcards</p>
                                    <div className="flex flex-col gap-4 w-full max-h-[calc(500%-66px)]">
                                        {customerData?.giftCards?.map(giftCard => {
                                            return (
                                            <div className="justify-between text-[#BFA6A1] p-[5%] rounded-md border border-[#BFA6A1] bg-white flex m-[10px]">
                                                <div className="bg-white flex flex-col gap-4">
                                                    <p>
                                                        Recipient name : {giftCard?.recipientName}
                                                    </p>
                                                    <p>
                                                        Message : {giftCard?.message}
                                                    </p>
                                                </div>
                                                <div className="bg-white flex flex-col gap-4">
                                                    <p className="text-nowrap flex gap-2">
                                                        Used: {giftCard?.used ? <Check /> : <X />}
                                                    </p>
                                                    <p>
                                                        Price: {giftCard?.price}
                                                    </p>
                                                </div>
                                            </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className=" self-center justify-self-center my-4">Vouchers</p>
                                    <div className="overflow-y-scroll w-full h-[calc(100%-66px)]"></div>
                                </div>
                            </div>}
                            {OPTIONS[currentOption] == "Personal details" && <div className="h-full">
                                <Form {...shippingAddressFrom}>
                                    <form className="inria-serif-regular justify-between h-full text-white w-full p-[5%]" onSubmit={() => {}}>
                                        <div className="flex flex-col justify-evenly h-full overflow-y-scroll">
                                            <FormField
                                                control={shippingAddressFrom.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem className='w-full flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>City</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.city} placeholder="" />
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
                                                                <p className='col-span-1'>State</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.state} placeholder="" />
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
                                                                <p className='col-span-1'>Postal Code</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.postalCode} placeholder="" type="number" />
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
                                                    <FormItem className='w-full flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Address Line 1</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.line1} placeholder="" />
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
                                                    <FormItem className='w-full flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Address Line 2</p>
                                                                <Input defaultValue={customerData?.address?.line2} {...field} className='col-span-3' placeholder="" />
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
                                                    <FormItem className='w-full flex flex-col'>
                                                        <FormControl className='w-full h-full'>
                                                            <div className='grid grid-cols-4 gap-4 items-center'>
                                                                <p className='col-span-1'>Company</p>
                                                                <Input {...field} className='col-span-3' defaultValue={customerData?.address?.company} placeholder="" />
                                                            </div>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <Button type="submit" variant={"ghost"} className="mt-14" >Save changes</Button>
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