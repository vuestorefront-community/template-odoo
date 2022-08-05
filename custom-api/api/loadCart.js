const gql = require('graphql-tag');
const orderFragment = require('../fragments/orderFragment.ts');

const loadCart = async (context, variables) => {
  return await context.client.apollo.query({
    fetchPolicy: 'no-cache',
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

module.exports = loadCart;
