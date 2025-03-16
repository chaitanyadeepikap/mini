let map;
let service;
let userPosition;

// Initialize the map and search for pharmacies
function initMapForPharmacies(userPosition) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: userPosition,
    zoom: 14,
  });

  findPharmacies(userPosition);
}

// Get user's location
function getUserLocationForPharmacies() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        initMapForPharmacies(userPosition);
      },
      () => {
        alert("Unable to fetch location. Using a default location.");
        initMapForPharmacies({ lat: 18.10126, lng: 83.41392 }); // Default location
      }
    );
  } else {
    alert("Geolocation not supported by browser.");
    initMapForPharmacies({ lat: 18.10126, lng: 83.41392 }); // Default location
  }
}

function addMarker(place, iconUrl) {
  new google.maps.Marker({
    position: place.geometry.location,
    map: map,
    title: place.name,
    icon: {
      url: iconUrl,
      scaledSize: new google.maps.Size(40, 40), // Adjust marker size
    },
  });
}


// Search for pharmacies nearby
function findPharmacies(location) {
  const request = {
    location: location,
    radius: "10000", // Increased radius to 10 km
    keyword: "pharmacy", // Added keyword to improve search
  };

  service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if (results.length === 0) {
        alert("No pharmacies found nearby.");
        return;
      }

      const pharmacyList = document.getElementById("pharmacy-list");
      pharmacyList.innerHTML = ""; // Clear previous list

      results.forEach((place) => {
        if (place.geometry && place.geometry.location) {
          addPharmacyToList(place);
          addMarker(place, "http://maps.google.com/mapfiles/ms/icons/red-dot.png"); // Red marker for pharmacies
        }
      });
    } else {
      alert("Error fetching pharmacies. Please try again.");
      console.error("Google Places API Error:", status);
    }
  });
}
// Add pharmacies to the list
function addPharmacyToList(place) {
  const pharmacyList = document.getElementById("pharmacy-list");
  const listItem = document.createElement("li");
  listItem.className = "pharmacy-item";

  const photoUrl =
    place.photos && place.photos.length > 0
      ? place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })
      : "https://via.placeholder.com/100?text=No+Image";

  listItem.innerHTML = `
    <img src="${photoUrl}" alt="${place.name}" class="pharmacy-photo" />
    <div class="pharmacy-details">
      <h3>${place.name}</h3>
      <p>${place.vicinity}</p>
      <p id="distance-${place.place_id}">Calculating distance...</p>
      <button class="get-directions-btn" onclick='getDirections(${JSON.stringify({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      })})'>Get Directions</button>
    </div>
  `;

  pharmacyList.appendChild(listItem);

  calculateDistance(place, place.place_id);
}

// Calculate distance using Google Maps Distance Matrix API
function calculateDistance(place, placeId) {
  const distanceService = new google.maps.DistanceMatrixService();

  distanceService.getDistanceMatrix(
    {
      origins: [userPosition],
      destinations: [place.geometry.location],
      travelMode: "DRIVING",
    },
    (response, status) => {
      if (status === "OK" && response.rows[0].elements[0].status === "OK") {
        const distanceElement = document.getElementById(`distance-${placeId}`);
        const distance = response.rows[0].elements[0].distance.text;
        distanceElement.textContent = `Distance: ${distance}`;
      } else {
        console.error("Distance calculation failed:", status);
      }
    }
  );
}

// Redirect to Google Maps for directions
function getDirections(location) {
  const destination = `${location.lat},${location.lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
  window.open(directionsUrl, "_blank");
}

// Event listener for "Find Pharmacies" button
document.getElementById("pharmacyFinderBtn").addEventListener("click", () => {
  getUserLocationForPharmacies();
});
