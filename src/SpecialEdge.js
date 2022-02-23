import React, { memo } from 'react';
import { EdgeText, getMarkerEnd, getSmoothStepPath } from 'react-flow-renderer';

export default memo(({ style, label, ...props}) => {
  const markerEnd = getMarkerEnd(props.arrowHeadType, props.markerEndId);
  let [centerX, centerY] = [props.targetX, props.sourceY + 20];

  if (props?.data?.loopback) {
    centerX = props.sourceX;
    centerY = props.targetY;
  }

  const path = getSmoothStepPath({
    ...props,
    centerX,
    centerY,
    borderRadius: 0
  });

  if (props?.data?.loopback) {
    console.log(path)
  }

  const text = label ? (
    <EdgeText
      x={centerX}
      y={centerY}
      label={label}
      labelStyle={props.labelStyle}
      labelShowBg={props.labelShowBg}
      labelBgStyle={props.labelBgStyle}
      labelBgPadding={props.labelBgPadding}
      labelBgBorderRadius={props.labelBgBorderRadius}
    />
  ) : null;

  return (
    <>
      <path style={style} className="react-flow__edge-path" d={path} markerEnd={markerEnd} />
      {text}
    </>
  )
});
