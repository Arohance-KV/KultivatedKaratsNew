import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { addToWishlist, removeFromWishlist } from "@/redux1/wishlistSlice";

interface WishlistItemData {
  product: any;
  color: string;
  karat: number;
}

/**
 * Adds a product to the wishlist using Redux
 * @param dispatch Redux dispatch function
 * @param productData Product and variant information (product, color, karat)
 * @param userId User ID (null if guest)
 * @returns Promise that resolves when complete
 */
export const addProductToWishlist = async (
  dispatch: any,
  productData: WishlistItemData,
  userId: string | null | undefined
): Promise<boolean> => {
  try {
    if (!userId) {
      // Handle guest wishlist (localStorage)
      const guestWishlist = JSON.parse(localStorage.getItem("wishList") || "[]");
      const itemExists = guestWishlist.some(
        (item: any) =>
          item.product?._id === productData.product?._id &&
          item.color === productData.color &&
          item.karat === productData.karat
      );

      if (!itemExists) {
        guestWishlist.push(productData);
        localStorage.setItem("wishList", JSON.stringify(guestWishlist));
      }

      toast.success("Product added to wishlist successfully!", {
        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
      });
      return true;
    }

    // For authenticated users, use Redux thunk
    const result = await dispatch(
        addToWishlist({
            productId: productData.product?._id,
            priceWhenAdded: 0,
            selectedVariant: {
                karat: productData.karat,
                sku: "",
                priceWhenAdded: 0
            }
        }) as any
    );

    if (result.type === addToWishlist.fulfilled.type) {
      toast.success("Product added to wishlist successfully!", {
        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
      });
      return true;
    } else {
      toast.error("Failed to add product to wishlist", {
        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
      });
      return false;
    }
  } catch (error: any) {
    console.error("Error adding to wishlist:", error);
    toast.error("Error adding product to wishlist", {
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });
    return false;
  }
};

/**
 * Removes a product from the wishlist using Redux
 * @param dispatch Redux dispatch function
 * @param productData Product and variant information (product, color, karat)
 * @param userId User ID (null if guest)
 * @returns Promise that resolves when complete
 */
export const removeProductFromWishlist = async (
  dispatch: any,
  productData: WishlistItemData,
  userId: string | null | undefined
): Promise<boolean> => {
  try {
    if (!userId) {
      // Handle guest wishlist (localStorage)
      const guestWishlist = JSON.parse(localStorage.getItem("wishList") || "[]");
      const updatedWishlist = guestWishlist.filter(
        (item: any) =>
          !(
            item.product?._id === productData.product?._id &&
            item.color === productData.color &&
            item.karat === productData.karat
          )
      );

      localStorage.setItem("wishList", JSON.stringify(updatedWishlist));
      toast.success("Product removed from wishlist successfully!", {
        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
      });
      return true;
    } else {
      // For authenticated users, use Redux thunk
      const result = await dispatch(
        removeFromWishlist(productData.product?._id) as any
      );

      if (result.type === removeFromWishlist.fulfilled.type) {
        toast.success("Product removed from wishlist successfully!", {
          className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
        });
        return true;
      } else {
        toast.error("Failed to remove product from wishlist", {
          className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
        });
        return false;
      }
    }
  } catch (error: any) {
    console.error("Error removing from wishlist:", error);
    toast.error("Error removing product from wishlist", {
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });
    return false;
  }
};

/**
 * Toggles a product in/out of the wishlist
 * @param dispatch Redux dispatch function
 * @param productData Product and variant information
 * @param isCurrentlyInWishlist Whether the product is currently in the wishlist
 * @param userId User ID (null if guest)
 * @returns Promise that resolves when complete
 */
export const toggleWishlistItem = async (
  dispatch: any,
  productData: WishlistItemData,
  isCurrentlyInWishlist: boolean,
  userId: string | null | undefined
): Promise<boolean> => {
  if (isCurrentlyInWishlist) {
    return removeProductFromWishlist(dispatch, productData, userId);
  } else {
    return addProductToWishlist(dispatch, productData, userId);
  }
};
