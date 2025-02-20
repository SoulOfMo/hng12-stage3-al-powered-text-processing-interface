/* eslint-disable no-restricted-globals */

export async function initializeLanguageDetector() {
  try {
    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.capabilities;
    let detector;
    let errorlog;
    if (canDetect === "no") {
      console.log("Language detector is not available.");
      errorlog = "Language detector is not available.";
      return errorlog;
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
    // setErrorLog("Error initializing language detector");
    return null;
  }
}

export default async function detectLanguage(text) {
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
