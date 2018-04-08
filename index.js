var express = require('express');
var fs = require('fs');
var MarkovChain = require('markovchain');
var Jimp = require('jimp');
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

var createAlbumArt = function() {

	var animeImages = new Array();
	fs.readdir("./futurefunkbackgrounds", function(err1, bgFilenames) {
		var bgImageName = "futurefunkbackgrounds/" + bgFilenames[Math.floor(Math.random()*bgFilenames.length)];
		
		fs.readdir("./futurefunkimages", function(err, overlayFilenames) {		
			//var overlayImages = new Array();
			//var numOverlays = Math.floor(Math.random() + 2);
			//for(var i=0; i<numOverlays; i++){
			//	overlayImages.push(overlayFilenames[Math.floor(Math.random() * overlayFilenames.length)]);
			//}
			
			var overlayImageName = "futurefunkimages/" + overlayFilenames[Math.floor(Math.random()*overlayFilenames.length)];
			
			var jimps = [];
			jimps.push(Jimp.read(bgImageName));
			jimps.push(Jimp.read(overlayImageName));
			
			Promise.all(jimps).then(function(data) {
				return Promise.all(jimps);
			}).then(function (data) {
				var outputFilename = "results/" + new Date().getTime().toString()+".jpg";

				data[0].resize(800,800)
							.blur(Math.floor(1 + Math.random()*3))
							//.brightness((-0.5) + Math.random())
							.composite(data[1].scaleToFit(800,800)
						.scale(.3 + Math.random())
						.opacity(Math.random()),
									   Math.floor(Math.random() * 500),
									   Math.floor(Math.random() * 500)
									  )
							.write(outputFilename);
							console.log(outputFilename);
				
			});
			
		});
	});

}

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
	createAlbumArt();
});