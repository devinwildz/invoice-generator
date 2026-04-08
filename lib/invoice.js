export function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `INV-${year}-${rand}`;
}

export function calculateTotals(items, taxRate, discount) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.quantity || 0) * Number(item.price || 0),
    0
  );
  const tax = (subtotal * Number(taxRate || 0)) / 100;
  const total = Math.max(subtotal + tax - Number(discount || 0), 0);

  return {
    subtotal,
    tax,
    total,
  };
}

export function formatCurrency(amount, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(Number(amount || 0));
  } catch (error) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(Number(amount || 0));
  }
}
