import { CircleUser, Heart, MapPinned, Search, ShoppingCart, Store, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../ui/button";
import { Badge } from "@/components/ui/badge";
import { IProduct, IUser } from "@/utils/interfaces";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { MobileNav } from "./MobileNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const HomePageNavBar = () => {

    const customerData: IUser = useSelector((state: any) => state.website.customerData);
    const products: IProduct[] = useSelector((state: any) => state.website.productData);
    
    const [ wishListLength, setWishListLength ] = useState(0);
    const [ cartLength, setCartLength ] = useState(0);
    const [ videoCartLength, setVideoCartLength ] = useState(0);
    const [ avatarUrl, setAvatarUrl ] = useState("");
    useEffect(() => {
        setWishListLength(customerData?.wishList?.length);
        setVideoCartLength(customerData?.videoCallCart?.length);
        setCartLength(customerData?.cart?.length);
        setAvatarUrl(customerData?.img?.link!);
        console.log(avatarUrl);
    }, [ customerData ]);

    const [ isSearchBarOpen, setIsSearchBarOpen ] = useState(false);
    const searchRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                    setIsSearchBarOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [query, setQuery] = useState("");

    const filteredProducts = products.filter((product) =>
      product.name.toLowerCase().trim().includes(query.toLowerCase()) || product?.category?.name?.trim()?.toLowerCase()?.includes(query?.toLowerCase())
    );


    // const [ isHamburgerMenuOpen, setIsHamburgerMenuOpen] = useState(false);

    return (
        <>
            <div className="sm:flex !text-white hidden w-full flex-col gap-4 bg-transparent absolute top-0 left-0 right-0 z-30">
                <div className="min-h-[100px] flex relative px-10">
                    <Link to={"/"}>
                        <img src="/logo.svg" className="absolute left-1/2 h-20 -translate-x-1/2" />
                    </Link>
                    <div className="flex-1"></div>
                    <div className="flex-[0.4] gap-[3%] !stroke-white!text-white flex justify-center items-center">
                        <Link to={"/store-locator"}><MapPinned className="stroke-[1.5] stroke-[#A68A7E]" /></Link>
                        {/* <Link to={"/gold-coins"}><CoinsIcon className="stroke-[1.5] stroke-[#FFD700]" /></Link> */}
                        <div ref={searchRef} className="relative w-full">
                            <Input type="text" onClick={(e) => {
                                e.preventDefault();
                                setIsSearchBarOpen(true);
                            }} placeholder="Search" value={query}
                            onChange={(e) => setQuery(e.target.value)} className="pl-6 h-8 border-[#A68A7E] border-2 bg-transparent text-[#A68A7E] placeholder:text-[#A68A7E]" />
                            <Search className="absolute top-1/2 left-2 -translate-y-1/2 w-3 h-3 stroke-[#A68A7E] stroke-2"/>
                            {isSearchBarOpen && <div className="absolute h-56 w-full top-[150%] rounded-lg py-4 rounded-br-lg flex flex-col gap-4 bg-white  text-[#A68A7E]">
                                <div className="flex flex-col gap-4 overflow-y-scroll">
                                    {filteredProducts?.map(product => {
                                        return (
                                            <a onClick={() => {
                                                setIsSearchBarOpen(false)
                                            }} href={`/product/${product?._id}`} className="px-4">
                                                {product?.name}
                                            </a>
                                        )
                                    })}
                                </div>
                            </div>}
                        </div>
                        <Link to={"/video-cart"}>
                            <Button className="rounded-full m-0 px-3 py-4 relative" variant={"ghost"}>
                                <Video className="fill-[#A68A7E] stroke-[#A68A7E] w-10 h-10"/>
                                <Badge className="absolute text-[10px] h-0 w-0 px-2 py-2 text-[#A68A7E] bg-transparent border border-[#A68A7E] rounded-full top-0 right-0">{videoCartLength}</Badge>
                            </Button>
                        </Link>
                        <Link to={"/wishlist"}>
                            <Button className="rounded-full m-0 px-3 relative  py-4" variant={"ghost"}>
                                <Heart className="fill-[#A68A7E] stroke-[#A68A7E] relative w-10 h-10"/>
                                <Badge className="absolute text-[10px] h-0 w-0 px-2 py-2 text-[#A68A7E] bg-transparent border border-[#A68A7E] rounded-full top-0 right-0">{wishListLength}</Badge>
                            </Button>
                        </Link>
                        <Link to={"/cart"}>
                            <Button className="rounded-full m-0 px-3 relative py-4" variant={"ghost"}>
                                <ShoppingCart className="fill-[#A68A7E] stroke-[#A68A7E] w-10 h-10" />
                                <Badge className="absolute text-[10px] h-0 w-0 px-2 py-2 text-[#A68A7E] bg-transparent border border-[#A68A7E] rounded-full top-0 right-0">{cartLength}</Badge>
                            </Button>
                        </Link>
                        <Link to={"/account-details"}>
                            <Button className="rounded-full h-auto hover:scale-110 transition-all m-0 px-0 py-0" variant={"ghost"}>
                                {<Avatar>
                                    <AvatarImage src={avatarUrl}></AvatarImage>
                                    <AvatarFallback><CircleUser className="stroke-[#A68A7E] w-10 h-10"/></AvatarFallback>
                                </Avatar>}
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* <div className="flex !text-white self-center items-center justify-evenly text-[#A68A7E] w-[80%]"> */}
                <div className="flex text-gray-600 self-center items-center justify-evenly w-[80%]">
                    {/* <Link className="" to={"/"}>Home</Link> */}
                    <Link to={"/about"}>About</Link>
                    <Link to={"/collections"}>Collections</Link>
                    <Link to={"/products"}>Products</Link>
                    <Link to={"/solitare"}>Solitare</Link>
                    <Link to={"/gold-coins"}>Gold coins</Link>
                    {/* <Link to={"/store-locator"}>
                        Store Locator
                    </Link> */}
                    <Link to={"/giftcards"}>Giftcards</Link>
                    {/* <Link to={"/"}>12 month plan</Link> */}
                </div>
            </div>
            <div id="phone-navbar" className="sm:hidden justify-between items-center flex w-full h-14">
                <Link to={"/"}>
                    <img src="/logo.svg" alt="" className="" />
                </Link>
                <Link to={"/store-locator"}>
                    <Store className="fill-[#E1C6B3] w-4 h-4 stroke-[#E1C6B3]"/>
                </Link>
                <Link to={"/wishlist"}>
                    <Heart className="fill-[#E1C6B3] w-4 h-4 stroke-[#E1C6B3]" />
                </Link>
                <Link to={"/cart"}>
                    <ShoppingCart className="fill-[#E1C6B3] w-4 h-4 stroke-[#E1C6B3]" />
                </Link>
                <Link to={"/auth"}>
                    <CircleUser className="fill-[#E1C6B3] w-4 h-4 stroke-[#E1C6B3]" />
                </Link>
                {/* <Hamburger color="#E1C6B3" toggled={isHamburgerMenuOpen} onToggle={() => {
                    setIsHamburgerMenuOpen(!isHamburgerMenuOpen);
                }} size={14} /> */}
                <MobileNav />
            </div>
        </>
    );
};