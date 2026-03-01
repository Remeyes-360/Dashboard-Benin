import React,{useEffect,useRef,useState}from'react'
import L from'leaflet'
import'leaflet/dist/leaflet.css'
import{BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer}from'recharts'
import'./App.css'
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({iconUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',iconRetinaUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',shadowUrl:'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'})
const STATS=[{val:'$2.9B',label:'IDE 2025',chg:'+19.2%',up:true},{val:'$912M',label:'Remittances',chg:'+13.8%',up:true},{val:'$1.3B',label:'Budget 2026',chg:'+8.5%',up:true},{val:'4.1%',label:'Inflation',chg:'-1.2%',up:false}]
const CHART=[{n:'IDE',v:2.9},{n:'Budget',v:1.3},{n:'Remit',v:0.9},{n:'Export',v:1.1}]
const NEWS=[{src:'LaFraternite',title:'Port de Cotonou: Nouveau terminal conteneurs operationnel',time:'Il y a 3h'},{src:'24H Benin',title:'Sommet CEDEAO a Porto-Novo : Agenda securitaire prioritaire',time:'Il y a 7h'},{src:'Matin Libre',title:'Agriculture: Le Benin augmente ses exportations de coton',time:'Il y a 12h'}]
const CITIES=[{name:'Cotonou',lat:6.3703,lng:2.3912,pop:'679 012'},{name:'Porto-Novo',lat:6.4969,lng:2.6289,pop:'264 320'},{name:'Parakou',lat:9.3372,lng:2.6303,pop:'255 478'},{name:'Abomey-Calavi',lat:6.4489,lng:2.3553,pop:'118 646'},{name:'Natitingou',lat:10.3047,lng:1.3781,pop:'107 167'},{name:'Djougou',lat:9.7085,lng:1.6651,pop:'251 539'}]
export default function App(){
const mapRef=useRef(null)
const mapInst=useRef(null)
const[time,setTime]=useState(new Date().toLocaleTimeString('fr-FR'))
useEffect(()=>{const t=setInterval(()=>setTime(new Date().toLocaleTimeString('fr-FR')),1000);return()=>clearInterval(t)},[])
useEffect(()=>{if(mapInst.current)return
const m=L.map(mapRef.current,{center:[9.30769,2.31583],zoom:7})
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxZoom:19}).addTo(m)
CITIES.forEach(c=>L.marker([c.lat,c.lng]).addTo(m).bindPopup('<b>'+c.name+'</b><br>Pop: '+c.pop))
mapInst.current=m},[])
return(
<div className='app'>
<header className='header'>
<h1>BJ BENIN MONITOR</h1>
<div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
<span style={{color:'#94a3b8',fontSize:'.85rem'}}>{time}</span>
<div className='live-badge'>● LIVE</div>
</div>
</header>
<div className='container'>
<div className='map-section'>
<h2>Carte du Benin</h2>
<div className='map-wrap' ref={mapRef}></div>
</div>
<div className='sidebar'>
<div className='card'>
<h3>FLUX FINANCIERS</h3>
<div className='stat-grid'>
{STATS.map(s=><div key={s.label} className='stat'><div className='stat-val'>{s.val}</div><div className='stat-label'>{s.label}</div><div className={'stat-chg'+(s.up?'':' down')}>{s.chg}</div></div>)}
</div>
</div>
<div className='card'>
<h3>INDICATEURS</h3>
<ResponsiveContainer width='100%' height={180}>
<BarChart data={CHART}><CartesianGrid strokeDasharray='3 3' stroke='#334155'/><XAxis dataKey='n' tick={{fill:'#94a3b8',fontSize:11}}/><YAxis tick={{fill:'#94a3b8',fontSize:11}}/><Tooltip contentStyle={{background:'#1e293b',border:'none',color:'#fff'}}/><Bar dataKey='v' fill='#10b981' radius={[4,4,0,0]}/></BarChart>
</ResponsiveContainer>
</div>
<div className='card'>
<h3>MEDIAS BENINOIS</h3>
{NEWS.map(n=><div key={n.title} className='news-item'><div className='news-src'>{n.src}</div><div className='news-title'>{n.title}</div><div className='news-time'>{n.time}</div></div>)}
</div>
</div>
</div>
</div>
)
}