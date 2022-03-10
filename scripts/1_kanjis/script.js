const dom = require('xmldom-silent').DOMParser
const fs = require('fs')
const jsdom = require("jsdom");
const {JSDOM} = jsdom;
var zlib = require('zlib');

/**
 * Retourne les enfants de nom donné du noeud donné.
 */
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

/**
 * Retourne le premier enfant de nom donné du noeud donné ou null s'il n'y en a pas.
 */
function child(node, name, attr, attrValue) {
    if (!node) return null;
    let nodes = children(node, name, attr, attrValue);
    return nodes.length > 0 ? nodes[0] : null;
}

// Lecture fichier aozora.json (fréquence des kanjis dans les romans) :
let aozora = {};
let aozorastr = fs.readFileSync('data/aozora.json', 'utf8');
let aozoradata = JSON.parse(aozorastr);
let count = 0
aozoradata.forEach(row => {
    let literal = row[0];
    let frequency = row[2];
    let ranking = count;
    if (count > 0) {
        aozora[literal] = {
            frequency,
            ranking
        }
    }
    count++;
})

// Lecture fichier kanjidic2.xml :
let kanjidic2 = {};
let str = fs.readFileSync('data/kanjidic2.xml', 'utf8');
let doc = new dom().parseFromString(str).documentElement;
let nodes = children(doc, 'character')
nodes.forEach(characterNode => {
    let literal = child(characterNode, 'literal').textContent;
    let misc = child(characterNode, 'misc');
    let rm = child(child(characterNode, 'reading_meaning'), 'rmgroup');
    let meanings = children(rm, 'meaning', 'm_lang', null);
    let onreadings = children(rm, 'reading', 'r_type', 'ja_on');
    let kunreadings = children(rm, 'reading', 'r_type', 'ja_kun');
    kanjidic2[literal] = {
        grade: child(misc, 'grade')?.textContent,
        jlpt: child(misc, 'jlpt')?.textContent,
        stroke_count: child(misc, 'stroke_count')?.textContent,
        readings: {
            on: onreadings.map(node => node.textContent),
            kun: kunreadings.map(node => node.textContent),
        },
        meanings: meanings.map(node => node.textContent),
        codepoint: child(child(characterNode, 'codepoint'), 'cp_value', 'cp_type', 'ucs')?.textContent,
        radical: child(child(characterNode, 'radical'), 'rad_value', 'rad_type', 'classical')?.textContent
    }
});

// Clean up :
if (fs.existsSync('target')) {
    fs.rmdirSync('target', {recursive: true});
}
fs.mkdirSync('target');
fs.mkdirSync('target/kanjis');

// Création des fichiers de kanjis :
let kanji = {}
for (let literal in kanjidic2) {
    if (kanjidic2.hasOwnProperty(literal)) {
        let obj = {
            literal,
            ...kanjidic2[literal],
            frequency: aozora[literal]?.frequency,
            ranking: aozora[literal]?.ranking,
        }
        kanji[literal] = obj;
        fs.writeFileSync('target/kanjis/' + literal + '.json', JSON.stringify(obj, null, 2));
    }
}
let zipped = zlib.gzipSync(JSON.stringify(kanji, null, 2));
fs.writeFileSync('target/kanjis.json.gz', zipped);