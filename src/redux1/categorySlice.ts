import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface Category {
  _id: string;
  categoryId: string;
  name: string;
  subCategoryIds: string[];
  imageUrl: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ColorOption {
  name: string;
  hexCode: string;
  _id: string;
  imageUrls: string[];
}

export interface StoneType {
  type: string;
  label: string;
  isAvailable: boolean;
  _id: string;
}

export interface CustomizationOptions {
  hasColorOptions: boolean;
  colors: ColorOption[];
  hasSizeOptions: boolean;
  sizes: string[];
  hasStoneTypeOptions: boolean;
  stoneTypes: StoneType[];
}

export interface ProductImage {
  url: string;
  publicId: string;
  _id: string;
}

export interface ProductVariant {
  karat: number;
  stoneType?: string;
  sku: string;
  price: number;
  stock: number;
  grossWeight: number;
  isAvailable: boolean;
  _id: string;
}

export interface CategoryProduct {
  _id: string;
  productId: string;
  name: string;
  categoryIds: string[];
  subCategoryIds: string[];
  collectionIds: string[];
  customizationOptions: CustomizationOptions;
  goldWeight: number;
  diamondWeight: number;
  netWeight: number;
  solitareWeight: number;
  noOfSolitares: number | null;
  noOfMultiDiamonds: number;
  multiDiamondWeight: number;
  totalKarats: any[];
  gender: string;
  shapeOfSolitare: string;
  shapeOfMultiDiamonds: string;
  shapeOfPointers: string;
  noOfPointers: number;
  gemStoneColour: string[];
  description: string;
  quantitySold: number;
  imageUrl: ProductImage[];
  isPendantFixed: boolean;
  containsGemstone: boolean;
  gemStoneWeightSol: number;
  isMrpProduct: boolean;
  pointersWeight: number;
  gemStoneWeightPointer: number;
  variants: ProductVariant[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
}

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  categoryProducts: CategoryProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  selectedCategory: null,
  categoryProducts: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAllCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>(
  'category/fetchAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/category`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Category[]> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch categories'
      );
    }
  }
);

export const fetchCategoryById = createAsyncThunk<
  Category,
  string,
  { rejectValue: string }
>(
  'category/fetchCategoryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Category> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch category'
      );
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk<
  CategoryProduct[],
  string,
  { rejectValue: string }
>(
  'category/fetchProductsByCategory',
  async (categoryId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/category/${categoryId}/products`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<CategoryProduct[]> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch category products'
      );
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Categories
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });

    // Fetch Category By ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });

    // Fetch Products By Category
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<CategoryProduct[]>) => {
        state.loading = false;
        state.categoryProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { clearSelectedCategory, clearCategoryProducts, clearError } = categorySlice.actions;
export default categorySlice.reducer;
