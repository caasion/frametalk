/**
 * Evaluate API route – Azure Pronunciation Assessment
 *
 * POST /api/evaluate
 * Body: FormData with:
 *   - audio: WAV file blob
 *   - target_sentence: string
 *
 * Response: {
 *   target: string,
 *   overall_accuracy: number,
 *   words: Array<{ word: string, accuracy_score: number, is_omitted: boolean }>
 * }
 */

import { NextRequest, NextResponse } from "next/server";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WordResult {
  word: string;
  accuracy_score: number;
  is_omitted: boolean;
}

interface AzureWordEntry {
  word: string;
  accuracyScore: number;
  errorType: string;
}

interface AssessmentResult {
  words: WordResult[];
  overall_accuracy: number;
}

// ---------------------------------------------------------------------------
// Core assessment function
// ---------------------------------------------------------------------------

async function assessPronunciation(
  audioBuffer: Buffer,
  referenceText: string
): Promise<AssessmentResult> {
  const speechKey = process.env.AZURE_SPEECH_KEY;
  const speechRegion = process.env.AZURE_SPEECH_REGION;

  if (!speechKey || !speechRegion) {
    throw new Error(
      "AZURE_SPEECH_KEY and AZURE_SPEECH_REGION environment variables must be set."
    );
  }

  // -- Speech config --------------------------------------------------------
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    speechKey,
    speechRegion
  );
  speechConfig.speechRecognitionLanguage = "en-US";

  // -- Push audio stream (WAV) ----------------------------------------------
  const pushStream = sdk.AudioInputStream.createPushStream();
  pushStream.write(audioBuffer);
  pushStream.close();

  const audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);

  // -- Pronunciation assessment config --------------------------------------
  const pronunciationConfig = new sdk.PronunciationAssessmentConfig(
    referenceText,
    sdk.PronunciationAssessmentGradingSystem.HundredMark,
    sdk.PronunciationAssessmentGranularity.Word,
    true // enable miscue detection (omissions / insertions)
  );

  // -- Recogniser -----------------------------------------------------------
  const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
  pronunciationConfig.applyTo(recognizer);

  // -- Run continuous recognition -------------------------------------------
  const allWords: AzureWordEntry[] = [];

  const result = await new Promise<void>((resolve, reject) => {
    recognizer.recognized = (_sender, event) => {
      if (
        event.result.reason === sdk.ResultReason.RecognizedSpeech &&
        event.result.text
      ) {
        const pronResult =
          sdk.PronunciationAssessmentResult.fromResult(event.result);
        const detailJson = event.result.properties.getProperty(
          sdk.PropertyId.SpeechServiceResponse_JsonResult
        );

        try {
          const detail = JSON.parse(detailJson);
          const nBest = detail?.NBest?.[0];
          if (nBest?.Words) {
            for (const w of nBest.Words) {
              allWords.push({
                word: w.Word,
                accuracyScore: w.PronunciationAssessment?.AccuracyScore ?? 0,
                errorType:
                  w.PronunciationAssessment?.ErrorType ?? "None",
              });
            }
          }
        } catch {
          // Fallback: try the SDK's built-in word list
          if (pronResult?.detailResult?.pronunciationAssessment) {
            // Use the raw JSON approach above as primary
          }
        }
      }
    };

    recognizer.canceled = (_sender, event) => {
      if (event.reason === sdk.CancellationReason.Error) {
        reject(new Error(`Recognition canceled: ${event.errorDetails}`));
      }
      resolve();
    };

    recognizer.sessionStopped = () => {
      resolve();
    };

    recognizer.startContinuousRecognitionAsync(
      () => {
        // Started – wait for events
      },
      (err) => reject(new Error(err))
    );

    // Safety timeout: stop after 30 seconds
    setTimeout(() => {
      recognizer.stopContinuousRecognitionAsync(
        () => resolve(),
        () => resolve()
      );
    }, 30_000);
  });

  recognizer.stopContinuousRecognitionAsync();

  // -- Build per-word results -----------------------------------------------
  const refWords = referenceText.match(/[a-zA-Z']+/g) ?? [];
  const wordResults: WordResult[] = [];
  let recognisedIdx = 0;

  for (const refWord of refWords) {
    if (recognisedIdx < allWords.length) {
      const entry = allWords[recognisedIdx];

      if (entry.errorType === "Omission") {
        wordResults.push({
          word: refWord,
          accuracy_score: 0,
          is_omitted: true,
        });
      } else {
        wordResults.push({
          word: entry.word,
          accuracy_score: Math.round(entry.accuracyScore * 10) / 10,
          is_omitted: false,
        });
      }
      recognisedIdx++;
    } else {
      // Remaining reference words were never spoken → omitted
      wordResults.push({
        word: refWord,
        accuracy_score: 0,
        is_omitted: true,
      });
    }
  }

  // Overall accuracy = average of non-omitted word scores
  const scored = wordResults
    .filter((w) => !w.is_omitted)
    .map((w) => w.accuracy_score);
  const overallAccuracy =
    scored.length > 0
      ? Math.round((scored.reduce((a, b) => a + b, 0) / scored.length) * 10) /
        10
      : 0;

  return { words: wordResults, overall_accuracy: overallAccuracy };
}

// ---------------------------------------------------------------------------
// Route handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("audio") as File | null;
    const targetSentence = formData.get("target_sentence") as string | null;

    if (!targetSentence?.trim()) {
      return NextResponse.json(
        { error: "target_sentence is required" },
        { status: 400 }
      );
    }

    if (!audioFile || audioFile.size === 0) {
      return NextResponse.json(
        { error: "audio file is required and must not be empty" },
        { status: 400 }
      );
    }

    const arrayBuffer = await audioFile.arrayBuffer();
    const audioBuffer = Buffer.from(arrayBuffer);

    const result = await assessPronunciation(audioBuffer, targetSentence);

    return NextResponse.json({
      target: targetSentence,
      overall_accuracy: result.overall_accuracy,
      words: result.words,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      { error: `Pronunciation assessment failed: ${message}` },
      { status: 500 }
    );
  }
}
