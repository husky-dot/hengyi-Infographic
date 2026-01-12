import { ComponentType, Defs, Group, Rect } from '../../jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';
import tinycolor from 'tinycolor2';

export interface RoundedRectNodeProps extends BaseItemProps {
  width?: number;
  height?: number;
  padding?: number;
}

export const RoundedRectNode: ComponentType<RoundedRectNodeProps> = (props) => {
  const [
    {
      indexes,
      datum,
      themeColors,
      width = 300,
      height = 40,
      padding = 4,
      positionH = 'normal',
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'borderRadius', 'padding']);

  const borderRadius = height / 2;

  // Calculate text positioning
  const textX = borderRadius;
  const textY = padding;
  const textWidth = width - borderRadius * 2;
  const textHeight = height - padding * 2;

  // 计算动态渐变颜色
  const gradientId = `rounded-rect-bg-gradient-${indexes.join('-')}`;
  const startColor = tinycolor(themeColors.colorPrimary).setAlpha(0.13).toRgbString();
  const endColor = tinycolor(themeColors.colorPrimary).lighten(10).setAlpha(0.04).toRgbString();
  const borderColor = tinycolor(themeColors.colorPrimary).setAlpha(0.4).toRgbString();

  return (
    <Group {...restProps}>
      <Defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </Defs>

      {/* Rounded rectangle background */}
      <Rect
        data-element-type="shape"
        width={width}
        height={height}
        rx={borderRadius}
        ry={borderRadius}
        fill={`url(#${gradientId})`}
        stroke={borderColor}
        strokeWidth={1}
        opacity={1} // 移除原有的 0.8 不透明度，完全由渐变色控制
      />

      {/* Text label */}
      <ItemLabel
        indexes={indexes}
        x={textX}
        y={textY}
        width={textWidth}
        height={textHeight}
        alignHorizontal={
          positionH === 'flipped'
            ? 'right'
            : positionH === 'center'
              ? 'center'
              : 'left'
        }
        alignVertical="middle"
        fontSize={14}
        fontWeight="500"
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>
    </Group>
  );
};

registerItem('rounded-rect-node', {
  component: RoundedRectNode,
  composites: ['label'],
});
