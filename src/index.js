import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import StarRating from "./Starcomponent";

function Test(rating) {
  const [newrating, setnewRating] = useState(0);
  return (
    <div>
      <StarRating color="blue" setnewRating={setnewRating} />
      This is the rating it has gotten {newrating}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating
      size="24"
      color="red"
      className={"test"}
      message={["Bad", "Ok", "Good", "Excellent", "qqq"]}
      defaultRating={3}
    /> */}
    {/* <Test /> */}
  </React.StrictMode>
);
