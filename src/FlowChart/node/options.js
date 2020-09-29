import { FlowBlockType, ShapeName, AnchorPointType } from '../index.d.ts'



// 流程块节点公共的配置
export const flowBlockPublicOptions = {
  style: {
    width: 139,
    height: 39,
    fill: '#FFFFFF',
    stroke: '#FFFFFF',
    lineWidth: 1,
    cursor: 'pointer',
    radius: [8,8,8,8]
  },
  stateStyles: {
    hover: {
      fill: '#4D7CFE',
      stroke: '#376DFF'
    },
    selected: {
      fill: '#4D7CFE',
      stroke: '#376DFF'
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
      AnchorPointType.Normal,
      AnchorPointType.Normal,
      AnchorPointType.Normal,
      AnchorPointType.Normal
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
      AnchorPointType.No,
      AnchorPointType.Yes
    ]
  },
}

// 锚点上的节点
export const anchorPointShapeOptions = {
  style: {
    r: 4,
    fill: '#fff',
    stroke: '#376DFF',
    cursor: 'crosshair',
    lineAppendWidth: 10, // 事件触发范围
  },
  no: {
    stroke: 'red'
  },
  yes: {
    stroke: 'green'
  },
  name: ShapeName.AnchorPointShape,
  stateStyles: {
    able: {
      fill: '#fff',
      cursor: 'crosshair'
    },
    unable: {
      fill: '#ddd',
      cursor: 'not-allowed'
    }
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
    y: 20,
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
    iconShape: {
      style: {
        text:'\ue704',
        fontFamily: 'iconfont',
        fill: '#376DFF',
        fontSize: 16,
        fontWeight: 400,
        textBaseline: 'middle',
        cursor: 'pointer'
      }
    },
    style: {
      r: 12,
      x: 140 + 8 + 12,
      y: 20,
      fill: '#fff',
      cursor: 'pointer'
    },
    stateStyles: {
      hover: {
        r: 13,
      },
    },
  },
  [ShapeName.DeleteShape]: {
    name: ShapeName.DeleteShape,
    iconShape: {
      style: {
        text:'\ue79a',
        fontFamily: 'iconfont',
        fill: '#FF493D',
        fontSize: 16,
        fontWeight: 400,
        textBaseline: 'middle',
        cursor: 'pointer'
      },
    },
    style: {
      r: 12,
      x: 140 + 8 + 12,
      y: 20,
      fill: '#fff',
      cursor: 'pointer'
    },
    stateStyles: {
      hover: {
        r: 13,
      },
    },
  }
}

