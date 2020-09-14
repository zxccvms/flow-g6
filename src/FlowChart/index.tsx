import React, { useCallback, useRef } from 'react'
import G6 from '@antv/g6';
import './node/index'

import './style/index.css'

const grid = new G6.Grid();

const data = {
  nodes: [{
    id: 'node0',
    x: 10,
    y: 10,
    name: 'sz-task',
    type: 'demoNode',
  },{
    id: 'node1',
    x: 200,
    y: 10,
    name: 'sz-task',
    type: 'demoNode',
  }],
  edges: [{
    source: 'node0',
    target: 'node1',
    type: 'polyline',
  }] 
}

const FlowChart = () => {
  // const graph = useRef(null)

  const container = useCallback(() => {
    const graph = new G6.Graph({
      container: 'container', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      width: 800, // Number，必须，图的宽度
      height: 500, // Number，必须，图的高度
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'flow-block-event'], // 允许拖拽画布、放缩画布、拖拽节点
      },
      plugins: [grid], // 插件
      
    });
    
    // 渲染数据
    graph.data(data);
    graph.render();

    // 事件
    graph.on('dblclick', e => {
      // const {x, y} = e
      console.log('画布双击', e)
    })

  }, [])
  

  return <div id="container" ref={container}></div>
}

export default FlowChart