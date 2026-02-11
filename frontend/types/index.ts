// ============================================
// Core Types for the Restaurant/Cafe SaaS Platform
// ============================================

export interface Plugin {
  key: string
  name: string
  description: string
  is_core: boolean
  is_usable: boolean
}

export interface SitePlugin {
  id: number
  plugin: Plugin
  is_active: boolean
}

export interface Site {
  id: number
  name: string
  slug: string
  logo: string | null
  cover_image: string | null
  category: number
  category_name: string
  theme: number
  theme_name: string
  source_identifier: string
  owner_phone: string
  owner_id: number
  settings: Record<string, any>
  active_plugins: string[] // Array of plugin keys
  required_plugins: string[] // Array of plugin keys required by theme
  created_at: string
}

// User & Authentication
export interface User {
  id: string
  email: string
  name: string
  phone?: string
  avatar?: string
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Restaurant/Cafe (Tenant)
export interface Restaurant {
  id: string
  ownerId: string
  name: string
  slug: string
  description?: string
  logo?: string
  coverImage?: string
  address?: string
  phone?: string
  email?: string
  website?: string
  socialLinks?: SocialLinks
  settings: RestaurantSettings
  subscription: Subscription
  createdAt: Date
  updatedAt: Date
}

export interface SocialLinks {
  instagram?: string
  telegram?: string
  whatsapp?: string
}

export interface RestaurantSettings {
  themeId: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  layoutVariant: 'grid' | 'list' | 'masonry'
  heroStyle: 'full' | 'split' | 'minimal'
  showPrices: boolean
  currency: string
  currencySymbol: string
  isPublished: boolean
  customDomain?: string
  our_story?: string
  working_hours_sat_wed?: string
  working_hours_thu_fri?: string
  address_line?: string
}

// Subscription & Plans
export interface Plan {
  id: string
  name: string
  nameEn: string
  description: string
  price: number
  duration: number // in days
  features: string[]
  isPopular?: boolean
  maxProducts: number
  maxCategories: number
  customDomain: boolean
  analytics: boolean
  support: 'basic' | 'priority' | 'dedicated'
}

export interface Subscription {
  id: string
  planId: string
  status: 'active' | 'expired' | 'cancelled' | 'pending'
  startDate: Date
  endDate: Date
  autoRenew: boolean
}

// Menu & Products
export interface Category {
  id: string
  restaurantId: string
  name: string
  description?: string
  image?: string
  order: number
  isActive: boolean
}

export interface Product {
  id: string
  restaurantId: string
  categoryId: string
  name: string
  description?: string
  price: number
  discountPrice?: number
  image?: string
  images?: string[]
  isAvailable: boolean
  isPopular?: boolean
  tags?: string[]
  nutritionInfo?: NutritionInfo
  order: number
}

export interface NutritionInfo {
  calories?: number
  protein?: number
  carbs?: number
  fat?: number
}

// Payment Gateway
export interface PaymentGateway {
  id: string
  name: string
  provider: 'zarinpal' | 'mellat' | 'parsian' | 'idpay'
  merchantId: string
  isActive: boolean
  isDefault: boolean
}

// Themes
export interface SiteCategory {
  id: number
  name: string
  slug: string
  is_active: boolean
  created_at: string
}

export interface Theme {
  id: number
  name: string
  slug: string
  category: number | null
  category_name: string
  site_types: string[]
  preview_image: string
  preview_url: string | null
  tag?: string | null
  description?: string | null
  source_identifier: string
  config: Record<string, any>
  default_settings: Record<string, any>
  is_active: boolean
  created_at: string
}

// Dashboard Stats
export interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalViews: number
  todayViews: number
  subscriptionDaysLeft: number
}

// Form Types
export interface LoginFormData {
  email: string
  password: string
}

export interface RegisterFormData {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  restaurantName: string
}

export interface ProductFormData {
  name: string
  description?: string
  categoryId: string
  price: number
  discountPrice?: number
  image?: string
  isAvailable: boolean
  isPopular?: boolean
  tags?: string[]
}

export interface CategoryFormData {
  name: string
  description?: string
  image?: string
  isActive: boolean
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}
