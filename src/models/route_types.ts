import { RouteProp } from "@react-navigation/native"
import { ItemsData, RefundListResponse, ShowBillData } from "./api_types"

type RootStackParamList = {
  ProductsScreen: {
    added_products: ItemsData[]
    net_total: number
    total_discount: number
    table_no?: number
  }
  CategoriesScreen: {
    category_id: number
    category_name: string
    category_photo?: string
    navigatedFromCamera?: boolean
    barcode?: string
  }
  CategoryProductsScreen: {
    added_products: ItemsData[]
    net_total: number
    total_discount: number
  }
  CategoryProductScreen: {
    product: ItemsData
    categoryName: string
  }
  CameraScreen: {
    barcode: string,
    navigatedFromCamera: boolean
    // routeLength: number
  }
  RefundItemsScreen: {
    // billed_sale_data: ShowBillData[]
    customer_phone_number: string
    bills_data: RefundListResponse[]
  }
  ReceiptsAgainstMobileScreen: {
    billed_sale_data: ShowBillData[]
    // customer_phone_number: string
  }
}

type ProductsScreenRouteProp = RouteProp<RootStackParamList, "ProductsScreen">
type CategoriesScreenRouteProp = RouteProp<RootStackParamList, "CategoriesScreen">
type CategoryProductsScreenRouteProp = RouteProp<RootStackParamList, "CategoryProductsScreen">
type CategoryProductScreenRouteProp = RouteProp<RootStackParamList, "CategoryProductScreen">
type CameraScreenRouteProp = RouteProp<RootStackParamList, "CameraScreen">
type RefundItemsScreenRouteProp = RouteProp<
  RootStackParamList,
  "RefundItemsScreen"
>
type ReceiptsAgainstMobileScreenRouteProp = RouteProp<
  RootStackParamList,
  "ReceiptsAgainstMobileScreen"
>

export type {
  ProductsScreenRouteProp,
  CategoriesScreenRouteProp,
  CategoryProductsScreenRouteProp,
  CameraScreenRouteProp,
  RefundItemsScreenRouteProp,
  ReceiptsAgainstMobileScreenRouteProp,
  CategoryProductScreenRouteProp
}
