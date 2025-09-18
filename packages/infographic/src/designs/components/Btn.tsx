/** @jsxImportSource @antv/infographic-jsx */
import type { RectProps } from '@antv/infographic-jsx';
import { Rect } from '@antv/infographic-jsx';

export interface BtnProps extends RectProps {
  indexKey: string | number;
}

export const BtnAdd = (props: BtnProps) => {
  const { indexKey, ...restProps } = props;
  const defaultProps: RectProps = {
    id: `btn-add-${indexKey}`,
    fill: '#B9EBCA',
    fillOpacity: 0.3,
    width: 20,
    height: 20,
  };
  return <Rect {...defaultProps} {...restProps} />;
};

export const BtnRemove = (props: BtnProps) => {
  const { indexKey, ...restProps } = props;
  const defaultProps: RectProps = {
    id: `btn-remove-${indexKey}`,
    fill: '#F9C0C0',
    fillOpacity: 0.3,
    width: 20,
    height: 20,
  };
  return <Rect {...defaultProps} {...restProps} />;
};
