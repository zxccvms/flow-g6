import G6 from '@antv/g6';

G6.registerEdge('sz-edge', {
  draw(cfg, group) {
    const startPoint = cfg.startPoint;
    const endPoint = cfg.endPoint;
    const keyShape = group.addShape('path', {
      attrs: {
        stroke: '#333',
        path: [
          ['M', startPoint.x, startPoint.y],
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, startPoint.y], // 三分之一处
          ['L', endPoint.x / 3 + (2 / 3) * startPoint.x, endPoint.y], // 三分之二处
          ['L', endPoint.x, endPoint.y],
        ],
      },
      name: 'path-shape',
    });
    return keyShape;
  },
  setState(name, value, item) {
    console.log("setState -> name, value, item", name, value, item)
    
  }
}, 'cubic');