export default function parsePrice(priceWithCurrency: string | number | null): number {
  if(typeof priceWithCurrency == null) return 0;
  if(typeof priceWithCurrency === "string") return parseFloat(priceWithCurrency.replace(/[^\d.]/g, ""));
  if (typeof priceWithCurrency === "number") return priceWithCurrency;
}