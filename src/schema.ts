import { z } from 'zod';
import type { Decimal } from '@prisma/client/runtime/library';
import { currencyCodes } from './currencies';
import { timeZones } from './timezones';
import { PermissionsList } from './permissions';

// Prisma's Decimal, checked structurally so @prisma/client is not needed at runtime.
export const decimalSchema = z.custom<Decimal>(
  (value) =>
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { toFixed?: unknown }).toFixed === 'function' &&
    typeof (value as { toNumber?: unknown }).toNumber === 'function',
);

export const currencySchema = z.enum(currencyCodes);
export const timeZonesSchema = z.enum(timeZones);
export const permissionsSchema = z.enum(PermissionsList);

export const workingShiftSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const workingShiftsSchema = z.record(
  z.string(),
  z.array(workingShiftSchema),
);

export const userAccessSchema = z.record(
  z.string(),
  z.object({
    is_admin: z.boolean(),
    is_owner: z.boolean().optional(),
    branches: z
      .record(
        z.string(),
        z.object({
          role_id: z.string(),
          permissions: z.array(permissionsSchema),
        }),
      )
      .optional(),
  }),
);

export const userSchema = z.object({
  user_id: z.string(),
  created_date: z.date().optional(),
  username: z.string(),
  email: z.string().optional(),
  country_code: z.string().optional(),
  phone: z.string().optional(),
  photo: z.string().nullable().optional(),
  welcomeEmailSent: z.boolean().optional(),
  is_test: z.boolean().optional(), // Test for taketkt devs
  source: z.enum(['APP', 'CONSOLE']).nullable().optional(),
  app_version: z.string().nullable().optional(),
  push_token: z.string().nullable().optional(),
});

export const dashboardUserSchema = z.object({
  user_id: z.string(),
  created_date: z.date().optional(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  country_code: z.string().optional(),
  phone: z.string(),
  stores: z.array(z.string()),
  access: userAccessSchema.optional(),
  working_shifts: z.record(z.string(), workingShiftsSchema).optional(),
  photo: z.string().nullable().optional(),
  emailVerified: z.boolean().optional(),
  phoneNumberVerified: z.boolean().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  is_test: z.boolean().optional(), // Test for taketkt devs
  push_token: z.string().nullable().optional(),
  receive_notifications: z.boolean().optional(),
});

export const storeCategorySchema = z.object({
  id: z.number(),
  name_en: z.string(),
  name_ar: z.string(),
  icon: z.string().optional(),
});

export const storeSchema = z.object({
  name_en: z.string(),
  name_ar: z.string(),
  store_id: z.string(),
  store_url: z.string(),
  created_date: z.date(),
  logo: z.string().nullable().optional(),
  owner_id: z.string().optional(),
  currency: currencySchema.optional(),
  categories: z.array(storeCategorySchema).optional(),
  cr_number: z.string().optional(),
  vat_number: z.string().optional(),
  vat_percentage: z.number().optional(),
  head_office_info: z
    .object({
      address: z.object({
        street: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        country: z.string().optional(),
      }),
      phone_number: z.string().optional(),
    })
    .optional(),
  is_verified: z.boolean().optional(),
  show_in_main_page: z.boolean().optional(),
  is_test: z.boolean().optional(), // Test for taketkt devs
  is_active: z.boolean().optional(),
  tickets_percent_for_payment: z.union([z.number(), decimalSchema]).optional(),
  loyalty_enabled: z.boolean().optional(),
  loyalty_points_per_ticket: z.number().optional(),
  loyalty_points_expiration_days: z.number().optional(),
});

export const branchGalleryImageSchema = z.object({
  id: z.number(),
  branch_id: z.string(),
  store_id: z.string(),
  url: z.string(),
  position: z.number(),
});

export const branchSchema = z.object({
  name_en: z.string(),
  name_ar: z.string(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  store_id: z.string().optional(),
  branch_id: z.string().optional(),
  branch_number: z.string(),
  store_url: z.string(),
  created_date: z.date(),
  current_id: z.number().optional(),
  auto_reset_current_id: z.boolean().optional(),
  working_shifts_timezone: timeZonesSchema,
  working_shifts: workingShiftsSchema,
  latitude: z.number().nullable().optional(),
  longitude: z.number().nullable().optional(),
  hide: z.boolean().optional(),
  show_whatsapp_contact: z.boolean().optional(),
  phone_number: z.string().optional(),
  logo: z.string().optional(),
  auto_done_tickets: z.boolean().optional(),
  auto_cancel_tickets: z.boolean().optional(),
  reservations_by_branch: z.boolean().optional(),
  auto_cancel_or_done_waitings_minutes: z.number().optional(),
  auto_cancel_or_done_reservations_minutes: z.number().optional(),
  socialMedia: z
    .object({
      instagram: z.string().optional(),
      snapchat: z.string().optional(),
      twitter: z.string().optional(),
      tiktok: z.string().optional(),
    })
    .optional(),
  is_not_receiving_tickets: z.boolean().optional(),
  allow_tickets_outside_shifts: z.boolean().optional(),
  auto_open_branch_after_midnight: z.boolean().optional(),
  reservations_slot_interval: z.number().optional(),
  gallery: z.array(branchGalleryImageSchema).optional(),
});

export const serviceAddOnSchema = z.object({
  id: z.number(),
  service_id: z.string(),
  name_en: z.string(),
  name_ar: z.string(),
  price: z.number(),
  duration: z.number(), // minutes
  active: z.boolean(),
  is_auto_selected: z.boolean(),
  enable_quantity: z.boolean().optional(),
});

export const ticketServiceAddOnSchema = serviceAddOnSchema.extend({
  quantity: z.number().optional(),
});

export const servicePriceModifierSchema = z.object({
  id: z.number(),
  service_id: z.string(),
  name: z.string(),
  daysOfWeek: z.array(z.number()), // 0 (Sunday) to 6 (Saturday)
  daysOfMonth: z.array(z.number()), // 1 to 31
  months: z.array(z.number()), // 0 (Jan) to 11 (Dec)
  timeRanges: z.array(z.object({ from: z.string(), to: z.string() })), // HH:mm format
  price_increase: z.number(), // percentage
  active: z.boolean(),
});

export const serviceDurationSchema = z.object({
  id: z.number(),
  service_id: z.string(),
  duration: z.number(),
  price_increase: z.union([z.number(), decimalSchema]),
  show_in_app: z.boolean(),
});

export const serviceIntegrationsSchema = z.object({
  lazywait: z.string(),
});

export const serviceSchema = z.object({
  service_id: z.string(),
  name_en: z.string(),
  name_ar: z.string(),
  description_en: z.string().optional(),
  description_ar: z.string().optional(),
  store_id: z.string(),
  branch_id: z.string(),
  category_id: z.number().nullable().optional(),
  branch_number: z.string(),
  store_url: z.string(),
  is_waiting: z.boolean().optional(),
  is_reservation: z.boolean().optional(),
  created_date: z.date().optional(),
  reservation_time: z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .optional(),
  not_active: z.boolean().optional(),
  hide: z.boolean().optional(),
  number_of_slots: z.number().optional(),
  require_confirmation: z.boolean().optional(),
  photo: z.string().nullable().optional(),
  price: z.number().optional(),
  max_limit_enabled: z.boolean().optional(),
  max_limit: z.number().optional(),
  enable_max_days_ahead: z.boolean().optional(),
  max_days_ahead: z.number().optional(),
  require_employee: z.boolean().optional(),
  enable_occupancy: z.boolean().optional(),
  occupancy_as_slots: z.boolean().optional(),
  allow_note: z.boolean().optional(),
  force_duration_on_waiting: z.boolean().optional(),
  is_full_day: z.boolean().optional(),
  specified_dates: z.array(z.date()).optional(),
  show_no_need_to_wait_message: z.boolean().optional(),
  // additional properties
  integrations: serviceIntegrationsSchema.optional(),
  employees: z.array(dashboardUserSchema),
  durations: z.array(serviceDurationSchema),
  price_modifiers: z.array(servicePriceModifierSchema),
  addons: z.array(serviceAddOnSchema),
});

export const customerSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  store_id: z.string(),
  branches_ids: z.array(z.string()).optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  country_code: z.string().optional(),
  phone: z.string().optional(),
  number_of_visits: z.number().optional(),
  last_visit: z.date().optional(),
});

export const ticketUpdateTypeSchema = z.enum([
  'SENT',
  'READY',
  'CANCELED', // Canceled by taketkt console
  'AUTO_CANCELED',
  'CANCELED_BY_USER',
  'SERVING',
  'DONE',
  'CONFIRMED',
  'REQUEUED',
  'REBOOKED',
  'UPDATED',
  'USER_CALLED_WILL_BE_LATE',
  'USER_CALLED_WILL_COME_SOON',
]);

export const ticketUpdateSchema = z.object({
  type: ticketUpdateTypeSchema,
  time: z.date(),
});

export const ticketIntegrationsSchema = z.record(
  z.string(),
  z.object({
    posOrderId: z.string(),
    posReceiptId: z.string(),
    posReceiptNumber: z.string(),
    posDisplayedId: z.string(),
  }),
);

export const ticketDiscountSchema = z.intersection(
  z.object({
    id: z.number(),
    name: z.string(),
  }),
  z.union([
    z.object({ type: z.literal('COUPON'), amount_percentage: z.number() }),
    z.object({
      type: z.literal('LOYALTY_POINTS'),
      amount: z.number(),
    }),
  ]),
);

export const waitingSchema = z.object({
  waiting_id: z.string(),
  id: z.number(),
  waiting_number: z.string().optional(),
  store_id: z.string(),
  branch_id: z.string(),
  service_id: z.string(),
  user_id: z.string(),
  employee_id: z.string().nullable().optional(),
  group_id: z.number().nullable().optional(),
  payment_id: z.string().nullable().optional(),
  coupon_id: z.number().nullable().optional(),
  loyalty_points_spent_id: z.number().nullable().optional(),
  name: z.string(),
  email: z.string(),
  country_code: z.string().optional(),
  phone: z.string(),
  created_date: z.date().optional(),
  note: z.string().optional(),
  done: z.boolean(),
  is_ready: z.boolean().optional(),
  is_canceled: z.boolean().optional(),
  serving_now: z.boolean().optional(),
  branch_name_en: z.string().optional(),
  branch_name_ar: z.string().optional(),
  store_name_en: z.string().optional(),
  store_name_ar: z.string().optional(),
  service_name_en: z.string().optional(),
  service_name_ar: z.string().optional(),
  photo: z.string().nullable().optional(),
  price: z.number().optional(),
  discounts: z.array(ticketDiscountSchema).optional(),
  currency: currencySchema.optional(),
  customer_did_not_come: z.boolean().optional(),
  cancel_note: z.string().optional(),
  updates: z.array(ticketUpdateSchema).optional(),
  vat_percentage: z.number().optional(),
  occupancy: z.number().nullable().optional(),
  integrations: ticketIntegrationsSchema.optional(),
  duration: z.number().nullable().optional(),
  addons: z.array(ticketServiceAddOnSchema).optional(),
  applied_price_modifiers: z.array(servicePriceModifierSchema).optional(),
  source: z.enum(['APP', 'CONSOLE']).nullable().optional(),
  app_version: z.string().nullable().optional(),
});

export const reservationSchema = z.object({
  reservation_id: z.string(),
  id: z.number(),
  store_id: z.string(),
  branch_id: z.string(),
  service_id: z.string(),
  user_id: z.string(),
  employee_id: z.string().nullable().optional(),
  group_id: z.number().nullable().optional(),
  payment_id: z.string().nullable().optional(),
  coupon_id: z.number().nullable().optional(),
  loyalty_points_spent_id: z.number().nullable().optional(),
  name: z.string(),
  email: z.string(),
  country_code: z.string().optional(),
  phone: z.string(),
  created_date: z.date().optional(),
  from: z.date().nullable().optional(),
  to: z.date().nullable().optional(),
  note: z.string().optional(),
  done: z.boolean(),
  is_ready: z.boolean().optional(),
  is_canceled: z.boolean().optional(),
  serving_now: z.boolean().optional(),
  branch_name_en: z.string().optional(),
  branch_name_ar: z.string().optional(),
  store_name_en: z.string().optional(),
  store_name_ar: z.string().optional(),
  service_name_en: z.string().optional(),
  service_name_ar: z.string().optional(),
  photo: z.string().nullable().optional(),
  price: z.number().optional(),
  discounts: z.array(ticketDiscountSchema).optional(),
  currency: currencySchema.optional(),
  reservation_number: z.string().optional(),
  customer_did_not_come: z.boolean().optional(),
  cancel_note: z.string().optional(),
  updates: z.array(ticketUpdateSchema).optional(),
  require_confirmation: z.boolean().optional(),
  is_confirmed: z.boolean().optional(),
  vat_percentage: z.number().optional(),
  occupancy: z.number().nullable().optional(),
  integrations: ticketIntegrationsSchema.optional(),
  duration: z.number().nullable().optional(),
  addons: z.array(ticketServiceAddOnSchema).optional(),
  applied_price_modifiers: z.array(servicePriceModifierSchema).optional(),
  source: z.enum(['APP', 'CONSOLE']).nullable().optional(),
  app_version: z.string().nullable().optional(),
});

export const ticketSchema = z.union([waitingSchema, reservationSchema]);

export const blockedTimesSchema = z.object({
  id: z.number(),
  service_id: z.string(),
  from_date_time: z.union([z.date(), z.string()]),
  to_date_time: z.union([z.date(), z.string()]),
  reason: z.string().optional(),
  created_date: z.union([z.date(), z.string()]),
});

export const reportStatementSchema = z.object({
  id: z.string(),
  store_id: z.string(),
  branch_id: z.string(),
  waitings: z.number().optional(),
  reservations: z.number().optional(),
  number_of_visits: z.number().optional(),
  waiting_did_not_come_customers: z.number().optional(),
  reservations_did_not_come_customers: z.number().optional(),
  total_did_not_come_customers: z.number().optional(),
  reservations_canceled: z.number().optional(),
  waitings_canceled: z.number().optional(),
  total_canceled: z.number().optional(),
  reservations_dones: z.number().optional(),
  waitings_dones: z.number().optional(),
  total_dones: z.number().optional(),
  last_visit: z.date().optional(),
  customers: z.array(z.string()).optional(),
});

export const employeeRoleSchema = z.object({
  role_id: z.string().optional(),
  store_id: z.string().optional(),
  role_name: z.string(),
  permissions: z.array(permissionsSchema),
  is_admin: z.boolean().optional(),
  is_default: z.boolean().optional(),
  creation_date: z.date().optional(),
  accountant: z.boolean().optional(),
});

export const otpCodeDocSchema = z.object({
  id: z.number(),
  phoneNumber: z.string(),
  code: z.number(),
  expiry: z.union([z.date(), z.string()]),
  userId: z.string().optional(),
});

export const licensePackageSchema = z.object({
  package_id: z.string(),
  name: z.string(),
  price: z.number(),
  currency: currencySchema,
  features: z.array(
    z.object({
      feature_id: z.string(),
      feature_name_en: z.string(),
      feature_name_ar: z.string(),
      limited_by_tickets: z.boolean().optional(),
      number_of_tickets: z.number().optional(),
      expiration_by_days: z.number().optional(),
    }),
  ),
  active: z.boolean().optional(),
  is_recommended: z.boolean().optional(),
  price_without_discount: z.number().nullable().optional(),
});

export const licenseSchema = z.object({
  license_id: z.string(),
  store_id: z.string(),
  payment_id: z.string().optional(),
  package_id: z.string().optional(),
  created_date: z.date(),
  start_date: z.date(),
  expire_date: z.date().nullable().optional(),
  is_trial: z.boolean(),
  features: licensePackageSchema.shape.features,
  is_test: z.boolean().optional(), // Test for taketkt devs
  number_of_tickets: z.number().optional(),
  number_of_used_tickets: z.number().optional(),
});

export const integrationSchema = z.object({
  integration_id: z.number(),
  id: z.enum(['lazywait', 'moyasar']), // 'lazywait' | 'foodics' | etc...
  apiKey: z.string(),
  store_id: z.string(),
  branches: z.array(
    z.object({
      branch_id: z.string(),
      external_branch_id: z.string().optional(),
    }),
  ),
  external_store_id: z.string(),
  number_of_invoices: z.number().optional(),
  auto_complete_after_pos_payment: z.boolean().optional(),
});

export const supportTicketSchema = z.object({
  support_ticket_id: z.string(),
  store_id: z.string(),
  branch_id: z.string().nullable().optional(),
  user_id: z.string().nullable().optional(),
  dashboarduser_id: z.string().nullable().optional(),
  created_date: z.date(),
  last_update: z.date(),
  subject: z.string(),
  message: z.string(),
  store: storeSchema.optional(),
  branch: branchSchema.nullable().optional(),
  user: userSchema.nullable().optional(),
  dashboarduser: dashboardUserSchema.nullable().optional(),
});

export const paymentTypesSchema = z.object({
  credit_card: z.boolean().optional(),
  apple_pay: z.boolean().optional(),
  stc_pay: z.boolean().optional(),
  token: z.boolean().optional(),
});

export const salesRequestSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  phone: z.string(),
  company: z.string().nullable().optional(),
  suitable_time: z.string().nullable().optional(),
  message: z.string().nullable().optional(),
  is_done: z.boolean(),
  is_canceled: z.boolean(),
  created_date: z.date(),
});

export const branchPolicySchema = z.object({
  policy_id: z.string(),
  store_id: z.string(),
  branches: z.array(z.string()),
  createdDate: z.date(),
  name: z.string(),
  text: z.string(),
  active: z.boolean(),
});

export const reportDataSchema = z.object({
  waiting_id: z.string().nullable().optional(),
  reservation_id: z.string().nullable().optional(),
  reservation_number: z.string().nullable().optional(),
  created_date: z.string().nullable(),
  price: z.union([z.number(), decimalSchema]),
  occupancy: z.number(),
  from_date_time: z.string().nullable().optional(),
  to_date_time: z.string().nullable().optional(),
  id: z.number(),
  discounts: z.array(ticketDiscountSchema),
  users: z.object({
    user_id: z.string(),
    country_code: z.string().nullable(),
    phone: z.string().nullable(),
    username: z.string().nullable(),
  }),
  services: z.object({
    service_id: z.string(),
    name_en: z.string().nullable(),
    name_ar: z.string().nullable(),
  }),
  branches: z.object({
    branch_id: z.string(),
    name_en: z.string().nullable(),
    name_ar: z.string().nullable(),
  }),
  stores: z.object({
    vat_percentage: z.number().nullable(),
  }),
});

export const reportSchema = z.object({
  data: z.array(reportDataSchema),
  total: z.number(),
  count: z.number(),
  countReservations: z.number(),
  countWaitings: z.number(),
  number_of_customers: z.number(),
  last_reservation_id: z.string().nullable(),
  last_waiting_id: z.string().nullable(),
});

export const faqSchema = z.object({
  questions: z.array(
    z.object({
      faq_id: z.string(),
      answer_ar: z.string(),
      answer_en: z.string(),
      question_ar: z.string().optional(),
      question_en: z.string().optional(),
      active: z.boolean().optional(),
    }),
  ),
});

export const serviceCategorySchema = z.object({
  category_id: z.number(),
  store_id: z.string(),
  branch_id: z.string(),
  name_en: z.string(),
  name_ar: z.string(),
  active: z.boolean(),
  position: z.number(),
});

export const dashboardInviteSchema = z.object({
  id: z.number(),
  user_id: z.string().optional(),
  email: z.string(),
  created_date: z.date(),
  is_registered: z.boolean(),
  stores: z.array(z.string()),
  access: userAccessSchema.optional(),
});

export const paymentMethodSchema = z.object({
  id: z.number(),
  name: z.string(),
  active: z.boolean(),
});

export const billingSchema = z.object({
  id: z.number(),
  store_id: z.string(),
  package_id: z.string(),
  token: z.string(),
  name: z.string(),
  last_four: z.string(),
  exp_month: z.string(),
  exp_year: z.string(),
  brand: z.string().optional(),
  is_active: z.boolean(),
  is_auto_renew: z.boolean(),
  last_payment_date: z.date().nullable().optional(),
  created_at: z.date(),
  updated_at: z.date(),
  stores: storeSchema.optional(),
  packages: licensePackageSchema.optional(),
});

export const billingHistorySchema = z.object({
  id: z.number(),
  store_id: z.string(),
  package_id: z.string(),
  payment_id: z.string().nullable().optional(),
  amount: z.union([decimalSchema, z.number()]),
  is_paid: z.boolean(),
  should_retry: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
  last_retry_date: z.date().nullable().optional(),
  retry_count: z.number(),
  stores: storeSchema.optional(),
  packages: licensePackageSchema.optional(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payments: z.any().optional(),
});

export const busyTimesWeekdaySchema = z.object({
  store_id: z.string(),
  branch_id: z.string(),
  weekday: z.number(),
  total: z.number(),
});

export const busyTimesHourlySchema = z.object({
  store_id: z.string(),
  branch_id: z.string(),
  hour: z.number(),
  total: z.number(),
});

export const busyTimesSchema = z.object({
  weekdays: z.array(busyTimesWeekdaySchema),
  hourly: z.array(busyTimesHourlySchema),
});

export const cohortSchema = z.object({
  store_id: z.string(),
  month: z.string(),
  total_customers: z.number(),
  returning_customers: z.array(z.number()),
});

export const couponSchema = z.object({
  id: z.number(),
  store_id: z.string().nullable().optional(),
  code: z.string(),
  discount_percentage: z.union([decimalSchema, z.number()]),
  is_active: z.boolean(),
  start_date: z.date(),
  end_date: z.date().nullable(),
  is_limited_by_time: z.boolean(),
  is_limited_by_usage: z.boolean(),
  usage_limit: z.number().nullable(),
  usage_count: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
  store: storeSchema.nullable().optional(),
  waitings: z.array(waitingSchema).optional(),
  reservations: z.array(reservationSchema).optional(),
});

export const bannerSchema = z.object({
  id: z.number(),
  imageUrl: z.string(),
  path: z.string().optional(),
});

export const notificationSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  title: z.string(),
  content: z.string(),
  data: z.string().optional(),
  createdDate: z.date(),
  isRead: z.boolean().optional(),
  user: userSchema.nullable().optional(),
});

export const loyaltyPointsSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  store_id: z.string(),
  points: z.number(),
  type: z.enum(['ADD', 'USE']),
  created_date: z.date(),
  updated_date: z.date(),
  expiration_date: z.date().nullable().optional(),
  user: userSchema.nullable().optional(),
  store: storeSchema.nullable().optional(),
  reservations: z.array(reservationSchema).optional(),
  waitings: z.array(waitingSchema).optional(),
});
