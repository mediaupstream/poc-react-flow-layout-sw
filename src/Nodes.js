import React, { memo } from "react";
import { nodeWidth } from './layout';
import { Handle } from "react-flow-renderer";

const style = {
  border: "1px solid #eee",
  fontSize: 12,
  color: "#222",
  background: "#fff",
  padding: '1rem',
  minWidth: nodeWidth,
  textAlign: "center"
};

const transitionStyle = {
  ...style,
  background: "#e5efff",
  paddingTop: "0.45rem",
  paddingBottom: "0.45rem",
}

const startStyle = {
  ...style,
  background: "#eafce3",
}

const endStyle = {
  ...style,
  background: "#ffe6e6",
}

const stepStyle = {
  ...style,
  boxShadow: "0px 2px 8px rgba(8, 35, 48, 0.14)",
  borderRadius: "8px",
}

export const Start = memo(({ data, isConnectable = true }) => (
  <div style={startStyle}>
    <div>{data.label}</div>
    <Handle id="source" type="source" position="bottom" isConnectable={isConnectable} />
  </div>
))


export const End = memo(({ data, isConnectable = true }) => (
  <div style={endStyle}>
    <Handle id="source" type="target" position="top" isConnectable={isConnectable} />
    <div>{data.label}</div>
  </div>
))

export const Transition = memo(({ data, isConnectable = true }) => (
  <div style={transitionStyle}>
    <Handle
      id="target"
      type="target"
      position="top"
      isConnectable={isConnectable}
    />
    <div>{data.label}</div>
    <Handle id="source" type="source" position="bottom" isConnectable={isConnectable} />
    <Handle
      id="loopback"
      type="source"
      position="right"
      isConnectable={isConnectable}
    />
  </div>
))

export const Step = (onAdd) => memo(({ data, isConnectable = true }) => {
  const add = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onAdd(data);
  }

  return (
    <div style={stepStyle} className="step-container">
      <Handle id="target" type="target" position="top" isConnectable={isConnectable} />
      <div className="step-content">
        {data.label} &nbsp;
        <button onClick={add} className="step-add">+</button>
      </div>
      <Handle
        id="source"
        type="source"
        position="bottom"
        isConnectable={isConnectable}
      />
      <Handle
        id="loopback"
        type="target"
        position="right"
        isConnectable={isConnectable}
      />
    </div>
  )
});
