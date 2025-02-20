import Output from "./Output";

export default function Interface({
  outputTexts,
  translatedText,
  translateText,
  handleSummerizer,
}) {
  return (
    <div className="interface">
      {outputTexts.map((result, id) => (
        <Output
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
