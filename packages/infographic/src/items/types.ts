import type { Data } from '../types';

export interface BaseItemProps {
  id?: string;
  indexKey: string;
  datum: Data['items'][number];
  x?: number;
  y?: number;
  positionH?: 'normal' | 'flipped' | 'center';
  positionV?: 'normal' | 'flipped' | 'center';
}
