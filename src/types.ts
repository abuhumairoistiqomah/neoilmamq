/**
 * Types for NEO ILMA Question Bank Dashboard
 */

export interface Worksheet {
  id: string;
  grade: number | string;
  chapter: string;
  topic: string;
  type: string;
  link: string;
}

export interface GradeStat {
  grade: number;
  count: number;
  chaptersCount: number;
  topicsCount: number;
  learningMaterialsCount: number;
}

export interface GASConfig {
  sheetUrl: string;
  isConfigured: boolean;
}
