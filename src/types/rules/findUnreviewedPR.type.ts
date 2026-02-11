import { SortOrder } from "../shared/sortOrder.type";

export interface FindStalePullRequestsOptions {
  sortOrder?: SortOrder;
  limit?: number;
}