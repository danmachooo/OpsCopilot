import { SortOrder } from "../shared/sortOrder.type";

export interface FindStalledPrsOptions {
  sortOrder?: SortOrder;
  limit?: number;
}
