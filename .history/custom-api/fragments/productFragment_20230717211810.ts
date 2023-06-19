export default `
  id
  firstVariant{
    id
    combinationInfoVariant
<<<<<<< HEAD
    slug
    variantAttributeValues{
      id
      name
      attribute{
        id
        name
      }
    }
=======
>>>>>>> 91126d1 (Update vsf/odoo version and update firstVariant from number to Product)
  }
  smallImage
  price
  name
  description
  image
  imageFilename
  combinationInfo
  slug
  sku
  jsonLd
  isInWishlist
  categories {
    id
    name
    slug
    parent{
      parent{
        id
      }
    }
  }
  attributeValues {
    id
    name
    displayType
    priceExtra
    attribute {
      id
      name
    }
    search
  }
`;
