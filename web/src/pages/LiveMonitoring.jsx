import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    MapPin,
    Navigation,
    Phone,
    Search,
    Target,
    TrendingUp,
    Truck,
    LocateFixed,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import api from "../services/api";
import { searchLocation } from "../services/rapidMaps";
import socketService from "../services/socket";

// Fix for default marker icons in modern bundlers
const iconUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png";
const shadowUrl = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Driver Card Component
const DriverStatusCard = ({ driver, onFocus }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-lg hover:border-gray-300 transition-all group relative overflow-hidden">
    <div className="flex justify-between items-start mb-4">
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F2933] to-gray-500 flex items-center justify-center relative">
          <span className="text-lg font-semibold text-white">
            {driver.name?.charAt(0)}
          </span>
          <div className={`absolute bottom-0 right-0 w-3 h-3 ${driver.isOnline ? "bg-emerald-500" : "bg-gray-400"} border-2 border-white rounded-full`}></div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#1F2933]">
              {driver.name}
            </h3>
            {driver.isOnline && (
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-medium px-1.5 py-0.5 rounded">
                LIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-xs mt-0.5">
            <Truck size={12} />
            <span>{driver.vehicleNumber || "No Vehicle"}</span>
            <span className="mx-1">•</span>
            <Phone size={12} />
            <span>{driver.phone}</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => driver.latitude && onFocus([driver.latitude, driver.longitude])}
        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 hover:text-[#1F2933] transition-all"
        title="Locate Driver"
        disabled={!driver.latitude}
      >
        <Navigation size={16} />
      </button>
    </div>

    <div className="space-y-3">
      <div className="flex justify-between items-end">
        <span className="text-xs font-medium text-gray-500">Shift Progress</span>
        <span className="text-sm font-semibold text-[#1F2933]">{driver.progress}%</span>
      </div>
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            driver.progress >= 80 ? "bg-emerald-500" : "bg-[#1F2933]"
          }`}
          style={{ width: `${driver.progress}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2">
        <div className="bg-gray-50 p-2 rounded-lg text-center">
          <p className="text-[10px] text-gray-500 font-medium">Total</p>
          <p className="text-sm font-semibold text-[#1F2933]">{driver.totalOrders}</p>
        </div>
        <div className="bg-emerald-50 p-2 rounded-lg text-center">
          <p className="text-[10px] text-emerald-600 font-medium">Done</p>
          <p className="text-sm font-semibold text-emerald-600">{driver.doneOrders}</p>
        </div>
        <div className="bg-amber-50 p-2 rounded-lg text-center">
          <p className="text-[10px] text-amber-600 font-medium">Left</p>
          <p className="text-sm font-semibold text-amber-600">{driver.totalOrders - driver.doneOrders}</p>
        </div>
      </div>

      <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <TrendingUp size={14} className="text-emerald-500" />
          <span className="text-xs font-medium text-gray-600">₹{driver.collection}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={12} className={driver.latitude ? "text-[#1F2933]" : "text-gray-400"} />
          <span className="text-[10px] font-medium text-gray-400">
            {driver.latitude ? `${driver.latitude.toFixed(4)}, ${driver.longitude.toFixed(4)}` : "Offline"}
          </span>
        </div>
      </div>
    </div>
  </div>
);

const LiveMonitoring = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      try {
        const map = L.map(mapRef.current, {
          center: [28.6139, 77.209],
          zoom: 13,
          zoomControl: false,
          layers: [
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
              attribution: '&copy; OpenStreetMap contributors',
            }),
          ],
        });
        L.control.zoom({ position: "bottomright" }).addTo(map);
        mapInstance.current = map;
      } catch (err) {
        console.error("Map initialization error:", err);
      }
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await api.get("/staff");
      const activeDrivers = res.data.filter((u) => u.role === "DRIVER");
      setDrivers(activeDrivers);

      const onlineDriverIds = new Set();
      activeDrivers.forEach((driver) => {
        if (driver.isOnline && driver.latitude && driver.longitude) {
          onlineDriverIds.add(driver.id);
          const coords = [driver.latitude, driver.longitude];

          if (markersRef.current[driver.id]) {
            markersRef.current[driver.id].setLatLng(coords);
          } else {
            const marker = L.marker(coords, { icon: DefaultIcon }).addTo(mapInstance.current)
              .bindPopup(`<div class="p-2"><h4 class="font-semibold text-gray-900">${driver.name}</h4><p class="text-xs text-gray-600">${driver.vehicleNumber || "No Vehicle"}</p></div>`);
            markersRef.current[driver.id] = marker;
          }
        }
      });

      Object.keys(markersRef.current).forEach((id) => {
        if (!onlineDriverIds.has(id)) {
          markersRef.current[id].remove();
          delete markersRef.current[id];
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    const socket = socketService.connect();

    socket.on("driverLocationUpdate", (update) => {
      setDrivers((prev) =>
        prev.map((d) =>
          d.id === update.id ? { ...d, latitude: update.latitude, longitude: update.longitude, isOnline: true } : d
        )
      );
      if (update.latitude && update.longitude && mapInstance.current) {
        const coords = [update.latitude, update.longitude];
        if (markersRef.current[update.id]) {
          markersRef.current[update.id].setLatLng(coords);
        }
      }
    });

    const interval = setInterval(fetchDrivers, 30000);
    return () => { clearInterval(interval); socket.off("driverLocationUpdate"); };
  }, []);

  const handleFocusDriver = (coords) => {
    if (mapInstance.current) {
      mapInstance.current.setView(coords, 16, { animate: true });
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const results = await searchLocation(searchQuery);
      if (results && results.length > 0) {
        const firstResult = results[0];
        let lat, lng;
        if (firstResult.latitude && firstResult.longitude) {
          lat = parseFloat(firstResult.latitude);
          lng = parseFloat(firstResult.longitude);
        }
        if (lat && lng) {
          mapInstance.current.flyTo([lat, lng], 15, { duration: 2 });
          L.marker([lat, lng], {
            icon: L.divIcon({
              html: `<div class="w-4 h-4 bg-red-500 border-2 border-white rounded-full"></div>`,
              className: "",
              iconSize: [16, 16],
            }),
          }).addTo(mapInstance.current).bindPopup(`<b>${firstResult.address || searchQuery}</b>`).openPopup();
        }
      }
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header with Search */}
      <div className="bg-white border border-gray-200 p-5 rounded-2xl" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-xl">
              <Target className="text-gray-600" size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#1F2933] flex items-center gap-2">
                Live Fleet Control
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              </h2>
              <p className="text-gray-500 text-sm">Real-time driver positioning & operational metrics</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="relative group max-w-md w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer location or area..."
              className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 rounded-xl py-2.5 pl-10 pr-24 text-[#1F2933] placeholder-gray-400 outline-none transition-all text-sm"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <button
              type="submit"
              disabled={searching}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#1F2933] hover:bg-gray-700 text-white rounded-lg transition-all text-sm font-medium"
            >
              {searching ? "..." : "Search"}
            </button>
          </form>
        </div>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.filter((d) => d.isOnline).map((driver) => (
          <DriverStatusCard key={driver.id} driver={driver} onFocus={handleFocusDriver} />
        ))}
        {drivers.filter((d) => d.isOnline).length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white border border-gray-200 rounded-2xl">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Truck size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-[#1F2933] mb-1">No Active Drivers</h3>
            <p className="text-gray-500 text-sm">Waiting for staff GPS connection...</p>
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="relative">
        {/* Floating Control Panel */}
        <div className="absolute top-4 left-4 z-10 hidden md:block">
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-lg flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
              <LocateFixed size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500">Live Connectivity</p>
              <p className="text-sm font-semibold text-[#1F2933] flex items-center gap-2">
                Maps Active
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.04)' }}>
          <div className="h-[500px] relative">
            <div ref={mapRef} style={{ height: "100%", width: "100%" }} className="z-0" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitoring;
