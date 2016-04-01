	// var apiKey = "42Y1DLXBCZUXSDFCD"
var valence;
var energy;
var artist;
var weather;
var city;
var songIDs = [];
var playlistName;
var playlistNameDisplay;
var trackURIs;
var title;
var trackURIs = [];

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

$('#playlist_button').click(savePlaylist);

//Take city input and get weather & temp
$("#go-button").click(function() {
	city = $("#city").val();
	artist = $("#artist-input").val();
	

	$.getJSON("http://api.openweathermap.org/data/2.5/weather", 
		{
			q: city,
			appid:"66216920d5f4a99f5d8a1401898eb1c3",
			units: "imperial",
		}, weatherCallback);
});

function weatherCallback(data) {
	console.log(data);

	energy = beaufort(data.wind.speed);
	console.log(energy);
	valence = (100-(data.clouds.all))/100;
	weather = data.weather[0].description;
	function beaufort(wind) {
		if(wind <= 19) {
			return(wind/19).toFixed(2);

		}	else if(wind > 19) {
			return("1");

		} 	else {
		console.log("beaufort isn't working");
	}
	  // if (wind < 1 ) {return("0"); }
	  // if (wind < 4 ) {return(".14"); }
	  // if (wind < 8 ) {return(".28"); }
	  // if (wind < 13 ) {return(".43"); }
	  // if (wind < 19 ) {return(".57"); }
	  // if (wind < 25 ) {return(".71"); }
	  // if (wind < 32 ) {return(".82"); }
	  // if (wind < 39 ) {return(".9"); }
	  // if (wind >= 39 ) {return("1"); }
	  // return(".5");
	  // console.log("beaufort isn't working");
	}


	function createStaticPlaylist(data) {
	    var songList = data.response.songs;
	    playlistName = "";
	    playlistNameDisplay = "";
        trackURIs = [ ]
        for(i=0;i<data.response.songs.length;i++) {
            trackURIs.push(data.response.songs[i].tracks[0].foreign_id);
        }
        
	    console.log(songList);
	    console.log(artist);
        console.log(trackURIs);

	    $("#tracklist").html(" ");
	    $("#playlistName").html(" ");
	    $("#stats").html("<h1>Energy:" + energy + " Valence = " + valence + "</h1");
	    playlistNameDisplay = "<h1>" + weather + " in " + city + " with " + artist + "</h1>";
	    playlistName = toTitleCase(weather + " In " + city + " With " + artist);

	    $("#playlistName").html(playlistNameDisplay);

	    for(i=0;i<data.response.songs.length;i++) {
			$("#tracklist").append("<li>" + data.response.songs[i].title + " by " + data.response.songs[i].artist_name + "</li>");
		}

		$("#circle").css("left", valence*100 + "%");
		$("#circle").css("top", (1-energy)*100 + "%");

		$("#playlist-container").show();
        $("#playlist_button").show();
	}

	$.getJSON("http://developer.echonest.com/api/v4/playlist/static?api_key=42Y1DLXBCZUXSDFCD&results=20&type=artist-radio&artist=" + artist + "&target_valence=" + valence + "&target_energy=" + energy + "&distribution=wandering&bucket=id:spotify&bucket=tracks&limit=true",
		// {
		// 	"artist": artist,
		// 	"target_valence": valence,
		// 	"target_energy": energy,
		// }
	 	createStaticPlaylist);

}


// GET TOKEN BELOW
function savePlaylist() {
        // var title = getPlaylistTitle();
        var client_id = '4c369231a4da4f6fb9d8c97e4ef64302';
        var redirect_uri = " ";
        var redirect_uri = 'http://philipvachon.com/weathermoodcallback3.html';

        var url = 'https://accounts.spotify.com/authorize?client_id=' + client_id +
            '&response_type=token' +
            '&scope=playlist-modify-private' +
            '&redirect_uri=' + encodeURIComponent(redirect_uri);
            // makes the tracks object into a string so he can store it in local storage with stringify, then uses parse to make it back into an object when he gets the object back with getItem
        localStorage.removeItem("createplaylist-tracks");
        localStorage.removeItem("createplaylist-name");
        localStorage.setItem('createplaylist-tracks', JSON.stringify(trackURIs));
        localStorage.setItem('createplaylist-name', playlistName);
        var w = window.open(url, 'asdf', 'WIDTH=400,HEIGHT=500');
}

// GET THEIR USERNAME

// var g_access_token = '';
// var g_username = '';
// var g_tracks = [];

// function getUsername(callback) {
//     var url = 'https://api.spotify.com/v1/me';
//     $.ajax(url, {
//         dataType: 'json',
//         headers: {
//             'Authorization': 'Bearer ' + g_access_token
//         },
//         success: function(r) {
//             callback(r.id);
//         },
//         error: function(r) {
//             callback(null);
//         }
//     });
// }

// // MAKE THE PLAYLIST FUNCTION
// function createPlaylist(username, name, callback) {
//     var url = 'https://api.spotify.com/v1/users/' + username + '/playlists';
//     $.ajax(url, {
//         type: 'POST',
//         data: JSON.stringify({
//             'name': name,
//             'public': false
//         }),
//         dataType: 'json',
//         headers: {
//             'Authorization': 'Bearer ' + g_access_token,
//             'Content-Type': 'application/json'
//         },
//         success: function(r) {
//             callback(r.id);
//         },
//         error: function(r) {
//             callback(null);
//         }
//     });
// }

// function addTracksToPlaylist(username, playlist, tracks, start, callback) {
//     var maxTracksPerPlaylistAdd = 20;
//     var url = 'https://api.spotify.com/v1/users/' + username +
//         '/playlists/' + playlist +
//         '/tracks'; 
//     var thisTracks = tracks.slice(start, start + maxTracksPerPlaylistAdd);
//     $.ajax(url, {
//         type: 'POST',
//         data: JSON.stringify(thisTracks),
//         dataType: 'json',
//         processData:false,
//         headers: {
//             'Authorization': 'Bearer ' + g_access_token,
//             'Content-Type': 'application/json'
//         },
//         success: function(r) {
//             if (start + maxTracksPerPlaylistAdd >= tracks.length) {
//                 callback('good');
//             } else {
//                 status(Math.round(100 * start / tracks.length)  + "% saved");
//                 addTracksToPlaylist(username, playlist, tracks, start + maxTracksPerPlaylistAdd, callback);
//             }
//         },
//         error: function(r, status, err) {
//             callback(null);
//         }
//     });
// }

// function status(msg) {
//     $("#status").text(msg);
// }

// function doit() {
//     // parse hash
//     var hash = location.hash.replace(/#/g, '');
//     var all = hash.split('&');
//     var maxTracks = 20;
//     var args = {};
//     all.forEach(function(keyvalue) {
//         var idx = keyvalue.indexOf('=');
//         var key = keyvalue.substring(0, idx);
//         var val = keyvalue.substring(idx + 1);
//         args[key] = val;
//     });

//     g_name = localStorage.getItem('createplaylist-name');
//     g_tracks = JSON.parse(localStorage.getItem('createplaylist-tracks'));

//     // g_tracks = g_tracks.slice(maxTracks);


//     if (typeof(args['access_token']) != 'undefined') {
//         // got access token
//         g_access_token = args['access_token'];
//     }

//     getUsername(function(username) {
//         createPlaylist(username, g_name, function(playlist) {
//             if (playlist) {
//                 addTracksToPlaylist(username, playlist, g_tracks, 0, function(ok) {
//                     if (ok) {
//                         $('#playlistlink').attr('href', 'spotify:user:'+username+':playlist:'+playlist);
//                         $("#title").text(g_name);
//                         $('#done').show();
//                         $('#creating').hide();
//                     } else {
//                         $('#error').show();
//                         $('#creating').hide();
//                     }
//                 });
//             } else {
//                 $("#error").show();
//                 $('#creating').hide();
//             }
//         });
//     });
// }

