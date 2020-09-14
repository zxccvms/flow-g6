import { FlowBlockType, OtherNodeType } from '../index.d.ts'

// 流程块节点
export const flowBlockOptionsMap = {
  [FlowBlockType.Task]: {
    style: {
      width: 100,
      height: 40,
      fill: '#eee',
      stroke: '#333',
      lineWidth: 2,
      cursor: 'pointer',
      radius: [2,2,2,2]
    },
    stateStyles: {
      hover: {},
      selected: {},
    },
    anchorPoints: [
      [0, 0.5], // 左侧中间
      [1, 0.5], // 右侧中间
      [0.5, 0], // 顶侧中间
      [0.5, 1], // 底侧中间
    ]
  }
}

// 锚点上的节点
export const anchorPointNodeOptions = {
  style: {
    r: 4,
    fill: '#fff',
    stroke: '#333',
    cursor: 'crosshair'
  },
  name: OtherNodeType.AnchorPointNode,
  stateStyles: {
    hover: {},
    selected: {},
  },
}