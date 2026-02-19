import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface CheckoutItem {
  type: "product" | "service";
  itemId: string;
  quantity: number;
}

interface CheckoutData {
  items: CheckoutItem[];
  fullName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  deliveryCity?: string;
  deliveryPostalCode?: string;
  deliveryInstructions?: string;
  deliveryMethod?: string;
  paymentMethod?: string;
}

export const useCheckout = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processCheckout = async (checkoutData: CheckoutData) => {
    setLoading(true);
    setError(null);

    try {
      // Check if user is logged in (frontend validation)
      if (!user) {
        setError("You must be logged in to checkout");
        setLoading(false);
        return null;
      }

      // Call checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(checkoutData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Checkout failed");
        setLoading(false);
        return null;
      }

      setLoading(false);
      return result.data;
    } catch (err: any) {
      const errorMessage = err.message || "An error occurred during checkout";
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return {
    processCheckout,
    loading,
    error,
    isLoggedIn: !!user,
  };
};
