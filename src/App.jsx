
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ECON_DATA = [
  { year: '2021', gdp: 7.2, inflation: 1.7 },
  { year: '2022', gdp: 6.3, inflation: 1.4 },
  { year: '2023', gdp: 6.4, inflation: 3.4 },
  { year: '2024', gdp: 7.45, inflation: 2.3 },
  { year: '2025', gdp: 7.6, inflation: 2.0 },
];

const CITIES = [
  { name: 'Cotonou', pos: [6.365, 2.418], pop: '679k', info: 'Port & Commerce' },
  { name: 'Porto-Novo', pos: [6.497, 2.629], pop: '264k', info: 'Capitale Culturelle' },
  { name: 'Parakou', pos: [9.337, 2.630], pop: '255k', info: 'Hub de Transport' },
  { name: 'Djougou', pos: [9.708, 1.666], pop: '268k', info: 'Commerce Nord' },
  { name: 'Bohicon', pos: [7.178, 2.067], pop: '125k', info: 'Carrefour Routier' },
  { name: 'Abomey-Calavi', pos: [6.448, 2.355], pop: '385k', info: 'Université & Résidentiel' },
  { name: 'Natitingou', pos: [10.304, 1.379], pop: '104k', info: 'Tourisme (Atacora)' },
  { name: 'Kandi', pos: [11.134, 2.938], pop: '110k', info: 'Coton & Frontière' },
  { name: 'Ouidah', pos: [6.363, 2.085], pop: '83k', info: 'Histoire & Mémoire' }
];

const WEATHER = [
  { city: 'Cotonou', temp: 31, cond: 'Ensoleillé' },
  { city: 'Parakou', temp: 34, cond: 'Dégagé' },
  { city: 'Natitingou', temp: 29, cond: 'Part. Nuageux' }
];

const VIDEOS = {
  tourism: [
    { id: 'n5cUiPrDc00', title: 'Top 10 à faire au Bénin' },
    { id: 'go5s1fLiKUA', title: 'Merveilles du Bénin' }
  ],
  mentions: [
    { id: '9vtlkFVcZcU', title: 'Première visite : Surprise !' }
  ]
};

export default function App() {
  const [activeTab, setActiveTab] = useState('tourism');
  const [news] = useState([
    { id: 1, source: '24H BENIN', title: 'Plan d\'action sécuritaire au Nord.', date: 'Mars 2026', url: 'https://www.24haubenin.info/' },
    { id: 2, source: 'LA FRATERNITE', title: 'PIB : Croissance résiliente confirmée.', date: 'Févr. 2026', url: 'https://lafraternite.bj/' }
  ]);

  return (
    <div className="bj-monitor-pro">
      <header className="hdr">
        <div className="logo-box">
          <span className="logo-main">BÉNIN MONITOR</span>
          <span className="logo-sub">SYSTEM V5.0.1</span>
        </div>
        <div className="hdr-right">
          <div className="live-pulse">● LIVE OPS</div>
          <div className="time">{new Date().toLocaleTimeString('fr-FR')}</div>
        </div>
      </header>

      <div className="layout">
        <aside className="panel p-left">
          <div className="section">
            <h3>📊 ÉCONOMIE (CROISSANCE %)</h3>
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={150}>
                <LineChart data={ECON_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="year" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip contentStyle={{background:'#000', border:'1px solid #00f2ff'}} />
                  <Line type="monotone" dataKey="gdp" stroke="#00f2ff" strokeWidth={2} dot={{r:3}} />
                  <Line type="monotone" dataKey="inflation" stroke="#ff0055" strokeWidth={2} dot={{r:3}} />
                </LineChart>
              </ResponsiveContainer>
              <div className="chart-legend">
                <span className="leg-gdp">■ PIB</span>
                <span className="leg-inf">■ Inflation</span>
              </div>
            </div>
          </div>

          <div className="section">
            <h3>🌡️ MÉTÉO PAR RÉGION</h3>
            <div className="weather-grid">
              {WEATHER.map(w => (
                <div key={w.city} className="w-item">
                  <span className="w-city">{w.city}</span>
                  <span className="w-temp">{w.temp}°C</span>
                  <span className="w-cond">{w.cond}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h3>📺 MÉDIA & TOURISME</h3>
            <div className="tab-buttons">
              <button className={activeTab === 'tourism' ? 'active' : ''} onClick={() => setActiveTab('tourism')}>Tourisme</button>
              <button className={activeTab === 'mentions' ? 'active' : ''} onClick={() => setActiveTab('mentions')}>Vlogs</button>
              <button className={activeTab === 'direct' ? 'active' : ''} onClick={() => setActiveTab('direct')}>Direct</button>
            </div>
            <div className="video-content">
              {activeTab === 'direct' ? (
                <iframe src="https://www.youtube.com/embed/live_stream?channel=UCxJlGbHU5InsKmvSf1Qd-TA" className="v-frame" frameBorder="0" allowFullScreen></iframe>
              ) : (
                VIDEOS[activeTab].map(v => (
                  <div key={v.id} className="v-item">
                    <iframe src={"https://www.youtube.com/embed/" + v.id} className="v-frame-sm" frameBorder="0" allowFullScreen></iframe>
                    <p>{v.title}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        <main className="panel p-center">
          <div className="map-container-wrap">
            <MapContainer center={[9.3, 2.3]} zoom={7} className="leaflet-map" zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='&copy; CARTO' />
              {CITIES.map(c => (
                <Marker key={c.name} position={c.pos}>
                  <Popup>
                    <strong>{c.name}</strong><br/>
                    Pop: {c.pop}<br/>
                    <em>{c.info}</em>
                  </Popup>
                </Marker>
              ))}
              <Circle center={[11.5, 2.0]} radius={50000} pathOptions={{color:'#ff0055', fillColor:'#ff0055', fillOpacity:0.1}} />
            </MapContainer>
            <div className="map-overlay">ZONES OPÉRATIONNELLES : BÉNIN SECTOR</div>
          </div>
        </main>

        <aside className="panel p-right">
          <div className="section">
            <h3>🛡️ ALERTES RÉELLES</h3>
            <div className="alert-card critical">
              <div className="alert-head">CRITICAL | TELLIMER</div>
              <h4>Menace Nord</h4>
              <p>Incursions signalées zone Parc W.</p>
              <a href="https://tellimer.com" target="_blank" className="fact-check">CHECK SOURCE 🔗</a>
            </div>
          </div>

          <div className="section">
            <h3>🗞️ DERNIÈRES INFOS</h3>
            {news.map(n => (
              <div key={n.id} className="news-card">
                <div className="news-meta"><span>{n.source}</span><span>{n.date}</span></div>
                <p>{n.title}</p>
                <a href={n.url} target="_blank" className="src-link-sm">FACT-CHECK 🔗</a>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
