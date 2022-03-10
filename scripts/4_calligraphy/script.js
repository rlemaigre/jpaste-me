const fs = require('fs')
var zlib = require('zlib');

// Read files :
let data = {};
let files = fs.readdirSync("data/");
files.forEach((name) => {
    let str = fs.readFileSync("data/" + name, 'utf8');
    str = str.replace(/<style>.*<\/style>/s, "");
    let unicode = name.match(/([0-9]+).svg/)[1];
    let char = String.fromCharCode(unicode);
    data[char] = str;
})

// Clean up :
if (fs.existsSync('target')) {
    fs.rmdirSync('target', {recursive: true});
}
fs.mkdirSync('target');

zipped = zlib.gzipSync(JSON.stringify(data, null, 2));
fs.writeFileSync('target/calligraphy.json.gz', zipped);
