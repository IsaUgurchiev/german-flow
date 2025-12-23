export type LessonLevel = 'A1' | 'A2' | 'B1';

export interface LessonMeta {
  id: string;
  title: string;
  level: LessonLevel;
  durationMin: number;
  thumbnailUrl?: string; // Optional for now
  videoSrc: string;      // relative path: e.g., assets/lessons/{id}/video.mp4
  subtitlesSrc: string;  // relative path: e.g., assets/transcripts/{id}.transcript.en.json
  exercisesSrc?: string; // path to exercises JSON: assets/exercises/exercises-{id}.json
}

