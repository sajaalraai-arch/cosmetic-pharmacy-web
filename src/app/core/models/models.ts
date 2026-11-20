

export interface CurrentUser {
  customerId: number;
  fullName: string;
  email: string;
  role: string;
}

export interface ApiMessage {
  message: string;
  canDeactivate?: boolean;
}

export interface Category {
  categoryId: number;
  categoryName: string;
  categoryImage?: string | null;
  isActive: boolean;
  productsCount: number;
}

export interface ProductListItem {
  productId: number;
  productName?: string | null;
  mainImageUrl?: string | null;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
  expiryDate: string;
  isActive: boolean;
  targetType?: string | null;
  barcode?: string | null;
  size?: string | null;
  categoryId?: number | null;
  categoryName?: string | null;
  brand?: string | null;
}

export interface ProductImage {
  imageId: number;
  imageUrl: string;
}

export interface ProductDetails extends ProductListItem {
  productSlug?: string | null;
  countryOfOrigin?: string | null;
  productDescription?: string | null;
  ingredients?: string | null;
  usageInstructions?: string | null;
  productImages: ProductImage[];
}

export interface ProductStats {
  totalProducts: number;
  lowStock: number;
  expiringSoon: number;
  activeItems: number;
}

export interface ProductsIndex {
  stats: ProductStats;
  products: ProductListItem[];
  categoryName?: string | null;
}

export interface HomeData {
  categories: Category[];
  topProducts: ProductListItem[];
}

export interface DashboardData {
  totalUsers: number;
  totalOrders: number;
  inventoryValue: number;
  latestProducts: ProductListItem[];
}

export interface CartItem {
  productId: number;
  productName?: string | null;
  mainImageUrl?: string | null;
  categoryName?: string | null;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface CartSummary {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
}

export interface Cart {
  items: CartItem[];
  summary: CartSummary;
  coupon?: string | null;
  itemsCount: number;
  couponApplied: boolean;
  discountPercent: number;
  couponMessage?: string | null;
}

export interface PlaceOrderRequest {
  fullName: string;
  city: string;
  address: string;
  phone: string;
  paymentMethod: string;
}

export interface OrderListItem {
  orderId: number;
  customerId: number;
  customerName?: string | null;
  orderDate: string;
  totalPrice: number;
  orderStateId: number;
  stateName?: string | null;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  todayOrders: number;
}

export interface OrderState {
  orderStateId: number;
  nameState: string;
}

export interface OrdersIndex {
  stats: OrderStats;
  orders: OrderListItem[];
  states: OrderState[];
}

export interface OrderFilter {
  searchString?: string;
  statusId?: string;
  fromDate?: string;
  toDate?: string;
  sortOrder?: string;
  customerId?: number | null;
}

export interface OrderItemRow {
  productId: number;
  productName?: string | null;
  mainImageUrl?: string | null;
  categoryId?: number | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderDetails extends OrderListItem {
  customerEmail?: string | null;
  contactPhone: string;
  shippingAddress: string;
  city: string;
  paymentMethod?: string | null;
  items: OrderItemRow[];
}

export interface Customer {
  customerId: number;
  fullName: string;
  email: string;
  userRole?: string | null;
  userStatus?: string | null;
  createdAt?: string | null;
  lastLogin?: string | null;
}

export interface CustomersIndex {
  totalUsers: number;
  activeUsers: number;
  bannedUsers: number;
  customers: Customer[];
}

export interface CommentItem {
  id: number;
  content: string;
  rating?: number | null;
  createdAt: string;
  productId: number;
  customerId: number;
  customerName?: string | null;
}
