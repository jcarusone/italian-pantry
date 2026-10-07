import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { PageHeader } from "@/components/layout/page-header";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your cart and continue to secure checkout.",
};

export default function CartPage() {
  return (
    <div className="pb-24 md:pb-36">
      <PageHeader lines={["Your cart"]} />
      <div className="site-container">
        <CartView />
      </div>
    </div>
  );
}
