import { useEffect, useState } from "react";
import { ICartItem, IWishListItem } from "../../../utils/interfaces";
import { UIsideBar } from "./Solitare";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Loader, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ToastSuccess } from "@/utils/UtilityComponents";
import { removeFromWishlist } from "@/redux1/wishlistSlice";
import { addToCart } from "@/redux1/cartSlice";
// Verify removeFromCart exists in cartSlice and add it to the import above if available

export const WishListPage = () => {
    // Use Redux selectors instead of localStorage
    const dispatch = useDispatch();
    const { wishlist, loading: wishlistLoading } = useSelector((state: any) => state.wishlist);
    const { items: cartItems, loading: cartLoading } = useSelector((state: any) => state.cart);
    const { isAuthenticated } = useSelector((state: any) => state.auth);

    return (
        <div className='w-full relative sm:min-h-auto min-h-screen pb-14'>
            <UIsideBar side="left"/>
            <UIsideBar side="right"/>
            <div id='solitare-main' className="sm:bg-[#E1C6B3] px-8 opacity-0 sm:mt-56 mt-14 gap-10 flex flex-col items-center sm:w-[80%] w-full justify-self-center rounded-tr-[100px] aspect-video">
                <div className="w-full sm:mt-14 text-center text-white ">
                    <p className="inria-serif-regular text-[#E1C6B3] sm:text-white sm:text-6xl">
                        Wish List                    
                    </p>
                </div>
                <div style={{}} className="grid py-4 overflow-x-auto! grid-cols-2 overflow-y-scroll h-auto min-h-[100%] max-h-[100%] no-scrollbar gap-4 flex-1 w-full">
                    {wishlistLoading ? (
                        <div className="col-span-2 flex justify-center items-center">
                            <Loader className="animate-spin w-8 h-8 text-[#A68A7E]" />
                        </div>
                    ) : wishlist?.length > 0 ? (
                        wishlist.map((item: IWishListItem) => (
                            <WishListItem 
                                key={item.product?._id} 
                                cartItem={{
                                    ...item, 
                                    containsGemstone: item?.product?.containsGemstone, 
                                    quantity: 1, 
                                    totalPrice: item?.product?.price
                                }} 
                                cartItems={cartItems} 
                                dispatch={dispatch}
                                isAuthenticated={isAuthenticated}
                            />
                        ))
                    ) : (
                        <div className="col-span-2 text-center text-[#A68A7E] py-8">
                            <p className="text-lg">Your wishlist is empty</p>
                        </div>
                    )}
                </div>
            </div>
        </div>    
    );
};

const WishListItem = ({ 
    cartItems, 
    cartItem, 
    dispatch, 
    isAuthenticated 
}: { 
    cartItem: ICartItem, 
    cartItems: ICartItem[], 
    dispatch: any,
    isAuthenticated: boolean 
}) => {
    const isInCart = cartItems?.some(item => cartItem?.product?._id === item?.product?._id);
    const [isCartButtonLoading, setIsCartButtonLoading] = useState(false);
    const [isRemoveItemLoadingButton, setIsRemoveItemLoadingButton] = useState(false);

    const handleAddOrRemoveFromCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsCartButtonLoading(true);

        try {
            const productId = cartItem?.product?._id;
            if (!productId) {
                toast.error("Product ID is missing");
                setIsCartButtonLoading(false);
                return;
            }

            if (isInCart) {
                // Remove from cart
                const result = await dispatch(removeFromCart(productId));
                if (result.type === 'cart/removeFromCart/fulfilled') {
                    toast.success("Product deleted from cart successfully!", { 
                        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", 
                        icon: <Trash2 className="w-4 h-4 stroke-red-500" /> 
                    });
                } else {
                    toast.error("Failed to remove from cart");
                }
            } else {
                // Add to cart
                const result = await dispatch(addToCart({
                    product: productId,
                    quantity: 1,
                    color: "white",
                    karat: 14,
                    totalPrice: cartItem?.product?.price,
                    containsGemstone: cartItem?.product?.containsGemstone
                }));
                if (result.type === 'cart/addToCart/fulfilled') {
                    toast.success("Product added to cart successfully!", { 
                        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", 
                        icon: <ToastSuccess /> 
                    });
                } else {
                    toast.error("Failed to add to cart");
                }
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsCartButtonLoading(false);
        }
    };

    const handleRemoveFromWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsRemoveItemLoadingButton(true);

        try {
            const productId = cartItem?.product?._id;
            if (!productId) {
                toast.error("Product ID is missing");
                setIsRemoveItemLoadingButton(false);
                return;
            }

            const result = await dispatch(removeFromWishlist(productId));
            if (result.type === 'wishlist/removeFromWishlist/fulfilled') {
                toast.success("Product removed from wishlist!", { 
                    className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white", 
                    icon: <Trash2 className="w-4 h-4 stroke-red-500" /> 
                });
            } else {
                toast.error("Failed to remove from wishlist");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsRemoveItemLoadingButton(false);
        }
    };

    return (
        <>
            {/* Mobile View */}
            <div className="flex relative text-sm sm:hidden h-28 text-[#A68A7E] w-[calc(100%-25px)] justify-self-center col-span-2 gap-x-2">
                <img 
                    src={cartItem?.product?.imageUrl?.[0]?.url} 
                    className="border border-[#A68A7E] rounded-md bg-white h-full aspect-square object-cover flex-[0.25]"
                />
                <div className="p-2 flex-[0.75] flex border border-[#A68A7E] rounded-md inria-serif-regular bg-white flex-col justify-between">
                    <p>Name: {cartItem?.product?.name}</p>
                    <div className="flex justify-between">
                        <p className="justify-self-end self-end">
                            Amount: {(cartItem?.product?._id) 
                                ? Math.round(cartItem?.product?.price) 
                                : <Skeleton className="w-8 h-4 rounded-md bg-red-100/10" />
                            }
                        </p>
                        <Button 
                            disabled={isCartButtonLoading}
                            className="bg-white justify-center items-center text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" 
                            onClick={handleAddOrRemoveFromCart}
                        >
                            {isCartButtonLoading ? (
                                <Loader className="animate-spin w-4 h-4"/>
                            ) : isInCart ? (
                                <><ShoppingCart className="w-4 h-4" /> <Minus className="w-4 h-4" /></>
                            ) : (
                                <><ShoppingCart className="w-4 h-4" /> <Plus className="w-4 h-4" /></>
                            )}
                        </Button>
                    </div>
                </div>
                <Button 
                    disabled={isRemoveItemLoadingButton}
                    variant={"ghost"} 
                    className="rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 py-3 px-1 w-0 h-0 bg-white text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" 
                    onClick={handleRemoveFromWishlist}
                >
                    <Minus className="w-2 h-2" />
                </Button>
            </div>

            {/* Desktop View */}
            <div className="hidden sm:flex relative sm:h-28 sm:gap-4 gap-2">
                <img 
                    src={cartItem?.product?.imageUrl?.[0]?.url} 
                    className="border border-[#A68A7E] rounded-md bg-white h-full aspect-square object-cover flex-[0.25]"
                />
                <div className="flex-[0.75] h-full text-[#A68A7E] p-4 rounded-md border border-[#A68A7E] sm:bg-white">
                    <div className="flex flex-col text-[8px] sm:text-[16px] flex-1">
                        <p>Name: {cartItem?.product?.name}</p>
                    </div>
                    <div className="flex-col flex justify-between sm:text-[16px] text-[8px] flex-1">
                        <p>Amount: {(cartItem?.product?._id) 
                            ? Math.round(cartItem?.product?.price) 
                            : <Skeleton className="w-8 h-4 rounded-md bg-red-100/10" />
                        }</p>
                        <Button 
                            disabled={isCartButtonLoading}
                            className="bg-white sm:flex hidden justify-center items-center text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" 
                            onClick={handleAddOrRemoveFromCart}
                        >
                            {isCartButtonLoading ? (
                                <Loader className="animate-spin w-4 h-4"/>
                            ) : isInCart ? (
                                <>Remove from cart <Minus className="w-4 h-4 ml-2" /></>
                            ) : (
                                <>Add to cart <Plus className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </div>
                    <Button 
                        disabled={isRemoveItemLoadingButton}
                        variant={"ghost"} 
                        className="rounded-full absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 py-3 px-1 w-0 h-0 bg-white text-[#A68A7E] border border-[#A68A7E] hover:text-white hover:bg-gray-800/20" 
                        onClick={handleRemoveFromWishlist}
                    >
                        <Minus className="w-2 h-2" />
                    </Button>
                </div>
            </div>
        </>
    );
};

function removeFromCart(productId: string) {
    return async (dispatch: any) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(
                `https://kk-server-lqp8.onrender.com/api/cart/${productId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Failed to remove from cart');
            }

            const data = await response.json();
            dispatch({ type: 'cart/removeFromCart/fulfilled', payload: data });
            return { type: 'cart/removeFromCart/fulfilled' };
        } catch (error) {
            console.error('Error removing from cart:', error);
            return { type: 'cart/removeFromCart/rejected' };
        }
    };
}


