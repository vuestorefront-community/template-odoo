const gql = require("graphql-tag");
const orderFragment = require("../fragments/orderFragment.ts");

const loadCart = async (context, variables) => {
  return await context.client.apollo.query({
    fetchPolicy: "no-cache",
    variables,
    query: gql`
      query {
        cart {
          ${orderFragment}
        }
      }
    `,
  });
};

const addToCart = async (context, variables) => {
  return await context.client.apollo.query({
    fetchPolicy: "no-cache",
    variables,
    query: gql`
      mutation($productId: Int!, $quantity: Int!) {
        cartAddItem(productId: $productId, quantity: $quantity) {
          ${orderFragment}
        }
      }
    `,
  });
};

const updateItemQty = async (context, variables) => {
  return await context.client.apollo.query({
    fetchPolicy: "no-cache",
    variables,
    query: gql`
      mutation($lineId: Int!, $quantity: Int!) {
        cartUpdateItem(lineId: $lineId, quantity: $quantity) {
          ${orderFragment}
        }
      }
    `,
  });
};


const removeCartItem = async (context, variables) => {
  return await context.client.apollo.query({
    fetchPolicy: "no-cache",
    variables,
    query: gql`
      mutation ($lineId: Int!) {
        cartRemoveItem(lineId: $lineId) {
          ${orderFragment}
        }
      }
    `,
  });
};

module.exports = {
  loadCart,
  addToCart,
  updateItemQty,
  removeCartItem,
};
