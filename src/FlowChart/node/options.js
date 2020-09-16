import { FlowBlockType, ShapeName, AnchorPointType } from '../index.d.ts'



// 流程块节点公共的配置
export const flowBlockPublicOptions = {
  style: {
    width: 140,
    height: 40,
    fill: '#FFFFFF',
    lineWidth: 2,
    cursor: 'pointer',
    radius: [8,8,8,8]
  },
  stateStyles: {
    hover: {
      fill: '#4D7CFE'
    },
    selected: {
      fill: '#4D7CFE'
    },
  }
}
// 流程块节点
export const flowBlockOptionsMap = {
  [FlowBlockType.Task]: {
    name: ShapeName.FlowBlockShape,
    text: '任务',
    icon: '\ue72a',
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
    ],
  },
  [FlowBlockType.Start]: {
    name: ShapeName.FlowBlockShape,
    text: '开始',
    icon: '\ue70c',
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
    name: ShapeName.FlowBlockShape,
    text: '结束',
    icon: '\ue718',
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
    name: ShapeName.FlowBlockShape,
    text: '判断',
    icon: '\ue715',
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
export const anchorPointShapeOptions = {
  style: {
    r: 0,
    fill: '#fff',
    stroke: '#6B7799',
    cursor: 'crosshair'
  },
  name: ShapeName.AnchorPointShape,
  stateStyles: {
    hover: {
      r: 3,
      stroke: '#376DFF',
    },
    selected: {
      r: 3,
      stroke: '#376DFF',
    },
  },
}


// icon
export const iconShapeOptions = {
  style: {
    fontFamily: 'iconfont',
    fill: '#376DFF',
    fontSize: 32,
    fontWeight: 400,
    textBaseline: 'middle',
    x: 4,
    y: 20,
    cursor: 'point'
  },
  name: ShapeName.IconShape,
  stateStyles: {
    hover: {
      fill: '#FFFFFF'
    },
    selected: {
      fill: '#FFFFFF'
    },
  },
}

// textShape
export const textShapeOptions = {
  name: ShapeName.TextShape,
  style: {
    fill: '#2E2E2E',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: 400,
    textBaseline: 'middle',
    x: 44,
    y: 22,
    cursor: 'point'
  },
  stateStyles: {
    hover: {
      fill: '#FFFFFF'
    },
    selected: {
      fill: '#FFFFFF'
    },
  },
}

// utilShapes
export const utilShapesOptionsMap = {
  [ShapeName.EditorShape]: {
    name: ShapeName.EditorShape,
    icon: '\ue704',
    style: {
      r: 0,
      x: 140 + 8 + 12,
      y: 20,
      fill: '#fff',
      stroke: '#6B7799',
      cursor: 'point'
    },
    stateStyles: {
      hover: {
        r: 12,
      },
      selected: {
        r: 12,
      },
    },
  },
  [ShapeName.DeleteShape]: {
    name: ShapeName.DeleteShape,
    icon: '\ue79a',
    style: {
      r: 0,
      x: 140 + 38 + 12,
      y: 20,
      fill: '#fff',
      stroke: '#6B7799',
      cursor: 'point'
    },
    stateStyles: {
      hover: {
        r: 12,
      },
      selected: {
        r: 12,
      },
    },
  }
}