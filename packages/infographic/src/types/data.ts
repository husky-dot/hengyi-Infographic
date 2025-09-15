import type { ImageAsset } from './asset';

export interface BaseItemDatum {
  icon?: ImageAsset;
  label?: string;
  desc?: string;
  value?: number;
  illus?: ImageAsset;
  children?: BaseItemDatum[];
}

export interface Data {
  title?: string;
  desc?: string;
  items: BaseItemDatum[];
}
