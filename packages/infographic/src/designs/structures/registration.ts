import { ListColumn } from './list-column';
import type { StructureRegistration } from './types';

const STRUCTURE_REGISTRY = new Map<string, StructureRegistration>();

export function registerStructure(structure: StructureRegistration) {
  STRUCTURE_REGISTRY.set(structure.type, structure);
}

export function getStructure(type: string): StructureRegistration | undefined {
  return STRUCTURE_REGISTRY.get(type);
}

registerStructure({ type: 'list-column', component: ListColumn });
