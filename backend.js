const express = require('express');
const request = require('request');
var path    = require("path");
var geohash = require('ngeohash');

const app = express();
app.listen(8000, function(){
    
    console.log('listening 8000');
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname+'/bootstrapform.html'));
});

app.get('/files/js/:fileN', function(req, res){
    res.sendFile(path.join(__dirname+'/js/'+req.params.fileN));
});

// Call for autocomplete - parameter - keyword
app.get('/autokey/:keyword', function(req, res) {
    console.log(req.query);
    var myURL = request.get( { url: "https://app.ticketmaster.com/discovery/v2/suggest?apikey=nA3iGIPdaIbm5jClkHVGqkqjDYkCGPky&keyword="+req.params.keyword}, function(error,response,body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
                
    });   
});

// Call for Google Maps Geocoding API - parameter - address typed - other

app.get('/add/:other_loc', function(req, res) {
    var myURL = request.get( { url: "https://maps.googleapis.com/maps/api/geocode/json?address="+req.params.other_loc+"&key=AIzaSyC_dPOlfs1EGAp82dN5DhWj8Q_YCaHoTcs"}, function(error,response,body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }         
    });
});


// Call for Events Search - parameter - keyword, segmentid, radius, unit, geopoint

// app.get('/key/:keyword/key/:segmentID/key/:radius/key/:unittype/key/:hashp', function(req, res) {
app.get('/searchEvents', function(req, res) {
    console.log(req.query);
    var hashp = geohash.encode(req.query.latitude, req.query.longitude);

    var myURL = request({method: 'GET',gzip: true, url: "https://app.ticketmaster.com/discovery/v2/events.json?apikey=nA3iGIPdaIbm5jClkHVGqkqjDYkCGPky&keyword="+req.query.keyword+"&segmentId="+req.query.segmentId+"&radius="+req.query.distance+"&unit="+req.query.distanceUnit+"&geoPoint="+hashp}, 
        function(error,response,body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
        else{
            res.send(JSON.stringify(body));
        }
                
    });   
});

// Call for Event Details Info tab - parameter - eventID

app.get('/id/:eventid', function(req, res) {
    
    var myURL = request.get( { url: "https://app.ticketmaster.com/discovery/v2/events/"+req.params.eventid+".json?apikey=nA3iGIPdaIbm5jClkHVGqkqjDYkCGPky"}, function(error,response,body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
                
    });   
});

// Call for Event Details Artist/teams tab - Spotify and Google Custom Search Engine