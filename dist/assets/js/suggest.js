
function suggester() {
    // List of languages to search for
    languages = ['zh', 'sp', 'en', 'ar', 'fr', 'ru', 'pt', 'de', 'ja', 'ko'];
    // Finding the browser language
    lan = navigator.language;
    lan = lan.substr(0,2);
    tags = ['addr'];
    languages.forEach(function(language, index){
        tags.push('addr:' + language);
    });
    // Tags contain all languages and tags to look for
    console.log(tags);

    var query = document.getElementById("q").value;
    var xmlhttp = new XMLHttpRequest();
    // The API url to get suggestions
    var url = encodeURI("https://gsoc2020.nominatim.org/suggest/autocomplete/?q=" + query);
    console.log("trial: " + url);
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var hits = JSON.parse(this.responseText);
            length =Object.keys(hits).length;
            var list_items = '';
            for (var i = 0; i < length; i++) {
                added = false;
                tags.forEach(function (value, index) {
                    if(hits[i][value] && hits[i][value].includes(query) && hits[i]['addr:'+lan])
                    {
                        res = ''
                        if(value.slice(2) != lan)
                        {
                            res += '(' + hits[i]['addr:'+lan] + ') ';
                        }
                        res += hits[i][value];
                        if(hits[i].country_code)
                            res += ', ' + hits[i].country_code;
                        if(hits[i].postcode)
                            res += ', ' + hits[i].postcode;
                        list_items += "<li class='list-group-item' onclick='putText(\"" + res + "\")'>" + res + "</li>";
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
                    list_items += "<li class='list-group-item' onclick='putText(\"" + res + "\")'>" + res + "</li>";
                }
            }
            document.getElementById('suglist').innerHTML = list_items;

            console.log(document.getElementById('suglist').innerHTML, list_items);

            // Making sure the dropdown is expanded
            document.getElementById("dd").classList.add("open");
            document.getElementById("dd").classList.add("show");
            document.getElementById("suglist").classList.add("show");
            document.getElementById("q").setAttribute("aria-expanded", true);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}

function putText(str)
{
	document.getElementById("q").value = str;
}
