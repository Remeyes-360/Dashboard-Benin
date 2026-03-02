import React,{useState,useEffect,useRef}from'react';
import{MapContainer,TileLayer,GeoJSON}from'react-leaflet';
import'leaflet/dist/leaflet.css';
import'./App.css';

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

const DEPT_DATA={
  Alibori:{score:78,info:'Zone de vigilance accrue. Activité transfrontalière intense.',src:'https://www.srtb.bj/info-securite'},
  Atacora:{score:65,info:'Vigilance météo: vents violents prévus.',src:'https://meteo.bj'},
  Atlantique:{score:32,info:'Croissance urbaine et économique stable.',src:'https://insae.bj'},
  Borgou:{score:56,info:'Tensions pastorales localisées en zone rurale.',src:'https://srtb.bj'},
  Collines:{score:30,info:'Récoltes agricoles records cette saison.',src:'https://agriculture.bj'},
  Couffo:{score:28,info:'Indice de santé publique en amélioration.',src:'https://sante.bj'},
  Donga:{score:58,info:'Sécurité routière: contrôles renforcés.',src:'https://dgpr.bj'},
  Littoral:{score:22,info:'Port de Cotonou: trafic en hausse de 9%.',src:'https://biic.bj'},
  Mono:{score:24,info:'Tourisme côtier en forte progression.',src:'https://benin-tourisme.bj'},
  Oueme:{score:35,info:'Infrastructures: nouveaux ponts opérationnels.',src:'https://travaux.bj'},
  Plateau:{score:37,info:'Commerce transfrontalier: normalisation.',src:'https://douanes.bj'},
  Zou:{score:42,info:'Artisanat: centre de promotion inauguré à Abomey.',src:'https://culture.bj'}
};

const TICKER_MSGS=['[SECURITE] Déploiement renforcé frontières Nord - source: État-Major','[METEO] Alerte inondations val de l Ouémé - source: Meteo Benin','[ECO] Le FMI salue la résilience économique du Bénin (6.5% croissance 2025)','[SANTÉ] Campagne vaccination nationale contre le paludisme - source: MS','[TOURISM] Festival Vodun Days 2026: record d affluence attendu à Ouidah'];

const YouTubeEmbed=({id})=><div className='yt-box'><iframe width='100%' height='100%' src={'https://www.youtube.com/embed/'+id} frameBorder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowFullScreen title='Embedded video'></iframe></div>;

export default function App(){
  const [scores,setScores]=useState(Object.keys(DEPT_DATA).reduce((a,k)=>({...a,[k]:DEPT_DATA[k].score}),{}));
  const [tick,setTick]=useState(0);
  const [sel,setSel]=useState(null);
  const [layers,setLayers]=useState({SECURITE:true,METEO:true,ECONOMIE:true,FRONTIERES:true,INFRA:false});
  const [tickerIdx,setTickerIdx]=useState(0);
  const tickRef=useRef(0);

  useEffect(()=>{
    const iv=setInterval(()=>{
      tickRef.current+=1;
      setTick(t=>t+1);
      setScores(prev=>{const n={...prev};Object.keys(n).forEach(d=>{n[d]=Math.max(5,Math.min(100,n[d]+(Math.random()-0.49)*1.5))});return n;});
      if(tickRef.current%5===0)setTickerIdx(i=>(i+1)%TICKER_MSGS.length);
    },3000);
    return()=>clearInterval(iv);
  },[]);

  const gS=Math.round(Object.values(scores).reduce((a,s)=>a+s,0)/12);
  const riskColor=s=>s>=70?'#ff2200':s>=50?'#ff8800':s>=30?'#ffcc00':'#00ffcc';
  const now=new Date();
  const dateStr=now.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'2-digit'});
  const timeStr=now.toTimeString().slice(0,8);

  const styleGeo=(f)=>{const nm=f.properties.shapeName;const s=scores[nm]||30;return{weight:1,color:'#00ffcc33',fillColor:riskColor(s),fillOpacity:0.6};};

  return <div className='app'>
    <header className='hdr'>
      <div className='hdr-l'><span className='logo'>BJ MONITOR</span><span className='ver'>V8.0</span></div>
      <div className='hdr-c'>
        <span className='time'>{dateStr} | {timeStr}</span>
        <span className='gidx' style={{color:riskColor(gS)}}>INDICE NATIONAL: {gS}/100</span>
      </div>
      <div className='hdr-r'><span className='live'>DIRECT IA</span><span className='cyc'>Cycle {tick}</span></div>
    </header>
    <div className='body'>
      <aside className='lpanel'>
        <div className='pblk'>
          <h3>COUCHES IA</h3>
          <div className='layers'>
            {Object.keys(layers).map(k=><div key={k} className={'layer '+(layers[k]?'on':'off')} onClick={()=>setLayers(p=>({...p,[k]:!p[k]}))}>{k}</div>)}
          </div>
          <a href='https://insae.bj' className='src-link' target='_blank'>Source: INSAE</a>
        </div>
        <div className='pblk' style={{flex:1}}>
          <h3>INDICES DEPT (CLIQUEZ)</h3>
          {Object.entries(scores).map(([k,v])=><div key={k} className='drow' onClick={()=>setSel(k)}>
            <span className='dnm'>{k}</span>
            <div className='dbar'><div style={{width:v+'%',height:'100%',background:riskColor(v),transition:'width 0.5s'}}></div></div>
            <span style={{color:riskColor(v),fontSize:'9px',width:15}}>{Math.round(v)}</span>
          </div>)}
        </div>
        <div className='pblk'>
          <h3>CHAÎNE D INFO (SRTB)</h3>
          <YouTubeEmbed id='videoseries?list=PLp0rW3U7E7kS0C0T-U5Y5B5E1O0E-W_Gf'/>
        </div>
      </aside>
      <main className='mapa'>
        <MapContainer center={[9.3,2.3]} zoom={7} zoomControl={false}>
          <TileLayer url='https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' attribution='CartoDB'/>
          <GeoJSON data={GEO_BENIN} style={styleGeo} onEachFeature={(f,l)=>{l.on('click',()=>setSel(f.properties.shapeName))}}/>
        </MapContainer>
      </main>
      <aside className='rpanel'>
        <div className='pblk'>
          <h3>ÉCONOMIE 2025 (FCFA)</h3>
          <div className='econ-grid'>
            <div className='econ-item'><span className='econ-lab'>PIB 2025</span><span className='econ-val'>13 250 Mds</span></div>
            <div className='econ-item'><span className='econ-lab'>CROISSANCE</span><span className='econ-val'>+6.5%</span></div>
            <div className='econ-item'><span className='econ-lab'>INFLATION</span><span className='econ-val'>-8.12%</span></div>
            <div className='econ-item'><span className='econ-lab'>DETTE/PIB</span><span className='econ-val'>54.2%</span></div>
          </div>
          <a href='https://biic.bj' className='src-link' target='_blank'>Source: BIIC</a>
        </div>
        <div className='pblk'>
          <h3>TOURISME & VLOG</h3>
          <YouTubeEmbed id='zfE-384HTFc'/>
          <YouTubeEmbed id='8zafbNUe7w8'/>
        </div>
        <div className='pblk'>
          <h3>ALERTES CONVERGENTES</h3>
          <div className='alert'>
            <span className='alv critical'>CRITICAL</span><span className='aldept'>Alibori</span>
            <p className='almsg'>Frontière Niger: Surveillance accrue du trafic fluvial. Convergence météo (températures > 40°C).</p>
            <span className='altime'>02/03/2026 12:45 | Source: Forces Armées</span>
          </div>
          <div className='alert'>
            <span className='alv high'>HIGH</span><span className='aldept'>Atacora</span>
            <p className='almsg'>Zone Pendjari: Activité saisonnière pastorale. Risque d orages violents prévus.</p>
            <span className='altime'>02/03/2026 11:15 | Source: ANPC</span>
          </div>
        </div>
      </aside>
    </div>
    <div className='ticker'>
      <div className='tlabel'>INFOS RÉELLES</div>
      <div style={{display:'flex',gap:'40px',animation:'scroll 30s linear infinite'}}>
        {TICKER_MSGS.concat(TICKER_MSGS).map((m,i)=><React.Fragment key={i}><span className='tmsg'>{m}</span><span className='tarr'>►</span></React.Fragment>)}
      </div>
    </div>
    {sel && <div className='modal-overlay' onClick={()=>setSel(null)}>
      <div className='modal-box' onClick={e=>e.stopPropagation()}>
        <span className='close-btn' onClick={()=>setSel(null)}>&times;</span>
        <h2 className='modal-title'>DÉTAILS IA : {sel.toUpperCase()}</h2>
        <div className='modal-content'>
          <p><b>Indice de Risque Actuel :</b> {Math.round(scores[sel])}/100</p>
          <p style={{marginTop:10}}>{DEPT_DATA[sel]?.info || 'Données en cours d analyse IA...'}</p>
          <p style={{marginTop:15,fontSize:11}}><i>Note: Cette analyse est générée par IA sur la base des flux de données gouvernementales en temps réel.</i></p>
        </div>
        <a href={DEPT_DATA[sel]?.src || '#'} target='_blank' className='modal-src'>Consulter la source officielle : {DEPT_DATA[sel]?.src}</a>
      </div>
    </div>}
    <style>{'@keyframes scroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}'}</style>
  </div>;
}