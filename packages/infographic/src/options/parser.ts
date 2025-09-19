import {
  getItem,
  getStructure,
  getTemplate,
  ParsedTemplateOptions,
  TemplateOptions,
  Title,
} from '../designs';
import { getPaletteColor } from '../renderer';
import { getTheme, type ThemeConfig } from '../themes';
import { parsePadding } from '../utils';
import type { InfographicOptions, ParsedInfographicOptions } from './types';

export function parseOptions(
  options: InfographicOptions,
): ParsedInfographicOptions {
  const {
    container,
    padding = 0,
    template,
    design,
    theme,
    themeConfig,
    ...restOptions
  } = options;

  const parsedContainer =
    typeof container === 'string'
      ? document.querySelector(container)
      : container;
  if (!parsedContainer) throw new Error('Container not found');

  const parsedTemplate: TemplateOptions = template
    ? getTemplate(template) || {}
    : {};

  return {
    ...restOptions,
    container: parsedContainer as HTMLElement,
    padding: parsePadding(padding),
    template,
    design: parseDesign({ ...parsedTemplate, ...design }, options),
    theme,
    themeConfig: parseTheme(theme, themeConfig),
  };
}

function normalizeWithType<T extends { type: string }>(obj: string | T): T {
  if (typeof obj === 'string') return { type: obj } as T;
  if (!('type' in obj)) throw new Error('Type is required');
  return obj as T;
}

function parseDesign(
  config: InfographicOptions['design'],
  options: InfographicOptions,
): ParsedTemplateOptions {
  const { structure, title, item } = config || {};
  return {
    structure: parseDesignStructure(structure),
    title: parseDesignTitle(title),
    item: parseDesignItem(item, options),
  };
}

function parseDesignStructure(
  config: TemplateOptions['structure'],
): ParsedTemplateOptions['structure'] {
  if (!config) throw new Error('Structure is required in design or template');
  const { type, ...userProps } = normalizeWithType(config);
  const structure = getStructure(type);
  if (!structure) throw new Error(`Structure ${type} not found`);
  const { component } = structure;
  return { component: (props) => component({ ...props, ...userProps }) };
}

function parseDesignTitle(
  config: TemplateOptions['title'],
): ParsedTemplateOptions['title'] {
  if (!config) throw new Error('Title is required in design or template');
  const { type, ...userProps } = normalizeWithType(config);
  // use default title for now
  return {
    component: (props: Parameters<typeof Title>[0]) =>
      Title({ ...props, ...userProps }),
  };
}

function parseDesignItem(
  config: TemplateOptions['item'],
  options: InfographicOptions,
): ParsedTemplateOptions['item'] {
  if (!config) throw new Error('Item is required in design or template');
  const { type, ...userProps } = normalizeWithType(config);
  const item = getItem(type);
  if (!item) throw new Error(`Item ${type} not found`);
  const { component, options: itemOptions } = item;
  return {
    component: (props) => {
      const { indexes } = props;
      const primaryColor = getPaletteColor(
        options.themeConfig?.palette,
        indexes,
        options.data?.items?.length,
      );
      return component({ ...props, primaryColor, ...userProps });
    },
    options: itemOptions,
  };
}

function parseTheme(
  theme: string | undefined,
  themeConfig: ThemeConfig = {},
): ThemeConfig {
  const base = theme ? getTheme(theme) || {} : {};
  return { ...base, ...themeConfig };
}
