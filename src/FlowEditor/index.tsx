import React, { useCallback, useRef } from 'react'
import G6 from '@antv/g6';

import Grid from './custom/Grid'
import './custom/index'

import './style.css'

let data = {"nodes":[{"id":"io5cd","shape":"sz-task","x":140,"y":140,"output":"","input":"","label":"任务块aaaaaaaaaaa","reTryCount":"0","errorVar":"","style":{}},{"id":"hsxAW","shape":"sz-start","x":140,"y":40,"label":"开始","style":{}},{"id":"5hnBB","shape":"sz-judge","x":80,"y":240,"condition":"123","label":"判断","style":{}},{"id":"JKdo6","shape":"sz-end","x":140,"y":440,"label":"完成","style":{}},{"id":"EiwZT","shape":"sz-task","x":200,"y":340,"input":"","output":"","reTryCount":"0","errorVar":"","label":"任务块","style":{}}],"edges":[{"shape":"line-arrow","source":"hsxAW","target":"io5cd","startPoint":{"x":209.5,"y":79.5,"index":0},"endPoint":{"x":209.5,"y":139.5,"index":0},"sourceAnchor":"0","targetAnchor":"0","centerPoint":{"x":209.5,"y":109.5},"style":{},"id":"edge1","controlPoints":[{"x":140,"y":90}]},{"shape":"line-arrow","source":"io5cd","target":"5hnBB","sourceAnchor":1,"startPoint":{"x":279.5,"y":159.5,"index":1},"endPoint":{"x":149.5,"y":239.5,"index":0},"centerPoint":{"x":254.5,"y":224.5},"targetAnchor":0,"style":{},"id":"edge2","controlPoints":[{"x":80,"y":190}]},{"shape":"line-arrow","source":"5hnBB","target":"JKdo6","sourceAnchor":2,"label":"yes","labelCfg":{"fill":"green"},"startPoint":{"x":149.5,"y":279.5,"index":2},"endPoint":{"x":209.5,"y":439.5,"index":0},"centerPoint":{"x":209.5,"y":329.5},"targetAnchor":0,"style":{},"id":"edge3","controlPoints":[{"x":70,"y":290},{"x":70,"y":340},{"x":70,"y":390}]},{"shape":"line-arrow","source":"EiwZT","target":"JKdo6","sourceAnchor":1,"startPoint":{"x":339.5,"y":359.5,"index":1},"endPoint":{"x":279.5,"y":459.5,"index":1},"centerPoint":{"x":354.5,"y":439.5},"targetAnchor":1,"style":{},"id":"edge5","controlPoints":[{"x":200,"y":390}]},{"id":"908","type":"line-arrow","source":"io5cd","sourceAnchor":4,"target":"EiwZT","styleType":"error","style":{},"startPoint":{"x":244.5,"y":179.5,"index":4},"endPoint":{"x":199.5,"y":359.5,"index":3},"centerPoint":{"x":184.5,"y":247},"targetAnchor":3,"controlPoints":[{"x":210,"y":190},{"x":210,"y":240},{"x":210,"y":290}]},{"id":"586","type":"line-arrow","source":"5hnBB","sourceAnchor":1,"target":"EiwZT","label":"no","styleType":"no","style":{},"startPoint":{"x":219.5,"y":259.5,"index":1},"endPoint":{"x":269.5,"y":339.5,"index":0},"centerPoint":{"x":234.5,"y":309.5},"targetAnchor":0,"controlPoints":[{"x":140,"y":290}]}],"combos":[],"groups":[]}

const grid = new Grid()

// 兼容数据
const handleData = (data): any => {
  const result = Array.isArray(data) ? [] : {}
  for (const key in data) {
    const value = data[key]
    if (typeof value === 'object') {
      result[key] = handleData(value)
    } else if (key !== 'shape') {
      result[key] = value
    } else {
      result['type'] = value
    }
  }
  return result
}

data = handleData(data)

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
        nodesep: 140, // 可选
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
      // graph.current.moveTo(60, 20)
      console.log("container -> graph.current.save()", JSON.stringify(graph.current.save()))
    }}>布局</button>
  </div>
}

export default FlowChart