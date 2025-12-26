import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface InitiatePaymentPayload {
  orderId: string;
  method: 'cod' | 'online' | 'card' | 'upi';
}

export interface PaymentInitiateResponse {
  razorpayOrderId?: string;
  amount?: number;
  currency?: string;
  key?: string;
  orderId: string;
  method: string;
  message?: string;
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface PaymentSuccessResponse {
  success: boolean;
  message: string;
  orderId?: string;
  paymentId?: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
}

interface PaymentState {
  paymentInitiateResponse: PaymentInitiateResponse | null;
  paymentSuccessResponse: PaymentSuccessResponse | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  paymentInitiateResponse: null,
  paymentSuccessResponse: null,
  loading: false,
  error: null,
};

// Helper function for authenticated requests
const getAuthToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
};

// Async Thunks

export const initiatePayment = createAsyncThunk<
  PaymentInitiateResponse,
  InitiatePaymentPayload,
  { rejectValue: string }
>(
  'payment/initiatePayment',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/payments/initiate`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PaymentInitiateResponse> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to initiate payment');
    }
  }
);

export const verifyPayment = createAsyncThunk<
  PaymentSuccessResponse,
  VerifyPaymentPayload,
  { rejectValue: string }
>(
  'payment/verifyPayment',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/payments/success`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<PaymentSuccessResponse> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to verify payment');
    }
  }
);

// Slice
const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    clearPaymentInitiateResponse: (state) => {
      state.paymentInitiateResponse = null;
    },
    clearPaymentSuccessResponse: (state) => {
      state.paymentSuccessResponse = null;
    },
    clearAllPaymentData: (state) => {
      state.paymentInitiateResponse = null;
      state.paymentSuccessResponse = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Initiate Payment
    builder
      .addCase(initiatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initiatePayment.fulfilled, (state, action: PayloadAction<PaymentInitiateResponse>) => {
        state.loading = false;
        state.paymentInitiateResponse = action.payload;
      })
      .addCase(initiatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to initiate payment';
      });

    // Verify Payment
    builder
      .addCase(verifyPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action: PayloadAction<PaymentSuccessResponse>) => {
        state.loading = false;
        state.paymentSuccessResponse = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to verify payment';
      });
  },
});

export const {
  clearPaymentInitiateResponse,
  clearPaymentSuccessResponse,
  clearAllPaymentData,
  clearError,
} = paymentSlice.actions;

export default paymentSlice.reducer;
