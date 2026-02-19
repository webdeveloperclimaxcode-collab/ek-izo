"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useCheckout } from "@/app/lib/hooks/useCheckout";
import { useCart } from "@/contexts/CartContext";
import StripePaymentForm from "@/components/StripePaymentForm";
import { getCurrencySymbol, formatPrice } from "@/app/lib/currency";
import Image from "next/image";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { processCheckout, loading: checkoutLoading, error: checkoutError } = useCheckout();
  const { cart, clearCart, cartTotal } = useCart();

  const [currency, setCurrency] = useState("eur");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    deliveryAddress: "",
    deliveryCity: "",
    deliveryPostalCode: "",
    deliveryInstructions: "",
    deliveryMethod: "standard",
    paymentMethod: "stripe",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.displayName || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const deliveryCost = 0; // Free delivery
  const tax = cartTotal * 0.1;
  const totalAmount = cartTotal + deliveryCost + tax;
  const currencySymbol = getCurrencySymbol(currency);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.fullName || !formData.phone || !formData.deliveryAddress) {
      setError(t("checkout.fillAllRequired"));
      return;
    }

    if (!cart || cart.length === 0) {
      setError(t("checkout.cartEmpty"));
      return;
    }

    // Convert cart items to checkout format
    const checkoutItems = cart.map((item) => ({
      type: item.type,
      itemId: item.id,
      quantity: item.quantity,
    }));

    // Process checkout (create order)
    const result = await processCheckout({
      items: checkoutItems,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      deliveryAddress: formData.deliveryAddress,
      deliveryCity: formData.deliveryCity,
      deliveryPostalCode: formData.deliveryPostalCode,
      deliveryInstructions: formData.deliveryInstructions,
      deliveryMethod: formData.deliveryMethod,
      paymentMethod: formData.paymentMethod,
    });

    if (result) {
      setOrderId(result.orderId);
      setShowPaymentForm(true);
    } else if (checkoutError) {
      setError(checkoutError);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Confirm payment and update order
      const confirmResponse = await fetch("/api/payment/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentIntentId,
          orderId,
        }),
      });

      const confirmData = await confirmResponse.json();

      if (confirmData.success) {
        setSuccess(true);
        clearCart();
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(confirmData.error || "Failed to confirm payment");
        setShowPaymentForm(false);
      }
    } catch (err: any) {
      setError(err.message || "Payment confirmation failed");
      setShowPaymentForm(false);
    }
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
    setShowPaymentForm(false);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9F001B]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme === "dark" ? "bg-[#000000]" : "bg-white"}`}>
      {/* Hero Section */}
      <section className="relative w-full h-[300px] flex items-center justify-center bg-linear-to-r from-[#9F001B] to-[#7a0015]">
        <div className="relative z-10 w-full px-6 2xl:px-20 max-w-5xl mx-auto text-center">
          <h1 className="text-white text-[48px] md:text-[56px] font-bold tracking-tight">
            {t("checkout.checkoutHero")}
          </h1>
          <p className="text-white/80 text-lg mt-4">{t("checkout.completeOrder")}</p>
        </div>
      </section>

      {/* Main Content */}
      <div className="w-full px-6 2xl:px-20 py-12 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            {error && (
              <div className={`mb-6 p-4 border-l-4 rounded transition-colors duration-300 ${theme === "dark"
                ? "bg-red-900/20 border-red-500 text-red-400"
                : "bg-red-50 border-red-500 text-red-700"
                }`}>
                <p className="font-semibold">{t("checkout.error")}</p>
                <p>{error}</p>
                {error.includes("clear your cart") && (
                  <button
                    onClick={() => {
                      clearCart();
                      setError(null);
                      router.push("/products");
                    }}
                    className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    {t("checkout.clearCartAndGo")}
                  </button>
                )}
              </div>
            )}

            {success && (
              <div className={`mb-6 p-4 border-l-4 rounded transition-colors duration-300 ${theme === "dark"
                ? "bg-green-900/20 border-green-500 text-green-400"
                : "bg-green-50 border-green-500 text-green-700"
                }`}>
                <p className="font-semibold">{t("checkout.success")}</p>
                <p>{t("checkout.paymentSuccessful")}</p>
              </div>
            )}

            {checkoutError && (
              <div className={`mb-6 p-4 border-l-4 rounded transition-colors duration-300 ${theme === "dark"
                ? "bg-red-900/20 border-red-500 text-red-400"
                : "bg-red-50 border-red-500 text-red-700"
                }`}>
                <p className="font-semibold">{t("checkout.error")}</p>
                <p>{checkoutError}</p>
              </div>
            )}

            {!showPaymentForm ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Customer Information */}
                <div className={`p-6 rounded-lg transition-colors duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                  <h2 className={`text-xl font-bold mb-6 pb-4 border-b-2 border-[#9F001B] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                    {t("checkout.customerInformation")}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>
                        {t("checkout.fullName")} {t("checkout.required")}
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9F001B] focus:border-transparent transition ${theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>
                        {t("checkout.email")} {t("checkout.required")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled
                        className={`w-full px-4 py-3 border rounded-lg transition ${theme === "dark"
                          ? "bg-gray-600 border-gray-600 text-gray-400"
                          : "bg-gray-100 border-gray-300 text-gray-600"
                          }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>
                        {t("checkout.phone")} {t("checkout.required")}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9F001B] focus:border-transparent transition ${theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Information */}
                <div className={`p-6 rounded-lg transition-colors duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                  <h2 className={`text-xl font-bold mb-6 pb-4 border-b-2 border-[#9F001B] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                    {t("checkout.deliveryInformation")}
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>
                        {t("checkout.deliveryAddress")} {t("checkout.required")}
                      </label>
                      <textarea
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9F001B] focus:border-transparent transition ${theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          }`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>
                          {t("checkout.city")}
                        </label>
                        <input
                          type="text"
                          name="deliveryCity"
                          value={formData.deliveryCity}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9F001B] focus:border-transparent transition ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                            }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>
                          {t("checkout.postalCode")}
                        </label>
                        <input
                          type="text"
                          name="deliveryPostalCode"
                          value={formData.deliveryPostalCode}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9F001B] focus:border-transparent transition ${theme === "dark"
                            ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                            }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${theme === "dark" ? "text-gray-300" : "text-[#1B2556]"}`}>
                        {t("checkout.deliveryInstructions")}
                      </label>
                      <textarea
                        name="deliveryInstructions"
                        value={formData.deliveryInstructions}
                        onChange={handleInputChange}
                        rows={2}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#9F001B] focus:border-transparent transition ${theme === "dark"
                          ? "bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                          : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                          }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={checkoutLoading || !cart || cart.length === 0}
                  className={`w-full py-3 rounded-lg font-bold transition duration-300 ${checkoutLoading || !cart || cart.length === 0
                    ? theme === "dark"
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#9F001B] text-white hover:bg-[#7a0015]"
                    }`}
                >
                  {checkoutLoading ? t("checkout.processing") : t("checkout.continueToPayment")}
                </button>
              </form>
            ) : (
              <div className={`p-6 rounded-lg transition-colors duration-300 ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"}`}>
                <h2 className={`text-xl font-bold mb-6 pb-4 border-b-2 border-[#9F001B] transition-colors duration-300 ${theme === "dark" ? "text-white" : "text-[#1B2556]"}`}>
                  {t("checkout.paymentInformation")}
                </h2>
                <StripePaymentForm
                  amount={totalAmount}
                  email={formData.email}
                  orderId={orderId || ""}
                  currency={currency}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                  isLoading={checkoutLoading}
                />
                <button
                  onClick={() => setShowPaymentForm(false)}
                  className={`w-full mt-4 border-2 py-3 rounded-lg font-bold transition duration-300 ${theme === "dark"
                    ? "border-[#9F001B] text-[#9F001B] hover:bg-gray-700"
                    : "border-[#9F001B] text-[#9F001B] hover:bg-gray-100"
                    }`}
                >
                  {t("checkout.backToCheckout")}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className={`text-white rounded-lg p-6 sticky top-20 transition-colors duration-300 ${theme === "dark"
              ? "bg-linear-to-b from-[#6B1B2F] to-[#3D0A2E]"
              : "bg-linear-to-b from-[#9F001B] to-[#7a0015]"
              }`}>
              <h2 className="text-xl font-bold mb-6">{t("checkout.orderSummary")}</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                {cart && cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-white/90">
                        {item.title} x {item.quantity}
                      </span>
                      <span className="font-semibold">{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-white/70">{t("checkout.noItemsInCart")}</p>
                )}
              </div>

              {/* Pricing Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-white/20">
                <div className="flex justify-between text-sm">
                  <span className="text-white/90">{t("cart.subtotal")}</span>
                  <span>{currencySymbol}{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/90">{t("checkout.tax")}</span>
                  <span>{currencySymbol}{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/90">{t("checkout.delivery")}</span>
                  <span>{currencySymbol}{deliveryCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold">{t("checkout.total")}</span>
                <span className="text-2xl font-bold">{currencySymbol}{totalAmount.toFixed(2)}</span>
              </div>

              {!showPaymentForm && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e as any);
                  }}
                  disabled={checkoutLoading || !cart || cart.length === 0}
                  className={`w-full py-3 rounded-lg font-bold transition duration-300 ${checkoutLoading || !cart || cart.length === 0
                    ? theme === "dark"
                      ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : theme === "dark"
                      ? "bg-gray-700 text-white hover:bg-gray-600"
                      : "bg-white text-[#9F001B] hover:bg-gray-100"
                    }`}
                >
                  {checkoutLoading ? t("checkout.processing") : t("checkout.continueToPayment")}
                </button>
              )}

              <button
                onClick={() => router.push("/products")}
                className={`w-full mt-3 border-2 border-white py-3 rounded-lg font-bold transition duration-300 ${theme === "dark"
                  ? "text-white hover:bg-white/10"
                  : "text-white hover:bg-white/10"
                  }`}
              >
                {t("checkout.continueShopping")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
