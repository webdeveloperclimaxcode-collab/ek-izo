export function getCurrencySymbol(currency: string): string {
  const currencyMap: { [key: string]: string } = {
    usd: "$",
    eur: "€",
    gbp: "£",
    jpy: "¥",
    cad: "C$",
    aud: "A$",
    chf: "CHF",
    cny: "¥",
    inr: "₹",
    mxn: "$",
  };

  return currencyMap[currency.toLowerCase()] || currency.toUpperCase();
}

export function formatPrice(amount: number, currency: string = "eur"): string {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toFixed(2)}`;
}
