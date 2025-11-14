import type { AddressModel } from "./address";
import type { BaseState } from "./common";

export interface ClientModel {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;
  image: string;
  country: string;
  addresses: AddressModel[];
  is_active: boolean;
}

export interface ClientState extends BaseState<ClientModel> {
  fetchClients: (page:number, per_page:number, search:string) => Promise<void>;
  switchActivation: (id: number) => Promise<void>;
  setSelectedClient: (client: ClientModel) => void;
}
