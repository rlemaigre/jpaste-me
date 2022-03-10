import {Entry} from "./schema";
import {reactive, readonly, Ref, watchEffect} from "vue";

export interface Stats {
    kanjisRefFrequency: number;
    wordsRefFrequency: number;
}

export let stats: Stats = <Stats>{};

export interface Radical {
    lesson: number;
    characters: string[];
    meanings: string[];
    image: string;
}

export let radicals: { [id: string]: Radical } = {};

export interface Kanji {
    literal: string;
    grade: string;
    jlpt: string;
    ranking: string;
    frequency: number;
    stroke_count: string;
    readings: {
        "on": string[]
        "kun": string[]
    };
    meanings: string[];
    codepoint: string;
    radical: string;
    dic: { [dic: string]: string };
    stroke_order: string;
    stroke_order2: string;
    heisigKeyword: string
    parts: Part[],
    koohii: string[],
    koohiimd: string
}

export interface Part {
    literal: string;
    type: 'kanji' | 'radical';
    meanings: string[];
    parts: Part[];
}

export interface Word1 {
    word: string;
    reading: string;
    meaning: string;
    furigana: string[];
    frequency: number;
}

export interface Kanji1 {
    literal: string;
    heisigKeyword: string;
    frequency: number;
    mainReading: Reading;
}

export interface TextAnalysis {
    words: Word1[],
    kanjis: Kanji1[]
    tokens: Token[]
}

export interface Token {
    text: string;
    reading: string;
    lemma: string;
}

export interface Word {
    frequency: number;
    entries: WordEntry[];
}

export interface WordEntry {
    word: string;
    reading: string;
    furigana: string[];
    senses: WordSense[];
}

export interface WordSense {
    translations: string[];
    pos: string[];
    examples: WordExample[];
}

export interface WordExample {
    jp: string;
    en: string;
}

export function kanjiURL(literal: string) {
    return "https://cdn.jpaste.me/kanjis/" + literal + ".json";
}

export function wordURL(literal: string) {
    return "https://cdn.jpaste.me/words/" + literal + ".json";
}


export function wordsURL(literal: string) {
    return "https://cdn.jpaste.me/words_by_kanjis/" + literal + ".json";
}

export function strokeOrder2URL(literal: string) {
    return "https://cdn.jpaste.me/stroke_order2/" + literal.codePointAt(0) + ".svg";
}

export function strokeOrderURL(literal: string) {
    return "https://cdn.jpaste.me/stroke_order/" + literal.codePointAt(0) + "_frames.svg";
}

export function koohiiURL(literal: string) {
    return "https://cdn.jpaste.me/koohii2/" + literal + '.md';
}

export function kanjiUsefulness(frequency: number) {
    return frequency / stats.kanjisRefFrequency;
}

export function wordUsefulness(frequency: number) {
    return frequency / stats.wordsRefFrequency;
}

export interface Reading {
    type: 'on' | 'kun';
    romaji: string;
    count: number;
    weighted: number;
}

export async function say(word: string, onEnded: () => void) {
    let response = await fetch("https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyBbs_aNb1SIRP1khqRvyItf-DUyIeC5uOk", {
        "method": "POST",
        "body": JSON.stringify({
            "audioConfig": {
                "audioEncoding": "MP3_64_KBPS",
                "pitch": 0,
                "speakingRate": 1
            },
            "input": {
                "text": word
            },
            "voice": {
                "languageCode": "ja-JP",
                "name": "ja-JP-Wavenet-B"
            }
        })
    });
    let json = await response.json();
    let base64 = json.audioContent;
    let dataurl = 'data:audio/mpeg;base64,' + base64;
    let audio = new Audio(dataurl);
    audio.addEventListener('ended', onEnded);
    await audio.play()
    let stop = () => {
        audio.pause();
        audio.currentTime = 0;
        onEnded();
    }
    return stop;
}

export function isKanji(letter: string) {
    return /[一-龯]/.test(letter);
}

export interface Page {
    type: 'WORD' | 'KANJI';
    literal: string;
}

export interface WordAnalysis {
    literal: string;
    letters: string[];
    furigana: string[];
    reading: string;
    senses: WordSense[];
    mainTranslation: string;
    poses: Map<number, string>;
    frequency: number
}

function initWordAnalysis(wordAnalysis: any, literal: string): WordAnalysis {
    wordAnalysis.literal = literal;
    wordAnalysis.letters = [];
    wordAnalysis.frequency = 0;
    wordAnalysis.senses = [];
    wordAnalysis.reading = "";
    wordAnalysis.mainTranslation = "";
    wordAnalysis.furigana = [];
    wordAnalysis.poses = new Map<number, string>();
    return wordAnalysis;
}

export function useWordAnalysis(literal: Ref<string>) {
    const wordAnalysis = reactive<WordAnalysis>(initWordAnalysis({}, literal.value));
    watchEffect(async () => {
        initWordAnalysis(wordAnalysis, literal.value);
        if (literal.value) {
            const word: Word = await fetch(wordURL(literal.value)).then(response => response.json());
            const entry = word.entries[0];
            wordAnalysis.letters = Array.from(literal.value);
            wordAnalysis.furigana = entry.furigana;
            wordAnalysis.reading = entry.reading;
            wordAnalysis.senses = entry.senses;
            wordAnalysis.mainTranslation = entry.senses[0].translations[0];
            //wordAnalysis.poses = poses(entry);
            wordAnalysis.frequency = word.frequency;
        }
    })
    return readonly(wordAnalysis);
}

/**
 * Retourne une map dans laquelle les POS successives identiques ne sont reprises qu'une fois.
 */
export function poses(entry: Entry): Map<number, string> {
    let posMap = new Map<number, string>();
    let prevPos = '';
    for (let index = 0; index < entry.senses.length; index++) {
        let pos = entry.senses[index].pos;
        if (pos && pos.length > 0) {
            let curPos = pos.join(', ');
            if (curPos !== prevPos) {
                posMap.set(index, curPos);
                prevPos = curPos;
            }
        }
    }
    return posMap;
}
