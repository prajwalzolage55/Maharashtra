/**
 * Maharashtra: Unity in Diversity 2026
 * Pure Satellite View Map Engine (Esri World Imagery)
 * 100% Free - NO API KEY REQUIRED - NO BLOCKS / NO POLYGONS
 */

let mhMap = null;
let satelliteLayer = null;
let labelsLayer = null;
let streetLayer = null;
let activeMarker = null;
let isSatellite = true;

// Regional Centers for smooth cinematic flight
const regionalViews = {
  konkan: {
    name: "Konkan (कोकण)",
    badge: "Coastal Belt & Sea Forts",
    districts: "Mumbai City, Mumbai Suburban, Thane, Palghar, Raigad, Ratnagiri, Sindhudurg",
    center: [18.25, 73.15],
    zoom: 8,
    desc: "A breathtaking 720 km coastline on the Arabian Sea with the lush Sahyadri mountain ridge. Known for Alphonso (Hapus) mangoes, pristine beaches, coconut groves, and naval sea fortresses (Sindhudurg, Murud-Janjira, Kolaba)."
  },
  desh: {
    name: "Western Maharashtra / Desh (पश्चिम महाराष्ट्र / देश)",
    badge: "Sugar Belt & Historical Maratha Heart",
    districts: "Pune, Satara, Kolhapur, Sangli, Solapur",
    center: [17.65, 74.65],
    zoom: 8,
    desc: "The agrarian, cultural, and industrial heart of Maharashtra. Home to historic Maratha capitals, fertile sugarcane fields along the Krishna river, Kolhapur wrestling akhadas, and modern IT/auto hubs of Pune."
  },
  north_mh: {
    name: "North Maharashtra / Nashik (उत्तर महाराष्ट्र / नाशिक)",
    badge: "Spiritual Hub & Wine Capital",
    districts: "Nashik, Ahmednagar",
    center: [19.85, 74.25],
    zoom: 8,
    desc: "Spiritual sanctuary on the banks of Godavari river (Trimbakeshwar Jyotirlinga, Shirdi, Kumbh Mela). Known as the 'Wine Capital of India' with picturesque vineyards, red onions, and table grapes."
  },
  khandesh: {
    name: "Khandesh (खानदेश)",
    badge: "Tapi Basin & Banana Capital",
    districts: "Jalgaon, Dhule, Nandurbar",
    center: [21.15, 74.95],
    zoom: 8,
    desc: "Fertile Tapi river basin between the Satpura and Ajanta hills. Famous for massive banana plantations in Jalgaon, melodious Ahirani dialect, and tribal folklore."
  },
  marathwada: {
    name: "Marathwada (मराठवाडा)",
    badge: "Land of Saints & UNESCO Caves",
    districts: "Chhatrapati Sambhajinagar, Jalna, Beed, Latur, Nanded, Parbhani, Dharashiv, Hingoli",
    center: [19.25, 76.45],
    zoom: 8,
    desc: "Spiritual land of saint poets and UNESCO World Heritage rock architecture (Ajanta and Ellora Caves with Kailash Temple). Houses 3 Jyotirlingas, Hazur Sahib Nanded, and Paithani silk weaving."
  },
  vidarbha: {
    name: "Vidarbha (विदर्भ)",
    badge: "Tiger Capital & Mineral Heartland",
    districts: "Nagpur, Amravati, Akola, Yavatmal, Wardha, Chandrapur, Gadchiroli, Bhandara, Gondia, Washim, Buldhana",
    center: [20.75, 78.75],
    zoom: 7,
    desc: "Vast teak forests and wildlife sanctuaries in eastern Maharashtra. Known as the 'Tiger Capital of India' (Tadoba), home to Nagpur oranges, the 52,000-year-old Lonar meteorite crater lake, spicy Saoji cuisine, and winter capital Nagpur."
  }
};

// Key Landmark Pins across Maharashtra
const landmarkPins = [
  {
    name: "Mumbai (मुंबई)",
    type: "Capital City & Gateway of India",
    coords: [18.9220, 72.8347],
    desc: "State Capital, Financial Hub of India, Gateway of India & Marine Drive."
  },
  {
    name: "Pune (पुणे)",
    type: "Cultural & IT Capital",
    coords: [18.5204, 73.8567],
    desc: "Historic capital of the Maratha Empire, COEP, and modern tech and education hub."
  },
  {
    name: "Nagpur (नागपूर)",
    type: "Winter Capital & Tiger Gateway",
    coords: [21.1458, 79.0882],
    desc: "Winter Capital of Maharashtra, Vidhan Bhavan, and gateway to central Indian tiger reserves."
  },
  {
    name: "Chh. Sambhajinagar (छ. संभाजीनगर)",
    type: "UNESCO Heritage & Ajanta-Ellora",
    coords: [19.8762, 75.3433],
    desc: "World-famous rock-cut Kailash Temple at Ellora, Ajanta murals, and Daulatabad Fort."
  },
  {
    name: "Nashik (नाशिक)",
    type: "Godavari Pilgrimage & Vineyards",
    coords: [19.9975, 73.7898],
    desc: "Kumbh Mela city, Trimbakeshwar Jyotirlinga, and the wine capital of India."
  },
  {
    name: "Kolhapur (कोल्हापूर)",
    type: "Mahalakshmi & Historic Royalty",
    coords: [16.7050, 74.2433],
    desc: "Shahu Maharaj's social justice capital, wrestling akhadas, and handcrafted Kolhapuri Chappals."
  },
  {
    name: "Raigad Fort (रायगड)",
    type: "Maratha Capital of Shivaji Maharaj",
    coords: [18.2345, 73.4415],
    desc: "Sovereign capital where Chhatrapati Shivaji Maharaj was crowned in 1674 (Rajyabhishek)."
  },
  {
    name: "Sindhudurg Fort (सिंधुदुर्ग)",
    type: "Maratha Naval Fortress",
    coords: [16.0422, 73.4682],
    desc: "Historic ocean sea-fortress built by Chhatrapati Shivaji Maharaj in 1664."
  },
  {
    name: "Tadoba Tiger Reserve (ताडोबा)",
    type: "Premier Wildlife Sanctuary",
    coords: [20.2440, 79.3000],
    desc: "Oldest and largest national park in Maharashtra with high density of Bengal tigers."
  },
  {
    name: "Lonar Crater Lake (लोणार)",
    type: "Meteorite Impact Crater",
    coords: [19.9760, 76.5070],
    desc: "52,000-year-old hyper-velocity meteorite impact crater lake in Buldhana."
  }
];

function initPureSatelliteMap() {
  const mapContainer = document.getElementById('realMap');
  if (!mapContainer || typeof L === 'undefined') return;

  if (mhMap) {
    mhMap.remove();
    mhMap = null;
  }

  // Centered on Maharashtra
  mhMap = L.map('realMap', {
    center: [19.5, 76.0],
    zoom: 7,
    minZoom: 6,
    maxZoom: 18,
    scrollWheelZoom: true
  });

  // 1. FREE ESRI High-Resolution Satellite Tiles (NO API KEY REQUIRED)
  satelliteLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    {
      attribution: 'Satellite Imagery &copy; Esri, Maxar, Earthstar Geographics',
      maxZoom: 18
    }
  );

  // 2. Hybrid Reference Labels (Boundaries, Cities, Road Lines)
  labelsLayer = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 18
    }
  );

  // 3. Alternative Standard Street Layer (OpenStreetMap - 100% Free, NO API KEY)
  streetLayer = L.tileLayer(
    'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }
  );

  // Add real satellite imagery + clear place labels by default
  satelliteLayer.addTo(mhMap);
  labelsLayer.addTo(mhMap);

  // Add sleek pulsating location pins (NO BLOCKS!)
  landmarkPins.forEach(item => {
    const pinIcon = L.divIcon({
      className: 'sat-pin',
      html: `
        <div style="
          width: 14px;
          height: 14px;
          background: #FF6B00;
          border-radius: 50%;
          border: 2px solid #FFFFFF;
          box-shadow: 0 0 10px #FF6B00, 0 0 4px #000;
          cursor: pointer;
        "></div>
      `,
      iconSize: [14, 14],
      iconAnchor: [7, 7]
    });

    const marker = L.marker(item.coords, { icon: pinIcon }).addTo(mhMap);
    marker.bindPopup(`
      <div style="font-family: inherit;">
        <div style="color: #FF6B00; font-weight: 700; font-size: 0.95rem; margin-bottom: 2px;">${item.name}</div>
        <div style="color: #FFA94D; font-size: 0.75rem; font-weight: 600; margin-bottom: 4px;">${item.type}</div>
        <div style="font-size: 0.8rem; line-height: 1.4; color: #555;">${item.desc}</div>
      </div>
    `);
  });

  // Setup Region selector buttons
  setupRegionClicks();

  // Setup Satellite / Street toggle
  setupToggle();
}

function setupRegionClicks() {
  document.querySelectorAll('.region-pill[data-map-region]').forEach(btn => {
    btn.addEventListener('click', () => {
      const regKey = btn.getAttribute('data-map-region');
      if (regKey === 'all') {
        flyToAll();
      } else {
        flyToRegion(regKey);
      }
    });
  });
}

function flyToRegion(regKey) {
  const reg = regionalViews[regKey];
  if (!reg || !mhMap) return;

  // Cinematic smooth flight to region in satellite view
  mhMap.flyTo(reg.center, reg.zoom, { duration: 1.2 });

  // Update button active state
  document.querySelectorAll('.region-pill[data-map-region]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-map-region') === regKey);
  });

  // Update info panel below map
  updatePanel(reg.name, reg.badge, `Districts: ${reg.districts}`, reg.desc);
}

function flyToAll() {
  if (!mhMap) return;
  mhMap.flyTo([19.5, 76.0], 7, { duration: 1.2 });

  document.querySelectorAll('.region-pill[data-map-region]').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-map-region') === 'all');
  });

  updatePanel(
    "All Maharashtra (Satellite View)",
    "6 Administrative Divisions • 36 Districts",
    "Arabian Sea Coast, Sahyadri Mountain Range, Deccan Plateau, Tapi Basin, and Vidarbha Forests.",
    "Click any region button above or zoom freely on the satellite view to explore the real landscape, rivers, hills, and cities of Maharashtra."
  );
}

function updatePanel(title, badge, districts, desc) {
  const titleEl = document.getElementById('mapDetailTitle');
  const badgeEl = document.getElementById('mapDetailBadge');
  const distEl = document.getElementById('mapDetailDistricts');
  const descEl = document.getElementById('mapDetailDesc');

  if (titleEl) titleEl.textContent = title;
  if (badgeEl) badgeEl.textContent = badge;
  if (distEl) distEl.textContent = districts;
  if (descEl) descEl.textContent = desc;
}

function setupToggle() {
  const btn = document.getElementById('mapLayerToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    if (!mhMap) return;

    if (isSatellite) {
      // Switch to OpenStreetMap (Street)
      mhMap.removeLayer(satelliteLayer);
      mhMap.removeLayer(labelsLayer);
      streetLayer.addTo(mhMap);
      isSatellite = false;
      btn.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
        </svg>
        <span>Street Map</span>
      `;
    } else {
      // Switch back to Esri Satellite
      mhMap.removeLayer(streetLayer);
      satelliteLayer.addTo(mhMap);
      labelsLayer.addTo(mhMap);
      isSatellite = true;
      btn.innerHTML = `
        <svg class="svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
        </svg>
        <span>Satellite View</span>
      `;
    }
  });
}

window.initRealMap = initPureSatelliteMap;

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initPureSatelliteMap, 300);
});
