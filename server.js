var SummaryTool = require('node-summary');
var fs = require('fs');

var express = require("express");
var app = express();
var server = app.listen(8800, function() {
    console.log("listening on port 8800");
});
app.use(express.static("public"));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/getSummary', getSummary);
function getSummary(req, res) {
    var content = fs.readFileSync('public/sampletext.txt', 'utf8');
    var title = "";
    var reply = {"summary_status" : "done"};
    SummaryTool.summarize(title, content, function(err, summary, dict) {
        if (err) console.log("Something went wrong man!");

        // summary += "\n\nOriginal Length: " + content.length + "    |    Summary Length: " + summary.length;
        fs.writeFileSync('public/summary.txt', summary);

        SummaryTool.getSortedSentences(content, 1, function(err, sorted_sentences) {
            if (err) {
                console.log("There was an error."); // Need better error reporting
            }
            // sorted_sentences += "\n\nOriginal Length: " + content.length + "    |    Sorted Summary Length: " + sorted_sentences.length;
            fs.writeFileSync('public/sortedSummary.txt', sorted_sentences);
        }, dict);
    });
    res.send(reply);
}






/*
Node Summary Package: https://github.com/jbrooksuk/node-summary
*/
