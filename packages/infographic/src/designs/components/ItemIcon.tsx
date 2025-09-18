/** @jsxImportSource @antv/infographic-jsx */
import type { RectProps } from '@antv/infographic-jsx';
import { Rect } from '@antv/infographic-jsx';

export interface ItemIconProps extends RectProps {
  size?: number;
}

export const ItemIcon = (props: ItemIconProps) => {
  const { size = 32, ...restProps } = props;
  const defaultProps: RectProps = {
    fill: 'lightgray',
    width: size,
    height: size,
  };
  return <Rect {...defaultProps} {...restProps} />;
};
