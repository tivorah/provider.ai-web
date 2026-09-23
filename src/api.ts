import { liveApi } from "./liveApi";
import { mockApi } from "./mocks/mockApi";

export { ApiError } from "./liveApi";
export const isMockMode = import.meta.env.VITE_DATA_MODE !== "api";
export const api = isMockMode ? mockApi : liveApi;
