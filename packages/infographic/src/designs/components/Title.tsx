/** @jsxImportSource @antv/infographic-jsx */
import {
  Text,
  type BaseGeometryProps,
  type TextProps,
} from '@antv/infographic-jsx';
import { FlexLayout } from '../layouts';

export interface TitleProps extends BaseGeometryProps {
  alignHorizontal?: 'left' | 'center' | 'right';
  title?: string;
  desc?: string;
  descLineNumber?: number;
}

export const Title = (props: TitleProps) => {
  const {
    x = 0,
    y = 0,
    width = 720,
    alignHorizontal = 'center',
    title = 'Title',
    desc = 'Sub Title',
    descLineNumber: subTitleLineNumber = 2,
  } = props;
  const MainTitle = (props: TextProps) => {
    const defaultProps: TextProps = {
      id: 'title',
      fontSize: 24,
      fill: '#212121',
      width,
      height: 32,
      lineHeight: 1.4,
      alignHorizontal,
    };
    return (
      <Text {...defaultProps} {...props}>
        {title}
      </Text>
    );
  };

  const Desc = (props: TextProps) => {
    const defaultProps: TextProps = {
      id: 'desc',
      fontSize: 16,
      fill: '#666666',
      width,
      alignHorizontal,
      lineHeight: 1.4,
      height: subTitleLineNumber * 24,
    };
    return (
      <Text {...defaultProps} {...props}>
        {desc}
      </Text>
    );
  };

  return (
    <FlexLayout
      id="title-group"
      flexDirection="column"
      x={x}
      y={y}
      width={width}
      gap={8}
    >
      {title && <MainTitle />}
      {desc && <Desc />}
    </FlexLayout>
  );
};
