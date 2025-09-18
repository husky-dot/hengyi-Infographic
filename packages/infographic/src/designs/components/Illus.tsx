/** @jsxImportSource @antv/infographic-jsx */
import type { RectProps } from '@antv/infographic-jsx';
import { Rect } from '@antv/infographic-jsx';

export interface IllusProps extends RectProps {}

export const Illus = (props: IllusProps) => {
  const defaultProps: RectProps = {
    fill: 'lightgray',
  };
  return <Rect {...defaultProps} {...props} />;
};
