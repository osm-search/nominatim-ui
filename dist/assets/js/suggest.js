k
function suggester() {
//     console.log(navigator.languages);
    languages = ['zh', 'sp', 'en', 'ar', 'fr', 'ru', 'pt', 'de', 'ja', 'ko'];
//     browser_languages = navigator.languages;
    lan = navigator.language;
    lan = lan.substr(0,2);
//     browser_languages.push(navigator.language.slice(-2));
    tags = ['addr'];
    languages.forEach(function(language, index){
        tags.push('addr:' + language);
    });
    console.log(tags);
//     tags = ['addr', 'addr:en', 'addr:it', 'addr:fr', 'addr:de'];
    var query = document.getElementById("q").value;

    var xmlhttp = new XMLHttpRequest();
    var url = encodeURI("https://gsoc2020.nominatim.org/suggest/autocomplete/?q=" + query);
    console.log("trial: " + url);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var hits = JSON.parse(this.responseText);
            length =Object.keys(hits).length;
            var options = '';
            for (var i = 0; i < length; i++) {
                added = false;
                tags.forEach(function (value, index) {
                    if(hits[i][value] && hits[i][value].includes(query) && hits[i]['addr:'+lan])
                    {
//                         console.log(hits[i]._source[value]);
                        res = hits[i][value];
                        if(hits[i].country_code)
                            res += ', ' + hits[i].country_code;
                        if(hits[i].postcode)
                            res += ', ' + hits[i].postcode;
                        if(value.slice(2) != lan)
                        {
                            res += '(' + hits[i]['addr:'+lan] + ')';
                        }
                        options += '<option value="' + res + '" />';
                        added = true;
                    }
                });
                if(!added)
                {
                    res = hits[i].addr;
                    if(hits[i].country_code)
                        res += ', ' + hits[i].country_code;
                    if(hits[i].postcode)
                        res += ', ' + hits[i].postcode;
                    options += '<option value="' + res + '" />';
                }
            }
            document.getElementById('suglist').innerHTML = options;
//             console.log(document.getElementById('suglist').innerHTML);
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

