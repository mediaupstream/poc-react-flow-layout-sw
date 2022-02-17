import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getRecipes } from "../fetch";

const Note = ({ children }) => (
  <div style={{ margin: '1.5rem 0', maxWidth: '600px', padding: '1.4rem', background: '#f5fff5', lineHeight: '1.4rem', borderRadius: 4, fontSize: '0.9rem' }}>
  {children}
  </div>
)

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

      <Note>
        <em><strong>Note:</strong></em> You can drill down into a STEP by double clicking on it
      </Note>
      <Note>
        You can toggle the layout between 'existing' and 'auto':<br />
        - <strong>Existing</strong> layout will use the x/y values from each step to render the layout.
        <br />
        - <strong>Auto</strong> layout will generate the x/y values for each step based on a derived heirarchy (using the links between steps and transitions)
      </Note>
    </div>
  )
}
