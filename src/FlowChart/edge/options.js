import { EdgeShapeName } from '../index.d.ts'

export const edgeShapeOptions = {
  name: EdgeShapeName.EdgeShape,
  style: {
    stroke: '#6B7799',
    lineWidth: 1,
    lineAppendWidth: 2,
    lineDash: [],
    endArrow: {
      path: 'M 0,0 L 6,4 L 6,-4 Z',
      fill: '#7B85A1',
    },
  },
  no: {
    stroke: 'red',
    endArrow: {
      path: 'M 0,0 L 6,4 L 6,-4 Z',
      fill: 'red'
    }
  },
  yes: {
    stroke: 'green',
    endArrow: {
      path: 'M 0,0 L 6,4 L 6,-4 Z',
      fill: 'green'
    }
  },
  stateStyles: {
    hover: {
      stroke: '#376DFF',
      lineWidth: 2,
      endArrow: {
        path: 'M 0,0 L 6,4 L 6,-4 Z',
        fill: '#376DFF'
      }
    },
    selected: {
      stroke: '#376DFF',
      lineWidth: 2,
      endArrow: {
        path: 'M 0,0 L 6,4 L 6,-4 Z',
        fill: '#376DFF'
      }
    }
  }
}

export const textShapeOptions = {
  name: EdgeShapeName.TextShape,
  style: {
    fontSize: 12,
    fontWeight: 400,
    fill: '#666',
    textBaseline: 'middle',
    textAlign: 'center',
  },
  no: {
    fill: 'red'
  },
  yes: {
    fill: 'green'
  }
}

export const rectShapeOptions = {
  name: EdgeShapeName.RectShape,
  style: {
    fill: '#E6E6E6',
    radius: [3,3,3,3]
  }
}


export const deleteShapeOptions = {
  name: EdgeShapeName.DeleteShape,
  iconShape: {
    name: EdgeShapeName.IconShape,
    style: {
      text:'\ue709',
      fontFamily: 'iconfont',
      fill: '#FFF',
      fontSize: 16,
      fontWeight: 400,
      textBaseline: 'middle',
      cursor: 'pointer'
    },
    stateStyles: {
      hover: {
        fontSize: 16,
      }
    },
    calcCoord(point) {
      const x = point.x - deleteShapeOptions.iconShape.style.fontSize / 2
      const y = point.y
      return {x, y}
    }
  },
  style: {
    r: 12,
    fill: '#396EFE',
    cursor: 'pointer'
  },
  stateStyles: {
    hover: {
      r: 13,
    }
  },
}