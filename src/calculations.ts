import { toNumber, absoluteNumber, sumArray } from './utils';
import type { Ticket } from './taketkt-types';

export function getPriceWithVat(price = 0, VAT = 0) {
  if (typeof VAT !== 'number' || VAT <= 0) return price;
  return toNumber(price) * (1 + VAT / 100);
}

export function itemTotalPrice(item: Ticket | null) {
  return calculateItem(item).total;
}

export function calculateItem(item: Ticket | null) {
  let subtotal = 0;
  let discount = 0;
  let vat = 0;
  let total = 0;

  if (item) {
    subtotal = toNumber(item.price) * toNumber(item.occupancy);
    const discountPercentage = sumArray(
      (item.discounts ?? []).map(d => toNumber(d.amount_percentage)),
    );
    discount = subtotal * (discountPercentage / 100);
    vat = (subtotal - discount) * (toNumber(item?.vat_percentage) / 100);
    total = subtotal + vat - discount;
  }

  return {
    subtotal: absoluteNumber(subtotal),
    vat: absoluteNumber(vat),
    discount: absoluteNumber(discount),
    total: absoluteNumber(total),
  };
}

export function calculateCart(tickets: Ticket[]) {
  const cart = [...(tickets ?? [])];
  let subtotal = 0;
  let discount = 0;
  let vat = 0;
  let total = 0;

  if (cart.length) {
    cart.forEach(item => {
      const itemCalcs = calculateItem(item);
      subtotal += itemCalcs.subtotal;
      discount += itemCalcs.discount;
      vat += itemCalcs.vat;
      total += itemCalcs.total;
    });
  }

  return {
    subtotal: absoluteNumber(subtotal),
    vat: absoluteNumber(vat),
    discount: absoluteNumber(discount),
    total: absoluteNumber(total),
  };
}
