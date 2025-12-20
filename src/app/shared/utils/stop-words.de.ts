/**
 * Common German stop words that should be filtered out from vocabulary extraction.
 */
export const STOP_WORDS_DE = new Set([
  'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einer', 'eines', 'einem', 'einen',
  'und', 'oder', 'aber', 'denn', 'doch', 'sondern', 'oder',
  'ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie', 'Sie',
  'mein', 'dein', 'sein', 'unser', 'euer', 'ihr',
  'mit', 'von', 'zu', 'an', 'auf', 'in', 'bei', 'für', 'nach', 'aus', 'über', 'unter', 'vor', 'zwischen',
  'ist', 'sind', 'war', 'waren', 'bin', 'bist', 'sein', 'werden', 'wurde', 'wird',
  'nicht', 'ja', 'nein', 'doch',
  'was', 'wer', 'wie', 'wo', 'wann', 'warum', 'welche', 'welcher', 'welches',
  'dass', 'daß', 'weil', 'wenn', 'als', 'ob',
  'auch', 'schon', 'noch', 'nur', 'mal', 'hier', 'da', 'jetzt', 'dann', 'so',
  'man', 'alle', 'alles', 'etwas', 'nichts',
  'sehr', 'gut', 'ganz', 'viel', 'viele', 'mehr', 'wenig'
]);

