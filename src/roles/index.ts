import { EmployeeRole } from '../types';

export default [
  {
    role_id: '1',
    role_name: 'ADMIN',
    permissions: [],
    is_admin: true,
    is_default: true,
  },
  {
    role_id: '2',
    role_name: 'MANAGER',
    permissions: [
      'ACCESS_DASHBOARD_PERMISSION',
      'CUSTOMERS_PERMISSION',
      'BRANCH_SETTINGS_PERMISSION',
      'VIEW_LANDING_PAGE_PERMISSION',
      'SERVICES_PERMISSION',
      'EMPLOYEES_PERMISSION',
    ],
    is_admin: false,
    is_default: true,
  },
  {
    role_id: '3',
    role_name: 'OPERATOR',
    permissions: [
      'ACCESS_DASHBOARD_PERMISSION',
      'CUSTOMERS_PERMISSION',
      'SERVICES_PERMISSION',
    ],
    is_admin: false,
    is_default: true,
  },
  {
    role_id: '4',
    role_name: 'NON_EMPLOYED',
    permissions: [],
    is_admin: false,
    is_default: true,
  },
  {
    role_id: '5',
    role_name: 'ACCOUNTANT',
    permissions: [
      'ACCESS_DASHBOARD_PERMISSION',
      'VIEW_LANDING_PAGE_PERMISSION',
      'VIEW_LANDING_PAGE_PERMISSION',
    ],
    is_admin: false,
    is_default: true,
    accountant: true,
  },
] as EmployeeRole[];
