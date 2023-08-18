import { Price } from '@/types/product';

export const useProductAttributes: any = () => {
  const getRegularPrice = (product: Price) => {
    if (product.firstVariant && product.firstVariant.combinationInfoVariant) {
      return product.firstVariant.combinationInfoVariant.list_price;
    }
  };

  const getSpecialPrice = (product: Price) => {
    if (
      product.firstVariant &&
      product.firstVariant.combinationInfoVariant.has_discounted_price
    ) {
      return product.firstVariant.combinationInfoVariant.price;
    }
  };
  return { getRegularPrice, getSpecialPrice };
};
