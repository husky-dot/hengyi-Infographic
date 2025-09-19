import { DoneList } from './DoneList';
import { Pyramid } from './Pyramid';
import { SimpleItem } from './SimpleItem';
import type { Item } from './types';

const ITEM_REGISTRY = new Map<string, Item>();

export function registerItem(type: string, item: Item) {
  ITEM_REGISTRY.set(type, item);
}

export function getItem(type: string): Item | undefined {
  return ITEM_REGISTRY.get(type);
}

registerItem('done-list', { component: DoneList });
registerItem('simple', { component: SimpleItem });
registerItem('pyramid', { component: Pyramid });
