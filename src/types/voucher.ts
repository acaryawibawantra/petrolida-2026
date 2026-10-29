export type VoucherType = "fixed_amount" | "percentage";
export type VoucherStatus = "active" | "inactive" | "expired";

export interface Voucher {
  id: string;
  code: string;
  name: string;
  description: string;
  type: VoucherType;
  amount: number;
  quantity: number;
  used_count: number;
  usage_limit: number;
  start_date: string;
  expiry_date: string;
  status: VoucherStatus;
}

export interface CreateVoucherPayload {
  code: string;
  name: string;
  description?: string;
  type: VoucherType;
  amount: number;
  quantity: number;
  usage_limit: number;
  start_date: string;
  expiry_date: string;
  status: VoucherStatus;
}

export interface UpdateVoucherPayload extends Partial<CreateVoucherPayload> {
  id: string;
}

export interface VoucherListResponse {
  success: boolean;
  message: string;
  data: Voucher[];
  meta: Array<{
    take: number;
    page: number;
    total_data: number;
    total_page: number;
    sort: string;
    sort_by: string;
  }>;
}

export interface VoucherDetailResponse {
  success: boolean;
  message: string;
  data: Voucher;
}

export interface VoucherCreateResponse {
  success: boolean;
  message: string;
  data: Voucher;
}

export interface VoucherUpdateResponse {
  success: boolean;
  message: string;
}
