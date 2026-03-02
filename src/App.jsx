
import React,{useState,useEffect,useRef,useCallback}from'react';
import{MapContainer,TileLayer,GeoJSON,useMap}from'react-leaflet';
import'leaflet/dist/leaflet.css';

const DEPTS=['Alibori','Atacora','Atlantique','Borgou','Collines','Couffo','Donga','Littoral','Mono','Oueme','Plateau','Zou'];

const GEO_BENIN={type:'FeatureCollection',features:[
{type:'Feature',properties:{shapeName:'Alibori'},geometry:{type:'Polygon',coordinates:[[[2.7,11.7],[3.9,11.7],[3.9,12.4],[2.7,12.4],[2.7,11.7]]]}},
{type:'Feature',properties:{shapeName:'Atacora'},geometry:{type:'Polygon',coordinates:[[[1.0,9.8],[2.7,9.8],[2.7,11.7],[1.0,11.7],[1.0,9.8]]]}},
{type:'Feature',properties:{shapeName:'Atlantique'},geometry:{type:'Polygon',coordinates:[[[2.0,6.3],[2.8,6.3],[2.8,7.0],[2.0,7.0],[2.0,6.3]]]}},
{type:'Feature',properties:{shapeName:'Borgou'},geometry:{type:'Polygon',coordinates:[[[2.7,9.0],[3.9,9.0],[3.9,11.7],[2.7,11.7],[2.7,9.0]]]}},
{type:'Feature',properties:{shapeName:'Collines'},geometry:{type:'Polygon',coordinates:[[[2.0,7.8],[3.1,7.8],[3.1,9.0],[2.0,9.0],[2.0,7.8]]]}},
{type:'Feature',properties:{shapeName:'Couffo'},geometry:{type:'Polygon',coordinates:[[[1.5,6.8],[2.0,6.8],[2.0,7.8],[1.5,7.8],[1.5,6.8]]]}},
{type:'Feature',properties:{shapeName:'Donga'},geometry:{type:'Polygon',coordinates:[[[1.0,8.5],[2.7,8.5],[2.7,9.8],[1.0,9.8],[1.0,8.5]]]}},
{type:'Feature',properties:{shapeName:'Littoral'},geometry:{type:'Polygon',coordinates:[[[2.3,6.2],[2.5,6.2],[2.5,6.5],[2.3,6.5],[2.3,6.2]]]}},
{type:'Feature',properties:{shapeName:'Mono'},geometry:{type:'Polygon',coordinates:[[[1.5,6.2],[2.0,6.2],[2.0,6.8],[1.5,6.8],[1.5,6.2]]]}},
{type:'Feature',properties:{shapeName:'Oueme'},geometry:{type:'Polygon',coordinates:[[[2.5,6.3],[3.1,6.3],[3.1,7.0],[2.5,7.0],[2.5,6.3]]]}},
{type:'Feature',properties:{shapeName:'Plateau'},geometry:{type:'Polygon',coordinates:[[[2.5,7.0],[3.1,7.0],[3.1,7.8],[2.5,7.8],[2.5,7.0]]]}},
{type:'Feature',properties:{shapeName:'Zou'},geometry:{type:'Polygon',coordinates:[[[2.0,7.0],[2.8,7.0],[2.8,7.8],[2.0,7.8],[2.0,7.0]]]}}
]};

const BASE_SCORES={Alibori:{score:75,incidents:12,meteo:'A'},Atacora:{score:62,incidents:8,meteo:'B'},Atlantique:{score:30,incidents:3,meteo:'B'},Borgou:{score:54,incidents:7,meteo:'B'},Collines:{score:31,incidents:4,meteo:'C'},Couffo:{score:26,incidents:2,meteo:'C'},Donga:{score:57,incidents:9,meteo:'B'},Littoral:{score:21,incidents:1,meteo:'D'},Mono:{score:22,incidents:2,meteo:'C'},Oueme:{score:35,incidents:4,meteo:'C'},Plateau:{score:36,incidents:3,meteo:'C'},Zou:{score:44,incidents:5,meteo:'B'}};
const ALERTS_BASE=[{level:'CRITICAL',dept:'Alibori',msg:'Convergence: incidents+chaleur+frontiere',time:'09:47'},{level:'HIGH',dept:'Atacora',msg:'Activite transfrontaliere inhabituelle',time:'08:23'},{level:'MEDIUM',dept:'Borgou',msg:'Tensions communautaires zone pastorale',time:'07:15'}];
const TICKER_MSGS=['[METEO] Alerte chaleur 42C prevus nord Benin','[DIPLO] Reunion CEDEAO Cotonou - agenda securitaire sous-region','[ECONOMIE] Hausse prix carburant +8% impact transport nord','[SECURITE] Incident frontalier Atacora - situation sous controle','[SANTE] Surveillance epidemiologique active zone Alibori'];

const riskColor=s=>s>=70?'#ff2200':s>=50?'#ff8800':s>=30?'#ffcc00':'#00ffcc44';

export default function App(){
  const [scores,setScores]=useState(BASE_SCORES);
  const [tick,setTick]=useState(0);
  const [sel,setSel]=useState(null);
  const [layers,setLayers]=useState({SECURITE:true,METEO:true,ECONOMIE:true,FRONTIERES:true,INFRA:false});
  const [alerts,setAlerts]=useState(ALERTS_BASE);
  const [tickerIdx,setTickerIdx]=useState(0);
  const tickRef=useRef(0);

  useEffect(()=>{
    const iv=setInterval(()=>{
      tickRef.current+=1;
      setTick(t=>t+1);
      setScores(prev=>{
        const n={...prev};
        DEPTS.forEach(d=>{n[d]={...n[d],score:Math.max(5,Math.min(100,n[d].score+(Math.random()-0.48)*2))};});
        return n;
      });
      if(tickRef.current%5===0)setTickerIdx(i=>(i+1)%TICKER_MSGS.length);
    },3000);
    return()=>clearInterval(iv);
  },[]);

  const gS=Math.round(Object.values(scores).reduce((a,d)=>a+d.score,0)/Object.keys(scores).length);

  const styleGeo=(f)=>{
    const nm=f.properties.shapeName;
    const d=scores[nm]||{score:30};
    return{weight:1,color:'#00ffcc44',fillColor:riskColor(d.score),fillOpacity:0.6};
  };

  const onEachFeature=(f,l)=>{
    const nm=f.properties.shapeName||'?';
    const d=scores[nm]||{score:0,incidents:0,meteo:'A'};
    l.bindPopup('<b>'+nm+'</b><br>Risque: '+Math.round(d.score)+'/100<br>Incidents: '+d.incidents+'<br>Meteo: '+d.meteo);
    l.on('click',()=>setSel(nm));
  };

  const now=new Date();
  const time=now.toTimeString().slice(0,8);

  return <div className='app'>
    <header className='hdr'>
      <div className='hdr-l'><span className='logo'>BJ MONITOR</span><span className='ver'>V7.0</span></div>
      <div className='hdr-c'><span className='time'>{time}</span><span className='gidx' style={{color:riskColor(gS)}}>INDICE NATIONAL: {gS}/100</span></div>
      <div className='hdr-r'><span className='live'>DIRECT</span><span className='cyc'>Cycle {tick}</span></div>
    </header>
    <div className='body'>
      <aside className='lpanel'>
        <div className='pblk'>
          <h3>COUCHES</h3>
          <div className='layers'>
            {Object.keys(layers).map(k=><div key={k} className={'layer '+(layers[k]?'on':'off')} onClick={()=>setLayers(p=>({...p,[k]:!p[k]}))}>{k}</div>)}
          </div>
        </div>
        <div className='pblk'>
          <h3>INDICE PAR DEPT</h3>
          {Object.entries(scores).map(([k,v])=><div key={k} className='drow' onClick={()=>setSel(sel===k?null:k)}>
            <span className='dnm'>{k}</span>
            <div className='dbar'>
              <div style={{width:Math.round(v.score)+'%',height:'100%',background:riskColor(v.score),transition:'width 0.5s'}}></div>
            </div>
            <span style={{color:riskColor(v.score),fontSize:'11px'}}>{Math.round(v.score)}</span>
          </div>)}
        </div>
      </aside>
      <main className='mapa'>
        <MapContainer center={[9.3,2.3]} zoom={7} style={{height:'100%',width:'100%'}} zoomControl={true}>
          <TileLayer url='https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' attribution='CartoDB'/>
          <GeoJSON data={GEO_BENIN} style={styleGeo} onEachFeature={onEachFeature}/>
        </MapContainer>
      </main>
      <aside className='rpanel'>
        <div className='pblk'>
          <h3>ALERTES CONVERGENTES</h3>
          {alerts.map((a,i)=><div key={i} className='alert'>
            <span className={'alv '+a.level.toLowerCase()}>{a.level}</span>
            <span className='aldept'>{a.dept}</span>
            <p className='almsg'>{a.msg}</p>
            <span className='altime'>{a.time}</span>
          </div>)}
        </div>
        <div className='pblk'>
          <h3>INCIDENTS (12 MOIS)</h3>
          <div className='chart'>
            {[18,22,15,30,25,36,28,20,14,22,18,24].map((v,i)=><div key={i} className='bar' style={{height:(v/36*100)+'%'}}></div>)}
          </div>
          <div className='xlabels'>{['Fev','Avr','Jun','Aou','Oct','Dec'].map(l=><span key={l}>{l}</span>)}</div>
        </div>
        <div className='pblk'>
          <h3>PIB CROISSANCE (%)</h3>
          <div className='chart2'>
            {[5.8,6.0,6.4,6.1,6.5,6.8,6.2,6.9,7.0,6.7,7.1,7.3].map((v,i)=><div key={i} className='bar2' style={{height:(v/8*100)+'%'}}></div>)}
          </div>
          <div className='xlabels'>{['Jan','Fev','Avr','Jun','Jul','Aou','Oct','Dec'].map(l=><span key={l}>{l}</span>)}</div>
        </div>
      </aside>
    </div>
    <div className='ticker'>
      <span className='tmsg'>{TICKER_MSGS[tickerIdx]}</span>
      <span className='tarr'>&#9658;</span>
      <span className='tmsg'>{TICKER_MSGS[(tickerIdx+1)%TICKER_MSGS.length]}</span>
      <span className='tarr'>&#9658;</span>
      <span className='tmsg'>{TICKER_MSGS[(tickerIdx+2)%TICKER_MSGS.length]}</span>
    </div>
  </div>;
}
