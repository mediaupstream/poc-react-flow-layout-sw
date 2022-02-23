/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useCallback } from "react";
import ReactFlow, { removeElements, useStoreState, useStoreActions } from "react-flow-renderer";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";

import { Step, Transition, Start, End } from "../Nodes";
import { processRecipe, transition, step, connect, normalizeCoords  } from "../data";
import computeLayout from '../layout';
import { getRecipe, getUnitProcedure, getOperation } from '../fetch';

import SpecialEdge from '../SpecialEdge';

// test data:
// import mockRecipe from '../data/recipe.json';
// import mockOperation from '../data/op.json';
// import mockUnitProcedure from '../data/up.json';

const recipeLevels = [
  getRecipe,
  getUnitProcedure,
  getOperation
]


const Sidebar = ({ recipe, recipeType }) => {
  const steps = recipe.filter(n => n?.type === 'step' && n?.data?.ref?.link_id?.length);
  let path;
  switch(recipeType) {
    case 0: path = 'unit_procedure'; break;
    case 1: path = 'operation'; break;
  }

  const link = (step) => `/${path}/${step?.data?.ref?.link_id}`;
  return (
    <div className="sidebar">
      <ul>
      {steps.map(step => (
        <li key={step.id}>
          {path
            ? <Link to={link(step)}>{step?.data?.label}</Link>
            : <a>{step?.data?.label}</a>
          }
        </li>
      ))}
      </ul>
    </div>
  )
}

const newId = ((id = 0) => () => {
  id++
  return id;
})()


const LayoutFlow = ({ recipeType = 0 }) => {
  const [init, setInit] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [autoLayout, setAuto] = useState(location?.state?.autoLayout || true);
  const [recipe, setRecipe] = useState(null);
  const [instance, setInstance] = useState(null);
  const [elements, setElements] = useState(null);
  const nodes = useStoreState((state) => state.nodes)
  const actions = useStoreActions((actions) => actions);

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

  React.useEffect(() => {
    // wait until we have elements, and nodes
    if (elements?.length && nodes?.length && !init) {
      const stepIds = elements.filter(n => !('source' in n)).map(n => n.id);
      const nodeIds = nodes.filter(n => n?.__rf?.height > 0 && n?.__rf?.width > 0).map(n => n.id)
      // wait until all nodes have a computed height/width value
      // and that node ids match all step ids
      const ready =
        nodeIds.length === stepIds.length &&
        nodeIds.every(id => stepIds.includes(id))

      console.log('init', [stepIds.length, nodeIds.length], { stepIds, nodeIds, ready })

      if (ready) {
        // set the computed width/height for elements and compute the layout!
        const res = elements.map(el => {
          if (!stepIds.includes(el.id)) {
            return el
          }
          const { width, height } = (nodes.find(n => n.id === el.id)?.__rf || {})
          return {
            ...el,
            width,
            height
          }
        })
        setInit(true);
        setElements([ ...computeLayout([ ...res], true) ]);
      }
    }
  }, [nodes, elements, init, setElements, setInit])

  // fetch recipe by level (recipe, unit procedure, operation)
  React.useEffect(() => {
    const query = recipeLevels[recipeType];
    if (query) {
      query(id)
        .then(({ data }) => {
          console.log('fetch remote data', data);
          setRecipe(data);
          setElements(
            processRecipe(data)
          );
        })
        .catch(console.log)
    }
  }, [])

  const toggleAutoLayout = () => {
    // setAuto(n => !n);
    setElements(n => [
      ...computeLayout(n, true)
    ]);
  }

  const onConnect = ({ source, target, sourceHandle }) => {
    const edge = connect(source, target, sourceHandle === 'loopback');
    setElements(n => [ ...n, edge ]);
  }

  const onElementsRemove = (elementsToRemove) => {
    setElements(n => [ ...removeElements(elementsToRemove, n) ]);
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

  const onAdd = React.useCallback(data => {
    const id = newId();
    const { operation_id, recipe_id, unit_procedure_id, user_id, x, y } = (data?.ref || {})
    const res = {
      id,
      expression: `${data.label}.STATE = Complete`,
      name: `T${id}_new`,
      operation_id,
      recipe_id,
      unit_procedure_id,
      user_id,
      x,
      y
    }
    const trans = transition(res);
    const edge = connect(data?.ref?.name, res.name);
    console.log('hello from onAdd', { data, id, res, trans, edge })
    setElements(n =>
      [ ...computeLayout([ ...n, trans, edge ], true)]
    );
  }, [setElements, transition, connect, newId, computeLayout])

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

      <Sidebar recipe={elements} recipeType={recipeType} />

      <ReactFlow
        key={`flow-${nodes.length}`}
        style={{
          opacity: init ? 1 : 0,
          marginLeft: '222px'
        }}
        nodesDraggable={true}
        snapToGrid={true}
        elements={elements}
        onConnect={onConnect}
        onElementsRemove={onElementsRemove}
        connectionLineType="step"
        onLoad={setInstance}
        onNodeDoubleClick={handleLoadRecipe}
        edgeTypes={{
          special: SpecialEdge
        }}
        nodeTypes={{
          step: Step(onAdd),
          transition: Transition,
          start: Start,
          end: End,
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
