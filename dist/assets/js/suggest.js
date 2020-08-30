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

    var query = document.getElementById("q").value;
    var xmlhttp = new XMLHttpRequest();

    // The API url to get suggestions - Update this with your server URL
    var url = encodeURI(get_config_value('Suggestions_Url') + query);

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
                    if(hits[i][value] && hits[i][value].includes(query) && hits[i]['addr:'+browser_lang] && !added)
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
                        icon_path = get_config_value('Images_Base_Url') + getIcon({'category': hits[i].category, 'type': hits[i].type}) + '.p.20.png';
                        list_items += "<li  class='list-group-item' onclick='putText("+ i +")'><div class='row'><div class='col' id="+i+">" + res + "</div><img class='fas mr-4 mapicons' src='" + icon_path + "'></div></li>";added = true;
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
                    icon_path = get_config_value('Images_Base_Url') + getIcon({'category': hits[i].category, 'type': hits[i].type}) + '.p.20.png';
                    list_items += "<li  class='list-group-item' onclick='putText("+ i +")'><div class='row'><div class='col' id="+i+">" + res + "</div><img class='fas mr-4 mapicons' src='" + icon_path + "'></div></li>";added = true;
                }
            }

            // We are setting the unordered list's inner HTML as the list_items
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

// Utility to put text on the search bar when clicked on a suggestion
function putText(id)
{
	document.getElementById("q").value = document.getElementById(id).innerHTML;
}
