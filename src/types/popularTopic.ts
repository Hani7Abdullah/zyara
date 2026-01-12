import type { BaseState } from "./common";

export interface PopularTopicModel {
  id: string;
  question: string;
  arabic_question: string;
  answer: string;
  arabic_answer: string;
}

export interface PopularTopicState extends BaseState<PopularTopicModel> {
  fetchPopularTopics: (page:number, per_page:number, search:string) => Promise<PopularTopicModel[]>;
  createPopularTopic: (popularTopic: Omit<PopularTopicModel, "id">) => Promise<void>;
  updatePopularTopic: (id: string, popularTopic: Partial<PopularTopicModel>) => Promise<void>;
  deletePopularTopic: (id: string) => Promise<void>;
  setSelectedPopularTopic: (popularTopic: PopularTopicModel) => void;
}

