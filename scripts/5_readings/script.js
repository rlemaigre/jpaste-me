const zlib = require("zlib")
const fs = require("fs")
const hepburn = require("hepburn");

if (fs.existsSync('target')) {
    fs.rmdirSync('target', {recursive: true});
}
fs.mkdirSync('target');
fs.mkdirSync('target/readings');

let zipped = fs.readFileSync('../1_kanjis/target/kanjis.json.gz');
let str = zlib.gunzipSync(zipped).toString('utf8');
let kanjis = JSON.parse(str);
zipped = fs.readFileSync('../2_words/target/words.json.gz');
str = zlib.gunzipSync(zipped).toString('utf8');
let words = JSON.parse(str);
let wordsByChar = {};
for (let word in words) {
    if (words.hasOwnProperty(word)) {
        let chars = Array.from(word);
        let nbrKanjis = chars.filter(c => {
            return /[一-龠]/u.test(c);
        }).length;
        if (nbrKanjis >= 2) {
            chars.forEach(char => {
                if (!wordsByChar[char]) {
                    wordsByChar[char] = [];
                }
                wordsByChar[char].push(word);
            })
        }
    }
}
let readingsByKanji = {};
for (let literal in kanjis) {
    if (kanjis.hasOwnProperty(literal)) {
        let list = wordsByChar[literal] || [];
        let readings = [];
        let kanji = kanjis[literal];
        let onReadings = kanji.readings.on;
        let kunReadings = kanji.readings.kun;
        readings.push(...distinct(onReadings.map(r => hepburn.fromKana(fixReading(r)))).map(on => {
            return {
                type: 'on',
                romaji: on,
                count: 0,
                weighted: 0
            }
        }));
        readings.push(...distinct(kunReadings.map(r => hepburn.fromKana(fixReading(r)))).map(kun => {
            return {
                type: 'kun',
                romaji: kun,
                count: 0,
                weighted: 0
            }
        }));
        for (let item of list) {
            let word = words[item];
            let entries = word.entries;
            if (entries) {
                entries.forEach(entry => {
                    let furigana = entry.furigana;
                    if (furigana) {
                        for (let i = 0; i < item.length; i++) {
                            if (item[i] === literal) {
                                let romaji = hepburn.fromKana(furigana[i]);
                                readings.forEach(r => {
                                    if (r.romaji === romaji) {
                                        r.count++;
                                        r.weighted += word.frequency || 0;
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
        let sum = readings.map(r => r.count).reduce((a, b) => a + b, 0);
        let weightedSum = readings.map(r => r.weighted).reduce((a, b) => a + b, 0);
        readings.forEach(r => {
            r.count = r.count / sum * 100;
            r.weighted = r.weighted / weightedSum * 100;
        })
        readingsByKanji[literal] = readings;
    }
}
zipped = zlib.gzipSync(JSON.stringify(readingsByKanji, null, 2));
fs.writeFileSync('target/readings.json.gz', zipped);

function fixReading(r) {
    if (r) {
        if (r[0] === '-') {
            return r.slice(1);
        } else {
            let match = /^[^-.]+/.exec(r)
            return match ? match[0] : null;
        }
    } else {
        return null;
    }
}

function distinct(arr) {
    return [...new Set(arr)];
}