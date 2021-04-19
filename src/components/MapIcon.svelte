<script>

  export let aPlace;

  $: sIcon = getIcon(aPlace.category, aPlace.type);
  $: title = 'icon for ' + aPlace.category + ' ' + aPlace.type;
  $: url = Nominatim_Config.Images_Base_Url + sIcon + '.p.20.png';

  function getIcon(category, type) {
    // equivalent to PHP Nominatim::ClassTypes::getIcon
    // covers 83 of 214 available icon filenames, e.g. transport_roundabout_anticlockwise
    // transport_rental_bicycle or place_of_worship_christian would need more data from
    // the place.
    var aIcons = {
      'boundary:administrative': 'poi_boundary_administrative',
      'place:city': 'poi_place_city',
      'place:town': 'poi_place_town',
      'place:village': 'poi_place_village',
      'place:hamlet': 'poi_place_village',
      'place:suburb': 'poi_place_village',
      'place:locality': 'poi_place_village',
      'place:airport': 'transport_airport2',
      'aeroway:aerodrome': 'transport_airport2',
      'railway:station': 'transport_train_station2',
      'amenity:place_of_worship': 'place_of_worship_unknown3',
      'amenity:pub': 'food_pub',
      'amenity:bar': 'food_bar',
      'amenity:university': 'education_university',
      'tourism:museum': 'tourist_museum',
      'amenity:arts_centre': 'tourist_art_gallery2',
      'tourism:zoo': 'tourist_zoo',
      'tourism:theme_park': 'poi_point_of_interest',
      'tourism:attraction': 'poi_point_of_interest',
      'leisure:golf_course': 'sport_golf',
      'historic:castle': 'tourist_castle',
      'amenity:hospital': 'health_hospital',
      'amenity:school': 'education_school',
      'amenity:theatre': 'tourist_theatre',
      'amenity:library': 'amenity_library',
      'amenity:fire_station': 'amenity_firestation3',
      'amenity:police': 'amenity_police2',
      'amenity:bank': 'money_bank2',
      'amenity:post_office': 'amenity_post_office',
      'tourism:hotel': 'accommodation_hotel2',
      'amenity:cinema': 'tourist_cinema',
      'tourism:artwork': 'tourist_art_gallery2',
      'historic:archaeological_site': 'tourist_archaeological2',
      'amenity:doctors': 'health_doctors',
      'leisure:sports_centre': 'sport_leisure_centre',
      'leisure:swimming_pool': 'sport_swimming_outdoor',
      'shop:supermarket': 'shopping_supermarket',
      'shop:convenience': 'shopping_convenience',
      'amenity:restaurant': 'food_restaurant',
      'amenity:fast_food': 'food_fastfood',
      'amenity:cafe': 'food_cafe',
      'tourism:guest_house': 'accommodation_bed_and_breakfast',
      'amenity:pharmacy': 'health_pharmacy_dispensing',
      'amenity:fuel': 'transport_fuel',
      'natural:peak': 'poi_peak',
      'natural:wood': 'landuse_coniferous_and_deciduous',
      'shop:bicycle': 'shopping_bicycle',
      'shop:clothes': 'shopping_clothes',
      'shop:hairdresser': 'shopping_hairdresser',
      'shop:doityourself': 'shopping_diy',
      'shop:estate_agent': 'shopping_estateagent2',
      'shop:car': 'shopping_car',
      'shop:garden_centre': 'shopping_garden_centre',
      'shop:car_repair': 'shopping_car_repair',
      'shop:bakery': 'shopping_bakery',
      'shop:butcher': 'shopping_butcher',
      'shop:apparel': 'shopping_clothes',
      'shop:laundry': 'shopping_laundrette',
      'shop:beverages': 'shopping_alcohol',
      'shop:alcohol': 'shopping_alcohol',
      'shop:optician': 'health_opticians',
      'shop:chemist': 'health_pharmacy',
      'shop:gallery': 'tourist_art_gallery2',
      'shop:jewelry': 'shopping_jewelry',
      'tourism:information': 'amenity_information',
      'historic:ruins': 'tourist_ruin',
      'amenity:college': 'education_school',
      'historic:monument': 'tourist_monument',
      'historic:memorial': 'tourist_monument',
      'historic:mine': 'poi_mine',
      'tourism:caravan_site': 'accommodation_caravan_park',
      'amenity:bus_station': 'transport_bus_station',
      'amenity:atm': 'money_atm2',
      'tourism:viewpoint': 'tourist_view_point',
      'tourism:guesthouse': 'accommodation_bed_and_breakfast',
      'railway:tram': 'transport_tram_stop',
      'amenity:courthouse': 'amenity_court',
      'amenity:recycling': 'amenity_recycling',
      'amenity:dentist': 'health_dentist',
      'natural:beach': 'tourist_beach',
      'railway:tram_stop': 'transport_tram_stop',
      'amenity:prison': 'amenity_prison',
      'highway:bus_stop': 'transport_bus_stop2'
    };

    return aIcons[category + ':' + type];
  }

</script>

{#if sIcon}
  <img class="mapicon" src={url} alt={title} />
{/if}

<style>
  .mapicon {
    margin: 10px 0;
  }
</style>
