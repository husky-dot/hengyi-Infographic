import {
  ComponentType,
  Defs,
  Ellipse,
  getElementBounds,
  Group,
  Rect,
} from '../../jsx';
import { ItemDesc, ItemIconCircle, ItemLabel } from '../components';
import { DropShadow } from '../defs';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';
import tinycolor from 'tinycolor2';

export interface CapsuleItemProps extends BaseItemProps {
  width?: number;
  height?: number;
  gap?: number;
  iconPadding?: number;
}

export const CapsuleItem: ComponentType<CapsuleItemProps> = (props) => {
  const [
    {
      datum,
      indexes,
      width = 400,
      height = 60,
      gap = 12,
      positionH = 'normal',
      iconPadding = 6,
      themeColors,
    },
    restProps,
  ] = getItemProps(props, ['width', 'height', 'gap', 'iconPadding']);

  // 胶囊圆角和图标尺寸（图标带有一定的内边距）
  const borderRadius = height / 2;
  const iconSize = height - iconPadding * 2; // 含内边距的图标直径

  // 根据 positionH 和是否有图标计算位置
  const isFlipped = positionH === 'flipped';
  const hasIcon = !!datum.icon;

  // 计算文本区域尺寸
  const textWidth = hasIcon ? width - height - gap : width - gap * 2;
  const textX = hasIcon ? (isFlipped ? gap : height) : gap;
  const textAlign = hasIcon ? (isFlipped ? 'right' : 'left') : 'center';

  const labelProps = {
    indexes,
    width: textWidth,
    alignHorizontal: textAlign,
    alignVertical: 'middle',
    fontSize: 16,
    fontWeight: '600',
    fill: themeColors.colorText,
  } as const;
  // 获取标签边界以计算布局
  const labelBounds = getElementBounds(
    <ItemLabel {...labelProps}>{datum.label}</ItemLabel>,
  );

  const descProps = {
    indexes,
    width: textWidth,
    alignHorizontal: textAlign,
    alignVertical: 'top',
    fontSize: 14,
    lineNumber: 1,
    fill: themeColors.colorTextSecondary,
  } as const;
  // 获取描述边界以计算布局
  const descBounds = getElementBounds(
    datum.desc ? <ItemDesc {...descProps}>{datum.desc}</ItemDesc> : null,
  );

  // 计算文本元素的垂直位置
  const textGap = 4;
  const totalTextHeight = labelBounds.height + textGap + descBounds.height;
  const textStartY = (height - totalTextHeight) / 2;
  const labelY = textStartY;
  const descY = labelY + labelBounds.height + textGap;

  // 计算图标位置（在圆形区域内居中，带内边距）
  const iconX = isFlipped ? width - height + iconPadding : iconPadding;
  const iconY = iconPadding;

  const primaryColor = themeColors.colorPrimary;
  // 胶囊渐变
  const capsuleGradientId = `capsule-gradient-${indexes.join('-')}`;
  const capsuleStartColor = tinycolor(primaryColor).setAlpha(0.13).toRgbString();
  const capsuleEndColor = tinycolor(primaryColor).setAlpha(0.04).toRgbString();
  const capsuleBorderColor = tinycolor(primaryColor).setAlpha(0.4).toRgbString();

  // 图标容器渐变（使用二次色逻辑或仅主色变体）
  // 用户要求特定逻辑但动态：rgba(112, 77, 240, 0.1) -> rgba(85, 43, 237, 0.2)
  // 为了与主题一致，我们使用主色变体
  const iconGradientId = `capsule-icon-gradient-${indexes.join('-')}`;
  const iconStartColor = tinycolor(primaryColor).spin(30).setAlpha(0.1).toRgbString();
  const iconEndColor = tinycolor(primaryColor).spin(30).darken(10).setAlpha(0.2).toRgbString();
  const iconBorderColor = tinycolor(primaryColor).spin(30).setAlpha(0.2).toRgbString();
  const iconShadowColor = tinycolor(primaryColor).spin(30).setAlpha(0.3).toRgbString();
  const innerShadowId = `capsule-icon-inner-shadow-${indexes.join('-')}`;

  return (
    <Group {...restProps}>
      <Defs>
        <DropShadow />
        <linearGradient id={capsuleGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={capsuleStartColor} />
          <stop offset="100%" stopColor={capsuleEndColor} />
        </linearGradient>
        <linearGradient id={iconGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={iconStartColor} />
          <stop offset="100%" stopColor={iconEndColor} />
        </linearGradient>
        <filter id={innerShadowId}>
            <feComponentTransfer in="SourceAlpha">
                <feFuncA type="table" tableValues="1 0" />
            </feComponentTransfer>
            <feGaussianBlur stdDeviation="4" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feFlood flood-color={iconShadowColor} result="color" />
            <feComposite in2="offsetblur" operator="in" />
            <feComposite in2="SourceAlpha" operator="in" />
            <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode />
            </feMerge>
        </filter>
      </Defs>
      {/* Capsule background */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={`url(#${capsuleGradientId})`}
        stroke={capsuleBorderColor}
        strokeWidth={1}
        rx={borderRadius}
        ry={borderRadius}
        data-element-type="shape"
      />

      {/* Icon - gradient background with inner shadow */}
      {datum.icon && (
        <>
          <Ellipse
            x={iconX}
            y={iconY}
            width={iconSize}
            height={iconSize}
            fill={`url(#${iconGradientId})`}
            stroke={iconBorderColor}
            strokeWidth={1}
            filter={`url(#${innerShadowId})`}
          />
          <ItemIconCircle
            indexes={indexes}
            x={iconX}
            y={iconY}
            size={iconSize}
            fill="none"
            colorBg={primaryColor}
            fillOpacity={0}
          />
        </>
      )}

      {/* Label */}
      {datum.label && (
        <ItemLabel x={textX} y={labelY} {...labelProps}>
          {datum.label}
        </ItemLabel>
      )}

      {/* Description */}
      {datum.desc && (
        <ItemDesc x={textX} y={descY} {...descProps}>
          {datum.desc}
        </ItemDesc>
      )}
    </Group>
  );
};

registerItem('capsule-item', {
  component: CapsuleItem,
  composites: ['icon', 'label', 'desc'],
});
