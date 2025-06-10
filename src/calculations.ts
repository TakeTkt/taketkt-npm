import type { ServicePriceModifier, Ticket } from './taketkt-types';
import { absoluteNumber, convertToDate, sumArray, toNumber } from './utils';

/**
 * @description Calculates the price of a ticket with VAT included.
 */
export function getPriceWithVat(price = 0, VAT = 0) {
  if (typeof VAT !== 'number' || VAT <= 0) return price;
  return toNumber(price) * (1 + VAT / 100);
}

/**
 * @description Calculates the total price of a ticket item.
 */
export function itemTotalPrice(item: Ticket | null) {
  return calculateItem(item).total;
}

/**
 * @description Calculates the subtotal, discount, VAT, and total price of a ticket item.
 * If the item is null, it returns all values as 0.
 */
export function calculateItem(item: Ticket | null) {
  let subtotal = 0;
  let discount = 0;
  let vat = 0;
  let total = 0;

  if (item) {
    subtotal = itemSubtotalPrice(item);
    discount = itemDiscount(item);
    vat = itemVat(item);
    total = subtotal + vat - discount;
  }

  return {
    subtotal: absoluteNumber(subtotal),
    vat: absoluteNumber(vat),
    discount: absoluteNumber(discount),
    total: absoluteNumber(total),
  };
}

/**
 * @description Calculates the total price of a cart containing tickets.
 * It sums up the subtotal, discount, VAT, and total for each ticket in the cart.
 * If the cart is empty, it returns all values as 0.
 */
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

/**
 * @description Calculates the subtotal price of a service based on its base price and applicable price modifiers (if exists any).
 */
export function calculatePriceWithModifiers(
  basePrice: number,
  date: Date,
  price_modifiers: ServicePriceModifier[],
): number {
  // Filter applicable modifier
  const applicableModifiers = price_modifiers.filter(modifier =>
    isPriceModifierEligible(modifier, date),
  );

  // Apply modifiers
  let finalPrice = toNumber(basePrice);
  for (const modifier of applicableModifiers) {
    const price_increase = modifier.price_increase;
    finalPrice += (price_increase / 100) * basePrice;
  }

  return toNumber(finalPrice);
}

/**
 * @description Checks if a price modifier is eligible based on the current date.
 */
export function isPriceModifierEligible(
  modifier: ServicePriceModifier,
  date: Date,
): boolean {
  if (!modifier.active) return false;

  const dayOfWeek = date.getDay(); // 0 (Sun) to 6 (Sat)
  const dayOfMonth = date.getDate(); // 1 to 31
  const month = date.getMonth(); // 0 (Jan) to 11
  const time = date.toTimeString().slice(0, 5); // 'HH:mm'

  // Helper: checks if a time string falls within a given range
  const isTimeInRange = (from: string, to: string): boolean => {
    return from <= time && time <= to;
  };

  const { months, daysOfWeek, daysOfMonth, timeRanges } = modifier;

  const matchDayOfWeek = daysOfWeek?.includes(dayOfWeek);
  const matchDayOfMonth = daysOfMonth?.includes(dayOfMonth);
  const matchMonth = months?.includes(month);
  const matchTimeRange = timeRanges?.some(({ from, to }) =>
    isTimeInRange(from, to),
  );

  return matchDayOfWeek || matchDayOfMonth || matchMonth || matchTimeRange;
}

// #region separate calcs

/**
 * @description Calculates the subtotal price of a ticket item, including addons and occupancy.
 */
function itemSubtotalPrice(item: Ticket | null) {
  if (!item) return 0;
  const date =
    'from' in item
      ? convertToDate(item.from)
      : convertToDate(item.created_date);

  let price = toNumber(item.price);
  price = calculatePriceWithModifiers(
    price,
    date,
    item.applied_price_modifiers ?? [],
  );

  if (item.addons && item.addons.length > 0) {
    price += sumArray(
      item.addons.map(addon => absoluteNumber(toNumber(addon.price))),
    );
  }

  const occupancy = toNumber(item.occupancy) || 1;
  return price * occupancy;
}

/**
 * @description Calculates the discount amount for a ticket item, including coupon and loyalty points discounts.
 */
function itemDiscount(item: Ticket | null) {
  if (!item) return 0;
  const discountPercentage = sumArray(
    (item.discounts ?? [])
      .filter(d => d.type === 'COUPON')
      .map(d => toNumber(d.amount_percentage)),
  );
  const loyaltyPointsAmount = sumArray(
    (item.discounts ?? [])
      .filter(d => d.type === 'LOYALTY_POINTS')
      .map(d => toNumber(d.amount)),
  );
  const loyaltyDiscount = loyaltyPointsAmount / 10; // 10 points = 1 currency unit
  const subtotal = itemSubtotalPrice(item);
  return subtotal * (discountPercentage / 100) + loyaltyDiscount;
}

/**
 * @description Calculates the VAT amount for a ticket item
 */
function itemVat(item: Ticket | null) {
  if (!item) return 0;
  const vatPercentage = toNumber(item.vat_percentage);
  const subtotal = itemSubtotalPrice(item);
  const discount = itemDiscount(item);
  return (subtotal - discount) * (vatPercentage / 100);
}
