import React, { memo } from "react";
import { nodeWidth } from './layout';
import { Handle } from "react-flow-renderer";


export const Transition = memo(({ data, isConnectable = true }) => {
  // const node = useStoreState((state) => state.transform);
  // console.log("Transition", node, data);
  return (
    <div style={{ padding: "0.5rem 2rem", width: nodeWidth }}>
      <Handle
        id="target"
        type="target"
        position="top"
        isConnectable={isConnectable}
      />
      <div>{data.label}</div>
      <Handle type="source" position="bottom" isConnectable={isConnectable} />
    </div>
  );
});

const stepStyle = {
  border: "1px solid #eee",
  boxShadow: "0px 2px 8px rgba(8, 35, 48, 0.14)",
  borderRadius: "8px",
  fontSize: 12,
  color: "#222",
  background: "#fff",
  padding: 10,
  width: nodeWidth,
  textAlign: "center"
};

export const Step = memo(({ data, isConnectable = true }) => {
  // const node = useStoreState((state) => state.transform);
  // console.log("Step", node, data);
  return (
    <div style={stepStyle}>
      <Handle type="target" position="top" isConnectable={isConnectable} />
      <div>{data.label}</div>
      <Handle
        id="source"
        type="source"
        position="bottom"
        isConnectable={isConnectable}
      />
      <Handle
        id="loopback"
        type="source"
        position="right"
        isConnectable={isConnectable}
      />
    </div>
  );
});
