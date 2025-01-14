import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Order } from "@/types";
import { OrderService, CreateOrderInput } from "@/lib/services/order.service";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (orderData: CreateOrderInput) => {
    const response = await OrderService.createOrder(orderData);
    return response.data;
  }
);

export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await OrderService.getOrders();
  return response.data;
});

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (orderId: string) => {
    const response = await OrderService.getOrder(orderId);
    return response.data;
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to create order";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch order";
      });
  },
});

export default orderSlice.reducer;
