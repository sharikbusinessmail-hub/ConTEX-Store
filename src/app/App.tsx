import { RouterProvider } from "react-router";
import { router } from "./routes";
import { CartProvider } from "./lib/cart";
import { ProductsProvider } from "./lib/products";

// 1. Import the new WhatsApp Button component
import { WhatsAppButton } from "./components/WhatsAppButton"; 

export default function App() {
  return (
    <ProductsProvider>
      <CartProvider>
        {/* 2. Wrap the router and the button in a fragment so they both render */}
        <>
          <RouterProvider router={router} />
          <WhatsAppButton />
        </>
      </CartProvider>
    </ProductsProvider>
  );
}