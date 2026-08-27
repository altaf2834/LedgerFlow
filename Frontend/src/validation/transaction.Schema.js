import { z } from "zod";

export const transactionSchema = z
  .object({
    fromAccount: z.string().min(1, "Select an account to send from"),
    toAccount: z.string().min(1, "Recipient account ID is required"),
    amount: z
      .number({ invalid_type_error: "Amount must be a number" })
      .positive("Amount must be greater than 0"),
  })
  .refine((data) => data.fromAccount !== data.toAccount, {
    message: "You can't send money to the same account",
    path: ["toAccount"],
  });