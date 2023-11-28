import { useState, useEffect } from "react";
const Key = "e9446596";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchmovies() {
        try {
          setError("");
          setIsLoading(true);
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${Key}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong when fetching movies");

          const data = await res.json();
          console.log(data.Search);

          if (data.Response === "False") {
            throw new Error("check the spelling bro");
          }
          setMovies(data.Search);
          setIsLoading(false);
        } catch (err) {
          if (err.name !== "AbortError") setError(err.message);
        } finally {
          setIsLoading(false);
        }
        // if (query.length < 3) {
        //   setMovies([]);
        //   setError("");
        //   return;
        // }
      }
      if (query.length < 3) {
        console.log("before search");
        setMovies([]);
        setError("");
        return;
      }
      //   handelMovieDetailClose();
      fetchmovies();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { movies, isLoading, error };
}
