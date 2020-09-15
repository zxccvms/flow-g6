import React, { useCallback, useRef } from 'react'
import G6 from '@antv/g6';

import './node/index'
import './edge/index'
import './layout/index'

import './style/index.css'

const grid = new G6.Grid();

const data = {
  nodes: [{
    id: 'node0',
    x: 10,
    y: 10,
    name: 'sz-task',
    type: 'sz-task',
  },{
    id: 'node1',
    x: 100,
    y: 10,
    name: 'sz-start',
    type: 'sz-start',
  },{
    id: 'node2',
    x: 200,
    y: 10,
    name: 'sz-end',
    type: 'sz-end',
  },{
    id: 'node3',
    x: 300,
    y: 10,
    name: 'sz-judeg',
    type: 'sz-judeg',
    }],
  edges: [{
    id: 1,
    type: 'sz-edge',
    source: 'node1',
    sourceAnchor: 0,
    target: 'node0',
    targetAnchor: 0
  }, {
    id: 2,
    type: 'sz-edge',
    source: 'node0',
    sourceAnchor: 3,
    target: 'node3',
    targetAnchor: 0
  }, {
    id: 3,
    type: 'sz-edge',
    source: 'node0',
    sourceAnchor: 2,
    target: 'node2',
    targetAnchor: 0
  }]
}

const FlowChart = () => {
  const graph = useRef(null)

  const container = useCallback(() => {
    graph.current = new G6.Graph({
      container: 'container', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      width: 800, // Number，必须，图的宽度
      height: 500, // Number，必须，图的高度
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'flow-block-event', 'edge-event'], // 允许拖拽画布、放缩画布、拖拽节点
      },
      plugins: [grid], // 插件
      layout: {
        type: 'sz-layout',
      },
    });
    
    // 渲染数据
    graph.current.data(data);
    graph.current.render();

    // 更新布局参数
    graph.current.updateLayout({
      graph:graph.current
    })
  }, [graph])
  

  return <div id="container" ref={container}>
    <div onClick={() => graph.current.layout()}>布局</div>
  </div>
}

export default FlowChart