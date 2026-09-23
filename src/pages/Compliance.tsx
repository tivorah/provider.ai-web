import { CompliancePage as ComplianceFeature } from "../features/compliance/CompliancePage";
import { ComplianceWorkspace } from "../features/operations/ComplianceWorkspace";
import { isMockMode } from "../api";

export function CompliancePage() {
  return isMockMode ? <ComplianceWorkspace /> : <ComplianceFeature />;
}
