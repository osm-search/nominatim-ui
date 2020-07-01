
function suggester() {
    var query = document.getElementById("q").value;
    // console.log(window.location.href + "?q=" + query + "&polygon_geojson=1");
    // $.ajax({
    //     type: "POST",
    //     url: "../lib/es.py",
    //     data: { param: query },
    //     success: callbackFunc,
    //     error: callbackFunc
    // });

    var xmlhttp = new XMLHttpRequest();
    var url = "http://localhost:8000/pref/?q=" + query;
    console.log(url);

    xmlhttp.onreadystatechange = function () {
        // if(!(this.responseText === ""))
        // {
        //     console.log(this.status, this.responseText);
        // }
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            // var hits = myArr['features'];
            var hits = myArr['hits'].hits;
            // console.log(hits, hits.length);
            var options = '';
            for (var i = 0; i < hits.length; i++) {
                res = '';
                // console.log(hits[i]['properties'].length);
                // for(var j in hits[i]['properties'])
                // {
                //     res += hits[i]['properties'][j];
                //     if(j != 0 && hits[i]['properties'][j] !== '')
                //         res += ", ";
                // }

                // console.log(i, hits[i]._source.name);
                res = hits[i]._source.name;
                // if(hits[i]._source.hasOwnProperty('name'))
                // if(hits[i]._source.hasOwnProperty('city'))
                //     res +=  ", " + hits[i]._source.city['default'];
                // if(hits[i]._source.hasOwnProperty('country'))
                //     res += ", " + hits[i]._source['country']['default'];
                // if(hits[i]._source.hasOwnProperty('osm_value'))
                //     res += " (" + hits[i]._source['osm_value'] + ")";
                // if(res === '')
                //     res = query;
                res = hits[i]._source.address;
                res = res.replace(/\"/g, "'")
                // console.log(res);
                // Using photon API
                // if(hits[i]['properties'].hasOwnProperty('name'))
                //     res += hits[i]['properties']['name'];
                // if(hits[i]['properties'].hasOwnProperty('city'))
                //     res +=  ", " + hits[i]['properties']['city'];
                // if(hits[i]['properties'].hasOwnProperty('country'))
                //     res += ", " + hits[i]['properties']['country'];
                // if(hits[i]['properties'].hasOwnProperty('osm_value'))
                //     res += " (" + hits[i]['properties']['osm_value'] + ")";
                // if(res === '')
                //     res = query;
                options += '<option value="' + res + '" />';
                // console.log( hits[i]['properties']['osm_id'] );

            }
            document.getElementById('suglist').innerHTML = options;
            console.log(document.getElementById('suglist').innerHTML);
        }
    };


    xmlhttp.open("GET", url, true);
    xmlhttp.send();

    function myFunction(arr) {
        var out = "";
        var i;
        for (i = 0; i < arr.length; i++) {
            out += '<a href="' + arr[i].url + '">' +
                arr[i].display + '</a><br>';
        }
        document.getElementById("content").innerHTML = out;
    }

    // xhr = createCORSRequest('GET', 'http://127.0.0.1:5001/square/');
    // console.log(xhr.send());
    // console.log(createCORSRequest('POST', 'http://127.0.0.1:5001/square/').send());
    // $.ajax({
    //     url: 'http://127.0.0.1:5001/generate/',
    //     data: {'number': query},
    //     method: 'POST',
    //     success: callbackFunc
    // });
    // $.getJSON('http://localhost:9200/bank/_search', 
    //     function(data, textStatus, jqXHR) {
    //         alert(data);
    //     }
    // );
}

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        // XHR has 'withCredentials' property only if it supports CORS
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") { // if IE use XDR
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

function callbackFunc(response) {
    // do something with the response
    console.log(response);
}