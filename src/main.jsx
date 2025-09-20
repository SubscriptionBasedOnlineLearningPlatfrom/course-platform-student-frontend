import React from "react"; // ADD THIS
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { CourseProvider } from "./contexts/CourseContext.jsx";
import { ApiProvider } from "./contexts/ApiContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <CourseProvider>
      <ApiProvider>
        <App />
      </ApiProvider>  
    </CourseProvider>
  </BrowserRouter>
);
