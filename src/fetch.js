import axios from "axios";

export const baseURL = "https://sw-recipe-builder-dev.azurewebsites.net/";
const fetch = axios.create({
  baseURL,
});

export const getRecipes = () => fetch(`recipe`)
export const getRecipe = id => fetch(`recipe/${id}`)
export const getUnitProcedure = id => fetch(`unit_procedure/${id}`)
export const getOperation = id => fetch(`operation/${id}`)

export default fetch;
