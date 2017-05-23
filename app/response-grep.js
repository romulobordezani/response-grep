var https = require('https'),
    request = require('request'),
    fs = require('fs'),
    urlList = [],
    loadingControl = 0;

var args = process.argv.slice(2);

function iterateUrls(){

    if( loadingControl > urlList.length ){
        return false;
    }

    // ##==  Try to load the URl via a non authorized cert ==#

    /*var options = {
        url: urlList[loadingControl],
        rejectUnauthorized: false,
        port: 443,
        method: 'GET'
    };

    require('dns').lookup('cadastro.uol.com.br', (err, ip) => {
        console.log( ip, err );
            if (err) throw err;
        request(`https://${ip}/`, (error, response, body) => {
            console.log( 'here1', body, error );
            // ...
        });
    });*/

    /*https.get(
        options,
        function(response) {
            var body = '';
            response.on('data', function(d) {
                body += d;
            });
            response.on('end', function() {
                console.log( 'fini', body );
            });
            response.on('error', function(error) {
                console.log( 'error', error );
            });
        }
    );*/






    // ##==  Just Lists URLs with a link ==#
    /*
    console.log( urlList[loadingControl] );
    loadingControl++;
    iterateUrls();
    return false;*/



    // ##==  Load the urls in the list and try to find a  tm script on it  ==#
    var options = {
        url: urlList[loadingControl],
        strictSSL: false,
        secureProtocol: 'TLSv1_method'
    };

    request( options, function( error, response, body ){

        if ( !error && response.statusCode == 200 ){

            var query = args[0] || 'Where is the f%ck*ng Query?';

            if( body.indexOf( query ) >= 0 ){
                console.log( ( loadingControl + 1), '>>>>> Contains: ' + args[0] + '>>>>>' , urlList[loadingControl] ); // Print the web page.
            }else{
                console.log( ( loadingControl + 1),  'Not found on: ', urlList[loadingControl] );
            }

            loadingControl++;
            iterateUrls();

        }

    });

}


function readLinesOnTxtFile(input, func) {

    var remaining = '';

    input.on('data', function(data) {

        remaining += data;
        var index = remaining.indexOf('\n');
        var last  = 0;
        while (index > -1) {
            var line = remaining.substring(last, index);
            last = index + 1;
            func(line);
            index = remaining.indexOf('\n', last);
        }

        remaining = remaining.substring(last);

    });

    input.on( 'end', function(){
        if( remaining.length > 0 ){
            iterateUrls();
        }
    });

}


function addToUrlList(data) {
    urlList.push( data.replace('\r', '') );
}


function init(){
    var input = fs.createReadStream('../urlList.txt');
    readLinesOnTxtFile( input, addToUrlList );
}


init();
