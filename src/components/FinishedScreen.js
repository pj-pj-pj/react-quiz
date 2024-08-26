import { useQuiz } from "../contexts/QuizContext";

function FinishedScreen() {
  const { score, maxScore, highscore, dispatch } = useQuiz();
  const percentage = (score / maxScore) * 100;

  let emoji;
  if (percentage === 100) emoji = "💡";
  if (percentage >= 80 && percentage < 100) emoji = "🎊";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🫠";

  return (
    <>
      <p className="result">
        <span>{emoji}</span>You scored <strong>{score}</strong> out of{" "}
        {maxScore} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(Highscore: {highscore} points)</p>
      <div className="start">
        <button
          className="btn"
          onClick={() => dispatch({ type: "reset" })}
        >
          Reset Quiz
        </button>
      </div>
    </>
  );
}

export default FinishedScreen;
