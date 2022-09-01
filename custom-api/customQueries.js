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
        register(emailPhone: $email, firstName: $firstName, lastName: $lastName, password: $password)
      }
    `
  })
};
