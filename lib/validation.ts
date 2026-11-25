/**
 * Enquiry form rules — shared by the client form. The PHP endpoint re-validates server-side
 * with the same rules (never trust the browser).
 */

export const projectTypes = [
  { value: "office", label: "Office interior" },
  { value: "corporate", label: "Corporate office" },
  { value: "retail", label: "Retail shop" },
  { value: "showroom", label: "Showroom" },
  { value: "restaurant", label: "Café / restaurant" },
  { value: "commercial", label: "Commercial space / renovation" },
  { value: "other", label: "Something else" },
] as const;

export const areaRanges = ["Under 500 sq ft", "500 – 1,500 sq ft", "1,500 – 3,000 sq ft", "3,000 – 6,000 sq ft", "6,000+ sq ft", "Not sure yet"];

export const budgetRanges = ["Under ₹5 lakh", "₹5 – 15 lakh", "₹15 – 30 lakh", "₹30 – 60 lakh", "₹60 lakh +", "Not decided yet"];

export type EnquiryField =
  | "name"
  | "company"
  | "phone"
  | "email"
  | "projectType"
  | "location"
  | "area"
  | "budget"
  | "message";

export type Enquiry = Record<EnquiryField, string>;

export const fieldLabels: Record<EnquiryField, string> = {
  name: "Full name",
  company: "Company name",
  phone: "Phone number",
  email: "Email address",
  projectType: "Project type",
  location: "Project location",
  area: "Approximate area",
  budget: "Estimated budget",
  message: "Project description",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Indian mobile/landline (with or without +91 / 0) or any other country's number in E.164 range. */
export function isValidPhone(raw: string) {
  const v = raw.replace(/[\s\-().]/g, "");
  return /^(?:\+?91|0)?[6-9]\d{9}$/.test(v) || /^0\d{9,10}$/.test(v) || /^\+(?!91)[1-9]\d{7,14}$/.test(v);
}

export function validateField(field: EnquiryField, value: string): string | null {
  const v = value.trim();
  if (field !== "message" && v.length > 200) return "Please keep this under 200 characters.";
  switch (field) {
    case "name":
      if (!v) return "Please enter your name.";
      if (v.length < 2) return "Your name looks too short.";
      return null;
    case "phone":
      if (!v) return "Please enter a phone number so we can call you back.";
      if (!isValidPhone(v)) return "Please enter a valid phone number, e.g. 98300 12345 or +91 98300 12345.";
      return null;
    case "email":
      if (!v) return "Please enter your email address.";
      if (!EMAIL.test(v)) return "Please enter a valid email address, e.g. name@company.com.";
      return null;
    case "projectType":
      return v ? null : "Please choose the type of project.";
    case "location":
      return v ? null : "Please tell us where the space is (area or neighbourhood is fine).";
    case "message":
      if (!v) return "Please tell us a little about your project.";
      if (v.length < 20) return "A few more details would help — at least 20 characters.";
      if (v.length > 2000) return "Please keep the description under 2,000 characters.";
      return null;
    default:
      return null;
  }
}

export function validateEnquiry(data: Enquiry) {
  const errors: Partial<Record<EnquiryField, string>> = {};
  for (const f of Object.keys(fieldLabels) as EnquiryField[]) {
    const e = validateField(f, data[f] ?? "");
    if (e) errors[f] = e;
  }
  return errors;
}
