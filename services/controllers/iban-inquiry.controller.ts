import { ApiClient } from "@/lib/utils/api-client";
import { IbanInquiryResponse } from "../models/types";

export class IbanInquiryController {
  static async inquireIban(iban: string): Promise<IbanInquiryResponse> {
    try {
      return await ApiClient.request<IbanInquiryResponse>(
        "/facility/ibanInquiry",
        {
          method: "POST",
          body: JSON.stringify({ IBAN: iban }),
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        throw {
          message: error.message,
          status: 500,
        };
      }
      throw error;
    }
  }
}
