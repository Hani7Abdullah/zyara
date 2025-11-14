import type { BaseState } from "./common";
import type { CurrencyModel } from "./currency";

export type PlatformType = "android" | "ios";

export type VersionStatus = "draft" | "published" | "latest";

export interface VersionModel {
    id: string;
    version: string;
    base_url: string | null;
    platform: PlatformType,
    currency_id: string;
    currency: CurrencyModel;
    is_required: boolean;
    status: VersionStatus;
}

export interface VersionState extends BaseState<VersionModel> {
    fetchVersions: (page: number, per_page: number, search: string) => Promise<void>;
    updateVersion: (id: string, role: Partial<VersionModel>) => Promise<void>;
    makePublish: (id: string) => Promise<void>;
    setSelectedVersion: (version: VersionModel) => void;
}