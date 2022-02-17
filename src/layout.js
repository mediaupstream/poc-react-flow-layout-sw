import dagre from "dagre";
import { isNode } from "react-flow-renderer";

export const nodeWidth = 170;
export const nodeHeight = 45;

const computeLayout = (elements, auto = false) => {

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const addEl = (el) => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {
        width: nodeWidth,
        height: nodeHeight
      });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  };

  const loopback = elements.filter((n) => n.loopback);
  elements = elements.filter((n) => !n?.loopback);
  dagreGraph.setGraph({
    // minlen: 10,
    // weight: 1,
    rankdir: "TB",
    align: "UL",
    // acyclicer: "greedy",
    // ranker: "tight-tree"
    // ranker: "longest-path"
  });

  elements.forEach(addEl);
  dagre.layout(dagreGraph);

  const res = elements.map((el) => {
    if (isNode(el)) {
      el.targetPosition = "top";
      el.sourcePosition = "bottom";
      let offset = 0;
      if (
        el?.data?.type === 'transition' ||
        el?.type === 'output'
      ) {
        offset = 50;
      }
      if (el?.type === 'input') {
        offset = 25;
      }
      if (auto) {
        console.log('using auto coords')
        const { x, y } = dagreGraph.node(el.id);
        el.position = { x, y };
      } else {
        console.log('using existing coords')
        el.position = {
          x: (el.position.x / 4) - offset,
          y: el.position.y / 3
        }
      }
    }

    return el;
  });
  return [...res, ...loopback];
};

export default computeLayout;
