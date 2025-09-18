import { DoneList } from './DoneList';
import { SimpleItem } from './SimpleItem';
import type { ItemRegistration } from './types';

const ITEM_REGISTRY = new Map<string, ItemRegistration>();

export function registerItem(item: ItemRegistration) {
  ITEM_REGISTRY.set(item.type, item);
}

export function getItem(type: string): ItemRegistration | undefined {
  return ITEM_REGISTRY.get(type);
}

registerItem({ type: 'done-list', component: DoneList });
registerItem({ type: 'simple', component: SimpleItem });
