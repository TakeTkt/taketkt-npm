import roles from './roles';
import {
  Branch,
  BranchPolicy,
  ClientCustomer,
  DashboardUser,
  EmployeeRole,
  Reservation,
  Service,
  Store,
  User,
  UserAccess,
  Waiting,
} from './taketkt-types';
import { getTodaysName } from './utils';

export function setNewUser(user: Partial<DashboardUser>): DashboardUser {
  return {
    firstName: '',
    lastName: '',
    email: '',
    country_code: '',
    phone: '',
    stores: [],
    ...user,
  } as DashboardUser;
}

export function setNewCustomer(
  customer: Partial<ClientCustomer> | null,
): ClientCustomer {
  return {
    store_id: '',
    branches_ids: [],
    username: '',
    email: '',
    country_code: '+966',
    phone: '',
    number_of_visits: 0,
    ...(customer ?? {}),
  } as ClientCustomer;
}

export function setNewStore(store?: Partial<Store>) {
  return {
    name_en: '',
    name_ar: '',
    store_id: '',
    store_url: '',
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
    ...store,
  } as Store;
}

export function setNewBranch(branch?: Partial<Branch> | null) {
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
    ...(branch ?? {}),
  } as Branch;
}

export function setNewService(
  service?: Partial<Service> | null,
  branch?: Branch,
) {
  const today = getTodaysName();
  const working_shifts = branch?.working_shifts;

  let obj: Partial<Service> = {};
  if (service?.is_reservation) {
    obj = {
      is_waiting: false,
    };
  }

  return {
    name_en: '',
    name_ar: '',
    store_id: branch?.store_id ?? '',
    branch_id: branch?.branch_id ?? '',
    branch_number: branch?.branch_number ?? '',
    store_url: branch?.store_url ?? '',
    is_waiting: true,
    is_reservation: false,
    hide: false,
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
    duration: '01:00',
    enable_max_days_ahead: false,
    max_days_ahead: 60,
    ...obj,
    ...(service ?? {}),
  } as Service;
}

export function setNewRole(role?: Partial<EmployeeRole> | null) {
  return {
    role_name: '',
    store_id: '',
    permissions: [],
    is_admin: false,
    is_default: false,
    ...(role ?? {}),
  } as EmployeeRole;
}

export function setNewStoreAccess(
  access?: Partial<UserAccess> | null,
  store_id?: string,
  branches_ids?: string[],
) {
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
) {
  return {
    store_id: store?.store_id,
    store_name_en: store?.name_en,
    store_name_ar: store?.name_ar,
    branch_id: branch?.branch_id,
    branch_name_en: branch?.name_en,
    branch_name_ar: branch?.name_ar,
    user_id: user?.user_id,
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
    currency: store?.currency ?? undefined,
    ...waiting,
  } as Waiting;
}

export function setNewReservation(
  reservation: Partial<Reservation>,
  store?: Store | null,
  branch?: Branch,
  user?: User,
) {
  return {
    store_id: store?.store_id,
    store_name_en: store?.name_en,
    store_name_ar: store?.name_ar,
    branch_id: branch?.branch_id,
    branch_name_en: branch?.name_en,
    branch_name_ar: branch?.name_ar,
    user_id: user?.user_id,
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
    currency: store?.currency ?? undefined,
    ...reservation,
  } as Reservation;
}

export function setBranchPolicy(
  obj?: Partial<BranchPolicy> | null,
): BranchPolicy {
  return {
    policy_id: '',
    store_id: '',
    branches: [],
    createdDate: new Date(),
    name: '',
    text: '',
    active: true,
    ...(obj ?? {}),
  };
}
