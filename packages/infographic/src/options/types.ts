import type { ComponentType } from '@antv/infographic-jsx';
import type { ItemRegistration, StructureRegistration } from '../designs';
import type { Data, Padding, ThemeConfig } from '../types';

export interface InfographicOptions {
  /** 容器，可以是选择器或者 HTMLElement */
  container: string | HTMLElement;
  /** 宽度 */
  width: number;
  /** 高度 */
  height: number;
  /** 容器内边距 */
  padding?: number | number[];
  /** 模板 */
  template?: string;
  /** 设计 */
  design?: {
    /** 结构 */
    structure?: string | StructureOptions;
    /** 标题 */
    title?: string | TitleOptions;
    /** 数据项 */
    item?: string | ItemOptions;
  };
  /** 数据 */
  data: Data;
  /** 主题 */
  theme?: string;
  /** 额外主题配置 */
  themeConfig?: ThemeConfig;
}

export interface ParsedInfographicOptions {
  container: HTMLElement;
  width: number;
  height: number;
  padding?: Padding;
  viewBox?: string;
  template?: string;
  design: {
    structure?: StructureRegistration & { props?: Record<string, any> };
    title?: {
      type: string;
      component: ComponentType<any>;
      props?: Record<string, any>;
    };
    item?: ItemRegistration & { props?: Record<string, any> };
  };
  data: Data;
  theme?: string;
  themeConfig: ThemeConfig;
}

export interface StructureOptions {
  type: string;
  [key: string]: any;
}

export interface TitleOptions {
  type: string;
  [key: string]: any;
}

export interface ItemOptions {
  type: string;
  [key: string]: any;
}
