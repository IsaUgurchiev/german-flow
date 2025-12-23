export interface TranscriptLine {
  time: string;
  text: string;
  translation?: string;
  active?: boolean;
  dimmed?: boolean;
}

export interface VocabRow {
  word: string;
  translation: string;
  level: 'A1' | 'A2';
  added: boolean;
}

export interface VideoPageData {
  xpText: string;
  title: string;
  levelText: string;
  durationText: string;
  transcriptLines: TranscriptLine[];
  vocabRows: VocabRow[];
}

export const videoPageMockData: VideoPageData = {
  xpText: '1,240 XP',
  title: 'Aladdin und die Wunderlampe',
  levelText: 'A2 - Intermediate',
  durationText: '13:33 min',
  transcriptLines: [
    {
      time: '04:05',
      text: 'Hallo! Entschuldigung, ist dieser Platz noch frei?',
      dimmed: true,
    },
    {
      time: '04:12',
      text: 'Guten Morgen, ich hätte gerne einen großen Kaffee.',
      translation: 'Good morning, I would like a large coffee.',
      active: true,
    },
    {
      time: '04:18',
      text: 'Natürlich. Möchten Sie Milch und Zucker dazu?',
    },
    {
      time: '04:22',
      text: 'Ja, bitte. Nur ein bisschen Milch.',
    },
    {
      time: '04:26',
      text: 'Alles klar. Sonst noch etwas?',
    },
    {
      time: '04:30',
      text: 'Vielleicht ein Stück Käsekuchen.',
    },
    {
      time: '04:35',
      text: 'Gute Wahl! Kommt sofort.',
    },
  ],
  vocabRows: [
    {
      word: 'der Kaffee',
      translation: 'Coffee',
      level: 'A1',
      added: false,
    },
    {
      word: 'hätte gerne',
      translation: 'would like',
      level: 'A2',
      added: true,
    },
  ],
};

