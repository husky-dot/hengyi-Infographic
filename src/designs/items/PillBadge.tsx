import { ComponentType, Defs, Group, Rect } from '../../jsx';
import { ItemDesc, ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';
import tinycolor from 'tinycolor2';

export interface PillBadgeProps extends BaseItemProps {
  width?: number;
  pillWidth?: number;
  pillHeight?: number;
  gap?: number;
}

export const PillBadge: ComponentType<PillBadgeProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 300,
      pillWidth = 120,
      pillHeight = 36,
      gap = 16,
      positionH = 'normal',
      themeColors,
    },
    restProps,
  ] = getItemProps(props, ['width', 'pillWidth', 'pillHeight', 'gap']);

  // Optimize: when no description, use pillWidth as component width
  const hasDesc = !!datum.desc;
  const componentWidth = hasDesc ? width : pillWidth;

  // Calculate pill position based on alignment
  const pillX = hasDesc
    ? positionH === 'center'
      ? (componentWidth - pillWidth) / 2
      : positionH === 'flipped'
        ? componentWidth - pillWidth
        : 0
    : 0; // Always 0 when no description

  const pillY = 0;

  // Calculate content position (only needed when hasDesc is true)
  const contentX = hasDesc
    ? positionH === 'center'
      ? 0
      : positionH === 'flipped'
        ? 0
        : 0
    : 0;
  const contentY = pillHeight + gap;
  const contentWidth = componentWidth;

  // 生成唯一 ID
  const uniqueId = indexes.join('-');
  const gradientId = `pill-bg-gradient-${uniqueId}`;

  // 计算背景渐变色
  const startColor = tinycolor(themeColors.colorPrimary).setAlpha(0.13).toRgbString();
  const endColor = tinycolor(themeColors.colorPrimary).setAlpha(0.039).toRgbString();
  // 计算边框颜色
  const borderColor = tinycolor(themeColors.colorPrimary).setAlpha(0.3).toRgbString();

  return (
    <Group {...restProps}>
      <Defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
      </Defs>
      {/* Pill-shaped badge */}
      <Rect
        x={pillX}
        y={pillY}
        width={pillWidth}
        height={pillHeight}
        fill={`url(#${gradientId})`}
        stroke={borderColor}
        strokeWidth={1}
        rx={pillHeight / 2}
        ry={pillHeight / 2}
        data-element-type="shape"
      />

      {/* Pill label */}
      <ItemLabel
        indexes={indexes}
        x={pillX}
        y={pillY}
        width={pillWidth}
        height={pillHeight}
        alignHorizontal="center"
        alignVertical="middle"
        fontSize={16}
        fontWeight="500"
        fill={themeColors.colorText}
      >
        {datum.label}
      </ItemLabel>

      {/* Description below */}
      {datum.desc && (
        <ItemDesc
          indexes={indexes}
          x={contentX}
          y={contentY}
          width={contentWidth}
          alignHorizontal={
            positionH === 'center'
              ? 'center'
              : positionH === 'flipped'
                ? 'right'
                : 'left'
          }
          fontSize={15}
          fill={themeColors.colorTextSecondary}
          lineNumber={2}
          wordWrap={true}
        >
          {datum.desc}
        </ItemDesc>
      )}
    </Group>
  );
};

registerItem('pill-badge', {
  component: PillBadge,
  composites: ['label', 'desc'],
});
