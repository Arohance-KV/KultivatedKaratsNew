import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface Discount {
  _id: string;
  code: string;
  type: 'coupon' | 'voucher';
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  applicableCategories: string[];
  excludedProducts: string[];
  validUntil: string;
  usageLimit: number;
  usedCount: number;
  usedBy: string[];
  isActive: boolean;
  validFrom: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
}

interface DiscountState {
  activeDiscounts: Discount[];
  loading: boolean;
  error: string | null;
}

const initialState: DiscountState = {
  activeDiscounts: [],
  loading: false,
  error: null,
};

// Async Thunks

export const fetchActiveDiscounts = createAsyncThunk<
  Discount[],
  void,
  { rejectValue: string }
>(
  'discount/fetchActiveDiscounts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/discount/active`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Discount[]> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch active discounts'
      );
    }
  }
);

// Slice
const discountSlice = createSlice({
  name: 'discount',
  initialState,
  reducers: {
    clearDiscounts: (state) => {
      state.activeDiscounts = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveDiscounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveDiscounts.fulfilled, (state, action: PayloadAction<Discount[]>) => {
        state.loading = false;
        state.activeDiscounts = action.payload;
      })
      .addCase(fetchActiveDiscounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { clearDiscounts, clearError } = discountSlice.actions;
export default discountSlice.reducer;

// Selectors
export const selectActiveDiscounts = (state: { discount: DiscountState }) => 
  state.discount.activeDiscounts;

export const selectActiveCoupons = (state: { discount: DiscountState }) =>
  state.discount.activeDiscounts.filter(discount => discount.type === 'coupon');

export const selectActiveVouchers = (state: { discount: DiscountState }) =>
  state.discount.activeDiscounts.filter(discount => discount.type === 'voucher');

export const selectDiscountByCode = (state: { discount: DiscountState }, code: string) =>
  state.discount.activeDiscounts.find(discount => discount.code === code);

export const selectPercentageDiscounts = (state: { discount: DiscountState }) =>
  state.discount.activeDiscounts.filter(discount => discount.discountType === 'percentage');

export const selectFixedDiscounts = (state: { discount: DiscountState }) =>
  state.discount.activeDiscounts.filter(discount => discount.discountType === 'fixed');
