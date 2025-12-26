import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

const BASE_URL = 'https://kk-server-lqp8.onrender.com';

// Types
export interface Address {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  phone: string;
}

export interface AppliedDiscount {
  code?: string;
  discountId?: string;
  discountAmount?: number;
}

export interface OrderItem {
  product: string;
  productName: string;
  productId: string;
  productImage: string;
  quantity: number;
  karat: number;
  stoneType?: string;
  sku: string;
  selectedImage: string;
  priceAtPurchase: number;
  grossWeight: number;
  itemTotal: number;
  _id: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
  subtotal: number;
  totalDiscountAmount: number;
  shippingCharge: number;
  taxAmount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  paymentMethod: 'cod' | 'online' | 'card' | 'upi';
  paymentStatus: 'created' | 'pending' | 'completed' | 'failed' | 'refunded';
  appliedCoupon?: AppliedDiscount;
  appliedVoucher?: AppliedDiscount;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface CreateOrderPayload {
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: 'cod' | 'online' | 'card' | 'upi';
  notes?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  orderNumber: string;
  total: number;
  itemCount: number;
  status: string;
}

export interface OrderListResponse {
  orders: Order[];
  total: number;
  totalPages: number;
}

export interface OrderStats {
  _id: string;
  count: number;
  totalAmount: number;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  success: boolean;
}

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  orderStats: OrderStats[];
  createOrderResponse: CreateOrderResponse | null;
  pagination: {
    total: number;
    totalPages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  selectedOrder: null,
  orderStats: [],
  createOrderResponse: null,
  pagination: {
    total: 0,
    totalPages: 0,
  },
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

export const createOrder = createAsyncThunk<
  CreateOrderResponse,
  CreateOrderPayload,
  { rejectValue: string }
>(
  'order/createOrder',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/order`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<CreateOrderResponse> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const fetchOrders = createAsyncThunk<
  OrderListResponse,
  void,
  { rejectValue: string }
>(
  'order/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/order`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<OrderListResponse> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

export const fetchOrderById = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>(
  'order/fetchOrderById',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/order/${orderId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Order> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

export const fetchOrderStats = createAsyncThunk<
  OrderStats[],
  void,
  { rejectValue: string }
>(
  'order/fetchOrderStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/order/stats`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<OrderStats[]> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch order stats');
    }
  }
);

export const cancelOrder = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/order/${orderId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Order> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel order');
    }
  }
);

export const returnOrder = createAsyncThunk<
  Order,
  string,
  { rejectValue: string }
>(
  'order/returnOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await authenticatedFetch(`${BASE_URL}/order/${orderId}/return`, {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Order> = await response.json();
      return result.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to return order');
    }
  }
);

// Slice
const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    clearCreateOrderResponse: (state) => {
      state.createOrderResponse = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.pagination = { total: 0, totalPages: 0 };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Create Order
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<CreateOrderResponse>) => {
        state.loading = false;
        state.createOrderResponse = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create order';
      });

    // Fetch Orders
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OrderListResponse>) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = {
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch orders';
      });

    // Fetch Order By ID
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order';
      });

    // Fetch Order Stats
    builder
      .addCase(fetchOrderStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStats.fulfilled, (state, action: PayloadAction<OrderStats[]>) => {
        state.loading = false;
        state.orderStats = action.payload;
      })
      .addCase(fetchOrderStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch order stats';
      });

    // Cancel Order
    builder
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.selectedOrder = action.payload;
        
        // Update order in the orders list
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to cancel order';
      });

    // Return Order
    builder
      .addCase(returnOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(returnOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false;
        state.selectedOrder = action.payload;
        
        // Update order in the orders list
        const index = state.orders.findIndex(order => order._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(returnOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to return order';
      });
  },
});

export const { 
  clearSelectedOrder, 
  clearCreateOrderResponse, 
  clearOrders, 
  clearError 
} = orderSlice.actions;

export default orderSlice.reducer;

// Selectors
export const selectOrders = (state: { order: OrderState }) => state.order.orders;

export const selectOrdersByStatus = (state: { order: OrderState }, status: Order['status']) =>
  state.order.orders.filter(order => order.status === status);

export const selectPendingOrders = (state: { order: OrderState }) =>
  state.order.orders.filter(order => order.status === 'pending');

export const selectCompletedOrders = (state: { order: OrderState }) =>
  state.order.orders.filter(order => order.status === 'delivered');

export const selectTotalOrderValue = (state: { order: OrderState }) =>
  state.order.orders.reduce((sum, order) => sum + order.total, 0);

export const selectOrderStatsById = (state: { order: OrderState }, statusId: string) =>
  state.order.orderStats.find(stat => stat._id === statusId);