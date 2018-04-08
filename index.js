var express = require('express');
var fs = require('fs');
var MarkovChain = require('markovchain');
var tracery = require('tracery');
var app = express();
var PORT = 3000;

var songArray = fs.readFileSync('./futurefunksonglist.txt').toString().split(/\s+/);
var nameGrammar = JSON.parse(fs.readFileSync('./namegrammar.json').toString());
//console.log(songArray);

//var titleMarkov = new MarkovChain(fs.readFileSync('./futurefunksonglist.txt', 'utf8'))


/*var getChains = function(wordList) {
  //var tmpList = Object.keys(wordList).filter(function(word) {
  //  return word[0] >= 'A' && word[0] <= 'Z'
  //})
  return wordList[~~(Math.random()*wordList.length)];
}*/

var getSongName = function() {
    var songName = "";
	var songLength = 1 + Math.floor(Math.random() * 6);
	for(var i=0; i < songLength; i++){
		songName += songArray[Math.floor(Math.random() * songArray.length)] + " ";
	}
    return songName;
}

app.get("/", function(req,res){
	//console.log(titleMarkov.start(getChains).end(5).process());
	var grammar = tracery.createGrammar(nameGrammar);
	res.send(getSongName());
});

app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});