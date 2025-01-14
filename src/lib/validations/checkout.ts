import { z } from "zod";

export const checkoutFormSchema = z.object({
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["credit_card", "paypal"] as const, {
    required_error: "Please select a payment method",
  }),
});

export type CheckoutFormData = z.infer<typeof checkoutFormSchema>;
