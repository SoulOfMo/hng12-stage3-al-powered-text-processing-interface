/* eslint-disable no-restricted-globals */

export default async function translateText(text, sourceLang, targetLang) {
  try {
    const translatorCapabilities = await self.ai.translator.capabilities();

    const isAvailable = await translatorCapabilities.languagePairAvailable(
      sourceLang,
      targetLang
    );

    let translator;

    if (!isAvailable) {
      // setErrorLog("Translation for this language pair is not available.");
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
