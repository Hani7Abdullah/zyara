import type { BaseState } from "./common";

export interface PopularTopicModel {
  id: string;
  title: string;
  arabic_title: string;
  description: string;
  arabic_description: string;
  priority: number;
}

export interface PopularTopicState extends BaseState<PopularTopicModel> {
  fetchPopularTopics: (page:number, per_page:number, search:string) => Promise<void>;
  createPopularTopic: (popularTopic: Omit<PopularTopicModel, "id">) => Promise<void>;
  updatePopularTopic: (id: string, popularTopic: Partial<PopularTopicModel>) => Promise<void>;
  deletePopularTopic: (id: string) => Promise<void>;
  setSelectedPopularTopic: (popularTopic: PopularTopicModel) => void;
}

