import type { BaseState } from "./common";

export interface SystemInformationModel {
  id: string;
  name: string;
  arabic_name?: string;
  content: string;
  arabic_content: string;
}

export interface SystemInformationState extends BaseState<SystemInformationModel> {
  fetchSystemInformation: (page:number, per_page:number, search:string) => Promise<void>;
  updateSystemInformation: (id: string, systemInformation: Partial<SystemInformationModel>) => Promise<void>;
  setSelectedSystemInformation: (setting: SystemInformationModel) => void;
}