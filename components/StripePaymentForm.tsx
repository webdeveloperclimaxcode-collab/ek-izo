"use client";

import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useTheme } from "@/contexts/ThemeContext";
import { getCurrencySymbol } from "@/app/lib/currency";

interface StripePaymentFormProps {
  amount: number;
  email: string;
  orderId: string;
  currency?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  isLoading: boolean;
}

export default function StripePaymentForm({
  amount,
  email,
  orderId,
  currency = "eur",
  onSuccess,
  onError,
  isLoading,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { theme } = useTheme();
  const [processing, setProcessing] = useState(false);
  const currencySymbol = getCurrencySymbol(currency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError("Stripe not loaded");
      return;
    }

    setProcessing(true);

    try {
      // Create payment intent
      const intentResponse = await fetch("/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          email,
          orderId,
          currency,
        }),
      });

      const intentData = await intentResponse.json();

      if (!intentData.success) {
        onError(intentData.error || "Failed to create payment intent");
        setProcessing(false);
        return;
      }

      // Confirm payment with card
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        onError("Card element not found");
        setProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        intentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              email,
            },
          },
        }
      );

      if (error) {
        onError(error.message || "Payment failed");
        setProcessing(false);
        return;
      }

      if (paymentIntent?.status === "succeeded") {
        onSuccess(paymentIntent.id);
      } else {
        onError("Payment not completed");
        setProcessing(false);
      }
    } catch (err: any) {
      onError(err.message || "Payment processing failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={`p-4 border rounded-lg transition-colors duration-300 ${theme === "dark"
        ? "bg-gray-700 border-gray-600"
        : "bg-white border-gray-300"
        }`}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: theme === "dark" ? "#e5e7eb" : "#424770",
                "::placeholder": {
                  color: theme === "dark" ? "#9ca3af" : "#aab7c4",
                },
              },
              invalid: {
                color: "#9f001b",
              },
            },
          }}
        />
      </div>

      <button
        type="submit"
        disabled={processing || isLoading || !stripe}
        className="w-full bg-[#9F001B] text-white py-3 rounded-lg font-bold hover:bg-[#7a0015] disabled:bg-gray-400 transition duration-300"
      >
        {processing || isLoading ? "Processing..." : `Pay ${currencySymbol}${amount.toFixed(2)}`}
      </button>
    </form>
  );
}
