const domain = process.env.SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function ShopifyData(query) {
  const url = `${domain}/api/2021-07/graphql.json`;

  const options = {
    endpoint: url,
    method: "POST",
    headers: {
      "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  };

  try {
    const data = await fetch(url, options).then((res) => res.json());
    return data;
  } catch (err) {
    console.log(err);
    throw new Error("Products not fetched");
  }
}

export async function getProductsInCollection() {
  const query = `
  {
    collectionByHandle(handle: "frontpage") {
      title
      products(first: 25) {
        edges {
          node {
            id
            title
            handle
            priceRange {
              minVariantPrice {
                amount
              }
            }
            images(first: 5) {
              edges {
                node {
                  originalSrc
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
  `;

  const res = await ShopifyData(query);

  const allProducts = res.data.collectionByHandle.products.edges
    ? res.data.collectionByHandle.products.edges
    : [];

  return allProducts;
}

export async function getAllProducts() {
  const query = `
    {
      products(first: 250) {
        edges {
          node {
            handle
            id
          }
        }
      }
    }
  `;
  const res = await ShopifyData(query);
  const slugs = res.data.products.edges ? res.data.products.edges : [];
  return slugs;
}

export async function getProduct(handle) {
  const query = `
  {
    productByHandle(handle: "${handle}") {
      id
      title
      handle
      description
      images(first: 5) {
        edges {
          node {
            originalSrc
            altText
          }
        }
      }
      options {
        name
        values
        id
      }
      variants(first: 25) {
        edges {
          node {
            selectedOptions {
              name
              value
            }
            image {
              originalSrc
              altText
            }
            title
            id
            priceV2 {
              amount
            }
          }
        }
      }
    }
  }
  `;
  const res = await ShopifyData(query);

  const product = res.data.productByHandle ? res.data.productByHandle : [];
  return product;
}
