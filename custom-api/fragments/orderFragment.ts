const coreProductAttribs = `
    id
    name
    image
    description
    smallImage
    displayName
    slug
    status
    price
    combinationInfo,
    sku
    productTemplate {
      id
      name
      image
      sku
      slug
    }
`;

const query = `
  order {
    id
    name
    amountTotal
    amountTax
    amountDelivery
    amountDiscounts
    dateOrder
    orderUrl
    stage
    websiteOrderLine {
      id
      name
      product {
        ${coreProductAttribs}
      }
      quantity
      priceTotal
    }
    lastTransaction{
      payment{
        name
        amount
        paymentReference
      }
      acquirer
      state
      amount
    }
    orderLines {
      id
      name
      product {
        ${coreProductAttribs}
      }
      quantity
      priceTotal
    }
     partnerInvoice {
      id
      name
      street
      phone
      country {
        id
      }
      city
      phone
      zip
    }
    partnerShipping {
      id
      name
      street
      city
      phone
      zip
      country {
        id
      }
    }
    shippingMethod{
      id
      name
      price
    }
  }
`;

module.exports = query;
