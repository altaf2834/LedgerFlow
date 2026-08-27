import { useState } from "react";
import { useAccounts } from "../../hooks/useAccounts";
import AccountCard from "../../components/accounts/AccountCard";
import CreateAccountModal from "../../components/accounts/CreateAccountModal";
import Button from "../../components/ui/Button";
import AccountCardSkeleton from "../../components/accounts/AccountCardSkeleton";
function AccountsPage() {
  const { accounts, loading, error, refetch } = useAccounts();
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Accounts</h1>
        <Button onClick={() => setShowModal(true)} className="!w-auto !px-4 !py-2 !rounded-lg !text-sm shadow-sm">
          New Account
        </Button>
      </div>
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <AccountCardSkeleton key={i} />)}
        </div>
      )}
      {error && <p className="text-error text-sm">{error}</p>}

      {!loading && !error && accounts.length === 0 && (
        <div className="border border-dashed border-line rounded-lg p-12 text-center">
          <p className="text-ink-soft text-sm mb-4">
            You don't have any accounts yet.
          </p>
          <Button onClick={() => setShowModal(true)} className="w-auto px-4 mx-auto">
            Create your first account
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {accounts.map((account) => (
          <AccountCard key={account._id} account={account} />
        ))}
      </div>

      {showModal && (
        <CreateAccountModal
          onClose={() => setShowModal(false)}
          onCreated={refetch}
        />
      )}
    </div>
  );
}

export default AccountsPage;