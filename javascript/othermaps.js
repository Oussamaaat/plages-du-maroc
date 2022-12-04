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


//layerSatellites
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
//codecartechoroplete
const info = L.control();
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info');
    this.update();
    return this._div;
};
info.update = function (props) {
    const contents = props ? `<b>${props.nom_reg}</b><br />${props.num_pop} plages` : '';
    this._div.innerHTML = `<h4>Plages du Maroc</h4>${contents}`;
};
info.addTo(map);
function getColor(d) {
    return d > 30   ? '#FD8D3C' :
        d > 15   ? '#FEB24C' :
        d > 5   ? '#FED976' : '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.num_pop)
    };
}

function highlightFeature(e) {
    const layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    layer.bringToFront();

    info.update(layer.feature.properties);
}
const geojson = L.geoJson(regionsmaroc, {
    style,
    onEachFeature
});

function resetHighlight(e) {
    geojson.resetStyle(e.target);
    info.update();
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

const ref =map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    const div = L.DomUtil.create('div', 'info legend');
    const grades = [0, 5, 15, 30];
    const labels = [];
    let from, to;

    for (let i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];

        labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
    }

    div.innerHTML = labels.join('<br>');
    return div;
};

legend.addTo(map);

/////////carte a symbole proportionnel
frequentation.features.sort(function (a, b) {
        return b.properties.num_pop - a.properties.num_pop;
    });

    const opo= L.geoJson(frequentation, {
    
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                color: '#28305c',
                weight: 1,
                fillColor: '#f0f0f0',
                fillOpacity: 0.8,
                radius: getRadius((feature.properties.num_pop))
            });
        },
        onEachFeature: function (feature, layer) {
            var popup =
                '<p><b>'+ layer.feature.properties.nom_reg +'</b></p>' +
                '<p>Frequentation: ' + layer.feature.properties.num_pop +'</p>' 
            layer.on('mouseover', function () {
                layer.bindPopup(popup).openPopup();
                layer.setStyle({
                    fillColor: '#f7cd34',
                    fillOpacity: 0.5
                });
            });
            layer.on('mouseout', function () {
                layer.setStyle({
                    fillColor: 'white',
                    fillOpacity: 0.3
                });
                layer.bindPopup(popup).closePopup();
            })

        }
    });
    function getRadius(area) {
        var radius = Math.sqrt(area / Math.PI);
        return radius * 0.1;
    };
/////controllayers
const baseLayers = {
    'OpenStreetMap': osm,
    // 'streo': Stadia_AlidadeSmoothDark,
    'Satellite':satellite	};

const choro = L.layerGroup([geojson]);
const overlays = {

    'Nombre de plages/région' : choro,
    'Fréquentation des plages par région/j' : opo,
};

const layerControl = L.control.layers(baseLayers,overlays).addTo(map);
///affichage des coordonnees
map.on('mouseover', function () {
    console.log('your mouse is over the map')
})
map.on('mousemove', function (e) {
    document.getElementsByClassName('coordinate')[0].innerHTML = 'LAT: '+'' + e.latlng.lat + '       '+ 'LNG:' + e.latlng.lng;
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
