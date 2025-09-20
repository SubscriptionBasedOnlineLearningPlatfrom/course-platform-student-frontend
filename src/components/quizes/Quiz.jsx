import {QuizCreation } from "./QuizCreation.jsx";
import React from "react";
import { quiz } from "./Quizes.jsx";

export const QuizComponent = () => {
  return (
    <div>
        <QuizCreation quiz={quiz}/>
    </div>
  );
};
