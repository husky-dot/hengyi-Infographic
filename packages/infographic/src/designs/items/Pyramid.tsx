/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, Group, Polygon } from '@antv/infographic-jsx';
import type { BaseItemProps } from './types';
import { getItemId, getItemProps } from './utils';

export interface PyramidProps extends BaseItemProps {
  gap?: number;
  iconSize?: number;
}

export const Pyramid: ComponentType<PyramidProps> = (props) => {
  const [
    {
      data,
      indexes,
      width = 300,
      height = 30,
      // iconSize = 30,
      gap = 5,
      // positionH = 'normal',
      // positionV = 'center',
    },
    restProps,
  ] = getItemProps(props, ['gap', 'iconSize']);

  const points = calculateTriangleSegment(
    width,
    height,
    gap,
    data.items.length,
    indexes[0],
  );

  return (
    <Group {...restProps}>
      <Polygon
        id={getItemId(indexes, 'shape')}
        points={points}
        fill="#f3b063"
      />
    </Group>
  );
};

function calculateTriangleSegment(
  width: number,
  height: number,
  gap: number,
  counts: number,
  index: number,
) {
  const centerX = width / 2;

  const triangleHeight = counts * height + (counts - 1) * gap;

  const rectTop = index * (height + gap);
  const rectBottom = rectTop + height;

  const widthAtTop = (rectTop / triangleHeight) * width;
  const widthAtBottom = (rectBottom / triangleHeight) * width;

  let points: [number, number][];

  // 将右斜边置于 points 前两项，便于计算文本区域
  if (index === 0) {
    points = [
      [centerX, rectTop], // 三角形顶点
      [centerX + widthAtBottom / 2, rectBottom], // 右下
      [centerX - widthAtBottom / 2, rectBottom], // 左下
    ];
  } else {
    points = [
      [centerX + widthAtTop / 2, rectTop], // 右上
      [centerX + widthAtBottom / 2, rectBottom], // 右下
      [centerX - widthAtBottom / 2, rectBottom], // 左下
      [centerX - widthAtTop / 2, rectTop], // 左上
    ];
  }

  return points;
}
