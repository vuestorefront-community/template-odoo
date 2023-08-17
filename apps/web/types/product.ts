export interface Discount {
  list_price?: string;
  has_discounted_price?: boolean;
  price?: string;
}
export interface CombinationInfo {
  combinationInfoVariant: Discount;
}
export interface Price {
  firstVariant?: CombinationInfo;
}
