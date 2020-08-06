
function suggester() {
    var query = document.getElementById("q").value;

    var xmlhttp = new XMLHttpRequest();
    var url = encodeURI("http://gsoc2020.nominatim.org:8000/pref/?q=" + query);
    console.log("trial: " + url);

    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var myArr = JSON.parse(this.responseText);
            var hits = myArr['hits'];
            var options = '';
            for (var i = 0; i < hits.length; i++) {
                tags = ['addr', 'addr:en', 'addr:it', 'addr:fr', 'addr:de'];
                tags.forEach(myFunction);

                function myFunction(value, index, array) {
                    if(hits[i]._source[value] && hits[i]._source[value].includes(query))
                    {
                        console.log(value);
                        console.log(hits[i]._source[value]);
                        res = hits[i]._source[value];
                        if(hits[i]._source.country_code)
                            res += ', ' + hits[i]._source.country_code;
                        if(hits[i]._source.postcode)
                            res += ', ' + hits[i]._source.postcode;

                        options += '<option value="' + res + '" />';
                    }
                }
                res = hits[i]._source.addr;
                if(hits[i]._source.country_code)
                    res += ', ' + hits[i]._source.country_code;
                if(hits[i]._source.postcode)
                    res += ', ' + hits[i]._source.postcode;
                options += '<option value="' + res + '" />';
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
}
