import { AppDispatch } from "../redux1/store";
import { toast } from "sonner";
import { ToastSuccess } from "./UtilityComponents";

/**
 * Apply coupon code to cart
 * @param dispatch Redux dispatch function
 * @param couponCode Coupon code to apply
 * @param cartTotal Total amount in cart
 * @returns Promise with discount amount or null on error
 */
export const applyCouponCode = async (
  dispatch: AppDispatch,
  couponCode: string,
  cartTotal: number,
  voucherAmount: number = 0
) => {
  try {
    const response = await fetch(
      "https://kk-server-lqp8.onrender.com/coupons/verify-coupon",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          code: couponCode,
          cart: [], // Can be customized based on actual cart data
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.errors?.[0] || data?.message || "Failed to apply coupon";
      toast.error("Coupon error", { description: errorMsg });
      return null;
    }

    let discountAmount = 0;

    // Handle different coupon types
    if (data?.data?.type === "fixed") {
      discountAmount = Number(data?.data?.discount) || 0;
    } else if (data?.data?.type === "making_waiver") {
      discountAmount = Number(data?.data?.discount) || 0;
    } else if (data?.data?.type === "percentage") {
      const percentageDiscount = (Number(data?.data?.discount) / 100) * cartTotal;
      discountAmount =
        percentageDiscount > data?.data?.upperLimit
          ? data?.data?.upperLimit
          : percentageDiscount;
    }

    // Ensure discount doesn't exceed cart total minus voucher amount
    if (cartTotal - voucherAmount < discountAmount) {
      discountAmount = cartTotal - voucherAmount;
    }

    toast.success("Coupon applied successfully!", {
      icon: <ToastSuccess />,
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });

    return {
      code: couponCode,
      amount: discountAmount,
      type: data?.data?.type,
    };
  } catch (error: any) {
    toast.error("Failed to apply coupon", {
      description: error.message || "Please try again",
    });
    return null;
  }
};

/**
 * Apply voucher or gift card to cart
 * @param dispatch Redux dispatch function
 * @param voucherCode Voucher/gift card code
 * @param cartTotal Total amount in cart
 * @param userId Customer ID
 * @param couponAmount Already applied coupon discount
 * @returns Promise with voucher details or null on error
 */
export const applyVoucherCode = async (
  dispatch: AppDispatch,
  voucherCode: string,
  cartTotal: number,
  userId: string,
  couponAmount: number = 0
) => {
  try {
    const response = await fetch(
      "https://kk-server-lqp8.onrender.com/vouchers/apply-voucher",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          voucherCode,
          cartTotal,
          userId,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMsg =
        data?.errors?.[0] || data?.message || "Failed to apply voucher";
      toast.error("Voucher error", { description: errorMsg });
      return null;
    }

    if (!data.success || data.statusCode !== 200 || !data.data?.isValid) {
      const errorMsg = data.message || "Invalid voucher code";
      toast.error("Invalid voucher", { description: errorMsg });
      return null;
    }

    let discountAmount = data.data.discount || 0;

    // Ensure discount doesn't exceed cart total minus coupon amount
    if (cartTotal - couponAmount < discountAmount) {
      discountAmount = cartTotal - couponAmount;
    }

    toast.success("Voucher applied successfully!", {
      icon: <ToastSuccess />,
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });

    return {
      code: data.data.voucher?.code || voucherCode,
      amount: discountAmount,
    };
  } catch (error: any) {
    toast.error("Failed to apply voucher", {
      description: error.message || "Please try again",
    });
    return null;
  }
};

/**
 * Validate and redeem Paytm gift card
 * @param giftCardCode Gift card code
 * @param pin Gift card PIN
 * @param customerData Customer information
 * @param cartTotal Total amount in cart
 * @returns Promise with gift card details or null on error
 */
export const redeemPaytmGiftCard = async (
  giftCardCode: string,
  pin: string,
  customerData: any,
  cartTotal: number
) => {
  try {
    // Step 1: Encrypt PIN
    const encryptedPinResponse = await fetch(
      "https://kk-server-lqp8.onrender.com/paytm/encrypt-pin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ pin }),
      }
    );

    const encryptedPinData = await encryptedPinResponse.json();

    if (!encryptedPinResponse.ok) {
      throw new Error("Failed to encrypt PIN, please try again");
    }

    const encryptedPin = encryptedPinData.data;

    // Step 2: Validate gift card
    const response = await fetch(
      "https://kk-server-lqp8.onrender.com/paytm/validate-giftcard",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          requestBody: {
            request: {
              brandMID: "PaytmGvTestBrand",
              cardNumber: giftCardCode,
              cardPIN: encryptedPin,
              orderId: "MERCHANT-ORDER-ID-1689584367474",
              sourceMerchantMid: "PaytmGvTestReseller",
              redemptionMetaData: {
                redeemerName: `${customerData?.firstName} ${customerData?.lastName}`,
                redeemerMobileNumber: customerData?.phoneNumber || "",
                redeemerEmailId: customerData?.email || "",
                invoiceAmount: cartTotal,
              },
              source: "BRAND",
            },
          },
        }),
      }
    );

    const responseJSON = await response.json();

    if (!response.ok) {
      throw new Error("Failed to validate gift card, please try again");
    }

    if (responseJSON.data.status === "FAILURE") {
      toast.error("Gift card validation failed", {
        description: responseJSON.data.statusMessage,
      });
      return null;
    }

    if (Number(responseJSON?.data?.response?.availableAmount) > cartTotal) {
      toast.error("Invalid gift card", {
        description: "Gift card amount greater than cart amount!",
      });
      return null;
    }

    toast.success("Gift card applied successfully!", {
      icon: <ToastSuccess />,
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });

    return {
      code: giftCardCode,
      pin: pin,
      amount: Number(responseJSON?.data?.response?.availableAmount) || 0,
      status: responseJSON?.data?.status,
    };
  } catch (error: any) {
    toast.error("Gift card error", {
      description: error.message || "Please try again",
    });
    return null;
  }
};
