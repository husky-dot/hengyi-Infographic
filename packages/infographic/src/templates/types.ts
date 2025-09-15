import type { JSXElement } from '@antv/infographic-jsx';
import { TitleProps } from '../components';
import type { BaseItemProps } from '../items';
import type { Data } from '../types';

export interface BaseTemplateProps {
  Title?: (props: Pick<TitleProps, 'title' | 'desc'>) => JSXElement;
  Item: <T extends BaseItemProps>(props: T) => JSXElement;
  data: Data;
  design?: {
    title?: TitleProps;
    item?: BaseItemProps;
  };
}
