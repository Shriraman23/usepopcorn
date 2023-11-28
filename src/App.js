import { useEffect, useRef, useState } from "react";
import StarRating from "./Starcomponent";
import { useMovies } from "./useMovies";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const Key = "e9446596";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setselectedId] = useState();
  const [watched, setWatched] = useState(function () {
    const storedvalue = localStorage.getItem("watched");
    return JSON.parse(storedvalue);
  });
  const { movies, error, isLoading } = useMovies(query);

  // const tempQuery = "interstellar";
  function handelMovieDetail(id) {
    setselectedId((selectedId) => (id === selectedId ? null : id));
  }
  function handelMovieDetailClose() {
    setselectedId(null);
  }
  function handelAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
    // localStorage.setItem("watched", JSON.stringify([...watched, movie]));
  }
  function handelDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(watched));
    },
    [watched]
  );

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <IsLoadingFn /> : <MovieList movies={movies} />} */}
          {isLoading && <IsLoadingFn />}
          {!isLoading && !error && (
            <MovieList movies={movies} handelMovieDetail={handelMovieDetail} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <>
              <MovieDetails
                selectedId={selectedId}
                handelMovieDetailClose={handelMovieDetailClose}
                onAddWatched={handelAddWatched}
                watched={watched}
                ondelete
              />
            </>
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                ondeleteWatched={handelDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function IsLoadingFn() {
  return <p className="loader">Is Loading</p>;
}
function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}
function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Search({ query, setQuery }) {
  const inputEl = useRef(null);
  // console.log(input);
  useEffect(
    function () {
      inputEl.current.focus();
      function callback(e) {
        if (document.activeElement === inputEl.current) return;
        if (e.code === "Enter") {
          inputEl.current.focus();
          setQuery("");
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [setQuery]
  );
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen1, setIsOpen1] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && children}
    </div>
  );
}
function MovieList({ movies, handelMovieDetail }) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie
          movie={movie}
          key={movie.imdbID}
          handelMovieDetail={handelMovieDetail}
        />
      ))}
    </ul>
  );
}
function Movie({ movie, handelMovieDetail }) {
  return (
    <li onClick={() => handelMovieDetail(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

// function WatchedBox() {
//   const [isOpen2, setIsOpen2] = useState(true);

//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
function MovieDetails({
  selectedId,
  handelMovieDetailClose,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setuserRating] = useState("");

  const watchedUserRating = watched.find(
    (wmovie) => wmovie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  // if (!selectedId) {
  //   document.title = "usePopcorn";
  // }
  // if (title) {
  //   document.title = `${title}`;
  // }
  // if (!title) {
  //   document.title = "usePopcorn";
  // }

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          handelMovieDetailClose();
          console.log("close");
        }
      }
      document.addEventListener("keydown", callback);
      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [handelMovieDetailClose]
  );

  function handelAdd() {
    // !watched.find((wmovie) => wmovie.imdbID === imdbID)?
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };
    onAddWatched(newWatchedMovie);
    handelMovieDetailClose();
  }

  useEffect(
    function () {
      async function getMovieDetails() {
        setIsLoading(true);
        console.log(isLoading);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${Key}&i=${selectedId}`
        );
        const data = await res.json();

        setMovie(data);
        setIsLoading(false);
      }
      getMovieDetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `${title}`;
      return function () {
        document.title = "usePopcorn";
      };
    },
    [title]
  );
  return (
    <div className="details">
      {isLoading ? (
        <IsLoadingFn />
      ) : (
        <>
          <header>
            <button
              className="btn-back "
              onClick={() => handelMovieDetailClose()}
            >
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie `} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!watched.find((wmovie) => wmovie.imdbID === selectedId) ? (
                <>
                  <StarRating max={10} size="24" setnewRating={setuserRating} />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handelAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>You already rated the movie with {watchedUserRating}</p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}
function WatchedMoviesList({ watched, ondeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          ondeleteWatched={ondeleteWatched}
        />
      ))}
    </ul>
  );
}
function WatchedMovie({ movie, ondeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.Title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button
          className="btn-delete"
          onClick={() => ondeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}

// const tempMovieData = [
//     {
//       imdbID: "tt1375666",
//       Title: "Inception",
//       Year: "2010",
//       Poster:
//         "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     },
//     {
//       imdbID: "tt0133093",
//       Title: "The Matrix",
//       Year: "1999",
//       Poster:
//         "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//     },
//     {
//       imdbID: "tt6751668",
//       Title: "Parasite",
//       Year: "2019",
//       Poster:
//         "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//     },
//   ];

//   const tempWatchedData = [
//     {
//       imdbID: "tt1375666",
//       Title: "Inception",
//       Year: "2010",
//       Poster:
//         "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//       runtime: 148,
//       imdbRating: 8.8,
//       userRating: 10,
//     },
//     {
//       imdbID: "tt0088763",
//       Title: "Back to the Future",
//       Year: "1985",
//       Poster:
//         "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//       runtime: 116,
//       imdbRating: 8.5,
//       userRating: 9,
//     },
//   ];
