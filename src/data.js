import { nodeWidth, nodeHeight } from './layout';
const edgeType = "smoothstep"; // smoothstep, step, default, straight

const styles = {
  default: {
    border: "1px solid #eee",
    boxShadow: "0px 2px 8px rgba(8, 35, 48, 0.14)",
    borderRadius: "8px",
    minWidth: nodeWidth
  }
};

const transitionLabel = (text) => {
  // const n = Math.floor(Math.random() * 10) % 3
  // return text + (n === 0 ? 'STEP.TEST.COMPLETED = TRUE AND STEP.INITIALIZE OR BIG.TEXTBLOCK = 9939944 > STEP.START = COMPLETED' : '')
  return text;
}

const truncateLabel = (text, len = 20) => {
  if (text.length <= len) {
    return text;
  }
  return text.substring(0, len) + '...'
}

const FROM_STEP = 21;
const FROM_TRANS = 22;

const isLoopback = (item, recipe) => {
  const { from_type, from_name, to_name } = item;
  if (from_type !== FROM_TRANS) {
    return false;
  }
  // a loopback connection must be a transition -> step
  // where the target (step) is higher up (smaller y value) than the source (transition)
  const source = recipe.transition.find(n => n.name === from_name);
  const target = recipe.step.find(n => n.name === to_name);
  if (target?.y < source?.y) {
    console.log('[loopback connection]', from_name, '=>', to_name, { source, target });
    return true
  }
  return false;
}

export const connect = (source, target, loopback = false) => ({
  id: `e${source}${target}`,
  source,
  target,
  label: loopback ? 'ᐃ' : undefined,
  type: loopback ? 'default' : 'step',
  sourceHandle: loopback ? "loopback" : "source",
  targetHandle: loopback ? "loopback" : "target",
  loopback,
  animated: loopback,
  style: styles['edge'],
  data: {
    type: 'link'
  }
});

export const step = item => {
  const type = /INITIALSTEP/gi.test(item.name)
      ? 'start'
      : /TERMINALSTEP/gi.test(item.name)
        ? 'end'
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
    type: 'transition',
    data: {
      label: transitionLabel(item.expression || item.name),
      ref: item,
      type: 'transition'
    },
    position: {
      x: item.x,
      y: item.y
    }
  }
}

export const normalizeCoords = (item, offset = 0) => {
  return {
    ...item,
    x: (item.x / 4) - offset,
    y: item.y / 3
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
