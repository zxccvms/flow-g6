import React, { useCallback, useRef } from 'react'
import G6 from '@antv/g6';
import Grid from './Grid'

import './node/index'
import './edge/index'
import './layout/index'

import './style/index.css'
import { findShortestPath } from '@antv/g6/lib/algorithm';

const data = {
  nodes: [{
    id: 'node0',
    x: 10,
    y: 10,
    type: 'sz-task',
  },{
    id: 'node1',
    x: 100,
    y: 10,
    type: 'sz-start',
  },{
    id: 'node2',
    x: 200,
    y: 10,
    type: 'sz-end',
  },{
    id: 'node3',
    x: 300,
    y: 10,
    type: 'sz-judeg',
    }],
  edges: [
    {
    id: 1,
    type: 'sz-edge',
    source: 'node1',
    sourceAnchor: 0,
    target: 'node0',
    targetAnchor: 0,
    },
    {
    id: 2,
    type: 'sz-edge',
    source: 'node0',
    sourceAnchor: 3,
    target: 'node3',
    targetAnchor: 0,
    // label: '很高兴遇见你',
    // labelCfg: {
    //   fill: '#017000'
    // }
  }]
}

const grid = new Grid()

const FlowChart = () => {
  const graph = useRef(null)

  const container = useCallback(() => {
    graph.current = new G6.Graph({
      container: 'container', // String | HTMLElement，必须，在 Step 1 中创建的容器 id 或容器本身
      width: 800, // Number，必须，图的宽度
      height: 500, // Number，必须，图的高度
      maxZoom: 3,
      minZoom: 0.5,
      modes: {
        default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'flow-block-event', 'edge-event'], // 允许拖拽画布、放缩画布、拖拽节点
      },
      plugins: [grid], // 插件
      layout: {
        type: 'dagre',
        rankdir: 'TB', // 可选，默认为图的中心
        // align: 'DL', // 可选
        nodesep: 60, // 可选
        ranksep: 20, // 可选
        controlPoints: true, // 可选
      },
    });
    
    // 渲染数据
    graph.current.data(data);
    graph.current.render();

    // 兼容icon渲染失败
    setTimeout(() => {
      graph.current.paint();
    }, 16);

    // 更新布局参数
    // graph.current.updateLayout({
    //   graph:graph.current
    // })
  }, [graph])
  

  return <div id="container" ref={container}>
    <button className="layout-init-btn" onClick={() => {
      graph.current.layout()
      graph.current.moveTo(0,0)
    }}>布局</button>
  </div>
}

export default FlowChart