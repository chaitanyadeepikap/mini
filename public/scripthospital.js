let map;
let service;
let userPosition;

// Initialize the map and search for nearby hospitals
function initMap(position) {
  userPosition = position;

  map = new google.maps.Map(document.getElementById("map"), {
    center: userPosition,
    zoom: 14,
  });

  findHospitals(userPosition);
}

// Get user's current location
function getUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("User location:", userPosition);
        initMap(userPosition);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to fetch your location. Using a default location.");
        initMap({ lat: 18.10126, lng: 83.41392 }); // Default location
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
    initMap({ lat: 18.10126, lng: 83.41392 }); // Default location
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

// Search for nearby hospitals
function findHospitals(location) {
  console.log("Searching for hospitals near:", location);

  const request = {
    location: location,
    radius: 5000, // Search within 5 km radius
    keyword: "hospital",
  };

  service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      console.log("Hospitals found:", results);
      displayHospitals(results);

      results.forEach((place) => {
        addMarker(place, "http://maps.google.com/mapfiles/ms/icons/red-dot.png");
      });

    } else {  
      console.error("Nearby Search failed:", status);
      alert("No hospitals found nearby or an API error occurred.");
    }
  });
}


// Display hospitals sorted by ratings and calculate distance
function displayHospitals(hospitals) {
  const hospitalList = document.getElementById("hospital-list");
  hospitalList.innerHTML = "";

  if (!hospitals || hospitals.length === 0) {
    hospitalList.innerHTML = "<p>No hospitals found nearby.</p>";
    return;
  }

  // Sort hospitals based on ratings (highest first), handle missing ratings
  hospitals.sort((a, b) => (b.rating || 0) - (a.rating || 0));

  hospitals.forEach((place) => {
    if (!place.geometry || !place.geometry.location) return; // Skip invalid places

    const listItem = document.createElement("li");
    listItem.className = "hospital-item";

    const photoUrl =
      place.photos && place.photos.length > 0
        ? place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })
        : "https://via.placeholder.com/100?text=No+Image";

    listItem.innerHTML = `
      <img src="${photoUrl}" alt="${place.name}" class="hospital-photo" />
      <div class="hospital-details">
        <h3>${place.name}</h3>
        <p>${place.vicinity}</p>
        <p><strong>Rating:</strong> ${place.rating ? place.rating + " / 5" : "No rating"}</p>
        <p><strong>Distance:</strong> <span id="distance-${place.place_id}">Calculating...</span></p>
        <button class="get-directions-btn" onclick="getDirections(${place.geometry.location.lat()}, ${place.geometry.location.lng()})">Get Directions</button>
      </div>
    `;

    hospitalList.appendChild(listItem);

    // Calculate and display distance
    calculateDistance(place);
  });
}

// Calculate the distance using Google Maps Distance Matrix API
function calculateDistance(place) {
  const distanceService = new google.maps.DistanceMatrixService();

  distanceService.getDistanceMatrix(
    {
      origins: [userPosition],
      destinations: [place.geometry.location],
      travelMode: "DRIVING",
    },
    (response, status) => {
      const distanceElement = document.getElementById(`distance-${place.place_id}`);

      if (status === "OK" && response.rows[0].elements[0].status === "OK") {
        const distance = response.rows[0].elements[0].distance.text;
        distanceElement.textContent = distance;
      } else {
        console.error("Distance calculation failed:", status);
        distanceElement.textContent = "Distance not available";
      }
    }
  );
}

// Redirect to Google Maps for directions
function getDirections(lat, lng) {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(directionsUrl, "_blank");
}

// Event listener for "Find Nearby Hospitals" button
document.getElementById("hospitalFinderBtn").addEventListener("click", () => {
  getUserLocation();
});
