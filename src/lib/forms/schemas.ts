import { z } from "zod";

/**
 * Form schemas shared by server actions. Error messages are codes, translated
 * by `messages` below, so validation stays language-independent.
 */
export const messages = {
  sv: {
    required: "Fyll i det här fältet.",
    email: "Skriv en giltig e-postadress, till exempel namn@exempel.se.",
    phone: "Skriv ett giltigt telefonnummer.",
    consent: "Du behöver godkänna integritetspolicyn för att kunna skicka.",
    age: "Du behöver vara minst 20 år för att bli volontär.",
    number: "Skriv ett antal mellan 1 och 2 000.",
    tooLong: "Texten är för lång.",
  },
  en: {
    required: "Please fill in this field.",
    email: "Enter a valid email address, for example name@example.com.",
    phone: "Enter a valid phone number.",
    consent: "You need to accept the privacy policy to send.",
    age: "You need to be at least 20 to volunteer.",
    number: "Enter a number between 1 and 2,000.",
    tooLong: "The text is too long.",
  },
} as const;

export type MessageCode = keyof (typeof messages)["sv"];

const text = (max = 200) =>
  z.string().trim().min(1, "required").max(max, "tooLong");
const optionalText = (max = 200) => z.string().trim().max(max, "tooLong").optional().or(z.literal(""));
const email = z.string().trim().min(1, "required").email("email");
const phone = z
  .string()
  .trim()
  .regex(/^[+0-9 ()-]{6,20}$/, "phone")
  .optional()
  .or(z.literal(""));
const consent = z.literal("on", { error: "consent" });

export const volunteerSchema = z
  .object({
    kind: z.enum(["volontar", "medlem", "bada"], { error: "required" }),
    name: text(),
    email,
    phone,
    city: text(),
    interests: z.array(z.string()).optional(),
    adult: z.string().optional(),
    message: optionalText(2000),
    consent,
  })
  .superRefine((v, ctx) => {
    if (v.kind !== "medlem" && v.adult !== "on") {
      ctx.addIssue({ code: "custom", path: ["adult"], message: "age" });
    }
  });

export const bookingSchema = z.object({
  organisation: text(),
  name: text(),
  email,
  phone,
  training: text(),
  participants: z.coerce.number({ error: "number" }).int("number").min(1, "number").max(2000, "number"),
  preferredDate: optionalText(100),
  city: text(),
  message: optionalText(2000),
  consent,
});

export const partnerSchema = z.object({
  company: text(),
  name: text(),
  email,
  phone,
  interest: text(),
  message: optionalText(2000),
  consent,
});

export const schemas = {
  volunteer: volunteerSchema,
  booking: bookingSchema,
  partner: partnerSchema,
};

export type FormName = keyof typeof schemas;

export type FormState = {
  status: "idle" | "success" | "error";
  errors?: Record<string, string>;
  values?: Record<string, string | string[]>;
  submittedAt?: number;
};
