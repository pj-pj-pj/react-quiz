function Progress({ index, numQuestions, score, maxScore, answer }) {
  return (
    <>
      <progress
        max={numQuestions}
        value={index + Number(answer !== null)}
      ></progress>
      <header className="progress">
        <p>
          Question
          <strong> {index + 1} </strong>/ {numQuestions}
        </p>
        <p>
          <strong>{score}</strong> / {maxScore} points
        </p>
      </header>
    </>
  );
}

export default Progress;
