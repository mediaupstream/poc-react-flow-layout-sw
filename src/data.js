import { nodeWidth, nodeHeight } from './layout';
const edgeType = "smoothstep"; // smoothstep, step, default, straight

const styles = {
  input: {
    background: "#eafce3",
    border: 0,
    width: nodeWidth,
  },
  output: {
    background: "#ffe6e6",
    border: 0,
    width: nodeWidth
  },
  transition: {
    background: "#e5efff",
    paddingTop: "0.45rem",
    paddingBottom: "0.45rem",
    border: 0,
    width: nodeWidth
  },
  default: {
    border: "1px solid #eee",
    boxShadow: "0px 2px 8px rgba(8, 35, 48, 0.14)",
    borderRadius: "8px",
    width: nodeWidth
  }
};

const truncateLabel = (text, len = 20) => {
  if (text.length <= len) {
    return text;
  }
  return text.substring(0, len) + '...'
}

const isLoopback = (item, recipe) => {
  const { from_type, from_name, to_name } = item;

  let source;
  let target;

  if (from_type === 21) {
    source = recipe.step.find(n => n.name === from_name);
    target = recipe.transition.find(n => n.name === to_name);
  } else {
    source = recipe.transition.find(n => n.name === from_name);
    target = recipe.step.find(n => n.name === to_name);
  }

  if (target?.y < source?.y) {
    console.log('isLoopback!!!', from_name, '=>', to_name, { source, target });
    return true
  }

  return false;
}

export const connect = (source, target, loopback = false) => ({
  id: `e${source}${target}`,
  source,
  target,
  type: edgeType,
  sourceHandle: loopback ? "loopback" : "source",
  loopback,
  animated: loopback,
  data: {
    type: 'link'
  }
});

export const step = item => {
  const type = /INITIALSTEP/gi.test(item.name)
      ? 'input'
      : /TERMINALSTEP/gi.test(item.name)
        ? 'output'
        : 'step';
  return {
    id: item.name,
    type,
    data: {
      label: truncateLabel(item.name),
      ref: item,
      type: 'step'
    },
    style: styles[type],
    position: {
      x: item.x,
      y: item.y
    }
  }
};

export const transition = item => {
  return {
    id: item.name,
    type: 'default',
    data: {
      label: truncateLabel(item.expression || item.name),
      ref: item,
      type: 'transition'
    },
    style: styles.transition,
    position: {
      x: item.x,
      y: item.y
    }
  }
}


export const processRecipe = (recipe) => {
  const results = [];
  // Add steps
  recipe.step.forEach(n =>
    results.push(step(n))
  )
  // Add transitions
  recipe.transition.forEach(n =>
    results.push(transition(n))
  )
  // Add connections
  recipe.link.forEach(n => {
    const loop = isLoopback(n, recipe);
    results.push(connect(n.from_name, n.to_name, loop))
  })

  console.log({ recipe })

  return results
}


/*
const START_ID = "Start";
const END_ID = "End";

const test = [
  // must have a start step
  step({ id: START_ID, type: "input" }),

  // steps
  transition({ id: "T1" }),
  step({ id: "A" }),
  step({ id: "B" }),
  step({ id: "B2" }),
  step({ id: "C" }),
  transition({ id: "T2" }),
  transition({ id: "T3" }),

  // must have an end step
  step({ id: END_ID, type: "output" }),

  // connection aka links
  connect(START_ID, "T1"),
  connect("T1", "A"),
  connect("T1", "B"),
  connect("A", "T3"),
  connect("B", "T2"),
  connect("T2", "B2"),
  connect("T2", "C"),
  connect("C", "T3"),
  connect("B2", "T3"),

  // connect("T1", "B2"),
  connect("B", "T1", true),
  connect("B2", "T2", true),
  // connect("B2", "T1", true),

  connect("T3", END_ID)
];
*/
