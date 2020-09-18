export enum FlowBlockType{
  Task = 'sz-task',
  Start = 'sz-start',
  End = 'sz-end',
  Judge = 'sz-judeg'
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
  UtilGroup = 'util-shape-group',
}

export enum UtilGroupChildrenName{ // 需要和ShapeName的key相同
  EditorShape = 'editor-shape-group',
  DeleteShape = 'delete-shape-group',
}

export enum AnchorPointType{
  All = 'all',
  In = 'in',
  Out = 'out'
}

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