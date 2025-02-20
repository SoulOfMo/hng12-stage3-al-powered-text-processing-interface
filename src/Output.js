import { useState } from "react";

export default function Output({
  result,
  detectedLang,
  translateText,
  handleSummerizer,
}) {
  const [selectedLang, setSelectedLang] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLang] = useState(detectedLang);

  const getLanguageName = (code) =>
    new Intl.DisplayNames(["en"], { type: "language" }).of(code);

  async function handleLangChange(e) {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    console.log(
      "Translating:",
      result.text,
      "From:",
      sourceLang,
      "To:",
      newLang
    );

    const translated = await translateText(result.text, sourceLang, newLang);
    setTranslatedText(translated);
    setIsTranslating(true);
  }

  async function handleSummarize() {
    const summarized = await handleSummerizer(result.text);
    console.log(summarized);
    if (!summarized) {
      console.error("Summarizer API is not available.");
      return;
    }
    setSummarizedText(summarized);
  }

  return (
    <div className="outputs-section">
      <div className="results">
        <div className="output-container">
          <p className="output-text">{result.text}</p>
          <p className="lang-type">
            detected language: {getLanguageName(sourceLang)}
          </p>
        </div>
        <div className="translated-container">
          {isTranslating && (
            <span> Translated to {getLanguageName(selectedLang)}</span>
          )}
          <p className="translate-text">{translatedText}</p>
          <div className="action-btn">
            <select onChange={handleLangChange}>
              <option value="" hidden>
                Translate
              </option>
              <option value="en">English</option>
              <option value="pt">Portuguese</option>
              <option value="es">Spanish</option>
              <option value="ru">Russian</option>
              <option value="tr">Turkish</option>
              <option value="fr">French</option>
            </select>
          </div>
        </div>
        <div className="summarized-container">
          <p className="summarize-text">{summarizedText}</p>
          {result.text.length > 150 && (
            <button onClick={handleSummarize}>Summarize</button>
          )}
        </div>
      </div>
    </div>
  );
}
