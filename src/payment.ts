import type { Currency } from './currencies';
import type { Store } from './taketkt-types';

export interface MoyasarError {
  type: string;
  message: string;
  errors: {
    [key: string]: string;
  };
}

export interface MoyasarInvoice {
  id: string;
  status: 'initiated' | string;
  amount: number;
  amount_format: string;
  currency: Currency;
  description?: string | null;
  logo_url?: string | null;
  url: string;
  created_at: string;
  expired_at: string | null;
  updated_at: string | null;
  callback_url?: string | null;
  back_url?: string | null;
  success_url?: string | null;
  metadata?: {
    [key: string]: string;
  } | null;
  payments: any[];
}

export interface CreditCardInitSource {
  type: 'creditcard';
  name: string;
  number: string;
  cvc: number;
  month: number;
  year: number;
  '3ds'?: boolean;
  manual?: boolean;
  save_card?: boolean;
}

export interface ApplePayInitSource {
  type: 'applepay';
  token: string;
}

export interface StcPayInitSource {
  type: 'stcpay';
  mobile: string;
  branch?: string;
  cashier?: string;
}

export interface TokenInitSource {
  type: 'token';
  token: string;
  '3ds'?: boolean;
  manual?: boolean;
}

export interface MoyasarPayment {
  id: string;
  status: 'initiated' | string;
  amount: number;
  fee: number;
  currency: Store['currency'];
  refunded: number;
  refunded_at?: string | null;
  captured: number;
  captured_at?: string | null;
  voided_at?: string | null;
  description?: string | null;
  invoice_id?: string | null;
  ip?: string | null;
  callback_url: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    [key: string]: string;
  };
  source:
    | CreditCardResponseSource
    | ApplePayResponseSource
    | StcPayResponseSource
    | TokenResponseSource;
  is_ticket?: boolean;
}

export interface CreditCardResponseSource {
  type: 'creditcard';
  company: 'mada' | 'visa' | 'master' | 'amex' | string;
  name: string;
  number: string;
  message: string;
  transaction_url?: string | null;
  token?: string | null;
  gateway_id?: string | null;
  reference_number?: string | null;
}

export interface ApplePayResponseSource {
  type: 'applepay';
  company: 'mada' | 'visa' | 'master' | 'amex' | string;
  name: string;
  number: string;
  message: string;
  gateway_id?: string | null;
  reference_number?: string | null;
}

export interface StcPayResponseSource {
  type: 'stcpay';
  mobile: string;
  reference_number?: string;
  branch?: string | null;
  cashier?: string | null;
  transaction_url?: string | null;
  message: string;
}

export interface TokenResponseSource {
  type: 'token';
  company: 'mada' | 'visa' | 'master' | 'amex' | string;
  number: string;
  message: string;
  transaction_url?: string | null;
}

export interface TokenResult {
  id: string;
  status: 'initiated' | 'active' | 'inactive';
  brand: string;
  funding: string;
  country: string;
  month: string;
  year: string;
  name: string;
  last_four: string;
  metadata: any | null;
  message: string | null;
  verification_url: string;
  created_at: string;
  updated_at: string;
}
