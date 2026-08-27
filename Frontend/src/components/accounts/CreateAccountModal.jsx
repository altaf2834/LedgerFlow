import { useState } from "react";
import * as accountApi from "../../api/account.api";
import Button from "../ui/Button";
import Field from "../ui/Field";
import toast from "react-hot-toast";

function CreateAccountModal({ onClose, onCreated }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Account name is required");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await accountApi.createAccount({ name: name.trim() });
      toast.success(`Account "${name.trim()}" created`);
      onCreated(); // tells parent to refetch the list
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 className="font-display text-xl text-ink mb-4">New account</h2>
        <form onSubmit={handleSubmit} noValidate>
          <Field
            label="Account name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error}
            placeholder="e.g. Checking"
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              Create
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountModal;