"use client";

import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

export default function CartSidebar() {
  const { cart, cartCount, cartTotal, isCartOpen, closeCart, removeFromCart, updateQuantity } = useCart();
  const { t } = useLanguage();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-white dark:bg-[#000000] shadow-2xl z-50 flex flex-col transition-colors duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-[#F0F3FF] to-[#FFFFFF] dark:from-gray-700 dark:to-gray-800">
          <div>
            <h2 className="text-[24px] font-bold text-[#1B2556] dark:text-white">{t("cart.shoppingCart")}</h2>
            <p className="text-[13px] text-[#64748B] dark:text-gray-400 mt-1">
              {cartCount} {cartCount === 1 ? t("cart.item") : t("cart.items")}
            </p>
          </div>
          <button
            onClick={closeCart}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <svg
              className="w-6 h-6 text-[#1B2556] dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-12 h-12 text-gray-400 dark:text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="text-[18px] font-semibold text-[#1B2556] dark:text-white mb-2">
                {t("cart.yourCartIsEmpty")}
              </h3>
              <p className="text-[14px] text-[#64748B] dark:text-gray-400 mb-6">
                {t("cart.addSomeProducts")}
              </p>
              <Link
                href="/products"
                onClick={closeCart}
                className="px-6 py-3 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white font-semibold rounded-full hover:opacity-90 transition-opacity text-[14px] cursor-pointer"
              >
                {t("cart.browseProducts")}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-gray-50 dark:bg-[#1a1a1a] rounded-[16px] border border-gray-200 dark:border-gray-600"
                >
                  {/* Product Image */}
                  <div className="relative w-20 h-20 shrink-0 bg-white dark:bg-gray-600 rounded-[12px] overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[14px] font-bold text-[#1B2556] dark:text-white mb-1 line-clamp-2">
                      {item.title}
                    </h3>
                    {item.sku && (
                      <p className="text-[11px] text-[#64748B] dark:text-gray-400 mb-2">
                        {t("cart.sku")}: {item.sku}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-[16px] font-bold text-[#9F001B] dark:text-[#ff4d6d]">
                        ${item.price.toFixed(2)}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <svg
                            className="w-4 h-4 text-[#1B2556] dark:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </button>
                        <span className="text-[14px] font-semibold text-[#1B2556] dark:text-white w-8 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-500 transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <svg
                            className="w-4 h-4 text-[#1B2556] dark:text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="self-start p-1 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <svg
                      className="w-5 h-5 text-red-500 dark:text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-linear-to-r from-[#F0F3FF] to-[#FFFFFF] dark:from-gray-700 dark:to-gray-800">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-[16px] font-semibold text-[#1B2556] dark:text-white">
                {t("cart.subtotal")}
              </span>
              <span className="text-[24px] font-bold text-[#9F001B] dark:text-[#ff4d6d]">
                ${cartTotal.toFixed(2)}
              </span>
            </div>

            <p className="text-[12px] text-[#64748B] dark:text-gray-400 mb-4 text-center">
              {t("cart.shippingAndTaxes")}
            </p>

            {/* Checkout Button */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full py-4 bg-linear-to-r from-[#9F001B] to-[#1B2556] text-white font-bold rounded-full hover:opacity-90 transition-opacity text-center text-[16px] mb-3 cursor-pointer"
            >
              {t("cart.proceedToCheckout")}
            </Link>

            {/* Continue Shopping */}
            <button
              onClick={closeCart}
              className="w-full py-3 border-2 border-[#1B2556] dark:border-white text-[#1B2556] dark:text-white font-semibold rounded-full hover:bg-[#1B2556] hover:text-white dark:hover:bg-white dark:hover:text-[#1B2556] transition-colors text-[14px] cursor-pointer"
            >
              {t("cart.continueShopping")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
