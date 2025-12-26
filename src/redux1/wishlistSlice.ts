import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface ColorPreference {
  name: string;
  hexCode: string;
}

export interface ItemPreferences {
  selectedColor?: ColorPreference;
  selectedSize?: string;
  selectedImage?: string;
}

export interface SelectedVariant {
  karat: number;
  sku: string;
  stoneType?: string;
  priceWhenAdded: number;
}

export interface WishlistItem {
  _id: string;
  product: string;
  addedAt: string;
  priceWhenAdded: number;
  priceDropAlert: boolean;
  selectedVariant: SelectedVariant;
  preferences: ItemPreferences;
}

export interface Wishlist {
  _id: string;
  user: string;
  name: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateWishlistPayload {
  isPublic: boolean;
  name?: string;
}

export interface AddToWishlistPayload {
  productId: string;
  priceWhenAdded: number;
  selectedVariant: SelectedVariant;
  preferences?: ItemPreferences;
}

export interface UpdateWishlistItemPayload {
  productId: string;
  selectedVariant: SelectedVariant;
}

export interface MoveToCartPayload {
  productId: string;
  karat: number;
  sku: string;
  selectedImage?: string;
  quantity: number;
  selectedSize?: string;
}

export interface WishlistCountResponse {
  count: number;
}

export interface CheckItemResponse {
  inWishlist: boolean;
  item?: WishlistItem;
}

export interface ToggleWishlistResponse {
  action: 'added' | 'removed';
  wishlist: Wishlist;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
}

interface WishlistState {
  wishlist: Wishlist | null;
  wishlistCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  wishlist: null,
  wishlistCount: 0,
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

export const createWishlist = createAsyncThunk<
  Wishlist,
  CreateWishlistPayload,
  { rejectValue: string }
>(
  'wishlist/createWishlist',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/wishlist/create`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Wishlist> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create wishlist');
    }
  }
);

export const fetchWishlist = createAsyncThunk<
  Wishlist,
  void,
  { rejectValue: string }
>(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/wishlist`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Wishlist> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist');
    }
  }
);

export const fetchWishlistCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>(
  'wishlist/fetchWishlistCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/wishlist/count`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<WishlistCountResponse> = await response.json();
      return result.data.count;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist count');
    }
  }
);

export const addToWishlist = createAsyncThunk<
  Wishlist,
  AddToWishlistPayload,
  { rejectValue: string }
>(
  'wishlist/addToWishlist',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/wishlist/add`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Wishlist> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to add item to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk<
  { wishlist: Wishlist; productId: string },
  string,
  { rejectValue: string }
>(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/wishlist/remove/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Wishlist> = await response.json();
      return { wishlist: result.data, productId };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to remove item from wishlist');
    }
  }
);

export const checkItemInWishlist = createAsyncThunk<
  CheckItemResponse,
  string,
  { rejectValue: string }
>(
  'wishlist/checkItemInWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/wishlist/check/${productId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<CheckItemResponse> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to check item in wishlist');
    }
  }
);

export const toggleWishlist = createAsyncThunk<
  ToggleWishlistResponse,
  AddToWishlistPayload,
  { rejectValue: string }
>(
  'wishlist/toggleWishlist',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/wishlist/toggle`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<ToggleWishlistResponse> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to toggle wishlist item');
    }
  }
);

export const updateWishlistItem = createAsyncThunk<
  Wishlist,
  UpdateWishlistItemPayload,
  { rejectValue: string }
>(
  'wishlist/updateWishlistItem',
  async ({ productId, selectedVariant }, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/wishlist/item/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ selectedVariant }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Wishlist> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update wishlist item');
    }
  }
);

export const fetchWishlistByVariant = createAsyncThunk<
  Wishlist,
  { karat?: number; stoneType?: string },
  { rejectValue: string }
>(
  'wishlist/fetchWishlistByVariant',
  async (params, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.karat) queryParams.append('karat', params.karat.toString());
      if (params.stoneType) queryParams.append('stoneType', params.stoneType);

      const response = await authenticatedFetch(
        `${BASE_URL}/wishlist/by-variant?${queryParams.toString()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Wishlist> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch wishlist by variant');
    }
  }
);

export const syncWishlistPrices = createAsyncThunk<
  Wishlist,
  void,
  { rejectValue: string }
>(
  'wishlist/syncWishlistPrices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/wishlist/sync-prices`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Wishlist> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to sync wishlist prices');
    }
  }
);

export const moveToCart = createAsyncThunk<
  { wishlist: Wishlist; cart: any },
  { productId: string; payload: MoveToCartPayload },
  { rejectValue: string }
>(
  'wishlist/moveToCart',
  async ({ productId, payload }, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(
        `${BASE_URL}/wishlist/move-to-cart/${productId}`,
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<{ wishlist: Wishlist; cart: any }> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to move item to cart');
    }
  }
);

// Slice
const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.wishlist = null;
      state.wishlistCount = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Helper function to handle wishlist updates
    const handleWishlistFulfilled = (state: WishlistState, action: PayloadAction<Wishlist>) => {
      state.loading = false;
      state.wishlist = action.payload;
      state.wishlistCount = action.payload.items.length;
    };

    const handlePending = (state: WishlistState) => {
      state.loading = true;
      state.error = null;
    };

    const handleRejected = (state: WishlistState, action: any) => {
      state.loading = false;
      state.error = action.payload || 'An error occurred';
    };

    // Create Wishlist
    builder
      .addCase(createWishlist.pending, handlePending)
      .addCase(createWishlist.fulfilled, handleWishlistFulfilled)
      .addCase(createWishlist.rejected, handleRejected);

    // Fetch Wishlist
    builder
      .addCase(fetchWishlist.pending, handlePending)
      .addCase(fetchWishlist.fulfilled, handleWishlistFulfilled)
      .addCase(fetchWishlist.rejected, handleRejected);

    // Fetch Wishlist Count
    builder
      .addCase(fetchWishlistCount.pending, handlePending)
      .addCase(fetchWishlistCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.wishlistCount = action.payload;
      })
      .addCase(fetchWishlistCount.rejected, handleRejected);

    // Add to Wishlist
    builder
      .addCase(addToWishlist.pending, handlePending)
      .addCase(addToWishlist.fulfilled, handleWishlistFulfilled)
      .addCase(addToWishlist.rejected, handleRejected);

    // Remove from Wishlist
    builder
      .addCase(removeFromWishlist.pending, handlePending)
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        if (state.wishlist) {
          state.wishlist.items = state.wishlist.items.filter(item => item.product !== action.payload.productId);
          state.wishlistCount = state.wishlist.items.length;
        }
      })
      .addCase(removeFromWishlist.rejected, handleRejected);

    // Toggle Wishlist
    builder
      .addCase(toggleWishlist.pending, handlePending)
      .addCase(toggleWishlist.fulfilled, (state, action: PayloadAction<ToggleWishlistResponse>) => {
        state.loading = false;
        state.wishlist = action.payload.wishlist;
        state.wishlistCount = action.payload.wishlist.items.length;
      })
      .addCase(toggleWishlist.rejected, handleRejected);

    // Update Wishlist Item
    builder
      .addCase(updateWishlistItem.pending, handlePending)
      .addCase(updateWishlistItem.fulfilled, handleWishlistFulfilled)
      .addCase(updateWishlistItem.rejected, handleRejected);

    // Fetch Wishlist by Variant
    builder
      .addCase(fetchWishlistByVariant.pending, handlePending)
      .addCase(fetchWishlistByVariant.fulfilled, handleWishlistFulfilled)
      .addCase(fetchWishlistByVariant.rejected, handleRejected);

    // Sync Wishlist Prices
    builder
      .addCase(syncWishlistPrices.pending, handlePending)
      .addCase(syncWishlistPrices.fulfilled, handleWishlistFulfilled)
      .addCase(syncWishlistPrices.rejected, handleRejected);

    // Move to Cart
    builder
      .addCase(moveToCart.pending, handlePending)
      .addCase(moveToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload.wishlist;
        state.wishlistCount = action.payload.wishlist.items.length;
      })
      .addCase(moveToCart.rejected, handleRejected);
  },
});

export const { clearWishlist, clearError } = wishlistSlice.actions;
export default wishlistSlice.reducer;

// Selectors
export const selectWishlist = (state: { wishlist: WishlistState }) => state.wishlist.wishlist;

export const selectWishlistItems = (state: { wishlist: WishlistState }) =>
  state.wishlist.wishlist?.items || [];

export const selectWishlistCount = (state: { wishlist: WishlistState }) =>
  state.wishlist.wishlistCount;

export const selectIsInWishlist = (state: { wishlist: WishlistState }, productId: string) =>
  state.wishlist.wishlist?.items.some(item => item.product === productId) || false;

export const selectWishlistItemByProductId = (state: { wishlist: WishlistState }, productId: string) =>
  state.wishlist.wishlist?.items.find(item => item.product === productId);
