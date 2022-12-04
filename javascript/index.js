const body = document.querySelector('body'),
        sidebar = body.querySelector('nav'),
        toggle = body.querySelector(".toggle"),
        searchBtn = body.querySelector(".search-box"),
        modeSwitch = body.querySelector(".toggle-switch"),
        modeText = body.querySelector(".mode-text");

toggle.addEventListener("click" , () =>{
    sidebar.classList.toggle("close");
})

searchBtn.addEventListener("click" , () =>{
    sidebar.classList.remove("close");
})

const mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
const mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';
const satellite = L.tileLayer(mbUrl, {id: 'mapbox/satellite-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
//layerosm
const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});
//darklayer
const Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
maxZoom: 20,
attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});
//ADDTO MAP
const map = L.map('map', {
    center: [30, -8 ],
    zoom: 5,
    layers: [osm],
    zoomControl: false
});

function onEachFeature(feature, layer) {
layer.bindPopup('<b> Plage </b> : ' + feature.properties.nom +
'<br>'+
'<br> <b>Commune</b> : ' + feature.properties.Commune+
'<br>'+
'<br> <b>Frenquatation/j </b> : ' + feature.properties.Frequ_parj +
'<br>'+
'<br> <b>Qualité de l&#39eau</b> : ' + feature.properties.Qualité+
'<br>'+
'<br> <b>Etendue de la plage</b> : ' + feature.properties.Etendue_km + ' KM')
;
};

/* global campus, bicycleRental, freeBus, coorsField */
const plages = L.geoJSON([plage], {
    onEachFeature,
    style(feature) {
        return feature.properties && feature.properties.style;
    },

    pointToLayer(feature, latlng) {
        return L.circleMarker(latlng, {
            radius: 5,
            fillColor: '#FFB767',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 1
        });
    }
}).addTo(map);
// Add autoroutes
function polyline(feature) {
return {
    fillColor: 'pink',
    weight: 2,
    opacity: 1,
    color: 'red',  //Outline color
    fillOpacity: 1
};
}

const routesLayer = L.geoJSON(autoroutes, {style: polyline});
function polygon(feature) {
return {
    fillColor: 'lightgreen', //pour choroplete getColor(feature.properties.num_pop)
    weight: 2,
    opacity: 1,
    color: 'green',  //Outline color
    fillOpacity: 0.7
};
}
const regionsLayer = L.geoJSON(regions, {style: polygon})
const baseLayers = {
    'OpenStreetMap': osm,
    // 'Stéreo': Stadia_AlidadeSmoothDark,
    'Satellite': satellite	};

//const regions = L.layerGroup(regionsLayer);
const overlays = {
    'Plages' : plages,
    'Autoroutes' : routesLayer,
    'Regions ' : regionsLayer
};
const layerControl = L.control.layers(baseLayers,overlays).addTo(map);

///affichage des coordonnees
map.on('mouseover', function () {
    console.log('your mouse is over the map')
})
map.on('mousemove', function (e) {
    document.getElementsByClassName('coordinate')[0].innerHTML = '  Latitude : '+'' + e.latlng.lat.toFixed(3) + '   ;    '+ '  Longitude : ' + e.latlng.lng.toFixed(3);
    console.log('lat: ' + e.latlng.lat, 'lng: ' + e.latlng.lng)
})

/////Echelle
L.control.scale().addTo(map)
///code de positionnement.
var lc = L.control
.locate({
position: "topright",
strings: {
  title: "Show me where I am, yo!"
}
})
.addTo(map);

L.control.zoom({
position: 'bottomright'
}).addTo(map);

L.Control.geocoder().addTo(map);

// filter input


// trigge input
var nbrPlages = myBeaches.length;
var myBeaches = ["SAÏDIA","RAS EL MA","KARIAT AREKMANE","OUED LAOU","SFIHA","DALYA","MOULAY BOUSSELHAM","LES NATIONS","SKHIRAT AMPHITRITE","BOUZNIKA","AÏN DIAB"];


function clickPress(event) {
    if (event.key == "Enter") {
        let input = document.getElementById("userInput").value; 
        alert("Correction des bugs en cours veuillez utiliser la loupe à droite de l'écran !")
        // if(myBeaches.indexOf(input) !== -1)  {  
        //     alert("OK");   
        // }   
        // else  {  
        //     alert("No, the value is absent.");
        // }  
    }
}



// function beachesFilter(feature, input) {
//   if (feature.properties.nom === input) return true
// }



// for (var i = 0; i < nbrPlages; i++) {
//     console.log(myBeaches[i]);


//     var search_beach = //Do something
// }


// "nom": "SAÏDIA"
// "nom": "RAS EL MA", "pavil
// "nom": "KARIAT AREKMANE", 
// "nom": "OUED LAOU", "pavil
// "nom": "SFIHA", "pavillon_
// "nom": "DALYA", "pavillon_
// "nom": "MOULAY BOUSSELHAM"
// "nom": "LES NATIONS", "pav
// "nom": "SKHIRAT AMPHITRITE"
// "nom": "BOUZNIKA", "pavill
// "nom": "AÏN DIAB", "pavill
// "nom": "SIDI ABED", "pavil
// "nom": "SAFI", "pavillon_b
// "nom": "Essaouira", "pavil
// "nom": "LALLA FATNA", "pav
// "nom": "IMMSOUANE", "pavil
// "nom": "TAGHAZOUT", "pavil
// "nom": "SIDI MOUSSA AGLOU"
// "nom": "SIDI IFNI", "pavil
// "nom": "IMI N’TOURGA", "pa
// "nom": "EL OUATIA", "pavil
// "nom": "KASAMAR", "pavillo
// "nom": "FOUM EL OUED", "pa
// "nom": "BOUJDOUR", "pavill
// "nom": "FOUM LABOUIR", "pa
// "nom": "CAMPING MOUSSAFIR"
// "nom": "TROUK", "pavillon"