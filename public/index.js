var txt; //sample text
var dict = {}; //key-value pair of word-frequency
var keys = []; //unique words
var summary; //summary text from server
var sortedSummary; //sorted summary from server
var keyType = /.*/; //tracking active tab (noun, verb etc)
var buffer = [
    "the",
    "and",
    "of",
    "to",
    "that",
    "in",
    "a",
    "for",
    "it",
    "s",
    "is",
    "has",
    "be",
    "have",
    "this",
    "with",
    "by",
    "at",
    "on"
]; //buffer words
// var buffer = [];

function preload() {
    txt = loadStrings("sampletext.txt");
}

function setup() {
    noCanvas();
    httpGet('/getSummary', gotSummary);
    getWordFrequency();
}

function getWordFrequency() {
    var allWords = txt.join("\n");
    var tokens = allWords.split(/\W+/);
    for (var i = 0; i < tokens.length; i++) {
        var word = tokens[i].toLowerCase();
        if (!/[\d+\s+\n]/.test(word) && buffer.indexOf(word) == -1) {
            if (dict[word]) {
                dict[word]++;
            } else {
                dict[word] = 1;
                keys.push(word);
            }
        }
    }
    keys.sort(compare);
    function compare(a, b) {
        return dict[b] - dict[a];
        //if b > a return 1 else return -1, this is what sort() needs
    }
    displayKeywords();
}

function displayKeywords() {
    var keywordSection = document.getElementById('keywords');
    while (keywordSection.firstChild) {
        keywordSection.removeChild(keywordSection.firstChild);
    }
    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        var riKey = new RiString(key);
        if (keyType.test(riKey.pos())) {
            var myDiv = createP(key + ": " + dict[key]);
            // var fontsize = getSize(key);
            // myDiv.style("font-size", fontsize + "px");
            myDiv.parent("keywords");
        }
    }
}

// function getSize(key) {
//     var maxCount = dict[keys[0]];
//     var minCount = dict[keys[keys.length - 1]];
//     var size = map(dict[key], minCount, maxCount, 14, 60);
//     return size;
// }

function gotSummary(s) {
    summary = loadStrings("summary.txt", displaySummary);
    sortedSummary = loadStrings("sortedSummary.txt", displaySortedSummary);
}

function displaySummary() {
    var summarySection = select("#summary");
    var p = createP(summary);
    p.parent(summarySection);
}

function displaySortedSummary() {
    var sSummarySection = select("#sortedSummary");
    var p = createP(sortedSummary);
    p.parent(sSummarySection);
}

//Tabs
document.getElementById("all_btn").addEventListener("click", changeKeyType);
document.getElementById("noun_btn").addEventListener("click", changeKeyType);
document.getElementById("pnoun_btn").addEventListener("click", changeKeyType);
document.getElementById("verb_btn").addEventListener("click", changeKeyType);
function changeKeyType(e) {
    switch (e.target.id) {
        case "all_btn":
            keyType = /.*/;
            break;
        case "noun_btn":
            keyType = /nn*./;
            break;
        case "pnoun_btn":
            keyType = /prp*./;
            break;
        case "verb_btn":
            keyType = /v*./;
            break;
        default:
            keyType = /.*/;
            break;
    }
    displayKeywords();
}
