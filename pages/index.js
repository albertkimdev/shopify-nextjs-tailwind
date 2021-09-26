import Head from "next/head";
import ProductList from "../components/ProductList";
import { getProductsInCollection } from "../lib/shopify";

export default function Home({ products }) {
  return (
    <div className="text-3xl">
      <ProductList products={products} />
    </div>
  );
}

export async function getStaticProps() {
  const products = await getProductsInCollection();

  return {
    props: {
      products,
    },
  };
}
