const products = `
query {
  products (pageSize: 150000) {
    products {
      id
      slug
    }
  }
}
`;

const categories = `
query {
  categories (pageSize: 10000) {
    categories {
      id
      name
      slug
      parent {
        id
        slug
      }
    }
  }
}
`;

export { products, categories };
