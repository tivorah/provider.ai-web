import { FinancePage as FinanceFeature } from "../features/finance/FinancePage";
import { AccountingWorkspace } from "../features/operations/AccountingWorkspace";
import { isMockMode } from "../api";

export function FinancePage() {
  return isMockMode ? <AccountingWorkspace /> : <FinanceFeature />;
}
