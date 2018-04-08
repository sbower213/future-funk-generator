var express = require('express');
var fs = require('fs');
var MarkovChain = require('markovchain');
var Jimp = require('jimp');
var tracery = require('tracery-grammar');
var fullwidth = require('fullwidth').default;
var exphbs = require('express-handlebars');
var app = express();
var PORT = 3000;


app.use('/results', express.static('results'));
var songArray = fs.readFileSync('./futurefunksonglist.txt').toString().split(/\s+/);
var nameGrammar = JSON.parse(fs.readFileSync('./namegrammar.json').toString());
var grammar = tracery.createGrammar(nameGrammar);
//console.log(songArray);

//var titleMarkov = new MarkovChain(fs.readFileSync('./futurefunksonglist.txt', 'utf8'))


/*var getChains = function(wordList) {
  //var tmpList = Object.keys(wordList).filter(function(word) {
  //  return word[0] >= 'A' && word[0] <= 'Z'
  //})
  return wordList[~~(Math.random()*wordList.length)];
}*/

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');


var createAlbumArt = function(artist, album, songList, res) {

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
				var outputFileName = "results/" + new Date().getTime().toString()+".jpg";
				data[0].resize(800,800)
						.blur(Math.floor(1 + Math.random()*3))
						.composite(data[1].scaleToFit(800,800)
								   .scale(.3 + Math.random())
								   .opacity(Math.random()),
								   Math.floor(Math.random() * 500),
								   Math.floor(Math.random() * 500)
								  )
						.write(outputFileName);
					//console.log(outputFileName);
				res.render('index', {artist: artist, album: album, songList: songList, albumArt: outputFileName});
	
			});
			
		});
	});

}

// between min and max inclusive
var getRandInt = function(min, max) {
    return (min + Math.floor(Math.random() * (max - min)));
}

var getSongName = function(album = false) {
    var songName = "";
	var songLength = getRandInt(1,7);
	for(var i=0; i < songLength; i++){
		songName += songArray[getRandInt(0,songArray.length)] + " ";
	}
    var fullwidthNum = getRandInt(0,9);
    if(fullwidthNum === 0) {
        songName = fullwidth(songName);
    }
    var featuringNum = getRandInt(0,5);
    if(!album && featuringNum === 0) {
        var feat = getArtist();
        songName += " (feat. "+feat+")";
    }
    return songName;
}

var getArtist = function() {
    var artist = grammar.flatten("#name#");
    var fullwidthNum = getRandInt(0,9);
    if(fullwidthNum === 0) {
        artist = fullwidth(artist);
    }
    return artist;
}

app.get("/", function(req,res){
	//console.log(titleMarkov.start(getChains).end(5).process());
    var artist = getArtist();
    var numSongs = getRandInt(8,12);
    var songList = [];
    for(var i=0; i < numSongs; i++) {
        songList.push(getSongName());
    }
    var albumNum = getRandInt(0,3);
    var album = "";
    switch(albumNum) {
        case 0: //new artist-ish name
            album = getArtist();
            break;
        case 1: //new song-ish name
            album = getSongName(true);
            break;
        case 2: //one of the song titles
            var songNum = getRandInt(0,songList.length);
            album = songList[songNum];
            var feat = album.indexOf("(feat.");
            if(feat !== -1) {
                album = album.substring(0, feat);
            }
            break; //unnecessary roughness
    }
	createAlbumArt(artist, album, songList, res); //calls res.render
});

app.listen(PORT, function() {
    console.log('Server listening on port:', PORT);
});