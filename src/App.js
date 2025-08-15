import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [recipes, setRecipes] = useState([]);
  const [searchInput, setSearchInput] = useState([]);
  const [showrecipes, setShowRecipes] = useState(false); //blur and focus
  const [cache, setCache] = useState({}); //lien store cache result to optimize the api call

  const fetchData = async () => {
    if (cache[searchInput]) {
      console.log("cache", searchInput);
      setRecipes(cache[searchInput]);
      return;
    }

    console.log("api call", searchInput);
    const data = await fetch(
      "https://dummyjson.com/recipes/search?q=" + searchInput
    );
    const jsonData = await data.json();
    setRecipes(jsonData?.recipes);
    setCache((prev) => ({ ...prev, [searchInput]: jsonData?.recipes }));
  };

  useEffect(() => {
    const timer = setTimeout(fetchData, 300);
    return () => {
      clearTimeout(timer);
    };
  }, [searchInput]);
  return (
    <div className="App">
      <h1>Auto Complete Search Bar</h1>
      <div>
        <input
          type="text"
          className="search-input"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setShowRecipes(true)}
          onBlur={() => setShowRecipes(false)}
        />
      </div>
      {showrecipes && (
        <div className="res-container">
          {recipes.map((r) => (
            <span className="result" key={r.id}>
              {r.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
