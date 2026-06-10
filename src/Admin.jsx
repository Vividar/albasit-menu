import { useState, useEffect } from "react";

const SUPA_URL = "https://eimcmuzstrvlbjgimvsx.supabase.co";
const SUPA_SECRET = "sb_secret_rinSAySb6qIY3GwmFA17GQ_I-CexNSL";
const ADMIN_PASS = "albasit2025";

const O="#E8620A",OH="#FF7A1A",BK="#000000",BRM="#1E0A02",BR="#1A0800",
      CR="#F5E2C4",CM="#8A6644";

async function db(method, table, params="", body=null){
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/${table}${params}`,{
      method,
      headers:{
        "apikey":SUPA_SECRET,
        "Authorization":`Bearer ${SUPA_SECRET}`,
        "Content-Type":"application/json",
        "Prefer": method==="POST"?"return=representation":"return=minimal"
      },
      body: body?JSON.stringify(body):undefined
    });
    if(method==="DELETE"||method==="PATCH") return {ok:true};
    const data = await res.json();
    return data;
  } catch(e){
    console.error("DB error:",e);
    return null;
  }
}

const TAG_OPTS=["","#1","Top","Spicy","New","Special","Family","Premium","Sweet","Value"];
const TAG_C={"#1":"#FF4500","Top":"#E8620A","Spicy":"#E63946","New":"#06D6A0","Special":"#9B5DE5","Family":"#FFB703","Premium":"#C9940F","Sweet":"#FF69B4","Value":"#2DC653"};

// ── STYLES ──────────────────────────────────────────────────
const card = {background:`linear-gradient(160deg,#1C0A01,${BK})`,border:`1px solid #E8620A22`,borderRadius:14,padding:14,marginBottom:8};
const inp = (w="100%")=>({width:w,padding:"9px 12px",background:"#E8620A0F",border:"1px solid #E8620A33",borderRadius:9,color:CR,fontSize:12,outline:"none",fontFamily:"'Space Grotesk',sans-serif"});
const lbl = {fontSize:8,color:"#E8620A",letterSpacing:2,fontWeight:700,marginBottom:4,display:"block"};
const btn = (active,danger)=>({padding:"8px 14px",background:danger?"#E6394615":active?`linear-gradient(135deg,${O},${OH})`:"#E8620A15",border:`1px solid ${danger?"#E6394644":active?O:"#E8620A33"}`,borderRadius:8,color:danger?"#E63946":active?"#fff":CR,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",transition:"all .15s"});

// ── LOGIN SCREEN ─────────────────────────────────────────────
function LoginScreen({onLogin}){
  const[pass,setPass]=useState("");
  const[err,setErr]=useState(false);
  const try_login=()=>{
    if(pass===ADMIN_PASS){onLogin();}
    else{setErr(true);setTimeout(()=>setErr(false),2000);}
  };
  return(
    <div style={{minHeight:"100vh",background:BK,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;}`}</style>
      <div style={{background:BRM,border:`1.5px solid ${O}55`,borderRadius:22,padding:36,width:"min(360px,90vw)",textAlign:"center",boxShadow:`0 0 40px ${O}22`}}>
        <div style={{fontSize:44,marginBottom:14}}>🔐</div>
        <div style={{fontSize:8,color:O,letterSpacing:4,fontWeight:700,marginBottom:3,fontFamily:"'Space Grotesk',sans-serif"}}>◈ ADMIN ACCESS ◈</div>
        <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:800,color:CR}}>Al Basit</h2>
        <p style={{margin:"0 0 22px",fontSize:11,color:CM}}>Menu Management System</p>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&try_login()}
          placeholder="Enter admin password"
          style={{...inp(),marginBottom:10,border:`1px solid ${err?"#E63946":O+"44"}`,transition:"border-color .2s",textAlign:"center"}}/>
        {err&&<div style={{fontSize:11,color:"#E63946",marginBottom:8}}>❌ Wrong password</div>}
        <button onClick={try_login} style={{...btn(true),width:"100%",padding:13,fontSize:14}}>LOGIN →</button>
      </div>
    </div>
  );
}

// ── MAIN ADMIN ───────────────────────────────────────────────
export default function Admin(){
  const[authed,setAuthed]=useState(false);
  const[view,setView]=useState("cats"); // cats | items | addItem | arUrls
  const[cats,setCats]=useState([]);
  const[selCat,setSelCat]=useState(null);
  const[items,setItems]=useState([]);
  const[loading,setLoading]=useState(false);
  const[toast,setToast]=useState("");
  const[newItem,setNewItem]=useState({name:"",tag:"",sub_section:"",description:""});
  const[newOpts,setNewOpts]=useState([{size_label:"Regular",price:""}]);

  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),2800);};

  const loadCats=async()=>{
    setLoading(true);
    const d=await db("GET","categories","?order=sort_order.asc");
    setCats(Array.isArray(d)?d:[]);
    setLoading(false);
  };

  const loadItems=async(slug)=>{
    setLoading(true);
    const d=await db("GET","items",`?category_slug=eq.${slug}&order=sort_order.asc&select=*,item_options(*)`);
    setItems(Array.isArray(d)?d:[]);
    setLoading(false);
  };

  const updatePrice=async(optId,price)=>{
    await db("PATCH","item_options",`?id=eq.${optId}`,{price:parseInt(price)});
    showToast("✅ Price updated!");
    loadItems(selCat.slug);
  };

  const toggleActive=async(itemId,cur)=>{
    await db("PATCH","items",`?id=eq.${itemId}`,{is_active:!cur});
    showToast(cur?"Item hidden from menu":"Item visible on menu");
    loadItems(selCat.slug);
  };

  const deleteItem=async(itemId,name)=>{
    if(!window.confirm(`Delete "${name}"?`))return;
    await db("DELETE","item_options",`?item_id=eq.${itemId}`);
    await db("DELETE","items",`?id=eq.${itemId}`);
    showToast("🗑️ Deleted");
    loadItems(selCat.slug);
  };

  const saveNewItem=async()=>{
    if(!newItem.name.trim()){showToast("❌ Name required");return;}
    const validOpts=newOpts.filter(o=>o.size_label&&o.price);
    if(!validOpts.length){showToast("❌ At least 1 price option needed");return;}
    const maxOrd=items.length?Math.max(...items.map(i=>i.sort_order||0)):0;
    const created=await db("POST","items","",{
      category_slug:selCat.slug,name:newItem.name.trim(),
      tag:newItem.tag,sub_section:newItem.sub_section.trim(),
      description:newItem.description.trim(),
      sort_order:maxOrd+1,is_active:true
    });
    if(created&&created[0]?.id){
      for(const o of validOpts){
        await db("POST","item_options","",{item_id:created[0].id,size_label:o.size_label,price:parseInt(o.price),sort_order:validOpts.indexOf(o)+1});
      }
      showToast("✅ Item added!");
      setNewItem({name:"",tag:"",sub_section:"",description:""});
      setNewOpts([{size_label:"Regular",price:""}]);
      setView("items");
      loadItems(selCat.slug);
    } else {
      showToast("❌ Error — check Supabase connection");
    }
  };

  const saveArUrl=async(catId,url)=>{
    await db("PATCH","categories",`?id=eq.${catId}`,{ar_url:url||null});
    showToast("✅ AR URL saved!");
    loadCats();
  };

  if(!authed) return <LoginScreen onLogin={()=>{setAuthed(true);loadCats();}}/>;

  return(
    <div style={{minHeight:"100vh",background:`radial-gradient(ellipse at 50% 0%,${BRM},${BK})`,fontFamily:"'Space Grotesk',sans-serif",color:CR}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;}input,select,textarea{font-family:'Space Grotesk',sans-serif;}input::placeholder{color:#8A664455;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${O}44;border-radius:3px;}`}</style>

      {/* Toast */}
      {toast&&<div style={{position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",background:`${O}EE`,color:"#fff",padding:"10px 22px",borderRadius:22,fontSize:12,fontWeight:700,zIndex:9999,boxShadow:`0 4px 20px ${O}66`,whiteSpace:"nowrap"}}>{toast}</div>}

      {/* Header */}
      <div style={{position:"sticky",top:0,zIndex:500,background:`linear-gradient(180deg,${BK}F9,${BRM}EE)`,backdropFilter:"blur(18px)",borderBottom:`1px solid ${O}22`,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          {view!=="cats"&&<button onClick={()=>setView("cats")} style={{...btn(false),padding:"7px 10px",marginRight:4}}>←</button>}
          <div>
            <div style={{fontSize:7,color:O,letterSpacing:3,fontWeight:700}}>◈ ADMIN PANEL ◈</div>
            <div style={{fontSize:16,fontWeight:800,color:CR,lineHeight:1.1}}>
              {view==="cats"?"Al Basit Menu":view==="arUrls"?"AR Model URLs":view==="addItem"?`Add — ${selCat?.name}`:selCat?.name||""}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <a href="/" target="_blank" style={{...btn(false),textDecoration:"none",padding:"7px 12px",fontSize:10}}>View Menu ↗</a>
          <button onClick={()=>setAuthed(false)} style={{...btn(false,true),padding:"7px 12px",fontSize:10}}>Logout</button>
        </div>
      </div>

      <div style={{maxWidth:820,margin:"0 auto",padding:"16px 14px 50px"}}>

        {/* ══ CATEGORIES ══════════════════════════════════════ */}
        {view==="cats"&&(
          <>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
              <h2 style={{margin:0,fontSize:15,fontWeight:800}}>📋 Select Category to Edit</h2>
              <button style={btn(false)} onClick={()=>setView("arUrls")}>🎯 AR Model URLs</button>
            </div>
            {loading?(
              <div style={{textAlign:"center",padding:50,color:CM}}>
                <div style={{fontSize:22,marginBottom:8,opacity:.5}}>◈</div>
                <div style={{fontSize:12}}>Connecting to database...</div>
                <div style={{fontSize:10,marginTop:6,opacity:.6}}>Make sure Supabase SQL has been run</div>
              </div>
            ):(
              cats.length===0?(
                <div style={{textAlign:"center",padding:40,color:CM,background:`${O}08`,border:`1px solid ${O}1C`,borderRadius:14}}>
                  <div style={{fontSize:28,marginBottom:10}}>⚠️</div>
                  <div style={{fontSize:13,fontWeight:700,color:CR,marginBottom:6}}>Database Empty</div>
                  <div style={{fontSize:11,lineHeight:1.6}}>Run the <span style={{color:O}}>supabase_setup.sql</span> file in Supabase SQL Editor first, then refresh this page.</div>
                </div>
              ):(
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                  {cats.map(cat=>(
                    <div key={cat.id} onClick={()=>{setSelCat(cat);setView("items");loadItems(cat.slug);}}
                      style={{...card,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",transition:"all .2s"}}
                      onMouseEnter={e=>e.currentTarget.style.borderColor=`${O}55`}
                      onMouseLeave={e=>e.currentTarget.style.borderColor=`${O}22`}>
                      <div>
                        <div style={{fontSize:13,fontWeight:700,color:CR,marginBottom:2}}>{cat.name}</div>
                        <div style={{fontSize:10,color:CM}}>{cat.sub}</div>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
                        {cat.ar_url&&<span style={{fontSize:8,color:"#06D6A0",background:"#06D6A012",border:"1px solid #06D6A033",padding:"2px 6px",borderRadius:20}}>AR✓</span>}
                        <span style={{fontSize:14,color:O}}>›</span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </>
        )}

        {/* ══ ITEMS ══════════════════════════════════════════ */}
        {view==="items"&&selCat&&(
          <>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14,flexWrap:"wrap"}}>
              <h2 style={{margin:0,fontSize:15,fontWeight:800,flex:1}}>{selCat.name}</h2>
              <button style={btn(true)} onClick={()=>setView("addItem")}>＋ Add Item</button>
            </div>
            {loading?(
              <div style={{textAlign:"center",padding:40,color:CM,fontSize:12}}>Loading items...</div>
            ):(
              items.length===0?(
                <div style={{textAlign:"center",padding:30,color:CM,background:`${O}08`,border:`1px solid ${O}1C`,borderRadius:12}}>
                  <div style={{fontSize:11}}>No items found. Add one!</div>
                </div>
              ):(
                items.map(item=>(
                  <div key={item.id} style={{...card,opacity:item.is_active?1:.5,transition:"opacity .2s"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap",marginBottom:2}}>
                          <span style={{fontSize:13,fontWeight:700,color:CR}}>{item.name}</span>
                          {item.tag&&<span style={{background:TAG_C[item.tag]||O,color:"#fff",fontSize:7,fontWeight:700,padding:"1px 6px",borderRadius:20}}>{item.tag}</span>}
                          {!item.is_active&&<span style={{background:"#E6394622",color:"#E63946",fontSize:7,padding:"1px 6px",borderRadius:20,border:"1px solid #E6394444"}}>Hidden</span>}
                        </div>
                        {item.sub_section&&<div style={{fontSize:9,color:O,opacity:.8,marginBottom:1}}>{item.sub_section}</div>}
                        {item.description&&<div style={{fontSize:10,color:CM,lineHeight:1.4}}>{item.description}</div>}
                      </div>
                      <div style={{display:"flex",gap:5,flexShrink:0}}>
                        <button onClick={()=>toggleActive(item.id,item.is_active)} style={{...btn(false),padding:"5px 10px",fontSize:9,background:item.is_active?"#2DC65318":"#E8620A18",borderColor:item.is_active?"#2DC65344":O+"44",color:item.is_active?"#2DC653":O}}>
                          {item.is_active?"Hide":"Show"}
                        </button>
                        <button onClick={()=>deleteItem(item.id,item.name)} style={{...btn(false,true),padding:"5px 9px",fontSize:9}}>🗑</button>
                      </div>
                    </div>
                    {/* Price options - inline edit */}
                    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                      {(item.item_options||[]).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)).map(opt=>(
                        <div key={opt.id} style={{display:"flex",alignItems:"center",gap:5,background:`${O}0E`,border:`1px solid ${O}22`,borderRadius:8,padding:"5px 10px"}}>
                          <span style={{fontSize:9,color:CM,whiteSpace:"nowrap"}}>{opt.size_label}</span>
                          <span style={{fontSize:10,color:O,fontWeight:700}}>Rs.</span>
                          <input
                            defaultValue={opt.price}
                            type="number"
                            onBlur={e=>{
                              const v=parseInt(e.target.value);
                              if(v&&v!==opt.price)updatePrice(opt.id,v);
                            }}
                            style={{width:65,background:"transparent",border:"none",color:O,fontSize:13,fontWeight:800,outline:"none",fontFamily:"'Space Grotesk',sans-serif"}}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )
            )}
          </>
        )}

        {/* ══ ADD ITEM ════════════════════════════════════════ */}
        {view==="addItem"&&selCat&&(
          <>
            <h2 style={{margin:"0 0 16px",fontSize:15,fontWeight:800}}>＋ Add Item — {selCat.name}</h2>
            <div style={card}>
              <label style={lbl}>ITEM NAME *</label>
              <input value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))}
                placeholder="e.g. Chicken Tikka" style={{...inp(),marginBottom:12}}/>

              <label style={lbl}>TAG (optional)</label>
              <select value={newItem.tag} onChange={e=>setNewItem(p=>({...p,tag:e.target.value}))}
                style={{...inp(),marginBottom:12}}>
                {TAG_OPTS.map(t=><option key={t} value={t} style={{background:"#1A0800"}}>{t||"— None —"}</option>)}
              </select>

              <label style={lbl}>SUB SECTION (e.g. Chinese Starters / Pizza Deals)</label>
              <input value={newItem.sub_section} onChange={e=>setNewItem(p=>({...p,sub_section:e.target.value}))}
                placeholder="Leave empty if not needed" style={{...inp(),marginBottom:12}}/>

              <label style={lbl}>DESCRIPTION (optional)</label>
              <input value={newItem.description} onChange={e=>setNewItem(p=>({...p,description:e.target.value}))}
                placeholder="Short description of the item" style={{...inp(),marginBottom:18}}/>

              <label style={{...lbl,marginBottom:8}}>SIZE & PRICE OPTIONS *</label>
              {newOpts.map((opt,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                  <input value={opt.size_label} onChange={e=>setNewOpts(p=>p.map((o,j)=>j===i?{...o,size_label:e.target.value}:o))}
                    placeholder="Size (e.g. Half / Small / Regular)" style={{...inp(),flex:2}}/>
                  <input value={opt.price} onChange={e=>setNewOpts(p=>p.map((o,j)=>j===i?{...o,price:e.target.value}:o))}
                    placeholder="Price" type="number" style={{...inp("90px")}}/>
                  {newOpts.length>1&&(
                    <button onClick={()=>setNewOpts(p=>p.filter((_,j)=>j!==i))}
                      style={{width:32,height:32,background:"#E6394615",border:"1px solid #E6394633",borderRadius:8,color:"#E63946",cursor:"pointer",fontSize:16,flexShrink:0}}>✕</button>
                  )}
                </div>
              ))}
              <button onClick={()=>setNewOpts(p=>[...p,{size_label:"",price:""}])}
                style={{...btn(false),marginBottom:20,fontSize:11}}>＋ Add Size Option</button>

              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setView("items")} style={{...btn(false),flex:1}}>Cancel</button>
                <button onClick={saveNewItem} style={{...btn(true),flex:2,padding:12,fontSize:13}}>SAVE ITEM ✓</button>
              </div>
            </div>
          </>
        )}

        {/* ══ AR URLs ═════════════════════════════════════════ */}
        {view==="arUrls"&&(
          <>
            <h2 style={{margin:"0 0 8px",fontSize:15,fontWeight:800}}>🎯 AR 3D Model URLs</h2>
            <div style={{fontSize:10,color:CM,marginBottom:16,lineHeight:1.7,background:`${O}08`,border:`1px solid ${O}1C`,borderRadius:10,padding:"10px 14px"}}>
              <strong style={{color:CR}}>How to add AR model:</strong><br/>
              1. GitHub par <span style={{color:O}}>public/pizza.glb</span> upload karo<br/>
              2. File par click → <span style={{color:O}}>"Raw"</span> button → URL copy karo<br/>
              3. Woh URL neeche paste karo → Save<br/>
              Format: <span style={{color:O,fontSize:9}}>https://raw.githubusercontent.com/YOUR/albasit-menu/main/public/pizza.glb</span>
            </div>
            {loading?(
              <div style={{textAlign:"center",padding:30,color:CM,fontSize:12}}>Loading...</div>
            ):(
              cats.map(cat=>(
                <div key={cat.id} style={{...card}}>
                  <label style={lbl}>{cat.name.toUpperCase()}</label>
                  <div style={{display:"flex",gap:8}}>
                    <input
                      id={`ar_${cat.id}`}
                      defaultValue={cat.ar_url||""}
                      placeholder="https://raw.githubusercontent.com/..."
                      style={{...inp(),flex:1,fontSize:10}}
                    />
                    <button
                      onClick={()=>saveArUrl(cat.id,document.getElementById(`ar_${cat.id}`).value)}
                      style={{...btn(true),padding:"8px 14px",flexShrink:0,fontSize:11}}>Save</button>
                  </div>
                  {cat.ar_url&&(
                    <div style={{fontSize:9,color:"#06D6A0",marginTop:5}}>✓ AR model linked</div>
                  )}
                </div>
              ))
            )}
          </>
        )}

      </div>
    </div>
  );
}
