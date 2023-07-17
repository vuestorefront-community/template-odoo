const gql = require('graphql-tag');
const orderFragment = require('./fragments/orderFragment.ts');
import productFragment from './fragments/productFragment';

module.exports = {
  customCartLoad: ({ variables }) => ({
    variables,
    query: gql`
      query { 
        cart {
          ${orderFragment}
        }
      }
    `
  }),
  confirmationPayment: ({ variables }) => ({
    variables,
    query: gql`
      query { 
        paymentConfirmation {
          ${orderFragment}
        }
      }
    `
  }),

  customLogin: ({ variables }) => ({
    variables,
    query: gql`
      mutation($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          partner {
            id
            name
            firstName
            lastName
            street
            street2
            city
            state
            {
              id
            }
            country
            {
              id
            }
            email
            phone
          }
        }
      }
    `
  }),
  customGetProduct: ({variables}) => ({
    query: gql`query ($slug: String) { product(slug: $slug) { ${productFragment} } }`,
    variables
  }),
  customGetCategory: ({variables}) => ({
    query: gql`query ($slug: String) { product(slug: $slug) { ${productFragment} } }`,
    variables
  }),
  customRegister: ({ variables }) => ({
    variables,
    query: gql`
      mutation register(
        $email: String!
        $firstName: String!
        $lastName: String!
        $password: String
      ) {
        register(
          emailPhone: $email
          firstName: $firstName
          lastName: $lastName
          password: $password
        )
      }
    `,
  }),
  customAddAddress: ({ variables }) => ({
    variables,
    mutation: gql`
      mutation addAddress(
        $name: String!
        $city: String!
        $countryId: Int!
        $phone: String!
        $street: String!
        $stateId: Int
        $zip: String!
        $type: AddressEnum!
      ) {
        addAddress(
          type: $type
          address: {
            name: $name
            city: $city
            countryId: $countryId
            phone: $phone
            street: $street
            stateId: $stateId
            zip: $zip
          }
        ) {
          id
          name
          street
          city
          state {
            id
          }
          country {
            id
          }
          email
          phone
        }
      }
    `,
  }),
  customUpdateAddress: ({ variables }) => ({
    variables,
    mutation: gql`
      mutation updateAddress(
        $id: Int!
        $name: String!
        $city: String!
        $countryId: Int!
        $phone: String!
        $street: String!
        $stateId: Int
        $zip: String!
      ) {
        updateAddress(
          address: {
            id: $id
            name: $name
            city: $city
            countryId: $countryId
            phone: $phone
            street: $street
            stateId: $stateId
            zip: $zip
          }
        ) {
          id
          name
          street
          city
          state {
            id
          }
          country {
            id
          }
          email
          phone
        }
      }
    `,
  }),
};
