import G6 from '@antv/g6';

G6.registerBehavior('edge-event', {
  getDefaultCfg() {
    return {
      multiple: true
    };
  },
  getEvents() {
    return {
      'edge:mouseenter': 'onEdgeMouseEnter'
    };
  },

  onEdgeMouseEnter(e) {
    console.log("onEdgeMouseEnter -> e", e)
  }
});