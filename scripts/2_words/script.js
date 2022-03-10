const dom = require('xmldom-silent').DOMParser
const fs = require('fs')
var hepburn = require("hepburn");
var zlib = require('zlib');

// Kanjis :
let zipped = fs.readFileSync("../1_kanjis/target/kanjis.json.gz");
let str = zlib.gunzipSync(zipped).toString('utf8');
let kanjis = JSON.parse(str);

// Fréquence des mots dans les romans :
function frequencies(path) {
    let str = fs.readFileSync(path, 'utf8');
    let json = JSON.parse(str);
    let japaneseWords = json.filter(row => /([一-龠]|[ぁ-ゔ]|[ァ-ヴー]|[々〆〤])+/u.test(row[0]));
    let total = japaneseWords.map(row => row[1]).reduce((a, b) => a + b, 0);
    let frequencies = {};
    japaneseWords.forEach(row => {
        frequencies[row[0]] = row[1] / total;
    })
    return frequencies;
}

let novelFreqs = frequencies('data/wordfreq/novels.json');

// Fréquence des mots dans fichier matsushita :
let matushitaFreqs = {}
str = fs.readFileSync("data/wordfreq/matsushita.json", 'utf8');
let json = JSON.parse(str);
json.forEach(arr => {
    matushitaFreqs[arr[0]] = arr[1] * arr[2];
})

// Retourne les enfants de nom donné du noeud donné.
function children(node, name, attr, attrValue) {
    if (!node) return [];
    let nodes = [];
    if (node.childNodes) {
        for (let i = 0; i < node.childNodes.length; i++) {
            let child = node.childNodes.item(i);
            if (child.nodeName === name) {
                if (attr) {
                    let attribute = child.attributes.getNamedItem(attr);
                    let foundValue = attribute ? attribute.value : null;
                    if (foundValue !== attrValue) continue;
                }
                nodes.push(child);
            }
        }
    }
    return nodes;
}

// Retourne le premier enfant de nom donné du noeud donné ou null s'il n'y en a pas.
function child(node, name, attr, attrValue) {
    if (!node) return null;
    let nodes = children(node, name, attr, attrValue);
    return nodes.length > 0 ? nodes[0] : null;
}

// Clean up :
if (fs.existsSync('target')) {
    fs.rmdirSync('target', {recursive: true});
}
fs.mkdirSync('target');
fs.mkdirSync('target/words');

let entries = [];
let str2 = fs.readFileSync('data/JMdict_e_examp', 'utf8');
let str3 = fs.readFileSync('data/pos.json', 'utf8');
let pos = JSON.parse(str3);
let doc2 = new dom().parseFromString(str2).documentElement;
let nodes2 = children(doc2, 'entry')
nodes2.forEach(node => {
    let entry = parseEntry(node);
    entry['translationsNumber'] = countTranslations(entry);
    entries.push(entry);
});

let entriesByWord = {};
entries.forEach(e => {
    let word = e.literal;
    if (!entriesByWord[word]) {
        entriesByWord[word] = [];
    }
    entriesByWord[word].push(e);
})

let words = {};
for (let w in entriesByWord) {
    if (entriesByWord.hasOwnProperty(w)) {
        let entries = entriesByWord[w].sort((a, b) => a.translationsNumber > b.translationsNumber ? -1 : 1);
        words[w] = {
            frequency: novelFreqs[w],
            entries: entries.sort((a, b) => (a.translationsNumber || 0) > (b.translationsNumber || 0) ? -1 : 1),
            literal: w
        }
    }
}
zipped = zlib.gzipSync(JSON.stringify(words, null, 2));
fs.writeFileSync('target/words.json.gz', zipped);

function countTranslations(entry) {
    let count = 0;
    entry.senses.forEach(sense => {
        count += sense.translations.length;
    })
    return count;
}

function parseEntry(node) {
    let result = {}
    let k_ele = child(node, 'k_ele');
    let word = child(k_ele, 'keb')?.textContent;
    let r_ele = child(node, 'r_ele');
    result['literal'] = word;
    result['reading'] = child(r_ele, 'reb')?.textContent;
    result['senses'] = parseSenses(children(node, 'sense'));
    if (word && word.length > 0) {
        result['furigana'] = furigana(result['literal'], kanaToHiragana(result['reading']));
    }
    return result;
}

function parseSenses(nodes) {
    let result = [];
    nodes.forEach(node => {
        result.push(parseSense(node));
    })
    return result;
}

function parseSense(node) {
    let result = {};
    result['pos'] = children(node, 'pos').map(node => node.textContent).map(str => pos[str.slice(1, str.length - 1)]);
    result['translations'] = children(node, 'gloss').map(node => node.textContent);
    result['examples'] = children(node, 'example').map(node => parseExample(node));
    return result;
}

function parseExample(node) {
    let result = {};
    result['jp'] = child(node, 'ex_sent', 'xml:lang', 'jpn')?.textContent;
    result['en'] = child(node, 'ex_sent', 'xml:lang', 'eng')?.textContent;
    return result;
}

function kanaToHiragana(kana) {
    return hepburn.toHiragana(hepburn.fromKana(kana));
}

function furigana(word, hiragana) {
    if (!word || word.length === 0) {
        if (!hiragana || hiragana.length === 0) {
            return [];
        } else {
            return null;
        }
    } else {
        let firstChar = word[0];
        if (kanjis[firstChar]) {
            let kanji = kanjis[firstChar];
            let hiraganaReadings = [...kanji.readings.on, ...kanji.readings.kun].map(r => {
                if (r[0] === '-') {
                    return r.slice(1);
                } else {
                    let match = /^[^-.]+/.exec(r)
                    return match ? match[0] : null;
                }
            }).filter(r => r).map(r => kanaToHiragana(r));
            for (let hiraganaReading of hiraganaReadings) {
                let len = hiraganaReading.length;
                let prefix = hiragana.substr(0, len);
                if (prefix === hiraganaReading) {
                    let remainingFurigana = furigana(word.slice(1), hiragana.slice(len));
                    if (remainingFurigana) {
                        return [hiraganaReading, ...remainingFurigana];
                    }
                }
            }
            return null;
        } else {
            let firstHiragana = kanaToHiragana(firstChar);
            if (hiragana[0] === firstHiragana) {
                let furi = furigana(word.slice(1), hiragana.slice(1));
                if (furi) {
                    return [null, ...furi];
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }
    }
}




























