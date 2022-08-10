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
    orderLines {
      id
      name
      product {
        ${coreProductAttribs}
      }
      quantity
      priceTotal
    }
    customerId {
      id
      firstName
      lastName
      phone
      email
    }
    remoteCustomerId {
      id
      firstName
      lastName
      phone
      email
    }
    receivingAgentId {
      id
      name
      county {
        id
        name
      }
      town {
        id
        name
      }
      village {
        id
        name
      }
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
    rcComments
    raComments
  }
`;

module.exports = query;
