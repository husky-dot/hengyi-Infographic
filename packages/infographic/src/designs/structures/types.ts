import type { ComponentType } from '@antv/infographic-jsx';
import type { Data } from '../../types';
import { TitleProps } from '../components';
import type { BaseItemProps } from '../items';

export interface BaseTemplateProps {
  Title?: ComponentType<Pick<TitleProps, 'title' | 'desc'>>;
  Item: ComponentType<BaseItemProps>;
  data: Data;
  design?: {
    title?: TitleProps;
    item?: BaseItemProps;
  };
}

export interface StructureRegistration<
  T extends BaseTemplateProps = BaseTemplateProps,
> {
  type: string;
  component: ComponentType<T>;
}
