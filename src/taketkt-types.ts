import type { Decimal } from "@prisma/client/runtime";
import type { FieldValue, GeoPoint, Timestamp } from "firebase/firestore";
import { Currency } from "./currencies";
import type { TimeZones } from "./timezones";

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
  welcomeEmailSent?: boolean;
  is_test?: boolean; // Test for taketkt devs
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
  photo?: string | null;
  emailVerified?: boolean;
  phoneNumberVerified?: boolean;
  gender?: "MALE" | "FEMALE";
  is_test?: boolean; // Test for taketkt devs
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

export type Permissions =
  | "ACCESS_DASHBOARD_PERMISSION"
  | "VIEW_LANDING_PAGE_PERMISSION"
  | "CUSTOMERS_PERMISSION"
  | "SERVICES_PERMISSION"
  | "EMPLOYEES_PERMISSION"
  | "BRANCH_SETTINGS_PERMISSION"
  | "VIEW_REPORTS_PERMISSION";

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
  location?: GeoPoint;
  hide?: boolean;
  show_whatsapp_contact?: boolean;
  phone_number?: string;
  logo?: string;
  socialMedia?: {
    instagram?: string;
    snapchat?: string;
    twitter?: string;
    tiktok?: string;
  };
  is_not_receiving_tickets?: boolean;
};

export type Service = {
  service_id?: string;
  name_en: string;
  name_ar: string;
  store_id: string;
  branch_id: string;
  branch_number: string;
  store_url: string;
  is_waiting?: boolean;
  is_reservation?: boolean;
  created_date?: Date;
  reservation_time?: {
    from: string;
    to: string;
  };
  duration?: string;
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
  integrations?: ServiceIntegrations;
  employees?: DashboardUser[];
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
  type: "SENT" | "READY" | "CANCELED" | "SERVING" | "DONE" | "CONFIRMED";
  time: Date | Timestamp;
};

export type Waiting = {
  waiting_id?: string;
  id?: number;
  store_id?: string;
  branch_id?: string;
  service_id?: string;
  user_id?: string;
  employee_id?: string | null;
  name: string;
  email: string;
  country_code?: string;
  phone: string;
  created_date?: Date | Timestamp;
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
  currency?: Currency;
  customer_did_not_come?: boolean;
  cancel_note?: string;
  updates?: TicketUpdate[] | FieldValue;
  integrations?: {
    [integration: string]: {
      posOrderId: string;
      posReceiptId: string;
      posReceiptNumber: string;
      posDisplayedId: string;
    };
  };
  vat_percentage?: number;
};

export type Reservation = {
  reservation_id?: string;
  id?: number;
  store_id?: string;
  branch_id?: string;
  service_id?: string;
  user_id?: string;
  employee_id?: string | null;
  name: string;
  email: string;
  country_code?: string;
  phone: string;
  created_date?: Date | Timestamp;
  from?: Date | Timestamp;
  to?: Date | Timestamp;
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
  currency?: Currency;
  reservation_number?: string;
  customer_did_not_come?: boolean;
  cancel_note?: string;
  updates?: TicketUpdate[] | FieldValue;
  require_confirmation?: boolean;
  is_confirmed?: boolean;
  integrations?: {
    [integration: string]: {
      posOrderId: string;
      posReceiptId: string;
      posReceiptNumber: string;
      posDisplayedId: string;
    };
  };
  vat_percentage?: number;
};

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
  created_date: Date;
  start_date: Date;
  expire_date: Date;
  is_trial: boolean;
  features: LicensePackage["features"];
  is_test?: boolean; // Test for taketkt devs
  number_of_tickets?: number;
  number_of_used_tickets?: number;
};

export type Integration = {
  integration_id: number;
  id: "lazywait" | "moyasar"; // 'lazywait' | 'foodics' | etc...
  apiKey: string;
  store_id: string;
  branches: {
    branch_id: string;
    external_branch_id?: string;
  }[];
  external_store_id: string;
  number_of_invoices?: number | FieldValue;
};

export type SupportTicket = {
  support_ticket_id?: string;
  store_id?: string;
  branch_id?: string;
  user_id?: string;
  userName?: string;
  userEmail?: string;
  userPhoneNumber?: string;
  created_date?: Date;
  last_update?: Date;
  store_name_en?: string;
  store_name_ar?: string;
  branch_name_en?: string;
  branch_name_ar?: string;
  subject?: string;
  message?: string;
};

export type LicensePackage = {
  package_id: string;
  name: string;
  price: number;
  currency: Currency;
  features: {
    feature_id: string;
    feature_name: string;
    limited_by_tickets?: boolean;
    number_of_tickets?: number;
    expiration_by_days?: number;
  }[];
  active?: boolean;
};

export type PaymentTypes = {
  credit_card?: boolean;
  apple_pay?: boolean;
  stc_pay?: boolean;
  token?: boolean;
};

export type SalesRequest = {
  id: number;
  phone: string;
  email?: string | null;
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
  from_date_time?: string | null;
  to_date_time?: string | null;
  id: number;
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
