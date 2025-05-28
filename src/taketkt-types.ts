import { Decimal } from '@prisma/client/runtime/library';
import type { Currency } from './currencies';
import type { TimeZones } from './timezones';
import type { PermissionsList } from './permissions';

export type ValueOf<T> = T[keyof T];
export type TypeOf<T> = keyof T;
export type DeepProp<T extends object, K extends string> = K extends keyof T
  ? T[K]
  : { [P in keyof T]: DeepProp<Extract<T[P], object>, K> }[keyof T];

export type User = {
  user_id: string;
  created_date?: Date;
  username: string;
  email?: string;
  country_code?: string;
  phone?: string;
  photo?: string | null;
  welcomeEmailSent?: boolean;
  is_test?: boolean; // Test for taketkt devs
  source?: 'APP' | 'CONSOLE' | null;
  app_version?: string | null;
  push_token?: string | null;
};

export type DashboardUser = {
  user_id: string;
  created_date?: Date;
  firstName: string;
  lastName: string;
  email: string;
  country_code?: string;
  phone: string;
  stores: string[];
  access?: UserAccess;
  working_shifts?: Record<string, WorkingShifts>;
  photo?: string | null;
  emailVerified?: boolean;
  phoneNumberVerified?: boolean;
  gender?: 'MALE' | 'FEMALE';
  is_test?: boolean; // Test for taketkt devs
  push_token?: string | null;
  receive_notifications?: boolean;
};

export type UserAccess = {
  [key: string]: {
    is_admin: boolean;
    is_owner?: boolean;
    branches?: {
      [key: string]: {
        role_id: string;
        permissions: Permissions[];
      };
    };
  };
};

export type Permissions = (typeof PermissionsList)[number];

export type Store = {
  name_en: string;
  name_ar: string;
  store_id: string;
  store_url: string;
  created_date: Date;
  logo?: string | null;
  owner_id?: string;
  currency?: Currency;
  categories?: StoreCategory[];
  cr_number?: string;
  vat_number?: string;
  vat_percentage?: number;
  head_office_info?: {
    address: {
      street?: string;
      city?: string;
      region?: string;
      country?: string;
    };
    phone_number?: string;
  };
  is_verified?: boolean;
  show_in_main_page?: boolean;
  is_test?: boolean; // Test for taketkt devs
  is_active?: boolean;
  tickets_percent_for_payment?: number | Decimal;
  loyalty_enabled?: boolean;
  loyalty_points_per_ticket?: number;
  loyalty_points_expiration_days?: number;
};

export type Branch = {
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  store_id?: string;
  branch_id?: string;
  branch_number: string;
  store_url: string;
  created_date: Date;
  current_id?: number;
  auto_reset_current_id?: boolean;
  working_shifts_timezone: TimeZones;
  working_shifts: WorkingShifts;
  latitude?: number | null;
  longitude?: number | null;
  hide?: boolean;
  show_whatsapp_contact?: boolean;
  phone_number?: string;
  logo?: string;
  auto_done_tickets?: boolean;
  auto_cancel_tickets?: boolean;
  reservations_by_branch?: boolean;
  auto_cancel_or_done_waitings_minutes?: number;
  auto_cancel_or_done_reservations_minutes?: number;
  socialMedia?: {
    instagram?: string;
    snapchat?: string;
    twitter?: string;
    tiktok?: string;
  };
  is_not_receiving_tickets?: boolean;
  allow_tickets_outside_shifts?: boolean;
  auto_open_branch_after_midnight?: boolean;
  reservations_slot_interval?: number;
};

export type Service = {
  service_id: string;
  name_en: string;
  name_ar: string;
  store_id: string;
  branch_id: string;
  category_id?: number | null;
  branch_number: string;
  store_url: string;
  is_waiting?: boolean;
  is_reservation?: boolean;
  created_date?: Date;
  reservation_time?: {
    from: string;
    to: string;
  };
  not_active?: boolean;
  hide?: boolean;
  number_of_slots?: number;
  require_confirmation?: boolean;
  photo?: string | null;
  price?: number;
  max_limit_enabled?: boolean;
  max_limit?: number;
  enable_max_days_ahead?: boolean;
  max_days_ahead?: number;
  require_employee?: boolean;
  enable_occupancy?: boolean;
  force_duration_on_waiting?: boolean;
  // additional properties
  integrations?: ServiceIntegrations;
  employees: DashboardUser[];
  durations: ServiceDuration[];
  price_modifiers: ServicePriceModifier[];
  addons: ServiceAddOn[];
};

export type ServiceAddOn = {
  id: number;
  service_id: string;
  name_en: string;
  name_ar: string;
  price: number;
  duration: number; // minutes
  active: boolean;
  is_auto_selected: boolean;
};

export type ServicePriceModifier = {
  id: number;
  service_id: string;
  name: string;
  daysOfWeek: number[]; // 0 (Sunday) to 6 (Saturday)
  daysOfMonth: number[]; // 1 to 31
  months: number[]; // 0 (Jan) to 11 (Dec)
  timeRanges: { from: string; to: string }[]; // HH:mm format
  price_increase: number; // percentage
  active: boolean;
};

export type ServiceDuration = {
  id: number;
  service_id: string;
  duration: number;
  price_increase: number | Decimal;
  show_in_app: boolean;
};

export type ServiceIntegrations = {
  lazywait: string;
};

export type WorkingShift = {
  from: string;
  to: string;
};

export type WorkingShifts = {
  [key: string]: WorkingShift[];
};

export type Customer = {
  id: number;
  user_id: string;
  store_id: string;
  branches_ids?: string[];
  username?: string;
  email?: string;
  country_code?: string;
  phone?: string;
  number_of_visits?: number;
  last_visit?: Date;
};

export type TicketUpdate = {
  type:
    | 'SENT'
    | 'READY'
    | 'CANCELED' // Canceled by taketkt console
    | 'AUTO_CANCELED'
    | 'CANCELED_BY_USER'
    | 'SERVING'
    | 'DONE'
    | 'CONFIRMED'
    | 'REQUEUED'
    | 'REBOOKED'
    | 'UPDATED';
  time: Date;
};

export type Waiting = {
  waiting_id: string;
  id: number;
  store_id: string;
  branch_id: string;
  service_id: string;
  user_id: string;
  employee_id?: string | null;
  group_id?: number | null;
  payment_id?: string | null;
  coupon_id?: number | null;
  loyalty_points_spent_id?: number | null;
  name: string;
  email: string;
  country_code?: string;
  phone: string;
  created_date?: Date;
  note?: string;
  done: boolean;
  is_ready?: boolean;
  is_canceled?: boolean;
  serving_now?: boolean;
  branch_name_en?: string;
  branch_name_ar?: string;
  store_name_en?: string;
  store_name_ar?: string;
  service_name_en?: string;
  service_name_ar?: string;
  photo?: string | null;
  price?: number;
  discounts?: TicketDiscount[];
  currency?: Currency;
  customer_did_not_come?: boolean;
  cancel_note?: string;
  updates?: TicketUpdate[];
  vat_percentage?: number;
  occupancy?: number | null;
  integrations?: TicketIntegrations;
  duration?: number | null;
  addons?: ServiceAddOn[];
  applied_price_modifiers?: ServicePriceModifier[];
  source?: 'APP' | 'CONSOLE' | null;
  app_version?: string | null;
};

export type Reservation = {
  reservation_id: string;
  id: number;
  store_id: string;
  branch_id: string;
  service_id: string;
  user_id: string;
  employee_id?: string | null;
  group_id?: number | null;
  payment_id?: string | null;
  coupon_id?: number | null;
  loyalty_points_spent_id?: number | null;
  name: string;
  email: string;
  country_code?: string;
  phone: string;
  created_date?: Date;
  from?: Date | null;
  to?: Date | null;
  note?: string;
  done: boolean;
  is_ready?: boolean;
  is_canceled?: boolean;
  serving_now?: boolean;
  branch_name_en?: string;
  branch_name_ar?: string;
  store_name_en?: string;
  store_name_ar?: string;
  service_name_en?: string;
  service_name_ar?: string;
  photo?: string | null;
  price?: number;
  discounts?: TicketDiscount[];
  currency?: Currency;
  reservation_number?: string;
  customer_did_not_come?: boolean;
  cancel_note?: string;
  updates?: TicketUpdate[];
  require_confirmation?: boolean;
  is_confirmed?: boolean;
  vat_percentage?: number;
  occupancy?: number | null;
  integrations?: TicketIntegrations;
  duration?: number | null;
  addons?: ServiceAddOn[];
  applied_price_modifiers?: ServicePriceModifier[];
  source?: 'APP' | 'CONSOLE' | null;
  app_version?: string | null;
};

export type TicketIntegrations = {
  [integration: string]: {
    posOrderId: string;
    posReceiptId: string;
    posReceiptNumber: string;
    posDisplayedId: string;
  };
};

export type TicketDiscount = {
  id: number;
  name: string;
} & (
  | { type: 'COUPON'; amount_percentage: number }
  | {
      type: 'LOYALTY_POINTS';
      amount: number;
    }
);

export type BlockedTimes = {
  id: number;
  service_id: string;
  from_date_time: Date | string;
  to_date_time: Date | string;
  reason?: string;
  created_date: Date | string;
};

export type ReportStatement = {
  id: string;
  store_id: string;
  branch_id: string;
  waitings?: number;
  reservations?: number;
  number_of_visits?: number;
  waiting_did_not_come_customers?: number;
  reservations_did_not_come_customers?: number;
  total_did_not_come_customers?: number;
  reservations_canceled?: number;
  waitings_canceled?: number;
  total_canceled?: number;
  reservations_dones?: number;
  waitings_dones?: number;
  total_dones?: number;
  last_visit?: Date;
  customers?: string[];
};

export type EmployeeRole = {
  role_id?: string;
  store_id?: string;
  role_name: string;
  permissions: Permissions[];
  is_admin?: boolean;
  is_default?: boolean;
  creation_date?: Date;
  accountant?: boolean;
};

export type OtpCodeDoc = {
  id: number;
  phoneNumber: string;
  code: number;
  expiry: Date | string;
  userId?: string;
};

export type License = {
  license_id: string;
  store_id: string;
  payment_id?: string;
  package_id?: string;
  created_date: Date;
  start_date: Date;
  expire_date?: Date | null;
  is_trial: boolean;
  features: LicensePackage['features'];
  is_test?: boolean; // Test for taketkt devs
  number_of_tickets?: number;
  number_of_used_tickets?: number;
};

export type Integration = {
  integration_id: number;
  id: 'lazywait' | 'moyasar'; // 'lazywait' | 'foodics' | etc...
  apiKey: string;
  store_id: string;
  branches: {
    branch_id: string;
    external_branch_id?: string;
  }[];
  external_store_id: string;
  number_of_invoices?: number;
  auto_complete_after_pos_payment?: boolean;
};

export type SupportTicket = {
  support_ticket_id: string;
  store_id: string;
  branch_id?: string | null;
  user_id?: string | null;
  dashboarduser_id?: string | null;
  created_date: Date;
  last_update: Date;
  subject: string;
  message: string;
  store?: Store;
  branch?: Branch | null;
  user?: User | null;
  dashboarduser?: DashboardUser | null;
};

export type LicensePackage = {
  package_id: string;
  name: string;
  price: number;
  currency: Currency;
  features: {
    feature_id: string;
    feature_name_en: string;
    feature_name_ar: string;
    limited_by_tickets?: boolean;
    number_of_tickets?: number;
    expiration_by_days?: number;
  }[];
  active?: boolean;
  is_recommended?: boolean;
  price_without_discount?: number | null;
};

export type PaymentTypes = {
  credit_card?: boolean;
  apple_pay?: boolean;
  stc_pay?: boolean;
  token?: boolean;
};

export type SalesRequest = {
  id: number;
  name?: string | null;
  email?: string | null;
  phone: string;
  company?: string | null;
  suitable_time?: string | null;
  message?: string | null;
  is_done: boolean;
  is_canceled: boolean;
  created_date: Date;
};

export type BranchPolicy = {
  policy_id: string;
  store_id: string;
  branches: string[];
  createdDate: Date;
  name: string;
  text: string;
  active: boolean;
};

export type Report = {
  data: ReportData[];
  total: number;
  count: number;
  countReservations: number;
  countWaitings: number;
  number_of_customers: number;
  last_reservation_id: string | null;
  last_waiting_id: string | null;
};

export type ReportData = {
  waiting_id?: string | null;
  reservation_id?: string | null;
  reservation_number?: string | null;
  created_date: string | null;
  price: number | Decimal;
  occupancy: number;
  from_date_time?: string | null;
  to_date_time?: string | null;
  id: number;
  discounts: TicketDiscount[];
  users: {
    user_id: string;
    country_code: string | null;
    phone: string | null;
    username: string | null;
  };
  services: {
    service_id: string;
    name_en: string | null;
    name_ar: string | null;
  };
  branches: {
    branch_id: string;
    name_en: string | null;
    name_ar: string | null;
  };
  stores: {
    vat_percentage: number | null;
  };
};

export type StoreCategory = {
  id: number;
  name_en: string;
  name_ar: string;
};

export type FAQ = {
  questions: {
    faq_id: string;
    answer_ar: string;
    answer_en: string;
    question_ar?: string;
    question_en?: string;
    active?: boolean;
  }[];
};

export type ServiceCategory = {
  category_id: number;
  store_id: string;
  branch_id: string;
  name_en: string;
  name_ar: string;
  active: boolean;
  position: number;
};

export type Ticket = Waiting | Reservation;

export type DashboardInvite = {
  id: number;
  user_id?: string;
  email: string;
  created_date: Date;
  is_registered: boolean;
  stores: string[];
  access?: UserAccess;
};

export type PaymentMethod = {
  id: number;
  name: string;
  active: boolean;
};

export type Billing = {
  id: number;
  store_id: string;
  package_id: string;
  token: string;
  name: string;
  last_four: string;
  exp_month: string;
  exp_year: string;
  brand?: string;
  is_active: boolean;
  is_auto_renew: boolean;
  last_payment_date?: Date | null;
  created_at: Date;
  updated_at: Date;
  stores?: Store;
  packages?: LicensePackage;
};

export type BillingHistory = {
  id: number;
  store_id: string;
  package_id: string;
  payment_id?: string | null;
  amount: Decimal | number;
  is_paid: boolean;
  should_retry: boolean;
  created_at: Date;
  updated_at: Date;
  last_retry_date?: Date | null;
  retry_count: number;
  stores?: Store;
  packages?: LicensePackage;
  payments?: any;
};

export type BusyTimesWeekday = {
  store_id: string;
  branch_id: string;
  weekday: number;
  total: number;
};

export type BusyTimesHourly = {
  store_id: string;
  branch_id: string;
  hour: number;
  total: number;
};

export type BusyTimes = {
  weekdays: BusyTimesWeekday[];
  hourly: BusyTimesHourly[];
};

export type Cohort = {
  store_id: string;
  month: string;
  total_customers: number;
  returning_customers: number[];
};

export type Coupon = {
  id: number;
  store_id?: string | null;
  code: string;
  discount_percentage: Decimal | number;
  is_active: boolean;
  start_date: Date;
  end_date: Date | null;
  is_limited_by_time: boolean;
  is_limited_by_usage: boolean;
  usage_limit: number | null;
  usage_count: number;
  created_at: Date;
  updated_at: Date;
  store?: Store | null;
  waitings?: Waiting[];
  reservations?: Reservation[];
};

export type Banner = {
  id: number;
  imageUrl: string;
  path?: string;
};

export type Notification = {
  id: number;
  user_id: string;
  title: string;
  content: string;
  data?: string;
  createdDate: Date;
  isRead?: boolean;
  user?: User | null;
};

export type LoyaltyPoints = {
  id: number;
  user_id: string;
  store_id: string;
  points: number;
  type: 'ADD' | 'USE';
  created_date: Date;
  updated_date: Date;
  expiration_date?: Date | null;
  user?: User | null;
  store?: Store | null;
  reservations?: Reservation[];
  waitings?: Waiting[];
};
