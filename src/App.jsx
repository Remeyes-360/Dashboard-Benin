
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BENIN_FACTS = {
  population: "13,754,688 (est. 2023)",
  area: "112,622 km²",
  regime: "République Présidentielle",
  currency: "Franc CFA (XOF)",
  independence: "1er Août 1960",
  capital: "Porto-Novo (const.), Cotonou (siège)",
  sources: [
    { name: "CIA World Factbook", url: "https://www.cia.gov/the-world-factbook/countries/benin/" },
    { name: "Gouvernement du Bénin", url: "https://www.gouv.bj/" },
    { name: "Banque Mondiale", url: "https://data.worldbank.org/country/benin" }
  ]
};

export default function App() {
  const [news] = useState([
    { id: 1, source: '24H BENIN', title: 'Plan d\'action sécuritaire : Le gouvernement renforce la surveillance au Nord.', date: 'Mars 2026', url: 'https://www.24haubenin.info/' },
    { id: 2, source: 'LA FRATERNITE', title: 'Économie : Le PIB du Bénin affiche une croissance résiliente.', date: 'Févr. 2026', url: 'https://lafraternite.bj/' }
  ]);

  const [alerts] = useState([
    { id: 1, type: 'critical', title: 'Menace terroriste - Nord', details: 'Activité accrue des groupes armés non-étatiques dans le parc W.', source: 'Tellimer', url: 'https://tellimer.com/research' },
    { id: 2, type: 'info', title: 'Stabilité Constitutionnelle', details: 'Continuité démocratique après échec tentative coup déc. 2025.', source: 'Reuters', url: 'https://www.reuters.com/' }
  ]);

  return (
    <div className="bj-monitor-pro">
      <header className="hdr">
        <div className="logo-box">
          <span className="logo-main">BÉNIN MONITOR</span>
          <span className="logo-sub">SYSTEM V4.0.5</span>
        </div>
        <div className="hdr-right">
          <div className="live-pulse">● LIVE DATA FEED</div>
          <div className="time">{new Date().toLocaleTimeString('fr-FR')}</div>
        </div>
      </header>

      <div className="layout">
        <aside className="panel p-left">
          <div className="section">
            <h3><span className="icon">📊</span> RÉSUMÉ NATIONAL</h3>
            <div className="info-grid">
              <div className="info-item"><label>Population</label><span>{BENIN_FACTS.population}</span></div>
              <div className="info-item"><label>Superficie</label><span>{BENIN_FACTS.area}</span></div>
              <div className="info-item"><label>Régime</label><span>{BENIN_FACTS.regime}</span></div>
              <div className="info-item"><label>Devise</label><span>{BENIN_FACTS.currency}</span></div>
              <div className="info-item"><label>Capitale</label><span>{BENIN_FACTS.capital}</span></div>
            </div>
          </div>

          <div className="section">
            <h3><span className="icon">🔗</span> SOURCES OFFICIELLES</h3>
            <div className="source-list">
              {BENIN_FACTS.sources.map(s => (
                <a key={s.name} href={s.url} target="_blank" className="src-link">{s.name} <small>↗</small></a>
              ))}
            </div>
          </div>

          <div className="section srt">
            <h3><span className="icon">📺</span> DIRECT SRT BÉNIN</h3>
            <iframe src="https://www.youtube.com/embed/live_stream?channel=UCxJlGbHU5InsKmvSf1Qd-TA" className="video-frame" frameBorder="0" allowFullScreen></iframe>
          </div>
        </aside>

        <main className="panel p-center">
          <div className="map-container-wrap">
            <MapContainer center={[9.3, 2.3]} zoom={7} className="leaflet-map" zoomControl={false}>
              <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" attribution='© CARTO' />
              <Circle center={[11.5, 2.0]} radius={50000} pathOptions={{color:'#ff0055', fillColor:'#ff0055', fillOpacity:0.1}} />
              <Marker position={[6.36, 2.41]}><Popup>Cotonou (Siège)</Popup></Marker>
              <Marker position={[6.5, 2.6]}><Popup>Porto-Novo (Capitale)</Popup></Marker>
            </MapContainer>
            <div className="map-overlay">GRID: B4-BENIN / SECTOR: WEST AFRICA</div>
          </div>
        </main>

        <aside className="panel p-right">
          <div className="section">
            <h3><span className="icon">🛡️</span> ALERTES SÉCURITÉ</h3>
            {alerts.map(a => (
              <div key={a.id} className={"alert-card " + a.type}>
                <div className="alert-head">
                  <span className="alert-type">{a.type.toUpperCase()}</span>
                  <span className="alert-src">{a.source}</span>
                </div>
                <h4>{a.title}</h4>
                <p>{a.details}</p>
                <a href={a.url} target="_blank" className="fact-check">FACT-CHECK SOURCE 🔗</a>
              </div>
            ))}
          </div>

          <div className="section">
            <h3><span className="icon">🗞️</span> DERNIÈRES NOUVELLES</h3>
            {news.map(n => (
              <div key={n.id} className="news-card">
                <div className="news-meta">
                  <span className="news-src">{n.source}</span>
                  <span className="news-date">{n.date}</span>
                </div>
                <p>{n.title}</p>
                <a href={n.url} target="_blank" className="src-link-sm">LIRE LA SUITE 🔗</a>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
