/* eslint-disable no-restricted-globals */
// eslint-disable-next-line no-unused-vars
import { useState, useEffect } from "react";
import detectLanguage from "./initializeLanguageDetector";
import translateText from "./translateText";
import Input from "./JsComponent/Input";
import SummarizerText from "./initializeSummarizer";
import Interface from "./Interface";

function App() {
  const [errorMsg, setErrorMsg] = useState("");
  // const [errorLog, setErrorLog] = useState("");
  const [text, setText] = useState("");
  const [outputTexts, setOutputTexts] = useState([]);
  const [theme, setTheme] = useState("dark");

  //   try {
  //     const translatorCapabilities = await self.ai.translator.capabilities();

  //     const isAvailable = await translatorCapabilities.languagePairAvailable(
  //       sourceLang,
  //       targetLang
  //     );

  //     let translator;

  //     if (!isAvailable) {
  //       // setErrorLog("Translation for this language pair is not available.");
  //       console.log("Translation for this language pair is not available.");
  //       return;
  //     }

  //     if (translatorCapabilities.capabilities === "readily") {
  //       translator = await self.ai.translator.create({
  //         sourceLanguage: sourceLang,
  //         targetLanguage: targetLang,
  //       });
  //     } else {
  //       translator = await self.ai.translator.create({
  //         sourceLanguage: sourceLang,
  //         targetLanguage: targetLang,
  //         monitor(m) {
  //           m.addEventListener("downloadprogress", (e) => {
  //             console.log(`Downloaded ${e.loaded} of ${e.total} bytes.`);
  //           });
  //         },
  //       });
  //       await translator.ready;
  //     }

  //     const translatedText = await translator.translate(text);
  //     console.log(`Translated Text: ${translatedText}`);
  //     return translatedText;
  //   } catch (error) {
  //     console.error("Error translating text:", error);
  //   }
  // }

  ///summarization

  function handleChange(e) {
    setText(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (text.trim() === "") {
      setErrorMsg("baba write something down");
      return;
    } else {
      setErrorMsg("");
      const detectedLang = await detectLanguage(text);
      setOutputTexts([...outputTexts, { text, detectedLang }]);
      setText("");
    }
  }

  function handleTheme() {
    setTheme((curTheme) => (curTheme === "dark" ? "" : "dark"));
  }
  return (
    <main className={theme === "dark" ? "bg-dark" : "bg-light"}>
      <Header handleTheme={handleTheme} themeState={theme} />
      <Interface
        outputTexts={outputTexts}
        translateText={translateText}
        handleSummerizer={SummarizerText}
      />
      <Input
        errorMsg={errorMsg}
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

export default App;
