import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../fetch";

export default function RecipesPage() {
  const [list, setList] = useState([]);

  React.useEffect(() => {
    getRecipes()
      .then(({ data }) => {
        setList(data);
      })
      .catch(console.log);
  }, [])

  return (
    <div style={{ padding: '10rem' }}>
    <h2>Recipes list</h2>
    <ul id='recipe-list'>
      {list.map(({ id, name }) =>
        <li key={`link-${id}-${name}`}>
          <Link to={`/recipe/${id}`}>{ name }</Link>
        </li>
      )}
    </ul>
    <div style={{ marginTop: '3rem', maxWidth: '35%', padding: '1.4rem', background: '#e0ffe0', lineHeight: '1.4rem', borderRadius: 4 }}>
      Note: You can drill down into a STEP by double clicking on it. Navigate using your browser forward / back buttons.
    </div>
    </div>
  )
}
