import G6 from '@antv/g6';
import { flowBlockPublicOptions } from '../node/options'

G6.registerLayout('sz-layout', {
  getDefaultCfg() {
    return {
      center: [0, 0], // 布局的中心点
      nodeSpaceX: 30, // 节点的x轴间距
      nodeSpaceY: 30, // 节点的y轴间距
      treeSpaceX: 30, // 树的x轴间距
    };
  },
  init(data) {
    this.nodes = data.nodes
    this.edges = data.edges
    this.sourceNodes = this.findSourceNodes()
  },
  execute() {
    if (!this.graph) return
    
    const tree = this.getTree(this.sourceNodes.map(node => node.id))
    console.log("execute -> tree", tree)
    const treeCoordMap = this.getTreeCoord(tree)
    console.log("execute -> treeCoordMap", treeCoordMap)
    const nodesCoord = this.getNodesCoord(tree, treeCoordMap)
    console.log("execute -> nodesCoord", nodesCoord)
    this.updateNodesCoord(nodesCoord)
  },
  // layout(data) {
  //   if(!this.graph) return

  // },
  updateCfg(cfg) {
    const { graph } = cfg
    this.graph = graph

    const defaultCfg = this.getDefaultCfg()

    for (const cfg in defaultCfg) {
      this[cfg] = defaultCfg[cfg]
    }
  },
  // destroy() { },
  
  // 寻找源节点
  findSourceNodes() {
    const targetIds = this.edges.map(edge => edge.target)
    const sourceNodes = this.nodes.filter(({ id }) => targetIds.indexOf(id) === -1)
    
    return sourceNodes
  },

  // 得到当前节点的所有outEdge连接的节点
  getNextNodes(currentNode) {
      const outEdges = currentNode.getOutEdges()
      const nextNodes = outEdges.map(edge => edge.getTarget())

    return nextNodes
  },
  // 得到下一个树节点
  getNextTreeNodes(currentNodes) {
    const nextTreeNodes = currentNodes.reduce((cur, node) => 
      cur.concat(this.getNextNodes(node))
    , [])
    
    return nextTreeNodes
  },
  // 得到源节点的关系树
  getSourceNodeTree(sourceNodeId) {
    const sourceNode = this.graph.findById(sourceNodeId)
    const sourceNodeTree = [[sourceNode]]

    let nextNodes = [sourceNode]
    do {
      nextNodes = this.getNextTreeNodes(nextNodes)

      if (nextNodes.length) {
        sourceNodeTree.push(nextNodes)
      }
      
    } while (nextNodes.length)
    
    return sourceNodeTree
  },
  // 得到整个关系树
  getTree(sourceNodeIds) {
    const tree = sourceNodeIds.reduce((cur, id) => {
      cur[id] = this.getSourceNodeTree(id)
      return cur
    }, {})

    return tree
  },

  // 计算树的大小(默认流程块的大小相同)
  calcTreeSize(treeNodes) {
    const treeHMaxCount = treeNodes.reduce((cur, nodes) => 
    nodes.length > cur ? nodes.length : cur
    , 0)

    const width = treeHMaxCount * (flowBlockPublicOptions.style.width + this.nodeSpaceX) - this.nodeSpaceX
    const height = treeNodes.length * (flowBlockPublicOptions.style.height + this.nodeSpaceY) - this.nodeSpaceY

    return {
      width,
      height
    }
  },
  // 得到所有树原点坐标
  getTreeCoord(tree) {
    const sourceAnchorMap = {}

    let nextTreeCoord = [0, 0]
    for (const sourceNodeId in tree) {
      sourceAnchorMap[sourceNodeId] = nextTreeCoord

      const { width, height } = this.calcTreeSize(tree[sourceNodeId])

      const nextTreeCoordX = nextTreeCoord[0] + width + this.treeSpaceX
      const nextTreeCoordY = nextTreeCoord[1]
      
      nextTreeCoord = [nextTreeCoordX, nextTreeCoordY]
    }
    
    return sourceAnchorMap
  },

  // 计算树上每个节点相对树原点的坐标
  calcNodesRelativeCoord(treeNodes) {
    let relativeX = 0
    let relativeY = 0

    const nodesRelativeCoordMap = treeNodes.reduce((pre, nodes) => {
      nodes.forEach(node => { 
        const { id } = node.getModel()
        relativeX += this.nodeSpaceX
        pre[id] = [relativeX, relativeY]
      })

      relativeY += this.nodeSpaceY + flowBlockPublicOptions.style.height
      relativeX = 0

      return pre
    }, {})

    return nodesRelativeCoordMap
  },
  // 得到所有节点的实际坐标
  getNodesCoord(tree, treeCoordMap) {
    const nodesCoordMap = {}

    for (const sourceNodeId in tree) {
      const [ treeX, treeY ] = treeCoordMap[sourceNodeId]
      const nodesRelativeCoord = this.calcNodesRelativeCoord(tree[sourceNodeId])
      
      for (const nodeId in nodesRelativeCoord) {
        const [relativeX, relativeY] = nodesRelativeCoord[nodeId]

        const x = treeX + relativeX
        const y = treeY + relativeY

        if (!nodesCoordMap[nodeId]) {
          nodesCoordMap[nodeId] = [x, y]
        }
      }
    }

    return  nodesCoordMap
  },

  // 更新节点坐标
  updateNodesCoord(nodesCoord) {
    this.nodes.forEach(node => {
      const { id } = node
      const [x, y] = nodesCoord[id]
      
      node.x = x
      node.y = y
    })
  }
});