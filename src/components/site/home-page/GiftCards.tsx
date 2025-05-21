// import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormMessage } from '../../ui/form';
// import { RadioGroup, RadioGroupItem } from '../../ui/radio-group';
// import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Button } from '../../ui/button';
// import { Checkbox } from '../../ui/checkbox';
import { cn } from '../../../lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { IUser } from '@/utils/interfaces';
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ToastSuccess } from '@/utils/UtilityComponents';
import { setCustomerData } from '@/redux/slices/websiteSlice';

const GIFTCARDS = [
    {
        name: "Congratulations",
        image: "/KultivatedKaratsAssets/congratulations-gift-card.png"
    },
    {
        name: "Thank you",
        image: "/KultivatedKaratsAssets/thank-you-gift-card.png"
    },
    {
        name: "Happy Aniversary",
        image: "/KultivatedKaratsAssets/happy-aniversary-gift-card.png"
    },
    {
        name: "Happy Birthday",
        image: "/KultivatedKaratsAssets/happy-birthday.png"
    },
    {
        name: "Custom",
        image: "/KultivatedKaratsAssets/default-gift-card.png"
    },
    {
        name: "Best Wishes",
        image: "/KultivatedKaratsAssets/best-wishes-gift-card.png"
    },
];
  
enum GiftCardNames {
    CONGRATULATIONS = "Congratulations",
    THANK_YOU = "Thank you",
    HAPPY_ANNIVERSARY = "Happy Aniversary",
    HAPPY_BIRTHDAY = "Happy Birthday",
    CUSTOM = "Custom",
    BEST_WISHES = "Best Wishes",
};

// enum Shapes {
//     Round = 'Round',
//     Pear = 'Pear',
//     Heart = 'Heart',
//     Princess = 'Princess',
//     Marquise = 'Marquise',
//     Oval = 'Oval',
//     Emerald = 'Emerald',
//     Radiant = 'Radiant',
//     Cushion = 'Cushion',
// };
  
// enum Colour {
//     D = 'D',
//     E = 'E',
//     F = 'F',
// };
  

const formSchema = z.object({
    email: z.string().email('Enter a valid email address!').min(0), // Add email validation
    giftCardDesign: z.nativeEnum(GiftCardNames, {
      required_error: 'Select a giftcard!!',
    }),
    name: z.string(),
    amount: z.coerce.number({
      required_error: 'Carat is required!',
      invalid_type_error: 'Enter a valid number!',
    }),
    phoneNo: z.coerce
      .number({
        required_error: 'Phone number is required!',
        invalid_type_error: 'Enter a valid number!',
      })
      .refine(
        (value) => {
          // Ensure the phone number contains only digits and is of valid length
          const phoneRegex = /^[0-9]{10}$/;
          return phoneRegex.test(value + '');
        },
        {
          message: 'Invalid phone number. It must only contain 10 digits!.',
        }
      ),
    message: z.string().optional(),
});
  
export const UIsideBar = ({ side } : { side : "left" | "right" }) => {
    return (
        <>
            <div className={cn('w-[50px] sm:block hidden -top-[5%] absolute bottom-0 bg-[#BFA6A173] rounded-tr-full z-[5]', side == "left" ? "left-0 " : "right-0 -scale-x-[1]")} />
            <div className={cn('w-[calc(0.75*50px)] sm:block hidden -top-[5%] bottom-0 absolute bg-[#BFA6A1A6] rounded-tr-full z-[10]', side == "left" ? "left-0" : "right-0 -scale-x-[1]")} />
            <div className={cn('w-[calc(0.5*50px)] -top-[5%] bottom-0 sm:block hidden absolute bg-[#BFA6A1] rounded-tr-full z-[15]', side == "left" ? "left-0" : "right-0 -scale-x-[1]")} />
        </>
    );
}

export const GiftCards = () => {

    const navigate = useNavigate();

    const customerData: IUser = useSelector((state: any) => state.website.customerData);
    const dispatch = useDispatch();

    const [ isSubmitButtonLoading, setIsSubmitButtonLoading ] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        // defaultValues: {
        //   shape: Shapes.Round, // Default value
        // },
    });
    
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        setIsSubmitButtonLoading(true);

        if ( customerData?._id == null ) return navigate("/auth");

        try {

            const paymentResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}payment/create-an-order/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ options: {
                    amount: (values?.amount * 100),
                    currency: "INR",
                }}),
                credentials: "include"
            });

            if (!paymentResponse.ok) throw new Error("HTTP error! status: "+paymentResponse.status+", "+paymentResponse.statusText);

            const paymentData = await paymentResponse.json();

            var options = {
                "key_id": import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                "key": import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                // "key_id": "rzp_test_2KRjU8skvbLEYt", // Enter the Key ID generated from the Dashboard
                "amount": (values?.amount * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                "currency": "INR",
                "name": "Kultivated karats", //your business name
                "description": "Test Transaction",
                "image": `/logo.png`,
                "order_id": paymentData?.data?.id,
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

                        const giftCardCreationResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}giftcards/create-a-gift-card`, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: 'include',
                            body: JSON.stringify({ giftCardData : {
                                code: `${uuidv4().split("-")[0]}-${Date.now().toString(36)}`.toUpperCase(),
                                amount: values?.amount,
                                occasion: values?.giftCardDesign,
                                recipientName: values?.name,
                                recipientEmail: values?.email,
                                recipientPhone: values?.phoneNo,
                                sender: customerData,
                                message: values?.message ? values?.message : "",
                                validUpto: new Date().setFullYear(new Date().getFullYear() + 1),
                                used: false,
                                imageUrl: [ {
                                    url: GIFTCARDS?.filter(giftCard => {
                                        return giftCard?.name?.trim()?.toLowerCase() == values?.giftCardDesign?.trim()?.toLowerCase()
                                    })[0]?.image,
                                    publicId: "none"
                                } ]
                            }}),
                        });

                        if (!giftCardCreationResponse.ok) throw new Error("HTTP error! status: "+response.status+", "+response.statusText);
                        
                        console.log(giftCardCreationResponse);
                        
                        const giftCardResponse = await giftCardCreationResponse.json();
                        console.log( giftCardResponse , giftCardCreationResponse );
                        dispatch(setCustomerData(giftCardResponse?.data?.user));
                        // await clearCart(dispatch, customerData?._id ? true : false);
                        toast.success("Giftcard added successfully!", { icon: <ToastSuccess />, className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white" });
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

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (error) {
            console.log(error);
        } finally {
            setIsSubmitButtonLoading(false);
        }
    };

    const [ selectedGiftCard, setSelectedGiftCards ] = useState("");

    return (
        <div className='w-full relative pb-28 sm:text-white!'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div className="sm:bg-[#E1C6B3] sm:mt-56 mt-14 gap-4 flex flex-col items-center w-full sm:w-[80%] justify-self-center rounded-tr-[100px] aspect-video">
                <div className="w-full mt-14 text-center sm:text-white text-[#E1C6B3]">
                    <p className="inria-serif-regular text-3xl">
                        Gift cards                   
                    </p>
                </div>
                <Form {...form}>
                    <form className="flex-1 inria-serif-regular gap-8 sm:text-white text-[#E1C6B3] w-full p-[5%] flex-col sm:flex-row flex" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex-[0.75]">
                            <FormField
                                control={form.control}
                                name="giftCardDesign"
                                render={({ field }) => (
                                <FormItem className='h-full'>
                                    <FormControl>
                                    <div id="card" className="flex h-full gap-5 flex-col">
                                        <p className='text-center'>Select a gift card</p>
                                        <RadioGroup
                                            {...field}
                                            value={field.value} // Bind to form state
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedGiftCards(value);
                                            }} 
                                            className="grid grid-cols-2 max-h-full h-full gap-4"
                                        >
                                            {GIFTCARDS.map((card) => (
                                                <Label
                                                key={card.name}
                                                htmlFor={card.name} // Connect label to radio input
                                                className={cn("bg-white peer-checked:text-white text-[#E1C6B3] flex flex-col pt-2 gap-2 justify-between items-center sm:border-white border border-[#E1C6B3] rounded-lg aspect-video col-span-1 cursor-pointer peer-checked:border-[#D4A373] peer-checked:bg-[#E1C6B3]", selectedGiftCard == card?.name && "shadow-lg !border-2 !border-red-300")}
                                                >
                                                <RadioGroupItem
                                                    id={card.name} // Ensure unique ID
                                                    value={card.name} // Ensure correct value
                                                    className="peer hidden" // Keep it functional but visually hidden
                                                />
                                                {card.name}
                                                <img
                                                    src={card.image}
                                                    alt={card.name}
                                                    className="w-full h-full rounded-[inherit] self-end bg-white"
                                                />
                                                </Label>
                                            ))}
                                        </RadioGroup>
                                    </div>
                                    </FormControl>
                                    <FormMessage className="" />
                                </FormItem>
                                )}
                            />
                        </div>
                        <div className="flex-1 col-start-3 grid grid-rows-5 row-start-1 col-span-1 row-span-2">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                <FormItem className="flex flex-col justify-center relative items-center">
                                    <FormControl>
                                    <div
                                        id="colour"
                                        className="grid grid-cols-4 w-full  gap-4"
                                    >
                                        <p className='col-span-1 flex items-center'>Name</p>
                                        <Input {...field} placeholder="" className='col-span-3 border-white' type="text" />
                                    </div>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage className="" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                <FormItem className="flex flex-col justify-center relative items-center">
                                    <FormControl>
                                    <div
                                        id="amount"
                                        className="grid grid-cols-4 w-full  gap-4"
                                    >
                                        <p className='col-span-1 flex items-center'>Amount</p>
                                        <Input {...field} placeholder="" className='col-span-3 border-white' type="number" />
                                    </div>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage className="" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phoneNo"
                                render={({ field }) => (
                                <FormItem className="flex flex-col justify-center relative items-center">
                                    <FormControl>
                                    <div
                                        id="colour"
                                        className="grid grid-cols-4 w-full  gap-4"
                                    >
                                        <p className='col-span-1 flex items-center'>Phone no</p>
                                        <Input {...field} placeholder="" className='col-span-3 border-white' type="number" />
                                    </div>
                                    </FormControl>
                                    <FormDescription />
                                    <FormMessage className="" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                <FormItem className="flex justify-center items-center w-full flex-col">
                                    <FormControl>
                                    <div
                                        id="carat"
                                        className="grid gap-4 grid-cols-4 w-full"
                                    >
                                        <p className='col-span-1 flex items-center'>Email address</p>
                                        <Input {...field} placeholder="" className='col-span-3 border-white' type="email" />
                                    </div>
                                    </FormControl>
                                    <FormMessage className="" />
                                </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem className="flex justify-center items-center flex-col w-full">
                                        <FormControl>
                                        <div
                                            id="gold-weight"
                                            className="grid gap-4 grid-cols-4 w-full"
                                        >
                                            <p className='col-span-1 flex items-center'>Message</p>
                                            <Textarea {...field} placeholder="" className='col-span-3 border-white resize-none' />
                                        </div>
                                        </FormControl>
                                        <FormMessage className="" />
                                    </FormItem>
                                )}
                            />
                            <div className='mt-14 flex justify-end items-center'>
                                <Button type='submit' className='bg-transparent border sm:border-white border-[#E1C6B3] text-[#E1C6B3] sm:text-white rounded-md'>
                                    {isSubmitButtonLoading ? <Loader2 className='animate-spin' /> : `Proceed to pay`}
                                </Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}