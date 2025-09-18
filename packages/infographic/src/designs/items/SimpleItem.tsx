/** @jsxImportSource @antv/infographic-jsx */
import { ComponentType, getElementBounds, Group } from '@antv/infographic-jsx';
import { ItemDesc, ItemIcon, ItemLabel } from '../components';
import { FlexLayout } from '../layouts';
import type { BaseItemProps } from './types';

export interface SimpleItemProps extends BaseItemProps {
  width?: number;
  gap?: number;
  iconSize?: number;
  positionH?: 'normal' | 'center' | 'flipped';
  positionV?: 'normal' | 'center' | 'flipped';
}

export const SimpleItem: ComponentType<SimpleItemProps> = (props) => {
  const {
    indexKey,
    datum,
    width = 200,
    gap = 4,
    iconSize = 30,
    positionH = 'normal',
    positionV = 'normal',
    ...restProps
  } = props;

  const { label, desc, icon } = datum;

  const getTextAlign = (position: string) => {
    return position === 'normal'
      ? 'left'
      : position === 'flipped'
        ? 'right'
        : 'center';
  };

  const textAlign = getTextAlign(positionH);

  if (!icon) {
    return (
      <Group {...restProps}>
        <ItemLabel
          width={width}
          alignHorizontal={textAlign}
          alignVertical="center"
        >
          {label}
        </ItemLabel>
        <ItemDesc
          width={width}
          y={getElementBounds(<ItemLabel width={width} />).height + gap}
          alignHorizontal={textAlign}
          alignVertical={getDescVerticalAlign(positionV, false)}
        >
          {desc}
        </ItemDesc>
      </Group>
    );
  }

  if (positionH === 'center') {
    return (
      <FlexLayout
        {...restProps}
        flexDirection="column"
        gap={gap}
        alignItems="center"
      >
        {positionV === 'flipped' ? (
          <>
            <Group>
              <ItemLabel
                width={width}
                alignHorizontal="center"
                alignVertical="center"
              >
                {label}
              </ItemLabel>
              <ItemDesc
                width={width}
                y={getElementBounds(<ItemLabel width={width} />).height + gap}
                alignHorizontal="center"
                alignVertical="bottom"
              >
                {desc}
              </ItemDesc>
            </Group>
            <ItemIcon size={iconSize} />
          </>
        ) : (
          <>
            <ItemIcon size={iconSize} />
            <Group>
              <ItemLabel
                width={width}
                alignHorizontal="center"
                alignVertical="center"
              >
                {label}
              </ItemLabel>
              <ItemDesc
                width={width}
                y={getElementBounds(<ItemLabel width={width} />).height + gap}
                alignHorizontal="center"
                alignVertical="top"
              >
                {desc}
              </ItemDesc>
            </Group>
          </>
        )}
      </FlexLayout>
    );
  }

  const iconBounds = getElementBounds(<ItemIcon size={iconSize} />);
  const textWidth = Math.max(width - iconBounds.width - gap, 0);

  return (
    <FlexLayout
      {...restProps}
      flexDirection="row"
      gap={gap}
      alignItems={getIconVerticalAlign(positionV)}
    >
      {positionH === 'flipped' ? (
        <>
          <Group>
            <ItemLabel
              width={textWidth}
              alignHorizontal="right"
              alignVertical="center"
            >
              {label}
            </ItemLabel>
            <ItemDesc
              width={textWidth}
              y={getElementBounds(<ItemLabel width={textWidth} />).height + gap}
              alignHorizontal="right"
              alignVertical={getDescVerticalAlign(positionV, true)}
            >
              {desc}
            </ItemDesc>
          </Group>
          <ItemIcon size={iconSize} />
        </>
      ) : (
        <>
          <ItemIcon size={iconSize} />
          <Group>
            <ItemLabel
              width={textWidth}
              alignHorizontal="left"
              alignVertical="center"
            >
              {label}
            </ItemLabel>
            <ItemDesc
              width={textWidth}
              y={getElementBounds(<ItemLabel width={textWidth} />).height + gap}
              alignHorizontal="left"
              alignVertical={getDescVerticalAlign(positionV, true)}
            >
              {desc}
            </ItemDesc>
          </Group>
        </>
      )}
    </FlexLayout>
  );

  function getDescVerticalAlign(positionV: string, hasIcon: boolean) {
    return 'top';
    // if (positionV === 'normal') return 'top';
    // if (positionV === 'flipped') return 'bottom';

    return hasIcon ? 'center' : 'top';
  }

  function getIconVerticalAlign(positionV: string) {
    if (positionV === 'normal') return 'flex-start';
    if (positionV === 'flipped') return 'flex-end';
    return 'center';
  }
};
