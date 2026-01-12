import type { ClientModel } from "./client";
import type { BaseState } from "./common";

export interface JoinRequestModel {
  id: string;
  user: ClientModel;
  classification: string;
  store_name: string;
}

export interface JoinRequestState extends BaseState<JoinRequestModel> {
  fetchJoinRequests: (page:number, per_page:number, search:string) => Promise<void>;
  setSelectedJoinRequest: (joinRequest: JoinRequestModel) => void;
}

