export enum FlowBlockType{
  Task = 'sz-task',
  Start = 'sz-start',
  End = 'sz-end',
  Judge = 'sz-judge'
}

export enum ShapeName{
  FlowBlockShape = 'flow-block-shape',
  AnchorPointShape = 'anchor-point-shape',
  TextShape = 'text-shape',
  IconShape = 'icon-shape',
  EditorShape = 'editor-shape',
  DeleteShape = 'delete-shape'
}

export enum GroupName{
  AnchorPointGroup = 'anchor-point-group',
  UtilGroup = 'util-group',
}

export enum UtilGroupChildrenName{ // 需要和ShapeName的key相同
  EditorShapeGroup = 'editor-shape-group',
  DeleteShapeGroup = 'delete-shape-group',
}

export enum AnchorPointType{
  Normal = 'normal',
  In = 'in',
  Out = 'out',
  Yes = 'yes',
  No = 'no',
  Error = 'error'
}

export const inTypeAchorPoints = [AnchorPointType.Normal, AnchorPointType.In]
export const outTypeAchorPoints = [AnchorPointType.Normal, AnchorPointType.Out, AnchorPointType.Yes, AnchorPointType.No, AnchorPointType.Error]

export const EdgeType = 'line-arrow'

export enum EdgeShapeName{
  EdgeShape = 'edge-shape',
  DeleteShape = 'edge-delete-shape',
  IconShape = 'edge-icon-shape',
  TextShape = 'edge-text-shape',
  RectShape = 'edge-rect-shape'
}

export enum EdgeGroupName{
  TextShape = 'text-shape-group',
  DeleteShape = 'delete-shape-group'
}

export enum EdgeStyleType{
  Normal = 'normal',
  No = 'no',
  Yes = 'yes'
}