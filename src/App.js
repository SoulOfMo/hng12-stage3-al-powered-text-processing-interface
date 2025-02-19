/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";

function App() {
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [sourceLang, setSourceLang] = useState("");
  // eslint-disable-next-line no-unused-vars
  const [targetLang, setTargetLang] = useState("");
  const [text, setText] = useState("");
  const [outputTexts, setOutputTexts] = useState([]);
  const [lang, setLang] = useState("en");
  const [darkTheme, setDarkTheme] = useState("dark");

  async function initializeLanguageDetector() {
    try {
      const languageDetectorCapabilities =
        await self.ai.languageDetector.capabilities();
      const canDetect = languageDetectorCapabilities.capabilities;
      let detector;

      if (canDetect === "no") {
        console.log("Language detector is not available.");
        setError("Language detector is not available.");
        return null;
      }

      if (canDetect === "readily") {
        detector = await self.ai.languageDetector.create();
      } else {
        detector = await self.ai.languageDetector.create({
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await detector.ready;
      }
      return detector;
    } catch (error) {
      console.error("Error initializing language detector:", error);
      setError("Error initializing language detector");
      return null;
    }
  }

  async function detectLanguage(text) {
    const detector = await initializeLanguageDetector();
    if (!detector) return;

    try {
      const result = (await detector.detect(text))[0];
      const detectedLanguage = result.detectedLanguage;

      return detectedLanguage;
    } catch (error) {
      console.error("Error detecting language:", error);
      return "unknown";
    }
  }

  async function translateText(text, sourceLang, targetLang) {
    try {
      const translatorCapabilities = await self.ai.translator.capabilities();
      const isAvailable = translatorCapabilities.languagePairAvailable(
        sourceLang,
        targetLang
      );
      let translator;

      if (!isAvailable) {
        setError("Translation for this language pair is not available.");
        console.log("Translation for this language pair is not available.");
        return;
      }

      if (translatorCapabilities.capabilities === "readily") {
        translator = await self.ai.translator.create({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
        });
      } else {
        translator = await self.ai.translator.create({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          monitor(m) {
            m.addEventListener("downloadprogress", (e) => {
              console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
            });
          },
        });
        await translator.ready;
      }

      const translatedText = await translator.translate(text);
      console.log(`Translated Text: ${translatedText}`);
      return translatedText;
    } catch (error) {
      console.error("Error translating text:", error);
    }
  }

  ///summarization
  async function initializeSummarizer() {
    const options = {
      // sharedContext: "This is a scientific article",
      type: "tl;dr",
      format: "plain-text",
      length: "short",
    };

    const available = (await self.ai.summarizer.capabilities()).available;
    let summarizer;
    if (available === "no") {
      console.log("The Summarizer API isn't usable. ");
      // The Summarizer API isn't usable.
      return;
    }
    if (available === "readily") {
      // The Summarizer API can be used immediately .
      summarizer = await self.ai.summarizer.create(options);
    } else {
      // The Summarizer API can be used after the model is downloaded.
      summarizer = await self.ai.summarizer.create(options);
      summarizer.addEventListener("downloadprogress", (e) => {
        console.log(e.loaded, e.total);
      });
      await summarizer.ready;
    }
    console.log("Summarizer is ready!");
    return summarizer;
  }

  async function SummarizerText(text) {
    const summarizer = await initializeSummarizer();
    if (!summarizer) {
      console.log("Summarizer couldn't be initialized.");
      return;
    }

    const summary = await summarizer.summarize(text, {
      context: "This article is intended for a tech-savvy audience.",
    });

    console.log("Summary:", summary);
    return summary;
  }

  // Example usage
  // detectLanguage("Hallo und herzlich willkommen!");
  // translateText("Where is the next bus stop, please?", "en", "fr");
  // detectLanguage(`Où est le prochain arrêt de bus, s'il vous plaît ?`);
  // detectLanguage(`Cómo estás`);

  // translateText("How are you", "en", "fr");
  // translateText("How are you?", "en", "ja");
  // translateText("How are you?", "en", "pt");

  // translateText("How are you?", "en", "ru");
  // translateText("How are you?", "en", "es");
  // translateText("How are you?", "en", "tr");
  // translateText("How are you?", "en", "hi");
  // translateText("How are you?", "en", "vi");
  // translateText("How are you?", "en", "bn");

  // const [formData, setFormData] = useState({
  //   text: "",
  //   translateText: "",
  // });

  function handleChange(e) {
    setText(e.target.value);
  }

  function handleLang(e) {
    e.preventDefault();
    setLang(e.target.value);
    console.log(text, sourceLang, e.target.value);
    translateText(text, sourceLang, e.target.value);
    // translateText("How are you", "en", "fr");
  }
  // 1. it is not coverting to other lang
  // debug in the console
  // 2. when i click on the select button, it should set the text to the text of the particular output container and and the value of the select should not chnage for the other output componenet instance, the translate text should be for select output component
  async function handleSubmit(e) {
    e.preventDefault();
    if (text.trim()) {
      const detectedLang = await detectLanguage(text);
      setOutputTexts([...outputTexts, { text, detectedLang }]);
      setText("");
    }
  }

  function handleTheme() {
    setDarkTheme((curTheme) => (curTheme === "dark" ? "" : "dark"));
  }
  return (
    <main className={darkTheme === "dark" ? "bg-dark" : "bg-light"}>
      <Header handleTheme={handleTheme} themeState={darkTheme} />
      <Interface
        outputTexts={outputTexts}
        handleLang={handleLang}
        lang={lang}
        sourceLang={sourceLang}
        translateText={translateText}
        handleSummerizer={SummarizerText}
      />
      <Input
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        text={text}
      />
    </main>
  );
}

function Header({ themeState, handleTheme }) {
  return (
    <header>
      <h1>Al Powered Text Processing Interface</h1>
      <div className="toggle" onClick={handleTheme}>
        {themeState === "dark" ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
            <path
              fill="#F8F9FA"
              fill-rule="evenodd"
              d="M13 0c.81 0 1.603.074 2.373.216C10.593 1.199 7 5.43 7 10.5 7 16.299 11.701 21 17.5 21c2.996 0 5.7-1.255 7.613-3.268C23.22 22.572 18.51 26 13 26 5.82 26 0 20.18 0 13S5.82 0 13 0z"
            />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26">
            <path
              fill="#2D2D2D"
              fill-rule="evenodd"
              d="M13 21a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-5.657-2.343a1 1 0 010 1.414l-2.121 2.121a1 1 0 01-1.414-1.414l2.12-2.121a1 1 0 011.415 0zm12.728 0l2.121 2.121a1 1 0 01-1.414 1.414l-2.121-2.12a1 1 0 011.414-1.415zM13 8a5 5 0 110 10 5 5 0 010-10zm12 4a1 1 0 110 2h-3a1 1 0 110-2h3zM4 12a1 1 0 110 2H1a1 1 0 110-2h3zm18.192-8.192a1 1 0 010 1.414l-2.12 2.121a1 1 0 01-1.415-1.414l2.121-2.121a1 1 0 011.414 0zm-16.97 0l2.121 2.12A1 1 0 015.93 7.344L3.808 5.222a1 1 0 011.414-1.414zM13 0a1 1 0 011 1v3a1 1 0 11-2 0V1a1 1 0 011-1z"
            />
          </svg>
        )}
      </div>
    </header>
  );
}

function Interface({
  outputTexts,
  handleLang,
  lang,
  translatedText,
  sourceLang,
  translateText,
  handleSummerizer,
}) {
  return (
    <div className="interface">
      {outputTexts.map((result, id) => (
        <Output
          result={result}
          handleLang={handleLang}
          translatedText={translatedText}
          lang={lang}
          key={id}
          sourceLang={sourceLang}
          translateText={translateText}
          detectedLang={result.detectedLang}
          handleSummerizer={handleSummerizer}
        />
      ))}
    </div>
  );
}

function Input({ handleSubmit, handleChange, text }) {
  return (
    <form className="input-container">
      <label htmlFor="request">Special request?</label>
      <textarea
        id="request"
        name="request"
        placeholder="Textarea"
        value={text}
        onChange={handleChange}
        // maxLength={100}
      ></textarea>
      <button type="submit" onClick={handleSubmit} aria-label="submit-btn">
        Submit
      </button>
    </form>
  );
}

function Output({ result, detectedLang, translateText, handleSummerizer }) {
  // eslint-disable-next-line no-unused-vars
  const [selectedLang, setSelectedLang] = useState("en");
  const [translatedText, setTranslatedText] = useState("");
  const [summarizedText, setSummarizedText] = useState("");
  const [sourceLang] = useState(detectedLang);

  const getLanguageName = (code) =>
    new Intl.DisplayNames(["en"], { type: "language" }).of(code);

  async function handleLangChange(e) {
    const newLang = e.target.value;
    setSelectedLang(newLang);
    console.log("Translating:", result, "From:", sourceLang, "To:", newLang);
    console.log(result.text.length);
    const translated = await translateText(result.text, sourceLang, newLang);
    setTranslatedText(translated);
  }

  async function handleSummarize() {
    const summarized = await handleSummerizer(result.text);
    console.log(summarized);
    setSummarizedText(summarized);
  }

  return (
    <div className="outputs">
      <div className="results">
        <div className="input-container">
          <p className="input-text">{result.text}</p>
          <p className="lang-type">
            detected text: {getLanguageName(sourceLang)}
          </p>
        </div>
        <div className="translated-container">
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

        {/* {false && <p className="Summarize-text"></p>
      <p className="translate-text">{translatedText}</p>} */}
      </div>
    </div>
  );
}
export default App;
