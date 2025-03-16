let map;
let service;

function initMap(userPosition) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: userPosition,
    zoom: 14,
  });
  findAmbulances(userPosition);
}

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
        initMap({ lat: 18.10126, lng:  83.4138});
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
    initMap({ lat: 18.10126, lng: 83.4138 });
  }
}

function findAmbulances(location) {
  const request = {
    location: location,
    radius: "5000",
    keyword: "ambulance service",
  };

  service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, (results, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      const ambulanceList = document.getElementById("ambulance-list");
      ambulanceList.innerHTML = "";

      results.forEach((place) => {
        if (place.geometry && place.geometry.location) {
          createMarker(place);
          fetchPlaceDetails(place.place_id);
        }
      });
    } else {
      alert("No ambulance services found nearby.");
    }
  });
}

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

function fetchPlaceDetails(placeId) {
  const detailsRequest = { placeId: placeId };
  service.getDetails(detailsRequest, (place, status) => {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      addAmbulanceToList(place);
    } else {
      console.error(`Place details request failed: ${status}`);
    }
  });
}

function addAmbulanceToList(place) {
  const ambulanceList = document.getElementById("ambulance-list");

  const photoUrl =
    place.photos && place.photos.length > 0
      ? place.photos[0].getUrl({ maxWidth: 100, maxHeight: 100 })
      : "https://via.placeholder.com/100?text=No+Image";

  const phoneNumber = place.formatted_phone_number || "Phone number not available";

  const listItem = document.createElement("li");
  listItem.className = "ambulance-item";
  listItem.innerHTML = `
    <img src="${photoUrl}" alt="${place.name}" class="ambulance-photo" />
    <div class="ambulance-details">
      <h3>${place.name}</h3>
      <p>${place.vicinity}</p>
      <p><strong>Phone:</strong> ${phoneNumber}</p>
    </div>
  `;

  ambulanceList.appendChild(listItem);
}

document.getElementById("ambulanceFinderBtn").addEventListener("click", () => {
  getUserLocation();
});
