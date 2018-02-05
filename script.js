function initMap() {
    var markerArray = [];

    // Instantiate a directions service.
    var directionsService = new google.maps.DirectionsService;

    // Create a map and center it on Manhattan.
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 13,
        center: { lat: 40.771, lng: -73.974 }
    });

    // Create a renderer for directions and bind it to the map.
    var directionsDisplay = new google.maps.DirectionsRenderer({ map: map });

    // Instantiate an info window to hold step text.
    var stepDisplay = new google.maps.InfoWindow;

    // Display the route between the initial start and end selections.
    calculateAndDisplayRoute(directionsDisplay, directionsService, markerArray, stepDisplay, map);
}

function calculateAndDisplayRoute(directionsDisplay, directionsService,
    markerArray, stepDisplay, map) {
    // First, remove any existing markers from the map.
    for (var i = 0; i < markerArray.length; i++) {
        markerArray[i].setMap(null);
    }

    directionsService.route({
        origin: document.getElementById('start').value,
        destination: document.getElementById('end').value,
        travelMode: 'DRIVING'
    }, function (response, status) {
        // console.log(response.routes[0].overview_path);
        // console.log(getPaths(response.routes[0].legs));
        response.routes[0].overview_path.reduce(function (prev, current) {
            if (prev) {
                calcPoints(prev.lat(), prev.lng(), current.lat(), current.lng());
            }
            return current;
        }, null);
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
}

function calcPoints(x1, y1, x2, y2) {
    var a = x2 - x1;
    var b = y2 - y1;
    var angle = Math.atan(b / a);
    console.log(a, b, angle);
}

// flatten all the paths from all steps/legs to single array
function getPaths(legs) {
    return legs.reduce(function (acc, leg) {
        var steps = leg.steps.reduce(function (acc, step) {
            return acc.concat(step.path);
        }, []);
        return acc.concat(steps);
    }, []);
}