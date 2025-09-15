/** @jsxImportSource @antv/infographic-jsx */
import type { JSXElement } from '@antv/infographic-jsx';
import { getElementBounds, Group } from '@antv/infographic-jsx';
import { BtnAdd, BtnRemove, BtnsGroup, ItemsGroup } from '../components';
import { FlexLayout } from '../layouts';
import type { BaseTemplateProps } from './types';

export interface ListColumnProps extends BaseTemplateProps {
  gap?: number;
}

export const ListColumn = (props: ListColumnProps) => {
  const { Title, Item, data, gap = 20, design } = props;
  const { title, desc, items = [] } = data;

  let width = 720;

  const titleContent = Title ? (
    <Title title={title} desc={desc} {...design?.title} />
  ) : null;
  if (Title) {
    const titleBounds = getElementBounds(titleContent);
    width = titleBounds.width * 0.8;
  }

  const btnBounds = getElementBounds(<BtnAdd indexKey={'1'} />);
  const itemBounds = getElementBounds(<Item indexKey={'1'} datum={items[0]} />);

  const btnElements: JSXElement[] = [];
  const itemElements: JSXElement[] = [];

  const btnAddX = (width - btnBounds.width) / 2;
  items.forEach((item, index) => {
    const indexKey = `${index + 1}`;
    const itemY = (itemBounds.height + gap) * index;

    itemElements.push(
      <Item
        indexKey={indexKey}
        id={`item-${indexKey}`}
        datum={item}
        y={itemY}
        width={width}
        positionV="center"
        {...design?.item}
      />,
    );

    btnElements.push(
      <BtnRemove
        indexKey={indexKey}
        id={`btn-remove-${indexKey}`}
        x={-btnBounds.width - 10}
        y={itemY + (itemBounds.height - btnBounds.height) / 2}
      />,
    );

    btnElements.push(
      <BtnAdd
        indexKey={indexKey}
        id={`btn-add-${indexKey}`}
        x={btnAddX}
        y={itemY - btnBounds.height}
      />,
    );
  });

  if (items.length > 0) {
    const lastItemY = (itemBounds.height + gap) * (items.length - 1);
    const extraAddBtnY = lastItemY + itemBounds.height;

    btnElements.push(
      <BtnAdd
        indexKey={`${items.length + 1}`}
        id={`btn-add-${items.length + 1}`}
        x={btnAddX}
        y={extraAddBtnY}
      />,
    );
  }

  return (
    <FlexLayout
      id="infographic-container"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      {titleContent}
      <Group>
        <ItemsGroup>{itemElements}</ItemsGroup>
        <BtnsGroup>{btnElements}</BtnsGroup>
      </Group>
    </FlexLayout>
  );
};
