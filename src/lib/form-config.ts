import {
  ASSET_CLASSIFICATION_OPTIONS,
  ASSET_TYPE_OPTIONS,
  BASIS_OF_VALUE_OPTIONS,
  LAND_NATURE_OPTIONS,
  USAGE_OPTIONS,
  VALUATION_PURPOSE_OPTIONS,
  YES_NO_OPTIONS,
} from "./options";

export type FieldType = "text" | "date" | "select" | "textarea" | "number";

export type FieldDef = {
  key: string;
  label: string;
  type?: FieldType;
  options?: string[];
  placeholder?: string;
  /** ياخد العرض الكامل في الشبكة */
  full?: boolean;
};

export type GroupDef = {
  id: string;
  title: string;
  subtitle?: string;
  path: string[];
  fields: FieldDef[];
};

export const FIELD_GROUPS: GroupDef[] = [
  {
    id: "transaction",
    title: "بيانات العملية",
    subtitle: "أرقام التكليف والعمولة والعميل والغرض من التقييم",
    path: ["transaction_data"],
    fields: [
      { key: "assignment_number", label: "رقم التكليف", placeholder: "مثال: 2026/1234" },
      { key: "commission_number", label: "رقم العمولة" },
      { key: "assignment_date", label: "تاريخ التكليف", type: "date" },
      {
        key: "valuation_purpose",
        label: "الغرض من التقييم",
        type: "select",
        options: VALUATION_PURPOSE_OPTIONS,
      },
      { key: "intended_use", label: "الاستخدام المقصود" },
      {
        key: "basis_of_value",
        label: "أساس القيمة",
        type: "select",
        options: BASIS_OF_VALUE_OPTIONS,
      },
      { key: "ownership", label: "الملكية" },
      { key: "client", label: "العميل" },
      { key: "valuation_branch", label: "فرع التقييم" },
      { key: "form", label: "النموذج" },
      {
        key: "valuation_hypothesis",
        label: "فرضية التقييم",
        type: "textarea",
        full: true,
      },
    ],
  },
  {
    id: "asset",
    title: "تفاصيل الأصل",
    subtitle: "الموقع ونوع الأصل والمعاين والمراجع",
    path: ["transaction_data", "asset_details"],
    fields: [
      { key: "region", label: "المنطقة" },
      { key: "city", label: "المدينة" },
      { key: "district", label: "الحي" },
      {
        key: "asset_classification",
        label: "تصنيف الأصل",
        type: "select",
        options: ASSET_CLASSIFICATION_OPTIONS,
      },
      { key: "asset_type", label: "نوع الأصل", type: "select", options: ASSET_TYPE_OPTIONS },
      { key: "asset_area", label: "مساحة الأصل", placeholder: "مثال: 450 م²" },
      { key: "inspector", label: "المعاين" },
      { key: "usage", label: "الاستخدام", type: "select", options: USAGE_OPTIONS },
      { key: "contact_number", label: "رقم التواصل", placeholder: "01xxxxxxxxx" },
      { key: "auditor", label: "المدقق" },
      { key: "coordinates", label: "الإحداثيات", placeholder: "24.7136, 46.6753" },
      { key: "references", label: "المراجع", type: "textarea", full: true },
    ],
  },
  {
    id: "basic",
    title: "البيانات الأساسية",
    subtitle: "بيانات العميل والمالك والصك والمخطط",
    path: ["basic_data"],
    fields: [
      { key: "customer_name", label: "اسم العميل" },
      { key: "report_requester", label: "طالب التقرير" },
      { key: "owner_name", label: "اسم المالك" },
      { key: "other_users", label: "مستخدمون آخرون" },
      { key: "deed_number", label: "رقم الصك" },
      { key: "deed_date", label: "تاريخ الصك", type: "date" },
      { key: "plan_number", label: "رقم المخطط" },
      { key: "block_number", label: "رقم البلوك" },
      { key: "plot_number", label: "رقم القطعة" },
      { key: "land_nature", label: "طبيعة الأرض", type: "select", options: LAND_NATURE_OPTIONS },
      { key: "level", label: "المنسوب" },
    ],
  },
  {
    id: "property",
    title: "بيانات العقار",
    subtitle: "حالة العقار والبناء والوحدة والشارع",
    path: ["property_data"],
    fields: [
      {
        key: "is_property_halted",
        label: "هل العقار متوقف؟",
        type: "select",
        options: YES_NO_OPTIONS,
      },
      {
        key: "construction_completion_percentage",
        label: "نسبة إنجاز البناء",
        placeholder: "مثال: 80%",
      },
      { key: "street_name", label: "اسم الشارع" },
      { key: "unit_number", label: "رقم الوحدة" },
      { key: "floor_number", label: "رقم الدور" },
      {
        key: "is_in_regulatory_plan",
        label: "داخل المخطط التنظيمي؟",
        type: "select",
        options: YES_NO_OPTIONS,
      },
    ],
  },
  {
    id: "boundaries",
    title: "الحدود والأطوال",
    subtitle: "حدود العقار الأربعة والأطوال المقابلة لكل حد",
    path: ["boundaries_and_lengths"],
    fields: [
      { key: "north_boundary", label: "حد الشمال" },
      { key: "north_length", label: "طول الشمال (م)" },
      { key: "south_boundary", label: "حد الجنوب" },
      { key: "south_length", label: "طول الجنوب (م)" },
      { key: "east_boundary", label: "حد الشرق" },
      { key: "east_length", label: "طول الشرق (م)" },
      { key: "west_boundary", label: "حد الغرب" },
      { key: "west_length", label: "طول الغرب (م)" },
    ],
  },
];
