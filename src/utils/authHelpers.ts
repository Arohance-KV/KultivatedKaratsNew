import { AppDispatch } from "@/redux1/store";
import { fetchProfile, updateProfile } from "@/redux1/authSlice";
import { toast } from "sonner";
import { ToastSuccess } from "./UtilityComponents";

/**
 * Fetch user profile from the server
 * @param dispatch Redux dispatch function
 * @returns Promise with profile data or error
 */
export const fetchUserProfile = async (dispatch: AppDispatch) => {
  try {
    const result = await dispatch(fetchProfile() as any);
    if (result.payload) {
      toast.success("Profile fetched successfully!", {
        icon: <ToastSuccess />,
        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
      });
      return result.payload;
    } else {
      toast.error("Failed to fetch profile", {
        description: result.error?.payload || "Please try again",
      });
      return null;
    }
  } catch (error: any) {
    toast.error("Error fetching profile", {
      description: error.message || "An error occurred",
    });
    return null;
  }
};

/**
 * Update user profile on the server
 * @param dispatch Redux dispatch function
 * @param updates Partial user object with fields to update
 * @returns Promise with updated profile data or error
 */
export const updateUserProfile = async (
  dispatch: AppDispatch,
  updates: any
) => {
  try {
    const result = await dispatch(updateProfile(updates) as any);
    if (result.payload) {
      toast.success("Profile updated successfully!", {
        icon: <ToastSuccess />,
        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
      });
      return result.payload;
    } else {
      toast.error("Failed to update profile", {
        description: result.error?.payload || "Please try again",
      });
      return null;
    }
  } catch (error: any) {
    toast.error("Error updating profile", {
      description: error.message || "An error occurred",
    });
    return null;
  }
};
