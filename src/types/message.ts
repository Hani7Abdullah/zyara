import type { ClientModel } from "./client";
import type { BaseState } from "./common";

export interface MessageModel {
  id: string;
  user: ClientModel;
  message: string;
}

export interface MessageState extends BaseState<MessageModel> {
  fetchMessages: (page:number, per_page:number, search:string) => Promise<void>;
  setSelectedMessage: (message: MessageModel) => void;
}

