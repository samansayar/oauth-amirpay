export interface IbanInquiryRequest {
  IBAN: string;
}

export interface IbanInquiryResponse {
  result: number;
  message: string;
  data?: {
    name: {
      firstName: string;
      lastName: string;
    }[];
    bankName: string;
    isTransferable: boolean;
  };
  errorCode: number | null;
}

export interface ApiError {
  message: string;
  status: number;
  code: string | number;
} 