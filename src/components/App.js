import { useEffect, useReducer } from "react";

import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import Progress from "./Progress";
import FinishedScreen from "./FinishedScreen";
import Footer from "./Footer";
import Timer from "./Timer";
import NextButton from "./NextButton";

const SECS_PER_QUESTION = 15;

//consists of variables that change and causes change/re-render
const initialState = {
  questions: [],

  // values can be: 'loading', 'error', 'ready', 'active', 'finished'
  status: "loading",
  index: 0,
  answer: null,
  score: 0,
  highscore: 0,
  secondsRemaining: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };
    case "dataFailed":
      return {
        ...state,
        status: "error",
      };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        score:
          action.payload === question.correctOption
            ? state.score + question.points
            : state.score,
      };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finished":
      return {
        ...state,
        status: "finished",
        highscore:
          state.score > state.highscore ? state.score : state.highscore,
      };
    case "reset":
      return {
        ...initialState,
        status: "ready",
        questions: state.questions,
        highscore: state.highscore,
      };
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
}

export default function App() {
  const [
    { status, questions, index, answer, score, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxScore = questions.reduce((prev, cur) => prev + cur.points, 0);

  useReducer(reducer, initialState);
  useEffect(function () {
    fetch("http://localhost:9000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}yio
        {status === "ready" && (
          <StartScreen
            numQuestions={numQuestions}
            dispatch={dispatch}
          />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              answer={answer}
              score={score}
              maxScore={maxScore}
            ></Progress>
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer
                dispatch={dispatch}
                secondsRemaining={secondsRemaining}
              />
              <NextButton
                dispatch={dispatch}
                index={index}
                answer={answer}
                numQuestions={numQuestions}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishedScreen
            score={score}
            maxScore={maxScore}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
