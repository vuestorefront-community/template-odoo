const gql = require("graphql-tag");

const addShippingAddress = async (context, variables) => {
  return await context.client.apollo.query({
    fetchPolicy: "no-cache",
    variables,
    query: gql`
      mutation (
        $name: String!
        $city: String
        $countryId: Int!
        $phone: String!
        $stateId: Int
        $street: String!
        $zip: String!
      ) {
        addAddress(
          type: Shipping
          address: {
            name: $name
            city: $city
            countryId: $countryId
            phone: $phone
            stateId: $stateId
            street: $street
            zip: $zip
          }
        ) {
          id
          name
          street
          street2
          city
          zip
          state {
            id
            __typename
          }
          country {
            id
            __typename
          }
          email
          phone
          __typename
        }
      }
    `,
  });
};

const updateShippingAddress = async (context, variables) => {
  return await context.client.apollo.query({
    fetchPolicy: "no-cache",
    variables,
    query: gql`
      mutation (
        $id: Int!
        $name: String!
        $city: String
        $countryId: Int!
        $phone: String!
        $stateId: Int
        $street: String!
        $zip: String!
      ) {
        updateAddress(
          address: {
            id: $id
            name: $name
            city: $city
            countryId: $countryId
            phone: $phone
            stateId: $stateId
            street: $street
            zip: $zip
          }
        ) {
          id
          name
          street
          street2
          city
          zip
          state {
            id
            __typename
          }
          country {
            id
            __typename
          }
          email
          phone
          __typename
        }
      }
    `,
  });
};


const addBillingAddress = async (context, variables) => {
  return await context.client.apollo.query({
    fetchPolicy: "no-cache",
    variables,
    query: gql`
      mutation (
        $name: String!
        $city: String
        $countryId: Int!
        $phone: String!
        $stateId: Int
        $street: String!
        $zip: String!
      ) {
        addAddress(
          type: Billing
          address: {
            name: $name
            city: $city
            countryId: $countryId
            phone: $phone
            stateId: $stateId
            street: $street
            zip: $zip
          }
        ) {
          id
          name
          street
          street2
          city
          zip
          state {
            id
            __typename
          }
          country {
            id
            __typename
          }
          email
          phone
          __typename
        }
      }
    `,
  });
};


module.exports = {
  addShippingAddress,
  updateShippingAddress,
  addBillingAddress,
};
