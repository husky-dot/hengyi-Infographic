import tinycolor from 'tinycolor2';
import type { ComponentType } from '../../jsx';
import { Defs, Ellipse, Group } from '../../jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface CircleNodeProps extends BaseItemProps {
  width?: number;
  height?: number;
}

export const CircleNode: ComponentType<CircleNodeProps> = (props) => {
  const [
    {
      indexes,
      datum,
      themeColors,
      positionH = 'normal',
      width = 240,
      height = width,
    },
    restProps,
  ] = getItemProps(props, ['width', 'height']);

  const size = Math.min(width, height);
  const innerCircleSize = size * 0.7;
  const innerCircleOffset = (size - innerCircleSize) / 2;
  const labelSize = (innerCircleSize * Math.sqrt(2)) / 2;
  const labelOffset = (size - labelSize) / 2;

  const base = tinycolor(themeColors.colorPrimary);

  // 1. 内圆 & 外圆渐变颜色
  // background: linear-gradient(100deg, rgba(77, 126, 240, 0.045) 4%, rgba(81, 132, 250, 0.15) 92%);
  const bgStart = base.clone().setAlpha(0.045).toRgbString();
  const bgEnd = base.clone().setAlpha(0.15).toRgbString();

  // 2. 边框渐变颜色
  // border-image: linear-gradient(270deg, rgba(77, 126, 240, 0.5) 0%, rgba(255, 255, 255, 0) 100%);
  const borderStart = base.clone().setAlpha(0.5).toRgbString();
  const borderEnd = 'rgba(255, 255, 255, 0)';

  const colorText = base.clone().darken(25).toRgbString();

  // 使用唯一 ID 避免冲突
  const uniqueId = indexes.join('-');
  const outerGradientId = `circle-outer-${uniqueId}`;
  const innerGradientId = `circle-inner-${uniqueId}`;
  const borderGradientId = `circle-border-${uniqueId}`;

  // 100deg 大约对应 (0,0) -> (1, 0.2)
  // 根据位置翻转渐变角度
  // positionH === 'flipped' (左侧) -> 180度 (从右到左)
  // positionH === 'normal' (右侧) -> 0度 (从左到右)
  const isLeft = positionH === 'flipped';
  
  // 背景渐变
  const bgAngle = isLeft ? 0 : 180;
  const bgGradientTransform = `rotate(${bgAngle}, 0.5, 0.5)`;
  const innerBgGradientTransform = bgGradientTransform;

  // 边框渐变 (始终是从深到浅定义)
  // 左球：右边深(起点)，左边浅(终点) -> x1=100%
  // 右球：左边深(起点)，右边浅(终点) -> x1=0%
  const borderGradientCoords = isLeft
    ? { x1: '100%', y1: '50%', x2: '0%', y2: '50%' }
    : { x1: '0%', y1: '50%', x2: '100%', y2: '50%' };

  return (
    <Group {...restProps}>
      <Defs>
        {/* 外圆背景渐变 */}
        <linearGradient id={outerGradientId} x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform={bgGradientTransform}>
          <stop offset="4%" stopColor={bgStart} />
          <stop offset="92%" stopColor={bgEnd} />
        </linearGradient>

        {/* 内圆背景渐变 */}
        <linearGradient id={innerGradientId} x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform={innerBgGradientTransform}>
          <stop offset="4%" stopColor={bgStart} />
          <stop offset="92%" stopColor={bgEnd} />
        </linearGradient>

        {/* 边框渐变 */}
        <linearGradient id={borderGradientId} {...borderGradientCoords}>
          <stop offset="0%" stopColor={borderStart} />
          <stop offset="100%" stopColor={borderEnd} />
        </linearGradient>
      </Defs>

      {/* 外圆 */}
      <Ellipse
        width={size}
        height={size}
        fill={`url(#${outerGradientId})`}
        stroke={`url(#${borderGradientId})`} // 边框加在外圆上
        strokeWidth={1}
        data-element-type="shape"
      />

      {/* 内圆 */}
      <Ellipse
        x={innerCircleOffset}
        y={innerCircleOffset}
        width={innerCircleSize}
        height={innerCircleSize}
        fill={`url(#${innerGradientId})`}
        // 内圆没有边框
        data-element-type="shape"
      />

      <ItemLabel
        indexes={indexes}
        x={labelOffset}
        y={labelOffset}
        width={labelSize}
        height={labelSize}
        lineHeight={1.1}
        fontSize={24}
        alignHorizontal="center"
        alignVertical="middle"
        fill={colorText}
        fontWeight="400"
      >
        {datum.label}
      </ItemLabel>
    </Group>
  );
};

registerItem('circle-node', {
  component: CircleNode,
  composites: ['label'],
});
