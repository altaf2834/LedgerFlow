import { useState } from "react";
import { useRef } from "react";
import { transactionSchema } from "../../validation/transaction.Schema";
import * as transactionApi from "../../api/transaction.api";
import AccountSelector from "./AccountSelector";
import Field from "../ui/Field";
import Button from "../ui/Button";
import toast from "react-hot-toast";

function TransactionForm({ onSuccess }) {
    const idempotencyKeyRef = useRef(null); 
  const [formData, setFormData] = useState({ fromAccount: "", toAccount: "", amount: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg("");

    const parsed = { ...formData, amount: Number(formData.amount) };
    const result = transactionSchema.safeParse(parsed);
    if (!result.success) {
        // ...existing validation error handling
        return;
    }

    setLoading(true);
    setErrors({});

    // Generate the key ONCE, before the try block that might retry.
    // If this exact submission needs retrying, reuse the SAME key.
    const idempotencyKey = idempotencyKeyRef.current ?? crypto.randomUUID();
    idempotencyKeyRef.current = idempotencyKey;

    try {
        const data = await transactionApi.createTransaction({ ...result.data, idempotencyKey });
        toast.success("Transaction completed successfully");
        setSuccessMsg("Transaction completed successfully.");
        setFormData({ fromAccount: "", toAccount: "", amount: "" });
        idempotencyKeyRef.current = null; // reset — next submit is a genuinely NEW transaction
        onSuccess?.(data.transaction);
    } catch (err) {
        setErrors({ form: err.response?.data?.message || "Transaction failed. Please try again." });
        // idempotencyKeyRef is deliberately NOT reset here —
        // if the user clicks "Send" again for this same form state, it's a retry, same key.
    } finally {
        setLoading(false);
    }
};

  return (
    <form onSubmit={handleSubmit} noValidate className="bg-white border border-line rounded-lg p-6">
      <AccountSelector
        label="From"
        value={formData.fromAccount}
        onChange={(v) => setFormData({ ...formData, fromAccount: v })}
      />
      {errors.fromAccount && <p className="text-error text-xs -mt-3 mb-4">{errors.fromAccount}</p>}

      <Field
        label="To (recipient account ID)"
        type="text"
        value={formData.toAccount}
        onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
        error={errors.toAccount}
        placeholder="Paste the recipient's account ID"
      />

      <Field
        label="Amount"
        type="number"
        step="0.01"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        error={errors.amount}
        placeholder="0.00"
      />

      {errors.form && <p className="text-error text-sm mb-4">{errors.form}</p>}
      {successMsg && <p className="text-ledger text-sm mb-4">{successMsg}</p>}

      {loading && (
        <p className="font-mono text-xs text-ink-soft mb-3">
          Processing your transaction — this can take up to 15 seconds…
        </p>
      )}

      <Button type="submit" loading={loading}>
        {loading ? "Processing…" : "Send"}
      </Button>
    </form>
  );
}

export default TransactionForm;