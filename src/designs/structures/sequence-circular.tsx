import type { ComponentType, JSXElement } from '../../jsx';
import { Defs, Ellipse, getElementBounds, Group, Path } from '../../jsx';
import tinycolor from 'tinycolor2';
import {
  BtnAdd,
  BtnRemove,
  BtnsGroup,
  ItemIcon,
  ItemsGroup,
} from '../components';
import { FlexLayout } from '../layouts';
import { getPaletteColor } from '../utils';
import { registerStructure } from './registry';
import type { BaseStructureProps } from './types';

const ITEM_AREA_HORIZONTAL_PADDING = 100;
const CIRCLE_AREA_HORIZONTAL_PADDING = 50;

export interface SequenceCircularProps extends BaseStructureProps {
  outerRadius?: number;
  innerRadius?: number;
  itemDistance?: number;
  gapAngle?: number;
  iconRadius?: number;
  iconBgRadius?: number;
  iconSize?: number;
}

const createRoundedAnnularSector = (
  cx: number,
  cy: number,
  innerR: number,
  outerR: number,
  startAngle: number,
  endAngle: number,
  cornerRadius: number,
): string => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const startRad = toRad(startAngle);
  const endRad = toRad(endAngle);

  const rc = cornerRadius;

  // Calculate angular offsets for corners
  // Clamp radius if too large
  const maxRc = (outerR - innerR) / 2;
  const effectiveRc = Math.min(rc, maxRc);

  let alphaOuter = 0;
  if (outerR > effectiveRc) {
    alphaOuter = Math.asin(effectiveRc / (outerR - effectiveRc));
  }

  const betaInner = Math.asin(effectiveRc / (innerR + effectiveRc));

  const polar = (r: number, theta: number) => ({
    x: cx + r * Math.cos(theta),
    y: cy + r * Math.sin(theta),
  });

  // 1. Outer Start Corner
  const dOuter = (outerR - effectiveRc) * Math.cos(alphaOuter);
  const p1_start = polar(dOuter, startRad);
  const p1_end = polar(outerR, startRad + alphaOuter);

  // 2. Outer End Corner
  const p2_start = polar(outerR, endRad - alphaOuter);
  const p2_end = polar(dOuter, endRad);

  // 3. Inner End Corner
  const dInner = (innerR + effectiveRc) * Math.cos(betaInner);
  const p3_start = polar(dInner, endRad);
  const p3_end = polar(innerR, endRad - betaInner);

  // 4. Inner Start Corner
  const p4_start = polar(innerR, startRad + betaInner);
  const p4_end = polar(dInner, startRad);

  const largeArcOuter = endRad - startRad - 2 * alphaOuter > Math.PI ? 1 : 0;
  const largeArcInner = endRad - startRad - 2 * betaInner > Math.PI ? 1 : 0;

  return [
    `M ${p1_start.x} ${p1_start.y}`,
    `A ${effectiveRc} ${effectiveRc} 0 0 1 ${p1_end.x} ${p1_end.y}`,
    `A ${outerR} ${outerR} 0 ${largeArcOuter} 1 ${p2_start.x} ${p2_start.y}`,
    `A ${effectiveRc} ${effectiveRc} 0 0 1 ${p2_end.x} ${p2_end.y}`,
    `L ${p3_start.x} ${p3_start.y}`,
    `A ${effectiveRc} ${effectiveRc} 0 0 1 ${p3_end.x} ${p3_end.y}`,
    `A ${innerR} ${innerR} 0 ${largeArcInner} 0 ${p4_start.x} ${p4_start.y}`,
    `A ${effectiveRc} ${effectiveRc} 0 0 1 ${p4_end.x} ${p4_end.y}`,
    'Z',
  ].join(' ');
};

export const SequenceCircular: ComponentType<SequenceCircularProps> = (
  props,
) => {
  const {
    Title,
    Item,
    data,
    options,
    outerRadius = 180,
    innerRadius = 120,
    itemDistance = 310,
    gapAngle = 5,
    iconRadius = 34,
    iconBgRadius = 46,
    iconSize = 36,
  } = props;

  const { title, desc, items = [] } = data;
  const titleContent = Title ? <Title title={title} desc={desc} /> : null;

  // 计算布局中心点，确保最高点为0
  const centerX = Math.max(
    itemDistance + ITEM_AREA_HORIZONTAL_PADDING,
    outerRadius + CIRCLE_AREA_HORIZONTAL_PADDING,
  );
  const centerY = Math.min(itemDistance, outerRadius);
  const btnBounds = getElementBounds(<BtnAdd indexes={[0]} />);

  // 如果没有数据，显示中心添加按钮
  if (items.length === 0) {
    return (
      <FlexLayout
        id="infographic-container"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        {titleContent}
        <Group>
          <BtnsGroup>
            <BtnAdd indexes={[0]} x={centerX - 20} y={centerY - 20} />
          </BtnsGroup>
        </Group>
      </FlexLayout>
    );
  }

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];
  const arcElements: JSXElement[] = [];
  const iconElements: JSXElement[] = [];
  const defsElements: JSXElement[] = [];

  // 获取Item组件尺寸
  const itemBounds = getElementBounds(
    <Item indexes={[0]} data={data} datum={items[0]} />,
  );

  // 计算每个扇区的角度
  const totalGapAngle = items.length * gapAngle;
  const availableAngle = 360 - totalGapAngle;
  const arcAngle = availableAngle / items.length;

  const computePosition = ({
    centerX,
    outerRadius,
    angleRad,
    btnBounds,
  }: {
    centerX: number;
    outerRadius: number;
    angleRad: number;
    btnBounds: { width: number; height: number };
  }) => {
    const x =
      centerX + (outerRadius + 20) * Math.cos(angleRad) - btnBounds.width / 2;

    const y =
      centerY + (outerRadius + 20) * Math.sin(angleRad) - btnBounds.height / 2;

    return {
      x,
      y,
    };
  };

  items.forEach((item, index) => {
    const indexes = [index];

    // 计算当前扇区的起始和结束角度（从顶部开始，270度对应顶部）
    const startAngle = index * (arcAngle + gapAngle) + 270;
    const endAngle = startAngle + arcAngle;

    // 计算扇区中心角度，用于定位Item和按钮
    const midAngle = (startAngle + endAngle) / 2;
    const midAngleRad = (midAngle * Math.PI) / 180;

    // 获取当前项的颜色
    const itemColor = getPaletteColor(options, indexes);
    
    // Gradients
    const fillGradientId = `seq-circ-fill-${index}`;
    const strokeGradientId = `seq-circ-stroke-${index}`;

    defsElements.push(
      <linearGradient id={fillGradientId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={itemColor} stopOpacity={0.3} />
        <stop offset="100%" stopColor={itemColor} stopOpacity={0.09} />
      </linearGradient>
    );

    defsElements.push(
      <linearGradient id={strokeGradientId} x1="41%" y1="0%" x2="59%" y2="100%">
        <stop offset="33%" stopColor={itemColor} stopOpacity={0.15} />
        <stop offset="68%" stopColor={itemColor} stopOpacity={0.5} />
      </linearGradient>
    );

    const pathD = createRoundedAnnularSector(
      centerX,
      centerY,
      innerRadius,
      outerRadius,
      startAngle,
      endAngle,
      10,
    );

    arcElements.push(
      <Path
        d={pathD}
        fill={`url(#${fillGradientId})`}
        stroke={`url(#${strokeGradientId})`}
        strokeWidth={1.4}
        opacity={0.8}
        data-element-type="shape"
      />,
    );

    // 计算图标在弧形中心的位置
    const iconDistance = (innerRadius + outerRadius) / 2;
    const iconCenterX = centerX + iconDistance * Math.cos(midAngleRad);
    const iconCenterY = centerY + iconDistance * Math.sin(midAngleRad);

    const iconFillId = `icon-fill-${index}`;
    const iconBorderId = `icon-border-${index}`;
    const iconShadowId = `icon-shadow-${index}`;

    defsElements.push(
      <linearGradient id={iconFillId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={itemColor} />
        <stop
          offset="100%"
          stopColor={tinycolor(itemColor).lighten(30).setAlpha(0.4).toRgbString()}
        />
      </linearGradient>,
    );

    defsElements.push(
      <linearGradient id={iconBorderId} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="white" stopOpacity={0} />
        <stop offset="100%" stopColor="white" stopOpacity={0.6} />
      </linearGradient>,
    );

    defsElements.push(
      <filter id={iconShadowId} x="-50%" y="-50%" width="200%" height="200%">
        <feFlood flood-color="black" result="flood" />
        <feComposite
          in="flood"
          in2="SourceAlpha"
          operator="out"
          result="inverse"
        />
        <feGaussianBlur in="inverse" stdDeviation="5.86" result="blurred" />
        <feOffset in="blurred" dx="0" dy="2.34" result="offset" />
        <feComposite
          in="offset"
          in2="SourceAlpha"
          operator="in"
          result="shadow-mask"
        />
        <feFlood flood-color={itemColor} result="shadow-color" />
        <feComposite
          in="shadow-color"
          in2="shadow-mask"
          operator="in"
          result="shadow"
        />
        <feMerge>
          <feMergeNode in="SourceGraphic" />
          <feMergeNode in="shadow" />
        </feMerge>
      </filter>,
    );

    const iconEffectiveRadius = iconBgRadius - 1.4;

    // 添加统一的图标容器圆（包含背景、边框、内阴影）
    iconElements.push(
      <Ellipse
        x={iconCenterX - iconEffectiveRadius}
        y={iconCenterY - iconEffectiveRadius}
        width={iconEffectiveRadius * 2}
        height={iconEffectiveRadius * 2}
        fill={`url(#${iconFillId})`}
        stroke={`url(#${iconBorderId})`}
        strokeWidth={2.8}
        opacity={0.5}
        filter={`url(#${iconShadowId})`}
        data-element-type="shape"
      />,
    );

    // 添加图标（如果数据项有图标）
    if (item.icon) {
      iconElements.push(
        <ItemIcon
          x={iconCenterX - iconSize / 2}
          y={iconCenterY - iconSize / 2}
          indexes={indexes}
          size={iconSize}
          fill="#fff"
        />,
      );
    }

    // 判断Item应该显示在左侧还是右侧
    const normalizedAngle = ((midAngle % 360) + 360) % 360;
    const isRightSide = normalizedAngle >= 270 || normalizedAngle <= 90;
    // 定义底部区域：75° - 105°（以90°为中心的±15°范围）
    const isBottomArea = normalizedAngle >= 75 && normalizedAngle <= 105;

    // 计算Item在弧形上的位置
    let itemAngle: number;
    let positionH: 'normal' | 'flipped' | 'center' = 'normal';
    let positionV: 'normal' | 'flipped' | 'center' = 'normal';

    if (isBottomArea) {
      itemAngle = normalizedAngle;
      positionV = 'normal';
      positionH = 'center';
    } else if (isRightSide) {
      // 右侧：将角度映射到右侧弧形范围 (-60° 到 60°)
      if (normalizedAngle >= 270) {
        // 270° - 360° 映射到 -60° - 0°
        itemAngle = -60 + ((normalizedAngle - 270) / 90) * 60;
      } else {
        // 0° - 90° 映射到 0° - 60°
        itemAngle = (normalizedAngle / 90) * 60;
      }
      positionH = 'normal';
    } else {
      // 左侧：将角度映射到左侧弧形范围 (120° 到 240°)
      // 90° - 270° 映射到 120° - 240°
      itemAngle = 120 + ((normalizedAngle - 90) / 180) * 120;
      positionH = 'flipped';
    }

    // 转换为弧度并计算Item位置
    const itemAngleRad = (itemAngle * Math.PI) / 180;
    const itemX =
      centerX + itemDistance * Math.cos(itemAngleRad) - itemBounds.width / 2;
    let itemY =
      centerY + itemDistance * Math.sin(itemAngleRad) - itemBounds.height / 2;

    if (isBottomArea) {
      itemY = centerY + outerRadius + itemBounds.height / 2;
    }

    itemElements.push(
      <Item
        indexes={indexes}
        datum={item}
        data={data}
        x={itemX}
        y={itemY}
        positionH={positionH}
        positionV={positionV}
      />,
    );

    // 添加删除按钮（在Item外侧）
    const removeBtnDistance = itemDistance + 40;
    const removeBtnX =
      centerX +
      removeBtnDistance * Math.cos(itemAngleRad) -
      btnBounds.width / 2;
    const removeBtnY =
      centerY +
      removeBtnDistance * Math.sin(itemAngleRad) -
      btnBounds.height / 2;

    btnElements.push(
      <BtnRemove indexes={indexes} x={removeBtnX} y={removeBtnY} />,
    );

    // 计算添加按钮位置（在相邻扇区之间的弧形上）
    const nextGapAngle = startAngle + arcAngle + gapAngle / 2;
    const nextGapAngleRad = (nextGapAngle * Math.PI) / 180;
    const { x: addBtnX, y: addBtnY } = computePosition({
      centerX,
      outerRadius,
      angleRad: nextGapAngleRad,
      btnBounds,
    });

    btnElements.push(<BtnAdd indexes={[index + 1]} x={addBtnX} y={addBtnY} />);
  });

  // 添加第一个位置的添加按钮
  const firstGapAngle = 270 - gapAngle / 2;
  const firstGapAngleRad = (firstGapAngle * Math.PI) / 180;

  const { x: firstAddBtnX, y: firstAddBtnY } = computePosition({
    centerX,
    outerRadius,
    angleRad: firstGapAngleRad,
    btnBounds,
  });

  btnElements.unshift(
    <BtnAdd indexes={[0]} x={firstAddBtnX} y={firstAddBtnY} />,
  );

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={70}
    >
      {titleContent}
      <Group>
        <Defs>{defsElements}</Defs>
        <Group>{arcElements}</Group>
        <Group>{iconElements}</Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};

registerStructure('sequence-circular', {
  component: SequenceCircular,
  composites: ['title', 'item'],
});
