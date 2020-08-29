// This function provides suggestions in the form of unordered list.
function suggester() {
    // List of languages to search for
    languages = ['zh', 'sp', 'en', 'ar', 'fr', 'ru', 'pt', 'de', 'ja', 'ko'];
    // Finding the browser language
    browser_lang = navigator.language;
    browser_lang = browser_lang.substr(0,2);
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
    
    // This is executed after the results are fetched
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var hits = JSON.parse(this.responseText);
            length =Object.keys(hits).length;
            // list_items string will be used to form the unordered list entries.
            var list_items = '';
            for (var i = 0; i < length; i++) {
                added = false;
                // This part adds one tag for each of the received results. Addresss in Broweser default language is returned in paranthesis for clarity.
                tags.forEach(function (value, index) {
                    if(hits[i][value] && hits[i][value].includes(query) && hits[i]['addr:'+lan] && !added)
                    {
                        res = ''
                        if(value.slice(2) != browser_lang)
                        {
                            res += '(' + hits[i]['addr:'+browser_lang] + ') ';
                        }
                        else
                            return;
                        res += hits[i][value];
                        if(hits[i].country_code)
                            res += ', ' + hits[i].country_code;
                        if(hits[i].postcode)
                            res += ', ' + hits[i].postcode;
                        icon_path = "poi_boundary_administrative.p.20.png"; // Needs to be calculated and replaced
                        list_items += "<li  class='list-group-item' onclick='putText("+ i +")'><div id="+i+">" + res + "</div><div class='md-v-line'></div><img class='mapicons' src='/ui/mapicons/" + icon_path + "'></i></li>";
                        added = true;
                    }
                });
                // This is to handle cases where no returned language text matches straightaway.
                // Then we return browser default language or default `addr`.
                if(!added)
                {
                    if(hits[i]['addr:'+browser_lang])
                        res = hits[i]['addr:'+browser_lang];
                    else
                        res = hits[i].addr;
                    if(hits[i].country_code)
                        res += ', ' + hits[i].country_code;
                    if(hits[i].postcode)
                        res += ', ' + hits[i].postcode;
                    icon_path = "poi_boundary_administrative.p.20.png"; // Needs to be calculated and replaced
                    list_items += "<li  class='list-group-item' onclick='putText("+ i +")'><div id="+i+">" + res + "</div><div class='md-v-line'></div><img class='mapicons' src='/ui/mapicons/" + icon_path + "'></i></li>";
                }
            }

            // We are setting the unordered list's inner HTML as the list_items. 
            document.getElementById('suglist').innerHTML = list_items;

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

function putText(id)
{
	document.getElementById("q").value = document.getElementById(id).innerHTML;
}
