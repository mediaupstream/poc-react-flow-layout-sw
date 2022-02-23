import dagre from "dagre";
import { isNode } from "react-flow-renderer";

export const nodeWidth = 170;
export const nodeHeight = 28;

const computeLayout = (elements, auto = false) => {
  console.log('[computed layout]', { elements, auto })
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const addEl = (el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {
        width: el?.width ?? nodeWidth,
        height: el?.height ?? nodeHeight
      });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  };

  const loopback = elements.filter((n) => n.loopback);
  elements = elements.filter((n) => !n?.loopback);
  dagreGraph.setGraph({
    edgesep: 100,
    rankdir: "TB",
    align: "UL",
    marginx: 20,
    marginy: 20,
  });

  elements.forEach(addEl);
  dagre.layout(dagreGraph);

  const res = elements.map((el) => {
    if (isNode(el)) {
      console.log('mom', el, { width: el.width, height: el.height });
      el.targetPosition = "top";
      el.sourcePosition = "bottom";
      if (auto) {
        const { x, y } = dagreGraph.node(el.id);
        const wOffset = (el?.width || 200) / 2 + (Math.random() / 1000)
        const hOffset = (el?.height || 34) / 2
        el.computed = el?.width ? true : false;
        el.position = {
          x: x - wOffset,
          y: y - hOffset
        };
        // update the data.ref x/y coords as well
        if (el?.data?.ref) {
          el.data.ref.x = el.position.x;
          el.data.ref.y = el.position.y;
        }
      }
    }

    return el;
  });
  return [...res, ...loopback];
};

export default computeLayout;
