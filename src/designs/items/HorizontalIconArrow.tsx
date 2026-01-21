import tinycolor from 'tinycolor2';
import {
  Bounds,
  ComponentType,
  Defs,
  Ellipse,
  getElementBounds,
  Group,
  Path,
  Text,
} from '../../jsx';
import {
  Gap,
  ItemDesc,
  ItemIconCircle,
  ItemLabel,
  ShapesGroup,
} from '../components';
import { AlignLayout, FlexLayout } from '../layouts';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
import type { BaseItemProps } from './types';

export interface HorizontalIconArrowProps extends BaseItemProps {
  width?: number;
}

export const HorizontalIconArrow: ComponentType<HorizontalIconArrowProps> = (
  props,
) => {
  const [
    { indexes, datum, width = 140, themeColors, positionV = 'normal' },
    restProps,
  ] = getItemProps(props, ['width']);

  const gradId = `arrow-grad-${indexes.join('-')}`;
  const startColor = tinycolor(themeColors.colorPrimary).setAlpha(0.3).toRgbString();
  const endColor = tinycolor(themeColors.colorPrimary).setAlpha(0.09).toRgbString();
  const borderColor = tinycolor(themeColors.colorPrimary).setAlpha(0.3).toRgbString();

  // Icon Circle Colors
  const iconBgStart = tinycolor(themeColors.colorPrimary)
    .lighten(20)
    .setAlpha(0.8)
    .toRgbString();
  const iconBgEnd = tinycolor(themeColors.colorPrimary)
    .lighten(5)
    .setAlpha(0.64)
    .toRgbString();
  const iconShadowColor = tinycolor(themeColors.colorPrimary)
    .lighten(10)
    .setAlpha(0.6)
    .toRgbString();

  const iconBgGradId = `icon-bg-${indexes.join('-')}`;
  const iconBorderGradId = `icon-border-${indexes.join('-')}`;
  const iconShadowId = `icon-shadow-${indexes.join('-')}`;

  const isVNormal = positionV !== 'flipped';
  const textAlignVertical = positionV === 'normal' ? 'bottom' : 'top';
  const label = (
    <ItemLabel
      indexes={indexes}
      width={width}
      fill={themeColors.colorText}
      alignHorizontal="center"
      alignVertical={textAlignVertical}
      fontSize={14}
    >
      {datum.label}
    </ItemLabel>
  );
  const desc = (
    <ItemDesc
      indexes={indexes}
      width={width}
      fill={themeColors.colorTextSecondary}
      alignHorizontal="center"
      alignVertical={textAlignVertical}
    >
      {datum.desc}
    </ItemDesc>
  );
  const icon = (
    <ItemIconCircle
      indexes={indexes}
      fill={`url(#${iconBgGradId})`}
      stroke={`url(#${iconBorderGradId})`}
      filter={`url(#${iconShadowId})`}
      opacity={0.3}
      colorBg={themeColors.colorPrimary}
    />
  );
  const dotLine = (
    <DotLine
      width={8}
      height={30}
      fill={themeColors.colorPrimary}
      positionV={positionV}
    />
  );

  const dotLineGap = 5;
  const iconGap = 25;
  const arrowHeight = 30;
  const labelBounds = getElementBounds(label);
  const descBounds = getElementBounds(desc);
  const iconBounds = getElementBounds(icon);
  const dotLineBounds = getElementBounds(dotLine);
  const fixedGap =
    labelBounds.height +
    descBounds.height +
    dotLineGap +
    dotLineBounds.height -
    iconBounds.height -
    iconGap;

  const totalHeight =
    iconBounds.height +
    iconGap +
    arrowHeight +
    dotLineBounds.height +
    dotLineGap +
    labelBounds.height +
    descBounds.height;

  return (
    <Group width={width} height={totalHeight} {...restProps}>
      <Defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={startColor} />
          <stop offset="100%" stopColor={endColor} />
        </linearGradient>

        {/* Icon Circle Defs */}
        <linearGradient id={iconBgGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="-3%" stopColor={iconBgStart} />
          <stop offset="100%" stopColor={iconBgEnd} />
        </linearGradient>

        <linearGradient id={iconBorderGradId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.6)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </linearGradient>

        <filter id={iconShadowId} x="-50%" y="-50%" width="200%" height="200%">
          <feFlood flood-color={iconShadowColor} result="flood" />
          <feComposite
            operator="out"
            in="flood"
            in2="SourceGraphic"
            result="inverse-fill"
          />
          <feGaussianBlur in="inverse-fill" stdDeviation="4" result="blur" />
          <feOffset in="blur" dx="0" dy="4.69" result="offset-blur" />
          <feComposite
            operator="in"
            in="offset-blur"
            in2="SourceGraphic"
            result="inset-shadow"
          />
          <feComposite
            operator="over"
            in="inset-shadow"
            in2="SourceGraphic"
            result="final"
          />
        </filter>
      </Defs>
      <FlexLayout flexDirection="column" alignItems="center">
        {isVNormal ? (
          <>
            {desc}
            {label}
            <Gap height={dotLineGap} />
            {dotLine}
          </>
        ) : (
          <>
            <Gap height={fixedGap} />
            {icon}
            <Gap height={iconGap} />
          </>
        )}
        <AlignLayout
          horizontal="center"
          vertical="middle"
          width={width}
          height={arrowHeight}
        >
          <HorizontalArrow
            width={width}
            height={arrowHeight}
            fill={`url(#${gradId})`}
            stroke={borderColor}
            strokeWidth={1}
            opacity={0.8}
          />
          <Text
            width={width}
            height={arrowHeight}
            alignHorizontal="center"
            alignVertical="middle"
            fill={themeColors.colorPrimary}
            fontWeight="bold"
            fontSize={16}
          >
            {datum.time
              ? datum.time
              : String(indexes[0] + 1)
                  .padStart(2, '0')
                  .slice(-2)}
          </Text>
        </AlignLayout>
        {!isVNormal ? (
          <>
            {dotLine}
            <Gap height={dotLineGap} />
            {label}
            {desc}
          </>
        ) : (
          <>
            <Gap height={iconGap} />
            {icon}
          </>
        )}
      </FlexLayout>
    </Group>
  );
};

const HorizontalArrow = (
  props: Partial<Bounds> & {
    fill: string;
    size?: number;
    stroke?: string;
    strokeWidth?: number;
    opacity?: number;
  },
) => {
  const {
    x = 0,
    y = 0,
    width = 100,
    height = 40,
    fill = '#FF356A',
    size = 10,
    stroke,
    strokeWidth,
    opacity,
  } = props;

  const r = 6;
  const notchX = x + size;
  const notchY = y + height / 2;
  const tipX = x + width;
  const tipY = y + height / 2;
  const backTopX = x + width - size;
  const backBottomX = x + width - size;

  // Calculate rounded corner points for the left notch
  const h2 = height / 2;
  // Length of the notch side
  const len = Math.sqrt(size * size + h2 * h2);
  // Offsets for the rounded corner
  const dx = (size / len) * r;
  const dy = (h2 / len) * r;

  // Point on Notch-TopLeft line, distance r from TopLeft
  const p1x = x + dx;
  const p1y = y + dy;

  // Point on Top edge, distance r from TopLeft
  const p2x = x + r;
  const p2y = y;

  // Point on Bottom edge, distance r from BottomLeft
  const p3x = x + r;
  const p3y = y + height;

  // Point on BottomLeft-Notch line, distance r from BottomLeft
  const p4x = x + dx;
  const p4y = y + height - dy;

  const d = `
    M ${backTopX} ${y}
    L ${tipX} ${tipY}
    L ${backBottomX} ${y + height}
    L ${p3x} ${p3y}
    Q ${x} ${y + height} ${p4x} ${p4y}
    L ${notchX} ${notchY}
    L ${p1x} ${p1y}
    Q ${x} ${y} ${p2x} ${p2y}
    Z
  `;

  return (
    <Path
      d={d}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      opacity={opacity}
      data-element-type="shape"
    />
  );
};

const DotLine = (props: {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill: string;
  positionV?: 'normal' | 'middle' | 'flipped';
}) => {
  const {
    x = 0,
    y = 0,
    width = 10,
    height = 50,
    fill,
    positionV = 'top',
  } = props;
  const r = width / 2;
  const lineLength = height - r;
  const strokeWidth = 1;
  const lineX = r;
  return (
    <ShapesGroup x={x} y={y} width={width} height={height}>
      <Ellipse
        width={width}
        height={width}
        stroke={fill}
        fill="none"
        y={positionV === 'top' ? 0 : lineLength - r - 4}
      />
      <Path
        d={
          positionV === 'top'
            ? `M${lineX},${r} L${lineX},${r + lineLength}`
            : `M${lineX},0 L${lineX},${lineLength - r - 4}`
        }
        strokeWidth={strokeWidth}
        stroke={fill}
      />
    </ShapesGroup>
  );
};

registerItem('horizontal-icon-arrow', {
  component: HorizontalIconArrow,
  composites: ['icon', 'label', 'desc', 'time'],
});
