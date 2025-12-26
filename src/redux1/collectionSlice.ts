// src/redux1/collectionSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Base URL - Use Vite's import.meta.env
const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// TypeScript Interfaces based on your API response
interface ImageUrl {
  url: string;
  publicId: string;
  _id: string;
}

interface Collection {
  _id: string;
  name: string;
  imageUrls: string[];
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ProductVariant {
  karat: number;
  sku: string;
  price: number;
  stock: number;
  grossWeight: number;
  isAvailable: boolean;
  _id: string;
}

interface Product {
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
  imageUrl: ImageUrl[];
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

interface CollectionWithProducts {
  collection: Collection;
  products: Product[];
  totalProducts: number;
}

// Initial state
interface CollectionState {
  collections: Collection[];
  selectedCollection: Collection | null;
  collectionProducts: CollectionWithProducts | null;
  loading: boolean;
  collectionLoading: boolean;
  productsLoading: boolean;
  error: string | null;
  collectionError: string | null;
  productsError: string | null;
}

const initialState: CollectionState = {
  collections: [],
  selectedCollection: null,
  collectionProducts: null,
  loading: false,
  collectionLoading: false,
  productsLoading: false,
  error: null,
  collectionError: null,
  productsError: null,
};

// Thunk 1: Fetch all collections
export const fetchAllCollections = createAsyncThunk<
  Collection[],
  void,
  { rejectValue: string }
>(
  'collection/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/collection/`);
      if (!response.ok) throw new Error('Failed to fetch collections');
      const result = await response.json();
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Thunk 2: Fetch single collection by ID
export const fetchCollectionById = createAsyncThunk<
  Collection,
  string,
  { rejectValue: string }
>(
  'collection/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/collection/${id}`);
      if (!response.ok) throw new Error('Failed to fetch collection');
      const result = await response.json();
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Thunk 3: Fetch collection with products by ID
export const fetchCollectionProducts = createAsyncThunk<
  CollectionWithProducts,
  string,
  { rejectValue: string }
>(
  'collection/fetchProducts',
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/collection/${id}/products`);
      if (!response.ok) throw new Error('Failed to fetch collection products');
      const result = await response.json();
      return result.data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Create slice
const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {
    clearSelectedCollection: (state) => {
      state.selectedCollection = null;
      state.collectionError = null;
    },
    clearCollectionProducts: (state) => {
      state.collectionProducts = null;
      state.productsError = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.collectionError = null;
      state.productsError = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all collections
    builder
      .addCase(fetchAllCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCollections.fulfilled, (state, action: PayloadAction<Collection[]>) => {
        state.loading = false;
        state.collections = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch collections';
      });

    // Fetch collection by ID
    builder
      .addCase(fetchCollectionById.pending, (state) => {
        state.collectionLoading = true;
        state.collectionError = null;
      })
      .addCase(fetchCollectionById.fulfilled, (state, action: PayloadAction<Collection>) => {
        state.collectionLoading = false;
        state.selectedCollection = action.payload;
        state.collectionError = null;
      })
      .addCase(fetchCollectionById.rejected, (state, action) => {
        state.collectionLoading = false;
        state.collectionError = action.payload || 'Failed to fetch collection';
      });

    // Fetch collection products
    builder
      .addCase(fetchCollectionProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchCollectionProducts.fulfilled, (state, action: PayloadAction<CollectionWithProducts>) => {
        state.productsLoading = false;
        state.collectionProducts = action.payload;
        state.productsError = null;
      })
      .addCase(fetchCollectionProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload || 'Failed to fetch collection products';
      });
  },
});

// Export actions
export const { clearSelectedCollection, clearCollectionProducts, clearErrors } = collectionSlice.actions;

// Export reducer
export default collectionSlice.reducer;
