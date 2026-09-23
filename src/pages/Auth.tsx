import { Auth as AuthFeature } from "../features/auth/AuthFeature";

export function Auth({ onBack, initialMode }: { onBack?: () => void; initialMode?: "register" | "login" }) {
  return <AuthFeature onBack={onBack} initialMode={initialMode} />;
}
