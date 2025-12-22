import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface SubtitleLine {
  startSec: number;
  endSec: number;
  text: string;
  translation?: string;
}

interface TranscriptJson {
  version: number;
  source: { lang: string };
  target: { lang: string };
  lines: {
    startSec: number;
    endSec: number;
    de: string;
    en: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  private http = inject(HttpClient);

  loadTranscript(url: string): Observable<SubtitleLine[]> {
    return this.http.get<TranscriptJson>(url).pipe(
      map((json) =>
        json.lines.map((l) => ({
          startSec: l.startSec,
          endSec: l.endSec,
          text: l.de,
          translation: l.en,
        }))
      )
    );
  }
}

