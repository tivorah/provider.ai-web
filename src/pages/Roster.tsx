import { RosterPage as RosterFeature } from "../features/roster/RosterPage";

export function RosterPage({ createRequest = 0 }: { createRequest?: number }) {
  return <RosterFeature createRequest={createRequest} />;
}
