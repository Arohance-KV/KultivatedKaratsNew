import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { setUser } from "@/redux/slices/userSlice";
// import { IUser } from "@/utils/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch
    // , useSelector
 } from "react-redux";
import { useNavigate } from "react-router-dom";
import { z } from "zod"

const shippingFormSchema = z.object({
    city: z.string(),
    postalCode: z.string(),
    state: z.string(),
    company: z.string().optional(),
    line1: z.string(),
    line2: z.string().optional(),
    phoneNumber: z.coerce.number(({ invalid_type_error: "Please enter a valid number." })).min( 10, { message: "Phone no should be 10 digits!"}),
}); 

export const SetShipping = () => {

const [ isShippingAddressButtonLoading, setIsShippingAddressButtonLoading ] = useState(false);

const dispatch = useDispatch();

// const customerData: IUser = useSelector((state: any) => state.website.customerData);

const navigate = useNavigate();

const onShippingFormSubmit = async (values: z.infer<typeof shippingFormSchema>) => {
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
                // const errData = await response.json();
                // loginForm.setError(errData.errors[0].type, {type: "manual", message: errData.errors[0].errMsg})
                throw new Error("HTTP error! status: "+response.status);
            }
    
            console.log(response);
            
            const data = await response.json();
    
            // if ( data.data.user.role !== "Admin" ) {
            //     loginForm.setError("email", { type: "manual", message: "Unauthorized user!"})
            //     throw new Error("Unauthorized user");
            // }
            console.log(data?.data)
            dispatch(setUser(data.data));
            navigate("/cart");
            console.log(data);
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsShippingAddressButtonLoading(false);
        } 
    }


    const shippingForm = useForm<z.infer<typeof shippingFormSchema>>({
        resolver: zodResolver(shippingFormSchema),
        defaultValues: {
        }
    });

    const { handleSubmit } = shippingForm; 

    return (
        <section className="w-full min-h-screen sm:mt-56 mt-14 text-[#A68A7E] inria-serif-regular flex justify-center items-center">
            <Form {...shippingForm}>
                <form className="flex flex-col justify-center items-center gap-4" onSubmit={shippingForm?.handleSubmit(onShippingFormSubmit)} >
                    <div className="flex flex-col gap-4">
                        <FormField 
                            control={shippingForm.control}
                            name="line1"
                            render={( {field} ) => {
                                return (
                                    <FormItem>
                                        <div>
                                            <FormControl>
                                                <Input {...field} placeholder="Address line 1" />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField 
                            control={shippingForm.control}
                            name="line2"
                            render={( {field} ) => {
                                return (
                                    <FormItem>
                                        <div>
                                            <FormControl>
                                                <Input {...field} placeholder="Address line 2" />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField 
                            control={shippingForm.control}
                            name="city"
                            render={( {field} ) => {
                                return (
                                    <FormItem>
                                        <div>
                                            <FormControl>
                                                <Input {...field} placeholder="City" />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField 
                            control={shippingForm.control}
                            name="state"
                            render={( {field} ) => {
                                return (
                                    <FormItem>
                                        <div>
                                            <FormControl>
                                                <Input {...field} placeholder="State" />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField 
                            control={shippingForm.control}
                            name="postalCode"
                            render={( {field} ) => {
                                return (
                                    <FormItem>
                                        <div>
                                            <FormControl>
                                                <Input {...field} placeholder="Postal code" />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField 
                            control={shippingForm.control}
                            name="company"
                            render={( {field} ) => {
                                return (
                                    <FormItem>
                                        <div>
                                            <FormControl>
                                                <Input {...field} placeholder="Company name" />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                        <FormField 
                            control={shippingForm.control}
                            name="phoneNumber"
                            render={( {field} ) => {
                                return (
                                    <FormItem>
                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                            {/* <Label htmlFor="phone">Phone Number</Label> */}
                                            <Input
                                                {...field}
                                                type="tel"
                                                id="phone"
                                                placeholder="Phone number"
                                                pattern="^\+?[1-9]\d{1,14}$"
                                                inputMode="tel"
                                                className="font-mono"
                                            />
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )
                            }}
                        />
                    <Button disabled={isShippingAddressButtonLoading} type="submit" onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(onShippingFormSubmit)();
                    }}>Set shipping address</Button>
                    </div>
                </form>
            </Form>
        </section>
    )
}