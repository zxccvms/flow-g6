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
  utilShapeGroup = 'anchor-point-group',
}

export enum AnchorPointType{
  All = 0,
  In,
  Out
}