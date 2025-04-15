import { FACEBOOK, INSTAGRAM } from "@/utils/constants";
import { Copyright, Facebook, Instagram, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
    return (
        <div className="bg-[#E1C6B3]">
            <div className="sm:flex hidden text-white p-10 inria-serif-regular gap-4 bg-[#E1C6B3] flex-col w-full h-96">
                <div className="flex gap-4 flex-1">
                    <div className="flex-1 flex flex-col gap-4 justify-between">
                        <img src="/logo.svg" className="w-[60%]" />
                        <p>
                            Kultivated Karats is a pioneer in the lab-grown diamond industry, revolutionizing the world of fine jewelry with a profound commitment to innovation, sustainability, and exceptional customer experiences.
                        </p>
                        <div className="flex gap-4 items-center">
                            <a href={INSTAGRAM} className="hover:opacity-75">
                                <Instagram size={24} />
                            </a>
                            <a href={FACEBOOK} className="hover:opacity-75">
                                <Facebook size={24} />
                            </a>
                        </div>
                    </div>
                    <div className="flex-1 flex">
                        <div className="flex-1 h-full flex flex-col gap-8">
                            <p className="text-3xl">Our Company</p>
                            <div className="flex flex-col flex-1 h-full text-xl gap-4">
                                <Link to={"/about"}>About us</Link>
                                <Link to={"/blogs"}>Blogs</Link>
                                <Link to={"/giftcards"}>Giftcards</Link>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-8">
                            <p className="text-3xl">Our Policies</p>
                            <div className="flex h-full gap-4 flex-col text-xl">
                                <Link to={"/privacy-policy"}>Privacy policy</Link>
                                <Link to={"/terms-and-conditions"}>Terms and conditions</Link>
                                <Link to={"/shipping-policy"}>Shipping policy</Link>
                            
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col gap-8">
                            <p className="text-3xl">Customer Care</p>
                            <div className="flex text-xl flex-col gap-4 h-full">
                                <Link to={"/contact-us"}>Contact us</Link>
                                <Link to={"/product-care"}>product care & repair</Link>
                            </div>
                        </div>
                    </div>
                </div>
                <p className="flex justify-center items-center gap-2"><Copyright /> 2025 Kultivated Karats</p>
            </div>
            <footer className="bg-[#E1C6B3] sm:hidden block inria-serif-regular mt-56 py-8 text-white text-center">
                <div className="container mx-auto px-4 flex flex-col justify-center items-center">
                    {/* Copyright */}
                    <div className="mb-6">
                    <p className="text-lg">&copy; 2025 Kultivated Karats</p>
                    </div>

                    {/* Logo */}
                    <div className="mb-4">
                    <img src="/logo.svg" alt="Kultivated Karats Logo" className="h-12 mx-auto" />
                    {/* <p className="text-xs mt-1">LAB GROWN DIAMOND JEWELRY</p> */}
                    </div>

                    {/* Description */}
                    <div className="mb-6 px-6 md:px-24">
                    <p className="w-[80%] leading-relaxed text-center">
                        Kultivated Karats is a pioneer in the lab-grown diamond industry, revolutionizing the world of fine jewelry with a profound commitment to innovation, sustainability, and exceptional customer experiences.
                    </p>
                    </div>

                    {/* Social Icons */}
                    <div className="flex justify-center space-x-6 mb-8">
                    <a href={INSTAGRAM} className="hover:opacity-75">
                        <Instagram size={24} />
                    </a>
                    <a href={FACEBOOK} className="hover:opacity-75">
                        <Facebook size={24} />
                    </a>
                    </div>

                    {/* Address */}
                    <div className="flex items-center justify-center space-x-2 text-xs">
                    <MapPin size={16} />
                    <p>Street no 11, Basavanna Temple St, AK Colony, Adugodi, Bengaluru, Karnataka 560030</p>
                    </div>
                </div>
                </footer>
        </div>
    );
}