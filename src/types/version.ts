import type { BaseState } from "./common";

export type PlatformType = "android" | "ios";

export type VersionStatus = "draft" | "published" | "latest";

export interface VersionModel {
    id: string;
    version: string;
    platform: PlatformType,
    currency: string;
    is_required: boolean;
    status: VersionStatus;
    released_at: Date;
}

export interface VersionState extends BaseState<VersionModel> {
    fetchVersions: (page: number, per_page: number, search: string) => Promise<VersionModel[]>;
    createVersion: (version: Omit<VersionModel, "id" | "status" | "released_at">) => Promise<void>;
    updateVersion: (id: string, version: Partial<VersionModel>) => Promise<void>;
    makePublish: (id: string) => Promise<void>;
    setSelectedVersion: (version: VersionModel) => void;
}