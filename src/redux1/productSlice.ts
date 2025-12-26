import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface ProductVariant {
  karat: number;
  sku: string;
  price: number;
  stock: number;
  grossWeight: number;
  isAvailable: boolean;
  _id: string;
}

export interface ProductImage {
  url: string;
  publicId: string;
  _id: string;
}

export interface Product {
  _id: string;
  productId: string;
  name: string;
  categoryIds: string[];
  subCategoryIds: string[];
  collectionIds: string[];
  goldWeight: number;
  diamondWeight: number;
  netWeight: number;
  solitareWeight: number;
  noOfSolitares: number;
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

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,
};

// Async Thunks
export const fetchAllProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>(
  'product/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/product`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Product[]> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch products'
      );
    }
  }
);

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>(
  'product/fetchProductById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/product/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Product> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch product'
      );
    }
  }
);

export const fetchProductByProductId = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>(
  'product/fetchProductByProductId',
  async (productId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/product/by-product-id/${productId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result: ApiResponse<Product> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || 'Failed to fetch product by productId'
      );
    }
  }
);

// Slice
const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch All Products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });

    // Fetch Product By ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });

    // Fetch Product By ProductId
    builder
      .addCase(fetchProductByProductId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductByProductId.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductByProductId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred';
      });
  },
});

export const { clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;
