import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { ReactFlowProvider } from "react-flow-renderer";

import Recipe from './pages/Recipe';
import Recipes from './pages/Recipes';

const RC = (props) => <Recipe {...props} />
const UP = (props) => <Recipe {...props} />
const OP = (props) => <Recipe {...props} />

const withRecipe = (props, Component) => (
  <ReactFlowProvider>
    <Component {...props} />
  </ReactFlowProvider>
)

export default function MyRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Recipes />} />
        <Route path='/recipe' element={<Recipes />} />
        <Route
          path="/recipe/:id"
          element={withRecipe({ key: 'recipe', recipeType: 0 }, RC)}
        />
        <Route
          path="/unit_procedure/:id"
          element={withRecipe({ key: 'unit_procedure', recipeType: 1 }, UP)}
        />
        <Route
          path="/operation/:id"
          element={withRecipe({ key: 'operation', recipeType: 2 }, OP)}
        />
      </Routes>
    </Router>
  )
}
