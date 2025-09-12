import { getStripePrices, getStripeProducts } from "@mapform/lib/stripe";
import { env } from "~/*";
import { WorkspaceSettings } from "./workspace-settings";

export default async function Settings() {
  const [stripePrices, stripeProducts] = await Promise.all([
    getStripePrices(),
    getStripeProducts(),
  ]);

  const proPlan = stripeProducts.find(
    (product: { id: string }) =>
      product.id === env.NEXT_PUBLIC_STRIPE_PRO_PRODUCT_ID,
  );
  const proPrice = stripePrices.find(
    (price: { productId: string }) => price.productId === proPlan?.id,
  );

  if (!proPrice) {
    throw new Error("Pro price not found");
  }

  return <WorkspaceSettings />;
}
