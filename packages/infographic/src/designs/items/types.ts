import { ComponentType } from '@antv/infographic-jsx';
import type { Data } from '../../types';

export interface BaseItemProps {
  x?: number;
  y?: number;
  id?: string;

  indexes: number[];
  data: Data;
  datum: Data['items'][number];
  primaryColor?: string;
  positionH?: 'normal' | 'center' | 'flipped';
  positionV?: 'normal' | 'center' | 'flipped';
  [key: string]: any;
}

export interface ItemOptions extends Partial<BaseItemProps> {
  coloredArea?: ('icon' | 'label' | 'desc' | 'value')[];
}

export interface Item<T extends BaseItemProps = BaseItemProps> {
  component: ComponentType<T>;
  options?: ItemOptions;
}
