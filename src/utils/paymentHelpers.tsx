import { toast } from "sonner";

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

interface CreateOrderParams {
  amount: number;
}

interface ValidatePaymentParams {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface CreateOrderInDBParams {
  orderId: number;
  customerId: string;
  total: number;
  deliveryAddress: string;
  orderStatus: string;
  cart: any[];
}

interface RedeemPaytmGiftCardParams {
  brandMID: string;
  cardNumber: string;
  cardPIN: string;
  orderId: string;
  sourceMerchantMid: string;
  amount: number;
  redemptionMetaData: {
    redeemerName: string;
    redeemerMobileNumber: string;
    redeemerEmailId: string;
    invoiceAmount: number;
  };
  source: string;
}

/**
 * Creates a Razorpay order on the backend
 * @param amount Amount in rupees (will be converted to paise: amount * 100)
 * @returns Order ID from Razorpay or null on error
 */
export const createRazorpayOrder = async (amount: number): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/payment/create-an-order/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        options: {
          amount: amount * 100, // Convert to paise
          currency: "INR",
        },
      }),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data?.id || null;
  } catch (error: any) {
    toast.error("Failed to create order. Please try again.", {
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });
    console.error("Order creation error:", error);
    return null;
  }
};

/**
 * Validates payment with Razorpay
 * @param paymentData Razorpay payment response data
 * @returns Validated payment data or null on error
 */
export const validatePayment = async (
  paymentData: ValidatePaymentParams
): Promise<any | null> => {
  try {
    const response = await fetch(`${BASE_URL}/payment/order/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    toast.error("Payment validation failed. Please contact support.", {
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });
    console.error("Payment validation error:", error);
    return null;
  }
};

/**
 * Creates an order in the database
 * @param orderData Order details to save
 * @returns Order response or null on error
 */
export const createOrderInDB = async (orderData: {
  order: CreateOrderInDBParams;
}): Promise<any | null> => {
  try {
    const response = await fetch(`${BASE_URL}/orders/create-an-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    toast.error("Failed to save order. Please contact support.", {
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });
    console.error("Order creation error:", error);
    return null;
  }
};

/**
 * Encrypts Paytm gift card PIN
 * @param pin The PIN to encrypt
 * @returns Encrypted PIN or null on error
 */
export const encryptPaytmPin = async (pin: string): Promise<string | null> => {
  try {
    const response = await fetch(`${BASE_URL}/paytm/encrypt-pin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ pin: pin + "" }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data?.data || null;
  } catch (error: any) {
    toast.error("Failed to encrypt PIN. Please try again.", {
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });
    console.error("PIN encryption error:", error);
    return null;
  }
};

/**
 * Redeems a Paytm gift card after payment
 * @param giftCardData Gift card redemption details
 * @returns Redemption response or null on error
 */
export const redeemPaytmGiftCardAfterPayment = async (
  giftCardData: RedeemPaytmGiftCardParams
): Promise<any | null> => {
  try {
    const response = await fetch(`${BASE_URL}/paytm/redeem-giftcard`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        requestBody: {
          request: giftCardData,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data?.data?.status === "FAILURE") {
      throw new Error(data?.data?.statusMessage || "Gift card redemption failed");
    }

    return data;
  } catch (error: any) {
    toast.error("Failed to redeem gift card. Please contact support.", {
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });
    console.error("Gift card redemption error:", error);
    return null;
  }
};

/**
 * Gets Razorpay options object for checkout
 * @param orderId Razorpay order ID
 * @param amount Amount in rupees
 * @param customerData Customer information
 * @param onPaymentSuccess Callback for successful payment
 * @returns Razorpay options object
 */
export const getRazorpayOptions = (
  orderId: string,
  amount: number,
  customerData: any,
  onPaymentSuccess: (response: any) => void
) => {
  return {
    key_id: import.meta.env.VITE_RAZORPAY_KEY_ID,
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amount * 100, // Convert to paise
    currency: "INR",
    name: "Kultivated karats",
    description: "Test Transaction",
    image: "https://example.com/your_logo",
    order_id: orderId,
    handler: onPaymentSuccess,
    modal: {
      ondismiss: async function () {
        console.log("Modal closed by user");
      },
    },
    prefill: {
      name: `${customerData?.firstName} ${customerData?.lastName}`,
      email: `${customerData?.email}`,
      contact: `${customerData?.phoneNumber || "0000000000"}`,
    },
    theme: {
      color: "#BFA6A1",
    },
  };
};

/**
 * Main payment processing function that orchestrates the entire flow
 * @param cartItems Cart items for the order
 * @param cartTotal Total cart amount
 * @param customerData Customer information
 * @param couponAmount Coupon discount amount
 * @param voucherAmount Voucher discount amount
 * @param onSuccess Callback after successful payment
 * @returns Razorpay instance or null on error
 */
export const processPayment = async (
  cartItems: any[],
  cartTotal: number,
  customerData: any,
  couponAmount: number,
  voucherAmount: number,
  onSuccess: (razorpayInstance: any) => void
): Promise<any | null> => {
  try {
    // Calculate final amount
    const subtotal = cartItems?.reduce((total, item) => {
      return total + item?.totalPrice * item?.quantity;
    }, 0) || 0;
    const gst = subtotal * (3 / 100);
    const finalAmount = Math.round(subtotal + gst - couponAmount - voucherAmount);

    if (finalAmount <= 0) {
      toast.error("Invalid order amount", {
        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
      });
      return null;
    }

    // Create Razorpay order
    const orderId = await createRazorpayOrder(finalAmount);
    if (!orderId) {
      return null;
    }

    // Create Razorpay instance with callback
    const options = getRazorpayOptions(orderId, finalAmount, customerData, (res: any) => {
      onSuccess(res);
    });

    const razorpayInstance = new (window as any).Razorpay(options);
    razorpayInstance.open();

    razorpayInstance.on("payment.failed", (response: any) => {
      console.error("Payment failed:", response);
      toast.error("Payment failed. Please try again.", {
        className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
      });
    });

    return razorpayInstance;
  } catch (error: any) {
    console.error("Payment processing error:", error);
    toast.error("Payment processing failed. Please try again.", {
      className: "!inria-serif-regular !border-[#A68A7E] !text-[#A68A7E] !bg-white",
    });
    return null;
  }
};
