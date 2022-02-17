import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Recipe from './pages/Recipe';
import Recipes from './pages/Recipes';

export default function MyRoutes() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Recipes />} />
        <Route path='/recipe' element={<Recipes />} />
        <Route
          path="/recipe/:id"
          element={<Recipe key='recipe' recipeType={0} />}
        />
        <Route
          path="/unit_procedure/:id"
          element={<Recipe key='unit_procedure' recipeType={1} />}
        />
        <Route
          path="/operation/:id"
          element={<Recipe key='operation' recipeType={2} />}
        />
      </Routes>
    </Router>
  )
}
