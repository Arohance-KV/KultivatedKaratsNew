import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface Banner {
  _id: string;
  name: string;
  link: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
}

interface BannerState {
  banners: Banner[];
  activeBannerIndex: number;
  loading: boolean;
  error: string | null;
}

const initialState: BannerState = {
  banners: [],
  activeBannerIndex: 0,
  loading: false,
  error: null,
};

// Async Thunks

export const fetchBanners = createAsyncThunk<
  Banner[],
  void,
  { rejectValue: string }
>(
  'banner/fetchBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/banner`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Banner[]> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch banners'
      );
    }
  }
);

// Slice
const bannerSlice = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    setActiveBannerIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.banners.length) {
        state.activeBannerIndex = action.payload;
      }
    },
    nextBanner: (state) => {
      if (state.banners.length > 0) {
        state.activeBannerIndex = (state.activeBannerIndex + 1) % state.banners.length;
      }
    },
    previousBanner: (state) => {
      if (state.banners.length > 0) {
        state.activeBannerIndex = 
          state.activeBannerIndex === 0 
            ? state.banners.length - 1 
            : state.activeBannerIndex - 1;
      }
    },
    resetBannerIndex: (state) => {
      state.activeBannerIndex = 0;
    },
    clearBanners: (state) => {
      state.banners = [];
      state.activeBannerIndex = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBanners.fulfilled, (state, action: PayloadAction<Banner[]>) => {
        state.loading = false;
        state.banners = action.payload;
        state.activeBannerIndex = 0; // Reset to first banner when new data loads
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const {
  setActiveBannerIndex,
  nextBanner,
  previousBanner,
  resetBannerIndex,
  clearBanners,
  clearError,
} = bannerSlice.actions;

export default bannerSlice.reducer;

// Selectors
export const selectBanners = (state: { banner: BannerState }) => state.banner.banners;

export const selectActiveBanner = (state: { banner: BannerState }) => {
  const { banners, activeBannerIndex } = state.banner;
  return banners[activeBannerIndex] || null;
};

export const selectActiveBannerIndex = (state: { banner: BannerState }) => 
  state.banner.activeBannerIndex;

export const selectBannerCount = (state: { banner: BannerState }) => 
  state.banner.banners.length;
