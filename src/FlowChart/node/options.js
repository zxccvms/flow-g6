import { FlowBlockType, OtherNodeType, AnchorPointType } from '../index.d.ts'



// 流程块节点公共的配置
export const flowBlockPublicOptions = {
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
    hover: {
      fill: 'blue'
    },
    selected: {
      fill: 'blue'
    },
  }
}
// 流程块节点
export const flowBlockOptionsMap = {
  [FlowBlockType.Task]: {
    style: {
      ...flowBlockPublicOptions.style
    },
    stateStyles: {
      ...flowBlockPublicOptions.stateStyles
    },
    anchorPoints: [ // 锚点位置
      [0.5, 0], // 顶部中间
      [1, 0.5], // 右侧中间
      [0.5, 1], // 底部中间
      [0, 0.5], // 左侧中间
    ],
    anchorPointsType: [ // 锚点类型
      AnchorPointType.All,
      AnchorPointType.All,
      AnchorPointType.All,
      AnchorPointType.All
    ]
  },
  [FlowBlockType.Start]: {
    style: {
      ...flowBlockPublicOptions.style
    },
    stateStyles: {
      ...flowBlockPublicOptions.stateStyles
    },
    anchorPoints: [ // 锚点位置
      [0.5, 1], // 底侧中间
    ],
    anchorPointsType: [ // 锚点类型
      AnchorPointType.Out,
    ]
  },
  [FlowBlockType.End]: {
    style: {
      ...flowBlockPublicOptions.style
    },
    stateStyles: {
      ...flowBlockPublicOptions.stateStyles
    },
    anchorPoints: [ // 锚点位置
      [0.5, 0], // 顶侧中间
      [1, 0.5], // 右侧中间
    ],
    anchorPointsType: [ // 锚点类型
      AnchorPointType.In,
      AnchorPointType.In
    ]
  },
  [FlowBlockType.Judge]: {
    style: {
      ...flowBlockPublicOptions.style
    },
    stateStyles: {
      ...flowBlockPublicOptions.stateStyles
    },
    anchorPoints: [ // 锚点位置
      [0.5, 0], // 顶侧中间
      [1, 0.5], // 右侧中间
      [0.5, 1], // 底侧中间
    ],
    anchorPointsType: [ // 锚点类型
      AnchorPointType.In,
      AnchorPointType.Out,
      AnchorPointType.Out
    ]
  },
}

// 锚点上的节点
export const anchorPointNodeOptions = {
  style: {
    r: 0,
    fill: '#fff',
    stroke: '#333',
    cursor: 'crosshair'
  },
  name: OtherNodeType.AnchorPointNode,
  stateStyles: {
    hover: {
      r: 4
    },
    selected: {
      r: 4
    },
  },
}