import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface CartItem {
  product: string;
  quantity: number;
  karat: number;
  sku: string;
  price: number;
  selectedImage: string;
  _id: string;
  addedAt: string;
}

export interface CartItemDetails {
  _id: string;
  product: {
    _id: string;
    productId: string;
    name: string;
    imageUrl: Array<{
      url: string;
      publicId: string;
      _id: string;
    }>;
  };
  quantity: number;
  karat: number;
  sku: string;
  price: number;
  variant: {
    karat: number;
    price: number;
    stock: number;
    grossWeight: number;
    isAvailable: boolean;
  };
  selectedImage: string;
  addedAt: string;
  itemTotal: number;
}

export interface AppliedDiscount {
  code?: string;
  discountId?: string;
  discountAmount?: number;
}

export interface Cart {
  _id: string;
  user?: string;
  sessionId?: string;
  items: CartItem[];
  appliedCoupon?: AppliedDiscount;
  appliedVoucher?: AppliedDiscount;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CartDetails {
  cart: {
    _id: string;
    user?: string;
    appliedCoupon: AppliedDiscount;
    appliedVoucher: AppliedDiscount;
  };
  items: CartItemDetails[];
  totals: {
    subtotal: number;
    discountAmount: number;
    total: number;
    itemCount: number;
  };
}

export interface ValidationResult {
  valid: boolean;
  issues: any[];
  validItems: CartItem[];
  needsUpdate: boolean;
}

export interface AddToCartPayload {
  product: string;
  quantity: number;
  karat: number;
  sku: string;
  price: number;
  selectedImage: string;
}

export interface UpdateCartItemPayload {
  itemId: string;
  quantity?: number;
  karat?: number;
  sku?: string;
  price?: number;
  selectedImage?: string;
}

export interface ApplyDiscountPayload {
  code: string;
  type: 'coupon' | 'voucher';
}

export interface RemoveDiscountPayload {
  type: 'all' | 'coupon' | 'voucher';
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
}

interface CartState {
  cart: Cart | null;
  cartDetails: CartDetails | null;
  validationResult: ValidationResult | null;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null,
  cartDetails: null,
  validationResult: null,
  loading: false,
  error: null,
};

// Helper function to get auth token
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function for authenticated requests
const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  return fetch(url, { ...options, headers });
};

// Async Thunks - Authenticated User Cart

export const addToCart = createAsyncThunk<
  Cart,
  AddToCartPayload,
  { rejectValue: string }
>(
  'cart/addToCart',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item to cart');
    }
  }
);

export const fetchCart = createAsyncThunk<
  Cart,
  void,
  { rejectValue: string }
>(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart');
    }
  }
);

export const fetchCartDetails = createAsyncThunk<
  CartDetails,
  void,
  { rejectValue: string }
>(
  'cart/fetchCartDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/details`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<CartDetails> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch cart details');
    }
  }
);

export const updateCartItem = createAsyncThunk<
  Cart,
  UpdateCartItemPayload,
  { rejectValue: string }
>(
  'cart/updateCartItem',
  async ({ itemId, ...payload }, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/item/${itemId}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update cart item');
    }
  }
);

export const removeCartItem = createAsyncThunk<
  Cart,
  string,
  { rejectValue: string }
>(
  'cart/removeCartItem',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/product/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove cart item');
    }
  }
);

export const clearCart = createAsyncThunk<
  Cart,
  void,
  { rejectValue: string }
>(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/clear`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to clear cart');
    }
  }
);

export const validateCart = createAsyncThunk<
  ValidationResult,
  void,
  { rejectValue: string }
>(
  'cart/validateCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/validate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ValidationResult> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to validate cart');
    }
  }
);

// Guest Cart Thunks

export const addToGuestCart = createAsyncThunk<
  Cart,
  { sessionId: string; payload: AddToCartPayload },
  { rejectValue: string }
>(
  'cart/addToGuestCart',
  async ({ sessionId, payload }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/guest/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item to guest cart');
    }
  }
);

export const fetchGuestCart = createAsyncThunk<
  Cart,
  string,
  { rejectValue: string }
>(
  'cart/fetchGuestCart',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/guest/${sessionId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch guest cart');
    }
  }
);

export const fetchGuestCartDetails = createAsyncThunk<
  CartDetails,
  string,
  { rejectValue: string }
>(
  'cart/fetchGuestCartDetails',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/guest/${sessionId}/details`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<CartDetails> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch guest cart details');
    }
  }
);

export const updateGuestCartItem = createAsyncThunk<
  Cart,
  { sessionId: string; itemId: string; payload: Partial<AddToCartPayload> },
  { rejectValue: string }
>(
  'cart/updateGuestCartItem',
  async ({ sessionId, itemId, payload }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/guest/${sessionId}/item/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update guest cart item');
    }
  }
);

export const addProductVariantToGuestCart = createAsyncThunk<
  Cart,
  { sessionId: string; productId: string; payload: AddToCartPayload },
  { rejectValue: string }
>(
  'cart/addProductVariantToGuestCart',
  async ({ sessionId, productId, payload }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/guest/${sessionId}/product/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add variant to guest cart');
    }
  }
);

export const removeGuestCartItem = createAsyncThunk<
  Cart,
  { sessionId: string; productId: string },
  { rejectValue: string }
>(
  'cart/removeGuestCartItem',
  async ({ sessionId, productId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/cart/guest/${sessionId}/product/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove guest cart item');
    }
  }
);

// Merge & Discount Thunks

export const mergeCart = createAsyncThunk<
  Cart,
  { sessionId: string },
  { rejectValue: string }
>(
  'cart/mergeCart',
  async ({ sessionId }, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/merge`, {
        method: 'POST',
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to merge cart');
    }
  }
);

export const applyDiscount = createAsyncThunk<
  Cart,
  ApplyDiscountPayload,
  { rejectValue: string }
>(
  'cart/applyDiscount',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/apply-discount`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to apply discount');
    }
  }
);

export const removeDiscount = createAsyncThunk<
  Cart,
  RemoveDiscountPayload,
  { rejectValue: string }
>(
  'cart/removeDiscount',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/remove-discount`, {
        method: 'DELETE',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove discount');
    }
  }
);

export const applyVoucher = createAsyncThunk<
  Cart,
  { code: string },
  { rejectValue: string }
>(
  'cart/applyVoucher',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/apply-voucher`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to apply voucher');
    }
  }
);

export const removeVoucher = createAsyncThunk<
  Cart,
  void,
  { rejectValue: string }
>(
  'cart/removeVoucher',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/cart/remove-voucher`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Cart> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove voucher');
    }
  }
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCartState: (state) => {
      state.cart = null;
      state.cartDetails = null;
      state.validationResult = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Helper function to handle cart updates
    const handleCartFulfilled = (state: CartState, action: PayloadAction<Cart>) => {
      state.loading = false;
      state.cart = action.payload;
    };

    const handleCartDetailsFulfilled = (state: CartState, action: PayloadAction<CartDetails>) => {
      state.loading = false;
      state.cartDetails = action.payload;
    };

    const handlePending = (state: CartState) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state: CartState, action: any) => {
      state.loading = false;
      state.error = action.payload || 'An error occurred';
    };

    // Add to cart
    builder
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleCartFulfilled)
      .addCase(addToCart.rejected, handleRejected);

    // Fetch cart
    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleCartFulfilled)
      .addCase(fetchCart.rejected, handleRejected);

    // Fetch cart details
    builder
      .addCase(fetchCartDetails.pending, handlePending)
      .addCase(fetchCartDetails.fulfilled, handleCartDetailsFulfilled)
      .addCase(fetchCartDetails.rejected, handleRejected);

    // Update cart item
    builder
      .addCase(updateCartItem.pending, handlePending)
      .addCase(updateCartItem.fulfilled, handleCartFulfilled)
      .addCase(updateCartItem.rejected, handleRejected);

    // Remove cart item
    builder
      .addCase(removeCartItem.pending, handlePending)
      .addCase(removeCartItem.fulfilled, handleCartFulfilled)
      .addCase(removeCartItem.rejected, handleRejected);

    // Clear cart
    builder
      .addCase(clearCart.pending, handlePending)
      .addCase(clearCart.fulfilled, handleCartFulfilled)
      .addCase(clearCart.rejected, handleRejected);

    // Validate cart
    builder
      .addCase(validateCart.pending, handlePending)
      .addCase(validateCart.fulfilled, (state, action: PayloadAction<ValidationResult>) => {
        state.loading = false;
        state.validationResult = action.payload;
      })
      .addCase(validateCart.rejected, handleRejected);

    // Guest cart operations
    builder
      .addCase(addToGuestCart.pending, handlePending)
      .addCase(addToGuestCart.fulfilled, handleCartFulfilled)
      .addCase(addToGuestCart.rejected, handleRejected);

    builder
      .addCase(fetchGuestCart.pending, handlePending)
      .addCase(fetchGuestCart.fulfilled, handleCartFulfilled)
      .addCase(fetchGuestCart.rejected, handleRejected);

    builder
      .addCase(fetchGuestCartDetails.pending, handlePending)
      .addCase(fetchGuestCartDetails.fulfilled, handleCartDetailsFulfilled)
      .addCase(fetchGuestCartDetails.rejected, handleRejected);

    builder
      .addCase(updateGuestCartItem.pending, handlePending)
      .addCase(updateGuestCartItem.fulfilled, handleCartFulfilled)
      .addCase(updateGuestCartItem.rejected, handleRejected);

    builder
      .addCase(addProductVariantToGuestCart.pending, handlePending)
      .addCase(addProductVariantToGuestCart.fulfilled, handleCartFulfilled)
      .addCase(addProductVariantToGuestCart.rejected, handleRejected);

    builder
      .addCase(removeGuestCartItem.pending, handlePending)
      .addCase(removeGuestCartItem.fulfilled, handleCartFulfilled)
      .addCase(removeGuestCartItem.rejected, handleRejected);

    // Merge cart
    builder
      .addCase(mergeCart.pending, handlePending)
      .addCase(mergeCart.fulfilled, handleCartFulfilled)
      .addCase(mergeCart.rejected, handleRejected);

    // Discount operations
    builder
      .addCase(applyDiscount.pending, handlePending)
      .addCase(applyDiscount.fulfilled, handleCartFulfilled)
      .addCase(applyDiscount.rejected, handleRejected);

    builder
      .addCase(removeDiscount.pending, handlePending)
      .addCase(removeDiscount.fulfilled, handleCartFulfilled)
      .addCase(removeDiscount.rejected, handleRejected);

    // Voucher operations
    builder
      .addCase(applyVoucher.pending, handlePending)
      .addCase(applyVoucher.fulfilled, handleCartFulfilled)
      .addCase(applyVoucher.rejected, handleRejected);

    builder
      .addCase(removeVoucher.pending, handlePending)
      .addCase(removeVoucher.fulfilled, handleCartFulfilled)
      .addCase(removeVoucher.rejected, handleRejected);
  },
});

export const { clearCartState, clearError } = cartSlice.actions;
export default cartSlice.reducer;
