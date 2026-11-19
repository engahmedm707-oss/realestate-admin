import { z } from "zod";

/**
 * الشكل اللي بيتحفظ في الداتابيز — مطابق للـ JSON المطلوب بالحرف.
 * كل الحقول نصية (تقدر تسيبها فاضية)، ما عدا folder_name.
 */
const text = z.string();

export const assetDetailsSchema = z.object({
  region: text,
  city: text,
  district: text,
  asset_classification: text,
  asset_type: text,
  asset_area: text,
  inspector: text,
  usage: text,
  contact_number: text,
  references: text,
  auditor: text,
  coordinates: text,
});

export const transactionDataSchema = z.object({
  assignment_number: text,
  commission_number: text,
  assignment_date: text,
  valuation_purpose: text,
  intended_use: text,
  basis_of_value: text,
  ownership: text,
  valuation_hypothesis: text,
  client: text,
  valuation_branch: text,
  form: text,
  asset_details: assetDetailsSchema,
});

export const basicDataSchema = z.object({
  customer_name: text,
  report_requester: text,
  owner_name: text,
  other_users: text,
  deed_number: text,
  deed_date: text,
  plan_number: text,
  block_number: text,
  plot_number: text,
  land_nature: text,
  level: text,
  deed_image: z.string().default(""),
});

export const propertyDataSchema = z.object({
  is_property_halted: text,
  construction_completion_percentage: text,
  street_name: text,
  unit_number: text,
  floor_number: text,
  is_in_regulatory_plan: text,
});

export const boundariesAndLengthsSchema = z.object({
  north_boundary: text,
  north_length: text,
  south_boundary: text,
  south_length: text,
  east_boundary: text,
  east_length: text,
  west_boundary: text,
  west_length: text,
});

export const submissionSchema = z.object({
  folder_name: z
    .string()
    .trim()
    .min(1, "اسم الفولدر مطلوب")
    .max(120, "اسم الفولدر طويل جدًا"),
  transaction_data: transactionDataSchema,
  basic_data: basicDataSchema,
  property_data: propertyDataSchema,
  boundaries_and_lengths: boundariesAndLengthsSchema,
  reminders: z.array(z.string().trim().max(500, "التذكير طويل جدًا")),
});

export type Submission = z.infer<typeof submissionSchema>;
export type AssetDetails = z.infer<typeof assetDetailsSchema>;
export type TransactionData = z.infer<typeof transactionDataSchema>;
export type BasicData = z.infer<typeof basicDataSchema>;
export type PropertyData = z.infer<typeof propertyDataSchema>;
export type BoundariesAndLengths = z.infer<typeof boundariesAndLengthsSchema>;

/** نسخة فاضية جديدة كل مرة (عشان ما يحصلش shared state) */
export function makeEmptySubmission(): Submission {
  return {
    folder_name: "",
    transaction_data: {
      assignment_number: "",
      commission_number: "",
      assignment_date: "",
      valuation_purpose: "",
      intended_use: "",
      basis_of_value: "",
      ownership: "",
      valuation_hypothesis: "",
      client: "",
      valuation_branch: "تقييم العقارات",
      form: "",
      asset_details: {
        region: "",
        city: "",
        district: "",
        asset_classification: "",
        asset_type: "",
        asset_area: "",
        inspector: "",
        usage: "",
        contact_number: "",
        references: "",
        auditor: "",
        coordinates: "",
      },
    },
    basic_data: {
      customer_name: "",
      report_requester: "",
      owner_name: "",
      other_users: "",
      deed_number: "",
      deed_date: "",
      plan_number: "",
      block_number: "",
      plot_number: "",
      land_nature: "",
      level: "",
      deed_image: "",
    },
    property_data: {
      is_property_halted: "نعم",
      construction_completion_percentage: "",
      street_name: "",
      unit_number: "",
      floor_number: "",
      is_in_regulatory_plan: "",
    },
    boundaries_and_lengths: {
      north_boundary: "",
      north_length: "",
      south_boundary: "",
      south_length: "",
      east_boundary: "",
      east_length: "",
      west_boundary: "",
      west_length: "",
    },
    reminders: [],
  };
}
