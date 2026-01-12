import tinycolor from 'tinycolor2';
import type { ComponentType } from '../../jsx';
import { Defs, Group, Path, Rect, getElementBounds } from '../../jsx';
import { ItemDesc, ItemIcon, ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface CandyCardLiteProps extends BaseItemProps {
  width?: number;
  height?: number;
}

export const CandyCardLite: ComponentType<CandyCardLiteProps> = (props) => {
  const [
    { indexes, datum, width = 280, height = 140, themeColors },
    restProps,
  ] = getItemProps(props, ['width', 'height']);

  const primaryColor = themeColors.colorPrimary;
  const gradientId = `candy-card-gradient-${indexes.join('-')}`;
  const startColor = tinycolor(primaryColor).setAlpha(0.13).toRgbString();
  const endColor = tinycolor(primaryColor).lighten(10).setAlpha(0.04).toRgbString();
  const borderColor = tinycolor(primaryColor).setAlpha(0.4).toRgbString();
  const underlineColor = tinycolor(primaryColor).setAlpha(0.4).toRgbString();

  const decoGradientId = `candy-card-deco-gradient-${indexes.join('-')}`;
  const decoStartColor = tinycolor('#FFFFFF').setAlpha(0.5).toRgbString();
  const decoEndColor = '#FFFFFF';

  // 预计算标题宽度
  const titleBounds = getElementBounds(
    <ItemLabel
      indexes={indexes}
      alignHorizontal="left"
      alignVertical="middle"
    >
      {datum.label}
    </ItemLabel>,
  );
  // 下划线宽度为标题宽度的一半，最小 20
  const underlineWidth = Math.max(20, titleBounds.width / 2);

  return (
    <Group {...restProps}>
      <Defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>
        <linearGradient id={decoGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={decoStartColor} />
          <stop offset="100%" stopColor={decoEndColor} />
        </linearGradient>
      </Defs>

      {/* 主背景卡片 */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={22}
        ry={22}
        fill={`url(#${gradientId})`}
        stroke={borderColor}
        strokeWidth={1}
        data-element-type="shape"
      />

      {/* 右上角白色装饰区域 */}
      <Path
        x={width - 85}
        y={0.5}
        width={85}
        height={65}
        d="M0 0H62.4495C74.9557 0 85.4549 10.8574 84.4557 23.1875V60.1875L77.8772 62.5839C64.3776 67.6876 48.51 64.6893 37.8662 53.7441L10.2361 25.3312C4.91402 19.8571 1.65356 13.1736 0.435652 6.21819L0 0Z"
        fill={`url(#${decoGradientId})`}
        data-element-type="shape"
      />

      {/* 主标题 */}
      <ItemLabel
        indexes={indexes}
        x={20}
        y={24}
        width={200}
        alignHorizontal="left"
        alignVertical="middle"
        fill={primaryColor}
      >
        {datum.label}
      </ItemLabel>

      {/* 标题下划线 */}
      <Rect
        x={20}
        y={55}
        width={underlineWidth}
        height={3}
        rx={1.5}
        ry={1.5}
        fill={underlineColor}
        data-element-type="shape"
      />

      {/* 副标题 */}
      <ItemDesc
        indexes={indexes}
        x={20}
        y={70}
        width={220}
        height={70}
        fill={themeColors.colorTextSecondary}
        alignHorizontal="left"
        alignVertical="top"
      >
        {datum.desc}
      </ItemDesc>

      {/* 右上角插图区域 */}
      <ItemIcon
        indexes={indexes}
        x={width - 48}
        y={12}
        width={32}
        height={32}
        fill={themeColors.colorPrimary}
      />
    </Group>
  );
};

registerItem('candy-card-lite', {
  component: CandyCardLite,
  composites: ['icon', 'label', 'desc'],
});
