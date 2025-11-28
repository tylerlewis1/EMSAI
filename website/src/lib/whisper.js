import { pipeline } from '@huggingface/transformers';

// Allocate pipeline
export default async function loadWhisperModel() {
  const pipe = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny');
  console.log('Whisper model loaded: ' + pipe);
  return pipe;
}