import type { BaseState } from "./common";

export interface SettingModel {
  id: string;
  name: string;
  arabic_name: string;
  value: string;
}

export interface SettingState extends BaseState<SettingModel> {
  fetchSettings: (page:number, per_page:number, search:string) => Promise<void>;
  updateSetting: (id: string, setting: Partial<SettingModel>) => Promise<void>;
  setSelectedSetting: (setting: SettingModel) => void;
}
