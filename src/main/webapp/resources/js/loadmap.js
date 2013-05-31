function initialize(url, nombreKML) {

	var latlng = new google.maps.LatLng(43.6809687624999, 5.65529168);
	var mapOptions = {
		zoom : 9,
		center : latlng,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	var map = new google.maps.Map(document.getElementById('map-canvas'),
			mapOptions);
	for ( var i = 0; i < nombreKML; i++) {
		var ctaLayer = new google.maps.KmlLayer(url + i + ".kml");
		ctaLayer.setMap(map);
	}
	// Iteration pour afficher tous les kml associes a l'ouvrage
	// for ( var i = 0; i < nombreKML; i++) {
	// var ctaLayer = new google.maps.KmlLayer(url + '5.kml');
	// ctaLayer.setMap(map);
	// }

}