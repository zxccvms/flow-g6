import { EdgeShapeName } from '../index.d.ts'

export const edgeShapeOptions = {
  name: EdgeShapeName.EdgeShape,
  style: {
    stroke: '#6B7799',
    lineWidth: 1,
    lineAppendWidth: 2,
    endArrow: {
      path: 'M 0,0 L 6,4 L 6,-4 Z',
      fill: '#7B85A1',
    },
  }
}

export const deleteShapeOptions = {
  name: EdgeShapeName.DeleteShape,
  iconShape: {
    style: {
      text:'\ue709',
      fontFamily: 'iconfont',
      fill: '#FFF',
      fontSize: 16,
      fontWeight: 400,
      textBaseline: 'middle',
      cursor: 'pointer'
    }
  },
  style: {
    r: 12,
    fill: '#396EFE',
    cursor: 'pointer'
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