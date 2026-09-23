import { ProviderIntelligence as ProviderIntelligenceFeature } from "../features/intelligence/ProviderIntelligence";
import type { Page } from "../types";

export function ProviderIntelligence({ onClose, onNavigate, mode, onToggleMode, onOpenNewTab }: { onClose: () => void; onNavigate: (page: Page) => void; mode: "drawer" | "full"; onToggleMode: () => void; onOpenNewTab: () => void }) {
  return <ProviderIntelligenceFeature onClose={onClose} onNavigate={onNavigate} mode={mode} onToggleMode={onToggleMode} onOpenNewTab={onOpenNewTab} />;
}
