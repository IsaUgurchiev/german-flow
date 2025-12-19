import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface SubtitleLine {
  start: number;
  end: number;
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class SubtitleService {
  private http = inject(HttpClient);

  parseVtt(url: string): Observable<SubtitleLine[]> {
    return this.http.get(url, { responseType: 'text' }).pipe(
      map((vttText) => this.parseVttContent(vttText))
    );
  }

  private parseVttContent(vttText: string): SubtitleLine[] {
    const lines = vttText.split(/\r?\n/);
    const subtitles: SubtitleLine[] = [];
    let currentLine: Partial<SubtitleLine> | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line || line === 'WEBVTT') continue;

      if (line.includes('-->')) {
        const [startPart, endPart] = line.split(' --> ');
        currentLine = {
          start: this.parseTime(startPart),
          end: this.parseTime(endPart),
          text: '',
        };
      } else if (currentLine) {
        currentLine.text = currentLine.text ? `${currentLine.text} ${line}` : line;
        
        // If the next line is empty or doesn't exist, we finish this subtitle
        const nextLine = lines[i + 1]?.trim();
        if (!nextLine || nextLine.includes('-->')) {
          subtitles.push(currentLine as SubtitleLine);
          currentLine = null;
        }
      }
    }

    return subtitles;
  }

  private parseTime(timeStr: string): number {
    const parts = timeStr.split(':');
    let seconds = 0;

    if (parts.length === 3) {
      // hh:mm:ss.ms
      seconds += parseInt(parts[0], 10) * 3600;
      seconds += parseInt(parts[1], 10) * 60;
      seconds += parseFloat(parts[2]);
    } else if (parts.length === 2) {
      // mm:ss.ms
      seconds += parseInt(parts[0], 10) * 60;
      seconds += parseFloat(parts[1]);
    }

    return seconds;
  }
}

