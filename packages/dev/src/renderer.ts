import { Infographic } from '@antv/infographic';

const container = document.getElementById('root');

const infographic = new Infographic({
  container,
  width: 800,
  height: 600,
  padding: 20,
  design: {
    structure: { type: 'list-column', gap: 5 },
    title: 'default',
    item: { type: 'pyramid', positionH: 'flipped' },
  },
  data: {
    title: 'AntV Infographic',
    desc: 'AntV Infographic is an AI-powered infographic recommendation and generation tool',
    items: [
      { label: 'AntV G', desc: 'Flexible visualization rendering engine' },
      { label: 'AntV G2', desc: 'Progressive visualization grammar' },
      {
        label: 'AntV G6',
        desc: 'Simple, easy-to-use, and comprehensive graph visualization engine',
      },
    ],
  },
  themeConfig: {
    palette: [
      '#1783FF',
      '#00C9C9',
      '#F0884D',
      '#D580FF',
      '#7863FF',
      '#60C42D',
      '#BD8F24',
      '#FF80CA',
      '#2491B3',
      '#17C76F',
      '#70CAF8',
    ],
  },
});

infographic.render();
