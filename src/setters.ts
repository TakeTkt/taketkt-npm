import roles from './roles';
import {
  Branch,
  BranchPolicy,
  Coupon,
  Customer,
  DashboardUser,
  EmployeeRole,
  License,
  Reservation,
  Service,
  ServiceAddOn,
  ServiceCategory,
  ServiceDuration,
  ServicePriceModifier,
  Store,
  User,
  UserAccess,
  Waiting,
} from './taketkt-types';
import { convertToDate, getTodaysName, toNumber } from './utils';

export function setNewUser(user: Partial<User>): User {
  return {
    username: '',
    email: '',
    country_code: '',
    phone: '',
    welcomeEmailSent: false,
    push_token: null,
    ...user,
  } as User;
}

export function setNewDashboardUser(
  user: Partial<DashboardUser>,
): DashboardUser {
  return {
    firstName: '',
    lastName: '',
    email: '',
    country_code: '',
    phone: '',
    stores: [],
    access: {},
    emailVerified: false,
    phoneNumberVerified: false,
    photo: null,
    push_token: null,
    ...user,
  } as DashboardUser;
}

export function setNewCustomer(customer: Partial<Customer> | null): Customer {
  return {
    store_id: '',
    branches_ids: [],
    username: '',
    email: '',
    country_code: '+966',
    phone: '',
    number_of_visits: 0,
    ...(customer ?? {}),
  } as Customer;
}

export function setNewStore(store?: Partial<Store>): Store {
  return {
    name_en: '',
    name_ar: '',
    store_id: '',
    store_url: '',
    logo: null,
    created_date: new Date(),
    show_in_main_page: false,
    currency: 'SAR',
    categories: [],
    cr_number: '',
    vat_number: '',
    vat_percentage: 0,
    head_office_info: {
      address: {
        street: '',
        city: '',
        region: '',
        country: '',
      },
      phone_number: '',
    },
    is_active: false,
    is_test: false,
    is_verified: false,
    tickets_percent_for_payment: 100,
    loyalty_enabled: false,
    loyalty_points_expiration_days: 60,
    loyalty_points_per_ticket: 1,
    ...store,
  };
}

export function setNewBranch(branch?: Partial<Branch> | null): Branch {
  return {
    name_en: '',
    name_ar: '',
    store_id: '',
    branch_number: '',
    current_id: 0,
    auto_reset_current_id: true,
    working_shifts_timezone: 'Asia/Riyadh',
    working_shifts: {
      Sunday: [],
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    },
    created_date: new Date(),
    store_url: '',
    is_not_receiving_tickets: false,
    reservations_by_branch: false,
    show_whatsapp_contact: false,
    auto_cancel_or_done_reservations_minutes: 60,
    auto_cancel_or_done_waitings_minutes: 60,
    auto_done_tickets: true,
    auto_cancel_tickets: false,
    allow_tickets_outside_shifts: false,
    auto_open_branch_after_midnight: true,
    reservations_slot_interval: 15,
    ...(branch ?? {}),
  };
}

export function setNewService(
  service?: Partial<Service> | null,
  branch?: Branch,
): Service {
  const today = getTodaysName();
  const working_shifts = branch?.working_shifts;

  let obj: Partial<Service> = {};
  if (service?.is_reservation) {
    obj = {
      is_waiting: false,
    };
  }

  return {
    service_id: service?.service_id as string,
    name_en: '',
    name_ar: '',
    store_id: branch?.store_id ?? '',
    branch_id: branch?.branch_id ?? '',
    branch_number: branch?.branch_number ?? '',
    store_url: branch?.store_url ?? '',
    category_id: service?.category_id ?? null,
    is_waiting: true,
    is_reservation: false,
    hide: false,
    not_active: false,
    number_of_slots: 1,
    require_confirmation: false,
    photo: null,
    price: 0,
    created_date: new Date(),
    max_limit_enabled: false,
    max_limit: 10,
    reservation_time: {
      from: working_shifts?.[today]?.[0]?.from ?? '00:00',
      to: working_shifts?.[today]?.[0]?.to ?? '23:59',
    },
    enable_max_days_ahead: false,
    max_days_ahead: 60,
    enable_occupancy: false,
    require_employee: false,
    force_duration_on_waiting: false,
    employees: [],
    ...obj,
    ...(service ?? {}),
    durations: (service?.durations ?? []).map(setNewDuration),
    addons: (service?.addons ?? []).map(setNewAddOn),
    price_modifiers: (service?.price_modifiers ?? []).map(setNewPriceModifier),
  };
}

export function setNewRole(role?: Partial<EmployeeRole> | null): EmployeeRole {
  return {
    role_name: '',
    store_id: '',
    permissions: [],
    is_admin: false,
    is_default: false,
    ...(role ?? {}),
  };
}

export function setNewStoreAccess(
  access?: Partial<UserAccess> | null,
  store_id?: string,
  branches_ids?: string[],
): UserAccess {
  let obj = {} as UserAccess;

  if (store_id) {
    obj[store_id] = {
      is_admin: false,
      is_owner: false,
      branches: {},
    };

    if (branches_ids) {
      branches_ids.forEach(branch_id => {
        if (obj[store_id].branches) {
          obj[store_id].branches![branch_id] = {
            role_id: '2',
            permissions: roles[1].permissions,
          };
        }
      });
    }
  }

  return { ...obj, ...(access ?? {}) } as UserAccess;
}

export function setNewWaiting(
  waiting: Partial<Waiting>,
  store?: Store | null,
  branch?: Branch,
  user?: User,
): Waiting {
  return {
    waiting_id: waiting?.waiting_id,
    service_id: waiting?.service_id,
    id: waiting?.id,
    store_id: store?.store_id,
    store_name_en: store?.name_en,
    store_name_ar: store?.name_ar,
    branch_id: branch?.branch_id,
    branch_name_en: branch?.name_en,
    branch_name_ar: branch?.name_ar,
    user_id: user?.user_id,
    employee_id: null,
    group_id: null,
    payment_id: null,
    coupon_id: null,
    loyalty_points_spent_id: null,
    name: user?.username ?? '',
    email: user?.email ?? '',
    country_code: user?.country_code ?? '+966',
    phone: user?.phone ?? '',
    note: '',
    done: false,
    is_ready: false,
    is_canceled: false,
    customer_did_not_come: false,
    photo: null,
    price: Number(waiting?.price ?? 0),
    discounts: [],
    currency: store?.currency ?? undefined,
    vat_percentage: store?.vat_percentage ?? 0,
    duration: null,
    occupancy: 1,
    ...waiting,
  } as Waiting;
}

export function setNewReservation(
  reservation: Partial<Reservation>,
  store?: Store | null,
  branch?: Branch,
  user?: User,
): Reservation {
  return {
    reservation_id: reservation?.reservation_id,
    service_id: reservation?.service_id,
    id: reservation?.id,
    store_id: store?.store_id,
    store_name_en: store?.name_en,
    store_name_ar: store?.name_ar,
    branch_id: branch?.branch_id,
    branch_name_en: branch?.name_en,
    branch_name_ar: branch?.name_ar,
    user_id: user?.user_id,
    employee_id: null,
    group_id: null,
    payment_id: null,
    coupon_id: null,
    loyalty_points_spent_id: null,
    name: user?.username ?? '',
    email: user?.email ?? '',
    country_code: user?.country_code ?? '+966',
    phone: user?.phone ?? '',
    note: '',
    done: false,
    is_ready: false,
    is_canceled: false,
    customer_did_not_come: false,
    require_confirmation: false,
    is_confirmed: false,
    photo: null,
    price: Number(reservation?.price ?? 0),
    discounts: [],
    currency: store?.currency ?? undefined,
    vat_percentage: store?.vat_percentage ?? 0,
    duration: null,
    occupancy: 1,
    ...reservation,
  } as Reservation;
}

export function setBranchPolicy(
  obj?: Partial<BranchPolicy> | null,
): BranchPolicy {
  return {
    store_id: '',
    branches: [],
    createdDate: new Date(),
    name: '',
    text: '',
    active: true,
    ...(obj ?? {}),
  } as BranchPolicy;
}

export function setNewDuration(
  obj?: Partial<ServiceDuration> | null,
): ServiceDuration {
  return {
    service_id: '',
    show_in_app: true,
    ...(obj ?? {}),
    duration: toNumber(obj?.duration ?? 60),
    price_increase: toNumber(obj?.price_increase ?? 0),
  } as ServiceDuration;
}

export function setNewAddOn(obj: Partial<ServiceAddOn> | null): ServiceAddOn {
  return {
    id: 0,
    service_id: '',
    name_en: '',
    name_ar: '',
    active: true,
    duration: 0,
    is_auto_selected: false,
    ...(obj ?? {}),
    price: toNumber(obj?.price ?? 0),
  };
}

export function setNewPriceModifier(
  obj?: Partial<ServicePriceModifier> | null,
): ServicePriceModifier {
  return {
    id: 0,
    name: '',
    service_id: '',
    active: true,
    daysOfWeek: [],
    daysOfMonth: [],
    months: [],
    timeRanges: [],
    ...(obj ?? {}),
    price_increase: toNumber(obj?.price_increase ?? 0),
  };
}

export function setLicense(license?: Partial<License> | null): License {
  return {
    license_id: '',
    store_id: '',
    created_date: new Date(),
    start_date: new Date(),
    expire_date: null,
    is_trial: false,
    features: [],
    number_of_tickets: 0,
    number_of_used_tickets: 0,
    ...(license ?? {}),
  } as License;
}

export function setNewServiceCategory(
  obj?: Partial<ServiceCategory> | null,
): ServiceCategory {
  return {
    store_id: '',
    name_en: '',
    name_ar: '',
    active: true,
    ...(obj ?? {}),
  } as ServiceCategory;
}

export function setNewCoupon(obj?: Partial<Coupon> | null): Coupon {
  return {
    code: '',
    is_active: true,
    is_limited_by_time: false,
    is_limited_by_usage: false,
    usage_limit: 10,
    usage_count: 0,
    ...(obj ?? {}),
    discount_percentage: toNumber(obj?.discount_percentage ?? 0),
    start_date: convertToDate(obj?.start_date),
    end_date: obj?.end_date ? convertToDate(obj.end_date) : null,
    created_at: convertToDate(obj?.created_at),
    updated_at: convertToDate(obj?.updated_at),
  } as Coupon;
}
