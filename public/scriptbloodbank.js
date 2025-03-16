let map;
let service;
let userPosition;

// Initialize the map and search for nearby blood banks
function initMap(position) {
    userPosition = position;
    map = new google.maps.Map(document.getElementById("map"), {
        center: position,
        zoom: 14,
    });
    findBloodBanks(position);
}

// Get user's current location
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const userPosition = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                initMap(userPosition);
            },
            () => {
                alert("Unable to fetch your location. Default location will be used.");
                initMap({ lat: 18.10126, lng: 83.41392 });
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
        initMap({ lat: 18.10126, lng: 83.41392 });
    }
}

// Search for nearby blood banks
function findBloodBanks(location) {
    const request = {
        location: location,
        radius: "5000",
        keyword: "blood bank",
    };

    service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            const bloodBankList = document.getElementById("bloodbank-list");
            bloodBankList.innerHTML = "";

            results.forEach((place) => {
                if (place.geometry && place.geometry.location) {
                    createMarker(place);
                    fetchPlaceDetails(place.place_id);
                }
            });
        } else {
            alert("No blood banks found nearby.");
        }
    });
}

// Create marker for each place on the map
function createMarker(place) {
    const marker = new google.maps.Marker({
        map: map,
        position: place.geometry.location,
        title: place.name,
    });

    const infowindow = new google.maps.InfoWindow({
        content: `<strong>${place.name}</strong>`,
    });

    marker.addListener("click", () => {
        infowindow.open(map, marker);
    });
}

// Fetch details of a place using Google Maps Places API
function fetchPlaceDetails(placeId) {
    const detailsRequest = {
        placeId: placeId,
    };
    service.getDetails(detailsRequest, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            addBloodBankToList(place);
        } else {
            console.error(`Place details request failed: ${status}`);
        }
    });
}

// Add the blood bank details to the list
function addBloodBankToList(place) {
    const bloodBankList = document.getElementById("bloodbank-list");

    const photoUrl =
        place.photos && place.photos.length > 0
            ? place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })
            : "https://via.placeholder.com/100?text=No+Image";

    const phoneNumber = place.formatted_phone_number || "Phone number not available";

    const listItem = document.createElement("li");
    listItem.className = "bloodbank-item";
    listItem.innerHTML = `
        <img src="${photoUrl}" alt="${place.name}" class="bloodbank-photo" />
        <div class="bloodbank-details">
            <h3>${place.name}</h3>
            <p>${place.vicinity}</p>
            <p><strong>Phone:</strong> ${phoneNumber}</p>
            <p><button class="get-directions-btn" onclick="getDirections(${place.geometry.location.lat()}, ${place.geometry.location.lng()})">Get Directions</button></p>
        </div>
    `;

    bloodBankList.appendChild(listItem);
}

// Function to redirect the user to Google Maps for directions
function getDirections(destinationLat, destinationLng) {
    const destination = new google.maps.LatLng(destinationLat, destinationLng);
    const origin = new google.maps.LatLng(userPosition.lat, userPosition.lng);

    // Construct the Google Maps URL for directions
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat()}%2C${origin.lng()}&destination=${destination.lat()}%2C${destination.lng()}&travelmode=driving`;

    // Redirect the user to the Google Maps directions page
    window.open(url, "_blank");
}

// Event listener for "Find Nearby Blood Banks" button
document.getElementById("bloodBankFinderBtn").addEventListener("click", () => {
    getUserLocation();
});
