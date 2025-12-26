import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface MobileBanner {
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

interface MobileBannerState {
  mobileBanners: MobileBanner[];
  activeMobileBannerIndex: number;
  loading: boolean;
  error: string | null;
}

const initialState: MobileBannerState = {
  mobileBanners: [],
  activeMobileBannerIndex: 0,
  loading: false,
  error: null,
};

// Async Thunks

export const fetchMobileBanners = createAsyncThunk<
  MobileBanner[],
  void,
  { rejectValue: string }
>(
  'mobileBanner/fetchMobileBanners',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/mobile-banner`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<MobileBanner[]> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch mobile banners'
      );
    }
  }
);

// Slice
const mobileBannerSlice = createSlice({
  name: 'mobileBanner',
  initialState,
  reducers: {
    setActiveMobileBannerIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.mobileBanners.length) {
        state.activeMobileBannerIndex = action.payload;
      }
    },
    nextMobileBanner: (state) => {
      if (state.mobileBanners.length > 0) {
        state.activeMobileBannerIndex = 
          (state.activeMobileBannerIndex + 1) % state.mobileBanners.length;
      }
    },
    previousMobileBanner: (state) => {
      if (state.mobileBanners.length > 0) {
        state.activeMobileBannerIndex = 
          state.activeMobileBannerIndex === 0 
            ? state.mobileBanners.length - 1 
            : state.activeMobileBannerIndex - 1;
      }
    },
    resetMobileBannerIndex: (state) => {
      state.activeMobileBannerIndex = 0;
    },
    clearMobileBanners: (state) => {
      state.mobileBanners = [];
      state.activeMobileBannerIndex = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMobileBanners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMobileBanners.fulfilled, (state, action: PayloadAction<MobileBanner[]>) => {
        state.loading = false;
        state.mobileBanners = action.payload;
        state.activeMobileBannerIndex = 0;
      })
      .addCase(fetchMobileBanners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const {
  setActiveMobileBannerIndex,
  nextMobileBanner,
  previousMobileBanner,
  resetMobileBannerIndex,
  clearMobileBanners,
  clearError,
} = mobileBannerSlice.actions;

export default mobileBannerSlice.reducer;

// Selectors
export const selectMobileBanners = (state: { mobileBanner: MobileBannerState }) => 
  state.mobileBanner.mobileBanners;

export const selectActiveMobileBanner = (state: { mobileBanner: MobileBannerState }) => {
  const { mobileBanners, activeMobileBannerIndex } = state.mobileBanner;
  return mobileBanners[activeMobileBannerIndex] || null;
};

export const selectActiveMobileBannerIndex = (state: { mobileBanner: MobileBannerState }) => 
  state.mobileBanner.activeMobileBannerIndex;

export const selectMobileBannerCount = (state: { mobileBanner: MobileBannerState }) => 
  state.mobileBanner.mobileBanners.length;
