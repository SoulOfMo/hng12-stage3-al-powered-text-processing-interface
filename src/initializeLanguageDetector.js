/* eslint-disable no-restricted-globals */

export async function initializeLanguageDetector(setErrorMsg) {
  try {
    const languageDetectorCapabilities =
      await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.capabilities;
    let detector;

    if (canDetect === "no") {
      console.log("Language detector is not available.");
      setErrorMsg((prev) => ({
        ...prev,
        languageDetector: "Language detector is not available on this device",
      }));
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
    setErrorMsg((prev) => ({
      ...prev,
      languageDetector: "Failed to initialize language detector.",
    }));
    return null;
  }
}

export default async function detectLanguage(text, setErrorMsg) {
  const detector = await initializeLanguageDetector(setErrorMsg);
  if (!detector) return;

  try {
    const result = (await detector.detect(text))[0];
    const detectedLanguage = result.detectedLanguage;

    return detectedLanguage;
  } catch (error) {
    console.error("Error detecting language:", error);
    setErrorMsg((prev) => ({
      ...prev,
      languageDetector: "Failed to detect language.",
    }));
    return "unknown";
  }
}
