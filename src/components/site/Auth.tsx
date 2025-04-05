import { z } from "zod";
import { Input } from "../ui/input";
import { UIsideBar } from "./home-page/Solitare"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2, LockKeyholeIcon, LucideMail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
// import { setCustomerData } from "@/redux/slices/websiteSlice";

export const loginFormSchema = z.object({
    email: z.string().email("Invalid email, enter a valid email address!"),
    password: z.string().min(8, { message: "Password must be 8 characters long"}).refine((password) => /[a-z]/.test(password), { message: "Password must contain at least one lower case character!"}).refine((password) => /[A-Z]/.test(password), { message: "Password must contain at least one upper case character!"}).refine((password) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(password), { message: "Password must contain at least one special character!"}).refine((password) => /[0-9]/.test(password), { message: "Password must contain at least one numberic value!"})
});

export const signUpFormSchema = z.object({
    email: z.string().email("Invalid email, enter a valid email address!"),
    password: z.string().min(8, { message: "Password must be 8 characters long"}).refine((password) => /[a-z]/.test(password), { message: "Password must contain at least one lower case character!"}).refine((password) => /[A-Z]/.test(password), { message: "Password must contain at least one upper case character!"}).refine((password) => /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(password), { message: "Password must contain at least one special character!"}).refine((password) => /[0-9]/.test(password), { message: "Password must contain at least one numberic value!"}),
    firstName: z.string().min(1, { message: "Mandatory field!"}),
    lastName: z.string().min(1, { message: "Mandatory field!"}),
    phoneNumber: z.coerce.number(({ invalid_type_error: "Please enter a valid number." })).min( 10, { message: "Phone no should be 10 digits!"})
});

export const Auth = () => {
    
    const dispatch = useDispatch();

    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
        resolver: zodResolver(signUpFormSchema),
        defaultValues: {
            email: "",
            password: "",
            firstName: "",
            lastName: "",
            // phoneNo: "",
        }
    });

    const navigate = useNavigate();

    const [ isAuthButtonLoading, setIsAuthButtonLoading ] = useState(false);  

    const onSignupFormSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
        setIsAuthButtonLoading(true);
        console.log(values);

        // try {
        //     const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/register`, {
        //       method: "POST",
        //       headers: {
        //           "Content-Type": "application/json",
        //       },
        //       credentials: 'include',
        //       body: JSON.stringify({userData: {...values, role: "Customer"}})
        //     });
      
        //     const data = await response.json();
        //     console.log(data);
      
        //     if ( !response.ok ){
        //       // productCreateForm.setError(data.type, { type: "manual", message: data?.errorMessage });
        //       if ( data?.errors[0]?.type !== undefined )
        //         data.errors.map((err: any) => {
        //           signUpForm.setError(err.type, { type: "manual", message: err.message });
        //         });
        //         console.log(data.errors);
        //       throw new Error(`${data.statusCode}, ${data}`);
        //     }

        //     dispatch(setCustomerData(data.data));
        //     navigate("/");
        // } catch (error: any) {
        //     console.error(error);
        //     // toast.error("Failed to create user!", { description: (error?.errors[0]?.message || ""), icon: <ToastFaliure /> });
        // } finally {
        //     setIsAuthButtonLoading(false);
        // }
    };

    const onLoginFormSubmit = async (values: z.infer<typeof loginFormSchema>) => {
        setIsAuthButtonLoading(true);
        try {
            // @ts-ignore
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({email: values.email, password: values.password})
            });
    
            if (!response.ok) {
                console.log(response)
                const errData = await response.json();
                loginForm.setError(errData.errors[0].type, {type: "manual", message: errData.errors[0].errMsg})
                throw new Error("HTTP error! status: "+response.status);
            }
    
            console.log(response);
            
            const data = await response.json();
    
            // if ( data.data.user.role !== "Admin" ) {
            //     loginForm.setError("email", { type: "manual", message: "Unauthorized user!"})
            //     throw new Error("Unauthorized user");
            // }
            
            dispatch(setUser(data.data.user));
            navigate("/");
            console.log(data);
        } catch (error) {
            console.error("Error: ", error);
        } finally {
            setIsAuthButtonLoading(false);
        } 
    }

    const [ showPassword, setShowPassword ] = useState(false);

    console.log(setShowPassword);
    

    const [ isSignUp, setIsSignUp ] = useState(false);

    return (
        <div className='w-full relative pb-14'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div className="sm:bg-[#E1C6B3] sm:mt-56 mt-14 flex flex-col gap-8 items-center w-[60%] justify-self-center rounded-lg h-auto pb-8 aspect-video">
                <p className="text-[#A68A7E] text-4xl mt-[6%] mb-[3%] font-[Inria_Serif]">{isSignUp ? "Create a new account" : "Sign in to your account"}</p>
                <div className="sm:w-[30%] w-full">
                    {isSignUp ? <Form {...signUpForm}>
                        <form className="w-full flex flex-col gap-4 justify-center items-center" onSubmit={signUpForm.handleSubmit(onSignupFormSubmit)}>
                            <div className="gap-4 flex">
                                <FormField
                                    control={signUpForm.control}
                                    name="firstName"
                                    render={({ field }) => {
                                        return (<FormItem className="flex w-full justify-center gap-1 items-center flex-col">
                                            {/* <FormLabel>Username</FormLabel> */}
                                            <div className="w-full relative">
                                                <FormControl className="">
                                                    <Input {...field} placeholder="First name" className="sm:!border-none border border-[#E1C6B3] w-full sm:placeholder:text-white placeholder:text-gray-600/30 !ring-0 !outline-none !focus:border-none !focus:ring-0 !focus:outline-none rounded-none active:border-none bg-white/30 text-white" />
                                                </FormControl>
                                                {/* <LucideMail className="sm:stroke-white stroke-[#E1C6B3] h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2"/> */}
                                            </div>
                                            <FormMessage />
                                        </FormItem>);
                                    }}
                                />
                                <FormField
                                    control={signUpForm.control}
                                    name="lastName"
                                    render={({ field }) => {
                                        return (<FormItem className="flex w-full justify-center gap-1 items-center flex-col">
                                            {/* <FormLabel>Username</FormLabel> */}
                                            <div className="w-full relative">
                                                <FormControl className="">
                                                    <Input {...field} placeholder="Last name" className="sm:!border-none border border-[#E1C6B3] w-full sm:placeholder:text-white placeholder:text-gray-600/30 !ring-0 !outline-none !focus:border-none !focus:ring-0 !focus:outline-none rounded-none active:border-none bg-white/30 text-white" />
                                                </FormControl>
                                                {/* <LucideMail className="sm:stroke-white stroke-[#E1C6B3] h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2"/> */}
                                            </div>
                                            <FormMessage />
                                        </FormItem>);
                                    }}
                                />
                            </div>
                            <FormField
                                control={signUpForm.control}
                                name="email"
                                render={({ field }) => {
                                    return (<FormItem className="flex w-full justify-center gap-1 items-center flex-col">
                                        {/* <FormLabel>Username</FormLabel> */}
                                        <div className="w-full relative">
                                            <FormControl className="">
                                                <Input {...field} placeholder="Email" className="sm:!border-none border border-[#E1C6B3] w-full sm:placeholder:text-white placeholder:text-gray-600/30 pl-12 !ring-0 !outline-none !focus:border-none !focus:ring-0 !focus:outline-none rounded-none active:border-none bg-white/30 text-white" />
                                            </FormControl>
                                            <LucideMail className="sm:sm:stroke-white stroke-[#E1C6B3] h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2"/>
                                        </div>
                                        <FormMessage />
                                    </FormItem>);
                                }}
                            />
                            <FormField
                                control={signUpForm.control}
                                name="phoneNumber"
                                render={({ field }) => {
                                    return (<FormItem className="flex w-full justify-center gap-1 items-center flex-col">
                                        {/* <FormLabel>Username</FormLabel> */}
                                        <div className="w-full flex gap-2 relative">
                                            <div className="text-white bg-white/30 flex justify-center gap-2 items-center min-w-[30%] ">
                                                <img src="/indian-flag.svg" className="h-5 aspect-square"/>
                                                <p className=" flex justify-center items-center">+91</p>
                                            </div>
                                            <FormControl className="">
                                                <Input {...field} placeholder="Phone number" type="number" className="appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none sm:!border-none border border-[#E1C6B3] w-full sm:placeholder:text-white placeholder:text-gray-600/30 !ring-0 !outline-none !focus:border-none !focus:ring-0 !focus:outline-none rounded-none active:border-none bg-white/30 text-white" />
                                            </FormControl>
                                        </div>
                                        <FormMessage />
                                    </FormItem>);
                                }}
                            />
                            <FormField
                                name="password"
                                control={signUpForm.control}
                                render={({ field }) => {
                                    return <FormItem className="flex w-full justify-center gap-1 items-center flex-col">
                                        <div className="relative w-full">
                                        <FormControl className="">
                                                <Input {...field} placeholder="Password" type={showPassword ? "text" : "password" } className="sm:!border-none border border-[#E1C6B3] w-full sm:placeholder:text-white placeholder:text-gray-600/30 pl-12 !ring-0 !outline-none !focus:border-none !focus:ring-0 !focus:outline-none rounded-none active:border-none bg-white/30 text-white" />
                                            </FormControl>
                                            <LockKeyholeIcon className="sm:stroke-white stroke-[#E1C6B3] h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2"/>
                                            {/* <Button type="button" className="bg-transparent hover:bg-transparent hover:shadow-lg absolute right-2 rounded-full h-0 w-0 p-4 top-1/2 -translate-y-1/2" onClick={(e) => {
                                                e.preventDefault();
                                                setShowPassword(!showPassword);
                                            }}> { showPassword ? <Eye className="w-2 aspect-square" /> : <EyeClosed className="w-2 aspect-square"/> } </Button> */}
                                        </div>
                                        <FormMessage className=""/>
                                    </FormItem>    
                                }}
                            />
                            <Button disabled={isAuthButtonLoading} onClick={async () => {
                                console.log(signUpForm?.formState?.errors);
                                // await onSignupFormSubmit(signUpForm?.getValues());
                            }} className="mt-4 w-full rounded-sm bg-[#A68A7E] hover:shadow-md hover:bg-transparent text-white hover:text-white" variant={"ghost"} type="submit">{ isAuthButtonLoading ? <Loader2 className="animate-spin" /> : "Sign up"}</Button> 
                            <Button type="button" className="text-[#A68A7E] font-thin bg-transparent self-end -mt-2  h-auto text-xs p-0 hover:bg-transparent hover:underline" onClick={() => {
                                setIsSignUp(false);
                            }}>Already have an account? Sign in!</Button>
                        </form>
                    </Form>
                    :
                    <Form {...loginForm}>
                        <form className="w-full flex flex-col gap-4 justify-center items-center" onSubmit={loginForm.handleSubmit(onLoginFormSubmit)}>
                            <FormField
                                control={loginForm.control}
                                name="email"
                                render={({ field }) => {
                                    return (<FormItem className="flex w-full justify-center gap-1 items-center flex-col">
                                        {/* <FormLabel>Username</FormLabel> */}
                                        <div className="w-full relative">
                                            <FormControl className="">
                                                <Input {...field} placeholder="Email" className="sm:!border-none border border-[#E1C6B3] w-full sm:placeholder:text-white placeholder:text-gray-600/30 pl-12 !ring-0 !outline-none !focus:border-none !focus:ring-0 !focus:outline-none rounded-none active:border-none bg-white/30 text-white" />
                                            </FormControl>
                                            <LucideMail className="sm:stroke-white stroke-[#E1C6B3] h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2"/>
                                        </div>

                                        <FormMessage />
                                    </FormItem>);
                                }}
                            />
                            <FormField
                                name="password"
                                control={loginForm.control}
                                render={({ field }) => {
                                    return <FormItem className="flex w-full justify-center gap-1 items-center flex-col">
                                        <div className="relative w-full">
                                            <FormControl className="">
                                                <Input {...field} placeholder="Password" type={showPassword ? "text" : "password" } className="sm:!border-none border border-[#E1C6B3] w-full sm:placeholder:text-white placeholder:text-gray-600/30 pl-12 !ring-0 !outline-none !focus:border-none !focus:ring-0 !focus:outline-none rounded-none active:border-none bg-white/30 text-white" />
                                            </FormControl>
                                            <LockKeyholeIcon className="sm:stroke-white stroke-[#E1C6B3] h-4 w-4 absolute left-4 top-1/2 -translate-y-1/2"/>
                                            {/* <Button type="button" className="bg-transparent hover:bg-transparent hover:shadow-lg absolute right-2 rounded-full h-0 w-0 p-4 top-1/2 -translate-y-1/2" onClick={(e) => {
                                                e.preventDefault();
                                                setShowPassword(!showPassword);
                                            }}> { showPassword ? <Eye className="w-2 aspect-square" /> : <EyeClosed className="w-2 aspect-square"/> } </Button> */}
                                        </div>
                                        <FormMessage className=""/>
                                    </FormItem>    
                                }}
                            />
                            <Button disabled={isAuthButtonLoading} className="mt-4 w-full rounded-sm bg-[#A68A7E] hover:shadow-md hover:bg-transparent text-white hover:text-white" variant={"ghost"} type="submit">{isAuthButtonLoading ? <Loader2 className="animate-spin" /> : "Login"}</Button> 
                            <Button type="button" className="text-[#A68A7E] font-thin bg-transparent self-end -mt-2  h-auto text-xs p-0 hover:bg-transparent hover:underline" onClick={(e) => {
                                e.preventDefault();
                                setIsSignUp(true);
                            }}>Don't have an account? Sign up!</Button>
                        </form>
                    </Form>}
                </div>
            </div>
        </div>
    )
};