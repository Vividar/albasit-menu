cat > /home/claude/premium_app.jsx << 'PREMEOF'
import{useState,useEffect,useRef}from"react";

DATA_PLACEHOLDER

const SUPA_URL="https://eimcmuzstrvlbjgimvsx.supabase.co";
const SUPA_KEY="sb_publishable_mhe6FqpyayyhNc7fVd1usw_X0RXPKlD";

async function fetchFromSupabase(table,params=""){
  const r=await fetch(`${SUPA_URL}/rest/v1/${table}${params}`,{headers:{"apikey":SUPA_KEY,"Authorization":`Bearer ${SUPA_KEY}`}});
  return r.json();
}

// Original dark theme - no glow, no emojis, premium clean
const O="#E8620A",OH="#D4571A",BK="#000000",
      G1="#0A0300",G2="#120500",G3="#1A0600",
      CR="#F5E2C4",CM="#8A6644",CL="#B89060",
      W="#FFFFFF";

const TAG_C={"#1":"#C0392B","Top":O,"Spicy":"#C0392B","New":"#1A6B3A","Special":"#6B3A8B","Family":"#8B6914","Premium":"#8B5A14","Sweet":"#A03560","Value":O};

const Icons={
  facebook:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  instagram:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>,
  whatsapp:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
  youtube:<svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>,
};

const ALL_CATS=["Popular Items","Deals","Starters","Broast","Burgers","Shawarma","Sandwiches","Chinese","Pizza","Signature Flavours","Pizza Pasta & Sandwich","Matka Biryani","Appetizers","Rolls","BBQ","Karahi","Platters","Handi","Traditional","Others","Drinks","Dessert"];

const BANNER_SLIDES=[
  {img_index:16,name:"Karahi",sub:"16 Varieties of Rich Karahi"},
  {img_index:4,name:"Burgers",sub:"Crispy Zinger & Jumbo Burgers"},
  {img_index:8,name:"Pizza",sub:"6 Classic Flavors"},
  {img_index:14,name:"Rolls",sub:"Chicken & Beef Rolls"},
  {img_index:17,name:"Platters",sub:"BBQ for 2-6 Persons"},
  {img_index:12,name:"Matka Biryani",sub:"Clay Pot Dum Biryani"},
  {img_index:7,name:"Chinese",sub:"Starters, Mains & Rice"},
  {img_index:18,name:"Handi",sub:"Slow Cooked Handi"},
];

// ═══ BANNER ═════════════════════════════
function HeroBanner(){
  const[idx,setIdx]=useState(0);
  const[out,setOut]=useState(false);
  useEffect(()=>{
    const t=setInterval(()=>{setOut(true);setTimeout(()=>{setIdx(p=>(p+1)%BANNER_SLIDES.length);setOut(false);},350);},4000);
    return()=>clearInterval(t);
  },[]);
  const cur=BANNER_SLIDES[idx];
  const prv=BANNER_SLIDES[(idx-1+BANNER_SLIDES.length)%BANNER_SLIDES.length];
  const nxt=BANNER_SLIDES[(idx+1)%BANNER_SLIDES.length];
  return(
    <div style={{position:"relative",height:280,overflow:"hidden",background:`linear-gradient(160deg,${G3},${G2},${G1})`}}>
      {/* Subtle texture - no glow */}
      <div style={{position:"absolute",inset:0,opacity:.03,backgroundImage:`linear-gradient(${O}FF 1px,transparent 1px),linear-gradient(90deg,${O}FF 1px,transparent 1px)`,backgroundSize:"40px 40px"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${O}44,transparent)`}}/>

      {/* Side cards */}
      <div style={{position:"absolute",left:10,top:"50%",transform:"translateY(-55%) scale(.58) perspective(500px) rotateY(22deg)",opacity:.35,zIndex:2,pointerEvents:"none"}}>
        <div style={{width:115,height:115,borderRadius:14,overflow:"hidden",border:`1.5px solid ${O}33`,background:G2}}>
          <img src={CI[prv.img_index]} style={{width:"100%",height:"100%",objectFit:"contain",background:G2}} alt=""/>
        </div>
      </div>
      <div style={{position:"absolute",right:10,top:"50%",transform:"translateY(-55%) scale(.58) perspective(500px) rotateY(-22deg)",opacity:.35,zIndex:2,pointerEvents:"none"}}>
        <div style={{width:115,height:115,borderRadius:14,overflow:"hidden",border:`1.5px solid ${O}33`,background:G2}}>
          <img src={CI[nxt.img_index]} style={{width:"100%",height:"100%",objectFit:"contain",background:G2}} alt=""/>
        </div>
      </div>

      {/* Main image - no glow ring */}
      <div style={{position:"absolute",left:"50%",top:"44%",transform:`translateX(-50%) translateY(-50%) ${out?"scale(.82) rotateY(90deg)":"scale(1) rotateY(0)"}`,transition:"all .35s ease",zIndex:3}}>
        <div style={{width:175,height:175,borderRadius:20,overflow:"hidden",border:`2px solid ${O}55`,background:G2,position:"relative"}}>
          <img src={CI[cur.img_index]} style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center"}} alt={cur.name}/>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,rgba(255,255,255,.04),transparent 55%)"}}/>
        </div>
        <div style={{position:"absolute",bottom:-8,left:"12%",right:"12%",height:12,background:"rgba(0,0,0,.3)",filter:"blur(6px)",borderRadius:"50%"}}/>
      </div>

      {/* Text - clean no glow */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"10px 16px 14px",background:`linear-gradient(to top,${BK}EE,transparent)`,textAlign:"center",zIndex:4}}>
        <div style={{fontSize:8,color:CL,letterSpacing:4,fontFamily:"'Cinzel',serif",marginBottom:3}}>{cur.sub}</div>
        <div style={{fontSize:20,fontWeight:700,color:CR,fontFamily:"'Cinzel',serif"}}>{cur.name}</div>
        <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}>
          {BANNER_SLIDES.map((_,i)=>(
            <div key={i} onClick={()=>{setOut(true);setTimeout(()=>{setIdx(i);setOut(false);},300);}}
              style={{width:i===idx?22:6,height:5,borderRadius:3,background:i===idx?O:`${O}33`,transition:"all .3s",cursor:"pointer"}}/>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══ AR MODAL ═══════════════════════════
function ARModal({cat,onClose}){
  const[t,setT]=useState(0);const raf=useRef();
  useEffect(()=>{let x=0;const r=()=>{x++;setT(x);raf.current=requestAnimationFrame(r);};raf.current=requestAnimationFrame(r);return()=>cancelAnimationFrame(raf.current);},[]);
  const ang=t*.5,sc=.97+Math.sin(t*.028)*.03;
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:4000,background:"rgba(0,0,0,.88)",backdropFilter:"blur(16px)",display:"flex",alignItems:"center",justifyContent:"center",padding:14}}>
      <div onClick={e=>e.stopPropagation()} style={{position:"relative",width:"min(420px,94vw)",background:G2,border:`1.5px solid ${O}44`,borderRadius:20,overflow:"hidden",boxShadow:"0 20px 50px rgba(0,0,0,.6)"}}>
        {/* Corner brackets only - no glow */}
        {[[0,0],[0,1],[1,0],[1,1]].map(([r,c],i)=>(
          <div key={i} style={{position:"absolute",zIndex:10,width:14,height:14,...(r?{bottom:10}:{top:10}),...(c?{right:10}:{left:10}),borderTop:r?"none":`1.5px solid ${O}88`,borderBottom:r?`1.5px solid ${O}88`:"none",borderLeft:c?"none":`1.5px solid ${O}88`,borderRight:c?`1.5px solid ${O}88`:"none"}}/>
        ))}
        <div style={{padding:"13px 15px 10px",borderBottom:`1px solid ${O}1E`,display:"flex",justifyContent:"space-between",alignItems:"center",background:G3}}>
          <div>
            <div style={{fontSize:7,color:CL,letterSpacing:4,fontFamily:"'Cinzel',serif"}}>AUGMENTED REALITY</div>
            <div style={{fontSize:16,fontWeight:700,color:CR,fontFamily:"'Cinzel',serif"}}>{cat.name.toUpperCase()}</div>
          </div>
          <button onClick={onClose} style={{background:`${O}18`,border:`1px solid ${O}44`,color:CR,width:28,height:28,borderRadius:"50%",cursor:"pointer",fontSize:12}}>✕</button>
        </div>
        <div style={{position:"relative",height:210,background:G1,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}>
          {/* Subtle rings - no glow */}
          {[55,80,105].map((r,i)=>(
            <div key={i} style={{position:"absolute",width:r*2,height:r*.55,borderRadius:"50%",border:`1px solid ${O}${["22","16","0C"][i]}`,transform:`rotateX(75deg) rotateZ(${ang*(i%2?-.25:.35)*(i+1)*.4}deg)`}}/>
          ))}
          <div style={{position:"relative",zIndex:3,width:160,height:160,borderRadius:16,overflow:"hidden",border:`1.5px solid ${O}44`,transform:`perspective(400px) rotateY(${Math.sin(ang*.014)*12}deg) scale(${sc})`,background:G2}}>
            <img src={CI[cat.img_index]} alt={cat.name} style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center"}}/>
          </div>
          <div style={{position:"absolute",top:10,left:10,background:"rgba(0,0,0,.7)",border:`1px solid ${O}33`,borderRadius:8,padding:"4px 9px"}}>
            <div style={{fontSize:6,color:CL,letterSpacing:2}}>FROM</div>
            <div style={{fontSize:13,fontWeight:700,color:O,fontFamily:"'Cinzel',serif"}}>Rs.{cat.min_price||0}</div>
          </div>
        </div>
        <div style={{padding:"12px 15px 14px",background:G2}}>
          <h2 style={{margin:"0 0 2px",fontSize:16,fontWeight:700,color:CR,fontFamily:"'Cinzel',serif"}}>{cat.name}</h2>
          <p style={{margin:"0 0 11px",fontSize:10,color:CM}}>{cat.sub}</p>
          {cat.ar_url?(
            <a href={`/ar-viewer.html?model=${encodeURIComponent(cat.ar_url)}&name=${encodeURIComponent(cat.name)}&sub=${encodeURIComponent(cat.sub||"")}&price=${cat.min_price||""}`}
              target="_blank" rel="noreferrer"
              style={{display:"block",width:"100%",padding:"12px",background:`linear-gradient(135deg,${O},${OH})`,border:"none",borderRadius:10,color:W,fontSize:12,fontWeight:700,textAlign:"center",textDecoration:"none",fontFamily:"'Cinzel',serif",letterSpacing:.8,transition:"opacity .2s"}}
              onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
              onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
              VIEW IN AR — Place on Table
            </a>
          ):(
            <div style={{background:`${O}0A`,border:`1px solid ${O}18`,borderRadius:10,padding:10,textAlign:"center"}}>
              <div style={{fontSize:10,color:CM}}>AR model coming soon</div>
            </div>
          )}
          <div style={{fontSize:7,color:`${CM}55`,textAlign:"center",marginTop:9,letterSpacing:2,fontFamily:"'Cinzel',serif"}}>TAP ANYWHERE TO CLOSE</div>
        </div>
      </div>
    </div>
  );
}

// ═══ ITEMS DRAWER ═══════════════════════
function ItemsDrawer({cat,onClose}){
  const[items,setItems]=useState([]);const[loading,setLoading]=useState(true);const[sel,setSel]=useState({});const[cart,setCart]=useState({});
  useEffect(()=>{(async()=>{setLoading(true);const d=await fetchFromSupabase('items',`?category_slug=eq.${cat.slug}&is_active=eq.true&order=sort_order.asc&select=*,item_options(*)`);setItems(d||[]);setLoading(false);})();},[cat.slug]);
  const getOi=(id)=>sel[id]||0;
  const add=(item)=>{const opt=item.item_options[getOi(item.id)];const k=`${item.id}|${opt.size_label}`;setCart(p=>({...p,[k]:(p[k]||0)+1}));};
  const sections={};items.forEach(item=>{const s=item.sub_section||'';if(!sections[s])sections[s]=[];sections[s].push(item);});
  const hasSubs=Object.keys(sections).some(k=>k!=='');
  const ItemRow=({item})=>{
    const opts=item.item_options||[];const oi=getOi(item.id);const ch=opts[oi]||opts[0]||{};const k=`${item.id}|${ch.size_label}`;
    return(
      <div style={{marginBottom:7,background:cart[k]?`${O}0E`:`${G2}`,border:`1px solid ${cart[k]?O+"33":O+"12"}`,borderRadius:11,overflow:"hidden",transition:"border-color .18s"}}>
        <div style={{padding:"9px 12px 8px",display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",marginBottom:3}}>
              <span style={{fontSize:12,fontWeight:600,color:CR,fontFamily:"'Space Grotesk',sans-serif"}}>{item.name}</span>
              {item.tag&&<span style={{background:TAG_C[item.tag]||O,color:W,fontSize:7,fontWeight:700,padding:"1px 6px",borderRadius:20}}>{item.tag}</span>}
            </div>
            {item.description&&<div style={{fontSize:9,color:CM,marginBottom:4,lineHeight:1.4}}>{item.description}</div>}
            {opts.length>1&&(
              <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                {opts.sort((a,b)=>a.sort_order-b.sort_order).map((opt,oi2)=>(
                  <button key={oi2} onClick={()=>setSel(p=>({...p,[item.id]:oi2}))}
                    style={{padding:"2px 9px",borderRadius:20,fontSize:9,fontWeight:600,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",transition:"all .12s",background:oi2===oi?O:`${O}12`,border:`1px solid ${oi2===oi?O+"99":O+"26"}`,color:oi2===oi?W:CM}}>
                    {opt.size_label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div style={{flexShrink:0,textAlign:"right"}}>
            <div style={{fontSize:13,fontWeight:700,color:O,fontFamily:"'Space Grotesk',sans-serif"}}>Rs.{(ch.price||0).toLocaleString()}</div>
            {opts.length===1&&<div style={{fontSize:8,color:CM,marginBottom:2}}>{ch.size_label}</div>}
            <button onClick={()=>add(item)} style={{marginTop:3,background:cart[k]?O:`${O}14`,border:`1px solid ${O}44`,color:cart[k]?W:O,width:27,height:27,borderRadius:"50%",fontSize:12,cursor:"pointer",fontWeight:700,transition:"all .18s"}}>{cart[k]||"+"}</button>
          </div>
        </div>
      </div>
    );
  };
  return(
    <div onClick={onClose} style={{position:"fixed",inset:0,zIndex:3000,background:"rgba(0,0,0,.85)",backdropFilter:"blur(10px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{position:"absolute",bottom:0,left:0,right:0,maxHeight:"85vh",background:`linear-gradient(180deg,${G3},${G2},${G1})`,borderTop:`2px solid ${O}66`,borderRadius:"18px 18px 0 0",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 -8px 30px rgba(0,0,0,.5)"}}>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${O}55,transparent)`,flexShrink:0}}/>
        <div style={{display:"flex",justifyContent:"center",padding:"8px 0 0",flexShrink:0}}><div style={{width:34,height:3,background:`${O}44`,borderRadius:2}}/></div>
        <div style={{padding:"8px 14px 10px",borderBottom:`1px solid ${O}14`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:9}}>
            <div style={{width:40,height:40,borderRadius:9,overflow:"hidden",border:`1px solid ${O}33`,flexShrink:0,background:G2}}>
              <img src={CI[cat.img_index]} style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center"}} alt=""/>
            </div>
            <div>
              <div style={{fontSize:6,color:CL,letterSpacing:3,fontFamily:"'Cinzel',serif"}}>MENU</div>
              <h3 style={{margin:0,fontSize:15,fontWeight:700,color:CR,fontFamily:"'Cinzel',serif"}}>{cat.name}</h3>
            </div>
          </div>
          <button onClick={onClose} style={{background:`${O}14`,border:`1px solid ${O}33`,color:CR,width:26,height:26,borderRadius:"50%",cursor:"pointer",fontSize:11}}>✕</button>
        </div>
        <div style={{overflowY:"auto",padding:"8px 11px 26px"}}>
          {loading?<div style={{textAlign:"center",padding:"28px",color:CM,fontFamily:"'Cinzel',serif",fontSize:12}}>Loading...</div>:
          hasSubs?(
            Object.entries(sections).map(([sec,secItems])=>(
              <div key={sec} style={{marginBottom:16}}>
                {sec&&(
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                    <div style={{flex:1,height:1,background:`linear-gradient(90deg,${O}44,transparent)`}}/>
                    <span style={{fontSize:8,color:CL,fontFamily:"'Cinzel',serif",fontWeight:700,letterSpacing:2,whiteSpace:"nowrap"}}>{sec.toUpperCase()}</span>
                    <div style={{flex:1,height:1,background:`linear-gradient(270deg,${O}44,transparent)`}}/>
                  </div>
                )}
                {secItems.map(item=><ItemRow key={item.id} item={item}/>)}
              </div>
            ))
          ):(items.map(item=><ItemRow key={item.id} item={item}/>))}
        </div>
      </div>
    </div>
  );
}

// ═══ CATEGORY CARD ══════════════════════
function CatCard({cat,onAR,onItems}){
  const[hov,setHov]=useState(false);
  const[tilt,setTilt]=useState({x:0,y:0});
  const ref=useRef();
  const mm=(e)=>{if(!ref.current)return;const r=ref.current.getBoundingClientRect();setTilt({x:((e.clientX-r.left)/r.width-.5)*14,y:-((e.clientY-r.top)/r.height-.5)*14});};
  return(
    <div ref={ref} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setTilt({x:0,y:0});}} onMouseMove={mm}
      style={{position:"relative",overflow:"hidden",
        background:hov?`linear-gradient(145deg,${G3},${G2})`:`linear-gradient(145deg,${G2},${G1})`,
        border:`1px solid ${hov?O+"66":O+"18"}`,
        borderRadius:16,
        transition:"border-color .22s, box-shadow .22s",
        transform:`perspective(600px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg) ${hov?"translateY(-5px)":"none"}`,
        boxShadow:hov?"0 14px 36px rgba(0,0,0,.7)":"0 3px 12px rgba(0,0,0,.5)",
        cursor:"pointer"}}>
      {/* Image - no vignette, no glow */}
      <div style={{position:"relative",width:"100%",background:G1,overflow:"hidden",borderRadius:"15px 15px 0 0"}}>
        <img src={CI[cat.img_index]} alt={cat.name}
          style={{width:"100%",display:"block",objectFit:"contain",objectPosition:"center",transition:"transform .4s",transform:hov?"scale(1.04)":"scale(1)",minHeight:130,maxHeight:185,background:G1}}/>
        {/* Clean top-only fade */}
        <div style={{position:"absolute",top:0,left:0,right:0,height:20,background:`linear-gradient(to bottom,${G1}88,transparent)`}}/>
        {/* Price badge - clean */}
        <div style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.8)",border:`1px solid ${O}33`,borderRadius:20,padding:"3px 9px",backdropFilter:"blur(4px)"}}>
          <span style={{fontSize:9,fontWeight:700,color:O,fontFamily:"'Space Grotesk',sans-serif"}}>from Rs.{cat.min_price||0}</span>
        </div>
        {/* AR badge */}
        {cat.ar_url&&(
          <div style={{position:"absolute",top:8,left:8,background:O,borderRadius:20,padding:"3px 8px"}}>
            <span style={{fontSize:7,fontWeight:700,color:W,letterSpacing:1,fontFamily:"'Cinzel',serif"}}>AR 3D</span>
          </div>
        )}
      </div>
      {/* Content */}
      <div style={{padding:"10px 12px 12px"}}>
        <div style={{fontSize:8,color:CM,marginBottom:2,fontFamily:"'Cinzel',serif",letterSpacing:1}}>{cat.sub}</div>
        <h3 style={{margin:"0 0 10px",fontSize:13,fontWeight:700,color:CR,fontFamily:"'Cinzel',serif"}}>{cat.name}</h3>
        {/* AR button - no glow, clean solid */}
        <button onClick={()=>onAR(cat)}
          style={{width:"100%",padding:"10px 0",marginBottom:6,background:`linear-gradient(135deg,${O},${OH})`,border:"none",borderRadius:10,color:W,fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"'Cinzel',serif",letterSpacing:.8,transition:"opacity .2s, transform .15s",position:"relative",overflow:"hidden"}}
          onMouseEnter={e=>e.currentTarget.style.opacity=".88"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
          <div style={{position:"absolute",inset:0,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.1),transparent)",animation:"sweep 2.5s linear infinite"}}/>
          <span style={{position:"relative",zIndex:1}}>VIEW IN AR</span>
        </button>
        {/* Items button */}
        <button onClick={()=>onItems(cat)}
          style={{width:"100%",padding:"7px 0",background:`${O}0E`,border:`1px solid ${O}22`,borderRadius:9,color:CM,fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",transition:"all .18s"}}
          onMouseEnter={e=>{e.currentTarget.style.background=`${O}22`;e.currentTarget.style.borderColor=`${O}44`;e.currentTarget.style.color=CR;}}
          onMouseLeave={e=>{e.currentTarget.style.background=`${O}0E`;e.currentTarget.style.borderColor=`${O}22`;e.currentTarget.style.color=CM;}}>
          VIEW ITEMS
        </button>
      </div>
    </div>
  );
}

// ═══ FOOTER ═════════════════════════════
function Footer(){
  const contacts=[
    {ic:"◉",lb:"Website",val:"albasitrestaurant.com",href:"https://albasitrestaurant.com/"},
    {ic:Icons.whatsapp,lb:"WhatsApp",val:"0314-5684466",href:"https://wa.me/923145684466"},
    {ic:"◎",lb:"Phone",val:"021-34500076",href:"tel:02134500076"},
    {ic:"◈",lb:"Email",val:"info@albasitresturant.com",href:"mailto:info@albasitresturant.com"},
  ];
  const socials=[
    {ic:Icons.facebook,href:"https://www.facebook.com/AlBasit.Restaurant"},
    {ic:Icons.instagram,href:"https://www.instagram.com/albasitrestaurantofficial/?hl=en"},
    {ic:Icons.whatsapp,href:"https://wa.me/923145684466"},
    {ic:Icons.youtube,href:"https://www.youtube.com/channel/UC-1FlxVk5Ams9JpFoXl-yAQ"},
  ];
  return(
    <footer style={{background:`linear-gradient(180deg,${G2},${BK})`,borderTop:`1px solid ${O}18`}}>
      <div style={{height:1,background:`linear-gradient(90deg,transparent,${O}44,transparent)`}}/>
      <div style={{maxWidth:1000,margin:"0 auto",padding:"22px 14px 0"}}>
        <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16,flexWrap:"wrap"}}>
          <img src={LOGO} alt="Al Basit" style={{width:56,height:56,borderRadius:"50%",border:`2px solid ${O}44`,objectFit:"cover",flexShrink:0}}/>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontSize:6,color:CL,letterSpacing:4,fontFamily:"'Cinzel',serif",fontWeight:700,marginBottom:1}}>◈ AL BASIT ◈</div>
            <div style={{fontSize:16,fontWeight:700,color:CR,fontFamily:"'Cinzel',serif"}}>FAST FOOD BAR BQ</div>
            <p style={{margin:"5px 0 0",fontSize:11,color:CM,lineHeight:1.6}}>Karachi's favorite destination for authentic flavors — BBQ, Karahis, Broast, Burgers, Shawarma & 200+ items.</p>
          </div>
        </div>
        <div style={{display:"flex",gap:7,alignItems:"center",marginBottom:12,padding:"10px 12px",background:`${O}08`,border:`1px solid ${O}18`,borderRadius:10}}>
          <span style={{fontSize:12,flexShrink:0,color:O}}>◍</span>
          <div>
            <div style={{fontSize:6,color:CL,fontFamily:"'Cinzel',serif",fontWeight:700,letterSpacing:3,marginBottom:2}}>ADDRESS</div>
            <div style={{fontSize:11,color:CR,lineHeight:1.5}}>Main Saudabad Chowrangi, Begum Khursheed Road, Malir, Karachi</div>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:7,marginBottom:14}}>
          {contacts.map((c,i)=>(
            <a key={i} href={c.href} target="_blank" rel="noreferrer"
              style={{textDecoration:"none",display:"flex",alignItems:"center",gap:8,padding:"8px 11px",background:`${O}07`,border:`1px solid ${O}15`,borderRadius:9,transition:"all .18s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=`${O}16`;e.currentTarget.style.borderColor=`${O}40`;}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${O}07`;e.currentTarget.style.borderColor=`${O}15`;}}>
              <span style={{color:O,flexShrink:0,display:"flex",alignItems:"center"}}>{typeof c.ic==="string"?<span style={{fontSize:16}}>{c.ic}</span>:c.ic}</span>
              <div style={{minWidth:0}}>
                <div style={{fontSize:6,color:CL,fontFamily:"'Cinzel',serif",fontWeight:700,letterSpacing:2,marginBottom:1}}>{c.lb}</div>
                <div style={{fontSize:10,color:CR,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.val}</div>
              </div>
            </a>
          ))}
        </div>
        <div style={{display:"flex",gap:9,marginBottom:14,justifyContent:"center"}}>
          {socials.map((s,i)=>(
            <a key={i} href={s.href} target="_blank" rel="noreferrer"
              style={{textDecoration:"none",width:42,height:42,borderRadius:"50%",background:`${O}0E`,border:`1px solid ${O}22`,display:"flex",alignItems:"center",justifyContent:"center",color:CM,transition:"all .2s"}}
              onMouseEnter={e=>{e.currentTarget.style.background=O;e.currentTarget.style.color=W;e.currentTarget.style.borderColor=O;e.currentTarget.style.transform="scale(1.1)";}}
              onMouseLeave={e=>{e.currentTarget.style.background=`${O}0E`;e.currentTarget.style.color=CM;e.currentTarget.style.borderColor=`${O}22`;e.currentTarget.style.transform="scale(1)";}}>
              {s.ic}
            </a>
          ))}
        </div>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${O}28,transparent)`,marginBottom:10}}/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:5,paddingBottom:14}}>
          <div style={{fontSize:9,color:`${CM}55`,fontFamily:"'Cinzel',serif"}}>© 2025 Al Basit Fast Food Bar BQ</div>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <span style={{fontSize:9,color:`${CM}44`}}>Powered by </span>
            <span style={{fontSize:9,color:O,fontWeight:700,fontFamily:"'Cinzel',serif"}}>VIVID AR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ═══ MAIN APP ═══════════════════════════
export default function App(){
  const[cats,setCats]=useState([]);
  const[loading,setLoading]=useState(true);
  const[arCat,setArCat]=useState(null);
  const[itemsCat,setItemsCat]=useState(null);
  const[search,setSearch]=useState("");
  const[mounted,setMounted]=useState(false);
  const[filter,setFilter]=useState("all");

  useEffect(()=>{
    (async()=>{
      setLoading(true);
      try{
        const d=await fetchFromSupabase('categories','?is_active=eq.true&order=sort_order.asc');
        const ok=d&&Array.isArray(d)&&d.length>0&&d[0].slug;
        if(ok){
          const opts=await fetchFromSupabase('item_options','?select=price,items!inner(category_slug)');
          const mm={};
          if(opts&&Array.isArray(opts))opts.forEach(o=>{const s=o.items?.category_slug;if(s&&(!mm[s]||o.price<mm[s]))mm[s]=o.price;});
          setCats(d.map(c=>({...c,min_price:mm[c.slug]||0})));
        } else setCats(FALLBACK_CATS);
      } catch(e){setCats(FALLBACK_CATS);}
      setLoading(false);
      setTimeout(()=>setMounted(true),80);
    })();
  },[]);

  const filtered=cats.filter(c=>{
    const ms=!search||c.name.toLowerCase().includes(search.toLowerCase())||c.sub.toLowerCase().includes(search.toLowerCase());
    const mf=filter==="all"||c.name.toLowerCase().includes(filter.toLowerCase())||c.sub.toLowerCase().includes(filter.toLowerCase());
    return ms&&mf;
  });

  return(
    <div style={{minHeight:"100vh",background:BK,color:CR}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Space+Grotesk:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;}
        body{background:${BK};}
        ::-webkit-scrollbar{width:3px;height:3px;}
        ::-webkit-scrollbar-thumb{background:${O}44;border-radius:3px;}
        input::placeholder{color:${CM}44;}
        button{font-family:'Cinzel',serif;}
        @keyframes sweep{0%{transform:translateX(-100%);}100%{transform:translateX(300%);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:none;}}
        @keyframes marquee{0%{transform:translateX(0);}100%{transform:translateX(-50%);}}
        @keyframes logoSpin{0%,100%{border-color:${O}55;}50%{border-color:${O}AA;}}
      `}</style>

      {/* Sticky Header */}
      <div style={{position:"sticky",top:0,zIndex:500,background:`linear-gradient(180deg,${BK}FA,${G1}F0)`,backdropFilter:"blur(20px)",borderBottom:`1px solid ${O}18`}}>
        <div style={{height:1,background:`linear-gradient(90deg,transparent,${O}44,transparent)`}}/>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"10px 14px 8px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <img src={LOGO} alt="Al Basit" style={{width:44,height:44,borderRadius:"50%",border:`2px solid ${O}55`,objectFit:"cover",flexShrink:0,animation:"logoSpin 3s ease-in-out infinite"}}/>
            <div style={{flex:1}}>
              <div style={{fontSize:6,color:CL,fontWeight:700,letterSpacing:4,fontFamily:"'Cinzel',serif",marginBottom:1}}>◈ AR MENU SYSTEM ◈</div>
              <div style={{fontSize:17,fontWeight:700,color:CR,fontFamily:"'Cinzel',serif",lineHeight:1}}>AL BASIT <span style={{fontSize:9,color:O,fontWeight:600,letterSpacing:2,marginLeft:5}}>FAST FOOD BAR BQ</span></div>
            </div>
          </div>
          {/* Search */}
          <div style={{position:"relative",marginBottom:8}}>
            <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:10,color:O}}>◈</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search menu..."
              style={{width:"100%",padding:"8px 12px 8px 28px",background:`${O}08`,border:`1px solid ${search?O+"44":O+"18"}`,borderRadius:9,color:CR,fontSize:11,fontFamily:"'Space Grotesk',sans-serif",outline:"none",transition:"border-color .2s"}}/>
          </div>
          {/* All 22 filter pills */}
          <div style={{display:"flex",gap:5,overflowX:"auto",paddingBottom:3}}>
            <button onClick={()=>setFilter("all")}
              style={{padding:"5px 14px",borderRadius:20,fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,background:filter==="all"?O:`${O}0E`,border:`1px solid ${filter==="all"?O:O+"22"}`,color:filter==="all"?W:CM,transition:"all .18s",fontFamily:"'Cinzel',serif"}}>
              All
            </button>
            {ALL_CATS.map(n=>(
              <button key={n} onClick={()=>setFilter(n===filter?"all":n)}
                style={{padding:"5px 11px",borderRadius:20,fontSize:10,fontWeight:600,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0,background:filter===n?O:`${O}0A`,border:`1px solid ${filter===n?O:O+"18"}`,color:filter===n?W:CM,transition:"all .18s",fontFamily:"'Cinzel',serif"}}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AR Tagline marquee - clean */}
      <div style={{background:`linear-gradient(90deg,${G3},${G2},${G3})`,borderBottom:`1px solid ${O}18`,padding:"7px 0",overflow:"hidden"}}>
        <div style={{display:"flex",animation:"marquee 22s linear infinite",whiteSpace:"nowrap",width:"200%"}}>
          {[...Array(2)].map((_,k)=>(
            <div key={k} style={{display:"flex"}}>
              {["Experience Food in Augmented Reality","Scan — See — Order in 3D","Point Camera — Watch Food Come to Life","Al Basit AR Menu","Real Size 3D Food at Your Table"].map((t,i)=>(
                <span key={i} style={{display:"inline-flex",alignItems:"center",padding:"0 26px",fontSize:10,fontWeight:600,fontFamily:"'Cinzel',serif",color:i%2===0?CR:CL,letterSpacing:1}}>
                  {t}<span style={{marginLeft:26,color:O,fontSize:8}}>◆</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Banner */}
      {!loading&&!search&&filter==="all"&&<HeroBanner/>}

      {/* Section title */}
      <div style={{maxWidth:1000,margin:"14px auto 10px",padding:"0 14px",display:"flex",alignItems:"center",gap:10}}>
        <div style={{flex:1,height:1,background:`linear-gradient(90deg,${O}44,transparent)`}}/>
        <span style={{fontSize:7,color:CL,fontFamily:"'Cinzel',serif",fontWeight:700,letterSpacing:3,whiteSpace:"nowrap"}}>
          {search?`${filtered.length} RESULTS`:filter!=="all"?filter.toUpperCase():"SELECT CATEGORY"}
        </span>
        <div style={{flex:1,height:1,background:`linear-gradient(270deg,${O}44,transparent)`}}/>
      </div>

      {/* Grid */}
      <div style={{maxWidth:1000,margin:"0 auto",padding:"0 14px 36px"}}>
        {loading?(
          <div style={{textAlign:"center",padding:"70px 0",color:CM,fontFamily:"'Cinzel',serif"}}>
            <div style={{fontSize:14,marginBottom:10}}>◈</div>
            <div style={{fontSize:13}}>Loading menu...</div>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:13}}>
            {filtered.map((cat,i)=>(
              <div key={cat.id} style={{opacity:mounted?1:0,transform:mounted?"none":"translateY(18px)",transition:`opacity .38s ${i*.04}s,transform .38s ${i*.04}s`}}>
                <CatCard cat={cat} onAR={setArCat} onItems={setItemsCat}/>
              </div>
            ))}
          </div>
        )}
        {!loading&&filtered.length===0&&(
          <div style={{textAlign:"center",padding:"60px 0",color:CM}}>
            <div style={{fontSize:14,marginBottom:8}}>◈</div>
            <p style={{fontFamily:"'Cinzel',serif",fontSize:12}}>No category found</p>
          </div>
        )}
      </div>

      <Footer/>
      {arCat&&<ARModal cat={arCat} onClose={()=>setArCat(null)}/>}
      {itemsCat&&<ItemsDrawer cat={itemsCat} onClose={()=>setItemsCat(null)}/>}
    </div>
  );
}
PREMEOF
echo "Done! $(wc -l < /home/claude/premium_app.jsx) lines"
