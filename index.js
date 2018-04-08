var express = require('express');
var fs = require('fs');
var MarkovChain = require('markovchain');
var app = express();
var PORT = 3000;

var songArray = fs.readFileSync('./futurefunksonglist.txt').toString().split(/\s+/);
//console.log(songArray);

//var titleMarkov = new MarkovChain(fs.readFileSync('./futurefunksonglist.txt', 'utf8'))


/*var getChains = function(wordList) {
  //var tmpList = Object.keys(wordList).filter(function(word) {
  //  return word[0] >= 'A' && word[0] <= 'Z'
  //})
  return wordList[~~(Math.random()*wordList.length)];
}*/

app.get("/", function(req,res){
	//console.log(titleMarkov.start(getChains).end(5).process());
	var songName = "";
	var songLength = 1 + Math.floor(Math.random() * 6);
	for(var i=0; i < songLength; i++){
		songName += songArray[Math.floor(Math.random() * songArray.length)] + " ";
	}
	res.send(songName);
});

app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});