import { useState } from "react";

export default function Output({
  errorMsg,
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
  const [translatorError, setTranslatorError] = useState("");
  const [summarizerError, setSummarizerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [translatorLoading, setTranslatorLoading] = useState(false);

  const getLanguageName = (code) =>
    new Intl.DisplayNames(["en"], { type: "language" }).of(code);

  async function handleLangChange(e) {
    setTranslatorLoading(true);
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
    if (sourceLang === newLang) {
      setTranslatorError("Same Language selected");
      setIsTranslating(false);
      setTranslatorLoading(false);
      return;
    }

    setTranslatorError("");

    try {
      const translated = await translateText(result.text, sourceLang, newLang);
      setTranslatedText(translated);
      setIsTranslating(true);
    } catch (error) {
      console.error("Translation error:", error);
      setTranslatorError("Failed to translate text.");
    } finally {
      setTranslatorLoading(false);
    }
  }

  async function handleSummarize() {
    // Reset summarizer error before starting
    setSummarizerError("");
    setLoading(true);

    try {
      const summarized = await handleSummerizer(result.text);
      if (!summarized) {
        throw new Error("Summarizer API is not available.");
      }
      setSummarizedText(summarized);
    } catch (error) {
      console.error("Summarization error:", error);
      setSummarizerError(error.message || "Failed to summarize the text.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="outputs-section">
      <div className="results">
        <div className="output-container">
          <p className="output-text">{result.text}</p>
          <p
            className={
              errorMsg.languageDetector === ""
                ? "lang-type"
                : "error-msg lang-type"
            }
          >
            detected language:
            {errorMsg.languageDetector === ""
              ? getLanguageName(sourceLang)
              : errorMsg.languageDetector}
          </p>
        </div>
        <div className="translated-container">
          {isTranslating && (
            <span>
              {translatorLoading ? "Translating to " : "Translated to "}
              {getLanguageName(selectedLang)}
            </span>
          )}
          <p className="translate-text">
            {translatorLoading
              ? "Processing..."
              : isTranslating && translatedText}
          </p>
          <div className="select-container">
            <select
              onChange={handleLangChange}
              aria-label="Select target language for translation"
              disabled={translatorLoading}
            >
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
            <span className="error-msg">{translatorError}</span>
          </div>
        </div>
        <div className="summarized-container">
          <p className="summarize-text">{summarizedText}</p>
          {result.text.length > 150 && (
            <button disabled={loading} onClick={handleSummarize}>
              {loading ? "Processing..." : "Summarize"}
            </button>
          )}
          <span className="error-msg">{summarizerError}</span>
        </div>
      </div>
    </div>
  );
}

// const longText =
//   "The UI should look like a chat interface with a textarea field in the bottom of the page and the output field should be the the area above";

// const summary = await summarizer.summarize(longText, {
//   context: "This article is intended for a tech-savvy audience.",
// });
