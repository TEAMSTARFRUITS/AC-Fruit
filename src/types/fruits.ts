export type FruitCategory = 'abricots' | 'peches' | 'nectarines';
export type FruitType = 'jaune' | 'blanche' | 'sanguine' | 'plate';

export interface MaturityPeriod {
  startDay: number;
  startMonth: number;
  endDay: number;
  endMonth: number;
}

export interface VideoSource {
  type: 'local' | 'youtube';
  url: string;
}

export interface FruitVariety {
  name: string;
  image: string;
  images?: string[];
  description: string;
  technicalSheet: string;
  videoUrl: string;
  videoSource?: VideoSource;
  maturityPeriod?: MaturityPeriod;
}

export interface Fruit {
  name: string;
  hasSubCategories: boolean;
  varieties: Record<string, FruitVariety> | Record<FruitType, Record<string, FruitVariety>>;
}