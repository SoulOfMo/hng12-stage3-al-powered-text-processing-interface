import Output from "./Output";

export default function Interface({
  errorMsg,
  outputTexts,
  translatedText,
  translateText,
  handleSummerizer,
}) {
  return (
    <div className="interface">
      {outputTexts.map((result, id) => (
        <Output
          errorMsg={errorMsg}
          result={result}
          translatedText={translatedText}
          key={id}
          translateText={translateText}
          detectedLang={result.detectedLang}
          handleSummerizer={handleSummerizer}
        />
      ))}
    </div>
  );
}
