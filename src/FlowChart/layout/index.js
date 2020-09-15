import G6 from '@antv/g6';

G6.registerLayout('sz-layout', {
  getDefaultCfg() {
    return {};
  },
  init(data) {
    this.nodes = data.nodes
    this.edges = data.edges
    this.sourceNodes = this.findSourceNodes()
  },
  execute() {
    if (!this.graph) return
    
    // const nextNodes = this.findNextNodes(this.sourceNodes[0].id)
    // console.log("execute -> nextNodes", nextNodes)
  },
  layout(data) {
    if(!this.graph) return

  },
  updateCfg(cfg) {
    const { graph } = cfg
    this.graph = graph
  },
  destroy() { },
  
  // 寻找源节点
  findSourceNodes() {
    const targetIds = this.edges.map(edge => edge.target)
    const sourceNodes = this.nodes.filter(({ id }) => targetIds.indexOf(id) === -1)
    
    return sourceNodes
  },

  // 寻找下一个树节点
  findNextNodes(currentNodeIds) {
    const nextNodes = currentNodeIds.reduce((pre, id) => {
      const node = this.graph.findById(id)
      const outEdges = node.getOutEdges()
      const nextNodes = outEdges.map(edge => edge.getTarget())
    }, [])

    return nextNodes
  },
  // 得到源节点的关系树
  getNodesTree(sourceNodeId) {
    const result = [sourceNodeId]

    let nextNodes = []
    do {
      nextNodes = this.findNextNodes(sourceNodeId)
      console.log("getNodesTree -> nextNodes", nextNodes)

      if (nextNodes.length) {
        result.push(nextNodes.map(node => node.getModal().id))
      }
      
    } while (nextNodes.length)
    
    return result
  }
});