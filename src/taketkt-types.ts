import type { z } from 'zod';
import type * as S from './schema';

export type ValueOf<T> = T[keyof T];
export type TypeOf<T> = keyof T;
export type DeepProp<T extends object, K extends string> = K extends keyof T
  ? T[K]
  : { [P in keyof T]: DeepProp<Extract<T[P], object>, K> }[keyof T];

export type User = z.infer<typeof S.userSchema>;

export type DashboardUser = z.infer<typeof S.dashboardUserSchema>;

export type UserAccess = z.infer<typeof S.userAccessSchema>;

export type Permissions = z.infer<typeof S.permissionsSchema>;

export type Store = z.infer<typeof S.storeSchema>;

export type Branch = z.infer<typeof S.branchSchema>;

export type BranchGalleryImage = z.infer<typeof S.branchGalleryImageSchema>;

export type Service = z.infer<typeof S.serviceSchema>;

export type ServiceAddOn = z.infer<typeof S.serviceAddOnSchema>;

export type TicketServiceAddOn = z.infer<typeof S.ticketServiceAddOnSchema>;

export type ServicePriceModifier = z.infer<typeof S.servicePriceModifierSchema>;

export type ServiceDuration = z.infer<typeof S.serviceDurationSchema>;

export type ServiceIntegrations = z.infer<typeof S.serviceIntegrationsSchema>;

export type WorkingShift = z.infer<typeof S.workingShiftSchema>;

export type WorkingShifts = z.infer<typeof S.workingShiftsSchema>;

export type Customer = z.infer<typeof S.customerSchema>;

export type TicketUpdate = z.infer<typeof S.ticketUpdateSchema>;

export type Waiting = z.infer<typeof S.waitingSchema>;

export type Reservation = z.infer<typeof S.reservationSchema>;

export type TicketIntegrations = z.infer<typeof S.ticketIntegrationsSchema>;

export type TicketDiscount = z.infer<typeof S.ticketDiscountSchema>;

export type BlockedTimes = z.infer<typeof S.blockedTimesSchema>;

export type ReportStatement = z.infer<typeof S.reportStatementSchema>;

export type EmployeeRole = z.infer<typeof S.employeeRoleSchema>;

export type OtpCodeDoc = z.infer<typeof S.otpCodeDocSchema>;

export type License = z.infer<typeof S.licenseSchema>;

export type Integration = z.infer<typeof S.integrationSchema>;

export type SupportTicket = z.infer<typeof S.supportTicketSchema>;

export type LicensePackage = z.infer<typeof S.licensePackageSchema>;

export type PaymentTypes = z.infer<typeof S.paymentTypesSchema>;

export type SalesRequest = z.infer<typeof S.salesRequestSchema>;

export type BranchPolicy = z.infer<typeof S.branchPolicySchema>;

export type Report = z.infer<typeof S.reportSchema>;

export type ReportData = z.infer<typeof S.reportDataSchema>;

export type StoreCategory = z.infer<typeof S.storeCategorySchema>;

export type FAQ = z.infer<typeof S.faqSchema>;

export type ServiceCategory = z.infer<typeof S.serviceCategorySchema>;

export type Ticket = z.infer<typeof S.ticketSchema>;

export type DashboardInvite = z.infer<typeof S.dashboardInviteSchema>;

export type PaymentMethod = z.infer<typeof S.paymentMethodSchema>;

export type Billing = z.infer<typeof S.billingSchema>;

export type BillingHistory = z.infer<typeof S.billingHistorySchema>;

export type BusyTimesWeekday = z.infer<typeof S.busyTimesWeekdaySchema>;

export type BusyTimesHourly = z.infer<typeof S.busyTimesHourlySchema>;

export type BusyTimes = z.infer<typeof S.busyTimesSchema>;

export type Cohort = z.infer<typeof S.cohortSchema>;

export type Coupon = z.infer<typeof S.couponSchema>;

export type Banner = z.infer<typeof S.bannerSchema>;

export type Notification = z.infer<typeof S.notificationSchema>;

export type LoyaltyPoints = z.infer<typeof S.loyaltyPointsSchema>;
