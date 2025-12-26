import { z } from "zod";
import { UIsideBar } from "./home-page/Solitare"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { ICartItem } from "@/utils/interfaces";
// import { setCustomerData } from "@/redux/slices/websiteSlice"; // COMMENTED OUT - OLD
import { signup, login, fetchProfile, SignupPayload, LoginPayload } from "@/redux1/authSlice"; // NEW
import type { AppDispatch } from "@/redux1/store"; // NEW
import { toast } from "sonner";
import { ToastSuccess } from "@/utils/UtilityComponents";

// Updated Zod schemas for new auth flow
export const signUpFormSchema = z.object({
  email: z.string().email("Invalid email, enter a valid email address!"),
  password: z.string().min(6, { message: "Password must be at least 6 characters long"}),
  firstName: z.string().min(1, { message: "First name is required!"}),
  lastName: z.string().min(1, { message: "Last name is required!"}),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits!"}),
});

export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address!"),
  password: z.string().min(1, { message: "Password is required!"}),
});

export const Auth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>(); // NEW: Type dispatch
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useSelector((state: any) => state.auth);

  const signupForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    }
  });

  const loginForm = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  // Reset forms when toggling between signup/login to prevent state pollution
  useEffect(() => {
    if (isSignUp) {
      signupForm.reset();
    } else {
      loginForm.reset();
    }
  }, [isSignUp, signupForm, loginForm]);

  useEffect(() => {
    if (auth.isAuthenticated && auth.accessToken) {
      navigate("/");
    }
  }, [auth.isAuthenticated, navigate]);

  const onSignupSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    setIsLoading(true);
    try {
      const result = await dispatch(signup({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phone: values.phone,
      } as SignupPayload) as any);

      if (result.payload) {
        // NEW: Fetch user profile after signup
        await dispatch(fetchProfile());
        toast.success("Signed up successfully!", { icon: <ToastSuccess />, className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white" });
        navigate("/");
      } else if (result.error) {
        toast.error("Signup failed", { description: result.error?.payload || "Please try again" });
      }
    } catch (error: any) {
      toast.error("Signup error", { description: error.message || "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const onLoginSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    setIsLoading(true);
    try {
      const result = await dispatch(login({
        email: values.email,
        password: values.password,
      } as LoginPayload) as any);

      if (result.payload) {
        // NEW: Fetch user profile after login
        await dispatch(fetchProfile());
        toast.success("Logged in successfully!", { icon: <ToastSuccess />, className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white" });
        navigate("/");
      } else if (result.error) {
        toast.error("Login failed", { description: result.error?.payload || "Invalid credentials" });
      }
    } catch (error: any) {
      toast.error("Login error", { description: error.message || "An error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const mergeCart = (guestCart : ICartItem[], mainCart : ICartItem[]) => {
    const mergedCart : ICartItem[] = [ ...mainCart ];
    if ( mainCart?.length == 0 ) {
      guestCart?.forEach(cartItem => {
        mergedCart?.push(cartItem);
      })
      return mergedCart;
    }
    const mergedCartLength = mergedCart?.length;
    for (let index = 0; index < guestCart?.length; index++) {
      const guestCartElement = guestCart[index];
      for (let j = 0; j < mergedCartLength; j++) {
        const mergedCartElement = mergedCart[j];
        if ( guestCartElement?.product?._id == mergedCartElement?.product?._id ) {
          mergedCartElement.quantity = ++mergedCartElement.quantity;
          continue;
        } else {
          mergedCart.push(guestCartElement);
        }
      }
    }
    return mergedCart;
  };

  return (
    <>
      <UIsideBar side={"left"} />
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h1 className="text-2xl font-bold text-center mb-6">
            {isSignUp ? "Create Account" : "Sign In"}
          </h1>

          {/* COMMENTED OUT: Google Login - OLD API */}
          {/* 
          <div className="mb-6 flex justify-center">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/google/login`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    credentials: 'include',
                    body: JSON.stringify({ token: credentialResponse?.credential })
                  });

                  if (!response.ok) {
                    throw new Error("HTTP error! status: "+response.status);
                  }

                  const data = await response.json();
                  const guestCart = JSON.parse(localStorage.getItem('cart') || '[]');
                  const mergedCart = mergeCart(guestCart, data?.data?.user?.cart);

                  const updateCartResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL}${import.meta.env.VITE_PORT}${import.meta.env.VITE_API_URL}users/update-user-cart`, {
                    method: "PATCH",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ updatedCart: mergedCart }),
                    credentials: "include"
                  });

                  if (!updateCartResponse.ok) throw new Error("HTTP error!");

                  const updateCartData = await updateCartResponse.json();
                  dispatch(setCustomerData({ ...data?.data?.user, cart: updateCartData?.data?.cart }));
                  toast.success("Logged In successfully!", { icon: <ToastSuccess />, className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white" });
                  navigate("/");
                } catch (error: any) {
                  toast.error("Google login failed", { description: error.message });
                }
              }}
            />
          </div>
          
          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>
          */}

          {/* Sign Up Form */}
          {isSignUp ? (
            <Form key="signup" {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="First Name" 
                          autoComplete="off"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Last Name" 
                          autoComplete="off"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Email" 
                          type="email" 
                          autoComplete="email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Phone Number" 
                          autoComplete="tel"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Password" 
                          type="password" 
                          autoComplete="new-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing Up...</> : "Sign Up"}
                </Button>

                <div className="text-center text-sm">
                  Already have an account?
                  <Button variant="link" onClick={() => setIsSignUp(false)} className="text-[#A68A7E] underline p-0 ml-1">
                    Sign In
                  </Button>
                </div>
              </form>
            </Form>
          ) : (
            /* Login Form */
            <Form key="login" {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Email" 
                          type="email" 
                          autoComplete="username"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Password" 
                          type="password" 
                          autoComplete="current-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : "Sign In"}
                </Button>

                <div className="text-center text-sm">
                  Don't have an account?
                  <Button variant="link" onClick={() => setIsSignUp(true)} className="text-[#A68A7E] underline p-0 ml-1">
                    Create one
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      </div>
    </>
  );
};