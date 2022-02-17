/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from "react";
import ReactFlow, { removeElements } from "react-flow-renderer";
import { useParams, useLocation, useNavigate } from "react-router-dom";

import { Step, Transition } from "../Nodes";
import { processRecipe, connect  } from "../data";
import computeLayout from '../layout';
import { getRecipe, getUnitProcedure, getOperation } from '../fetch';

// test data:
// import mockRecipe from '../data/recipe.json';
// import mockOperation from '../data/op.json';
// import mockUnitProcedure from '../data/up.json';

const recipeLevels = [
  getRecipe,
  getUnitProcedure,
  getOperation
]

const LayoutFlow = ({ recipeType = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [autoLayout, setAuto] = useState(location?.state?.autoLayout || false);
  const [recipe, setRecipe] = useState(null);
  const [instance, setInstance] = useState(null);
  const [elements, setElements] = useState(null);

  const levelTitle = (() => {
    switch(recipeType) {
      case 0: return 'Recipe';
      case 1: return 'Unit Procedure';
      case 2: return 'Operation';
    }
  })()

  const BackBtn = () => {
    return (
      <>
        <button onClick={() => navigate(-1)}>{'<'}</button>
        &nbsp; &nbsp;
      </>
    )
  }

  // fetch recipe by level (recipe, unit procedure, operation)
  React.useEffect(() => {
    const query = recipeLevels[recipeType];
    if (query) {
      query(id)
        .then(({ data }) => {
          console.log('fetch remote data', data);
          setRecipe(data);
          setElements(
            computeLayout(processRecipe(data), autoLayout)
          );
        })
        .catch(console.log)
    }
  }, [])

  const toggleAutoLayout = () => {
    console.log('toggle layout', !autoLayout);
    setAuto(n => !n);
    setElements([
      ...computeLayout(processRecipe(recipe), !autoLayout)
    ]);
  }

  const onConnect = ({ source, target, sourceHandle }) => {
    const edge = connect(source, target, sourceHandle === 'loopback');
    setElements(n => computeLayout([...n, edge]));
  }

  const onElementsRemove = (elementsToRemove) => {
    setElements((els) => removeElements(elementsToRemove, els));
  }

  const onSave = useCallback(() => {
    if (instance) {
      const flow = instance.toObject();
      console.log(flow)
    }
  }, [instance]);

  const handleLoadRecipe = (_, { type, data }) => {
    if (type === 'step' && data?.ref?.link_id) {
      let path;
      switch(recipeType) {
        case 0: path = 'unit_procedure'; break;
        case 1: path = 'operation'; break;
      }
      if (path) {
        const id = data.ref.link_id;
        navigate(`/${path}/${id}`, { state: { autoLayout }})
      }
    }
  }

  console.log('recipe state', {
    id,
    recipeType,
    recipe,
    elements
  })

  if (!elements) {
    return <div className="layoutflow" style={{ textAlign: 'center', padding: '10rem' }}>
      Loading...
    </div>
  }

  return (
    <div className="layoutflow" key={`${id}-${recipeType}`}>
      <h2 style={{
        background: '#eee',
        padding: '1rem',
        margin: 0,
        fontSize: '1rem'
      }}>
      <BackBtn />
      {levelTitle}: {recipe.name}
      </h2>
      <ReactFlow
        nodesDraggable={true}
        elements={elements}
        onConnect={onConnect}
        onElementsRemove={onElementsRemove}
        connectionLineType="step"
        onLoad={setInstance}
        onNodeDoubleClick={handleLoadRecipe}
        nodeTypes={{
          step: Step,
          transition: Transition
        }}
      />
      <div className="save__controls" style={{
        position: 'absolute',
        top: 0,
        right: 0,
        padding: '1rem',
        zIndex: 9999
      }}>
        {/* <button onClick={onSave}>save</button>
        &nbsp; | &nbsp; */}
        <button onClick={toggleAutoLayout}>layout: {autoLayout ? 'auto' : 'existing'}</button>
      </div>
    </div>
  );
};

export default LayoutFlow;
