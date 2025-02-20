/* eslint-disable no-restricted-globals */
export async function initializeSummarizer() {
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

export default async function SummarizerText(text) {
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
