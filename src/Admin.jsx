import { useState, useEffect, useRef } from "react";

const SUPA_URL = "https://eimcmuzstrvlbjgimvsx.supabase.co";
const SUPA_KEY = "sb_publishable_mhe6FqpyayyhNc7fVd1usw_X0RXPKlD";
const ADMIN_PASS = "albasit2025";

const O="#E8620A",OH="#FF7A1A",BK="#000000",BRM="#1E0A02",
      CR="#F5E2C4",CM="#8A6644";

async function db(method, table, params="", body=null){
  try {
    const res = await fetch(`${SUPA_URL}/rest/v1/${table}${params}`,{
      method,
      headers:{
        "apikey":SUPA_KEY,
        "Authorization":`Bearer ${SUPA_KEY}`,
        "Content-Type":"application/json",
        "Prefer": method==="POST"?"return=representation":"return=minimal"
      },
      body: body?JSON.stringify(body):undefined
    });
    if(method==="DELETE"||method==="PATCH") return {ok:true};
    return await res.json();
  } catch(e){ console.error("DB error:",e); return null; }
}

const TAG_OPTS=["","#1","Top","Spicy","New","Special","Family","Premium","Sweet","Value"];
const TAG_C={"#1":"#FF4500","Top":"#E8620A","Spicy":"#E63946","New":"#06D6A0","Special":"#9B5DE5","Family":"#FFB703","Premium":"#C9940F","Sweet":"#FF69B4","Value":"#2DC653"};

const card = {background:`linear-gradient(160deg,#1C0A01,${BK})`,border:`1px solid #E8620A22`,borderRadius:14,padding:14,marginBottom:10};
const inp = (w="100%")=>({width:w,padding:"9px 12px",background:"#E8620A0F",border:"1px solid #E8620A33",borderRadius:9,color:CR,fontSize:12,outline:"none",fontFamily:"'Space Grotesk',sans-serif"});
const lbl = {fontSize:8,color:"#E8620A",letterSpacing:2,fontWeight:700,marginBottom:4,display:"block",marginTop:10};
const btn = (active,danger,sm)=>({padding:sm?"6px 12px":"8px 16px",background:danger?"#E6394615":active?`linear-gradient(135deg,${O},${OH})`:"#E8620A15",border:`1px solid ${danger?"#E6394644":active?O:"#E8620A33"}`,borderRadius:8,color:danger?"#E63946":active?"#fff":CR,fontSize:sm?10:11,fontWeight:600,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif",transition:"all .15s"});

function LoginScreen({onLogin}){
  const[pass,setPass]=useState("");
  const[err,setErr]=useState(false);
  return(
    <div style={{minHeight:"100vh",background:BK,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;}`}</style>
      <div style={{background:BRM,border:`1.5px solid ${O}55`,borderRadius:22,padding:36,width:"min(360px,90vw)",textAlign:"center",boxShadow:`0 0 40px ${O}22`}}>
        <div style={{fontSize:44,marginBottom:14}}>🔐</div>
        <div style={{fontSize:8,color:O,letterSpacing:4,fontWeight:700,marginBottom:3}}>◈ ADMIN ACCESS ◈</div>
        <h2 style={{margin:"0 0 6px",fontSize:20,fontWeight:800,color:CR}}>Al Basit</h2>
        <p style={{margin:"0 0 22px",fontSize:11,color:CM}}>Menu Management System</p>
        <input type="password" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(pass===ADMIN_PASS?onLogin():setErr(true))}
          placeholder="Enter admin password"
          style={{...inp(),marginBottom:10,border:`1px solid ${err?"#E63946":O+"44"}`,textAlign:"center"}}/>
        {err&&<div style={{fontSize:11,color:"#E63946",marginBottom:8}}>❌ Wrong password</div>}
        <button onClick={()=>pass===ADMIN_PASS?onLogin():setErr(true)} style={{...btn(true),width:"100%",padding:13,fontSize:14}}>LOGIN →</button>
      </div>
    </div>
  );
}

export default function Admin(){
  const[authed,setAuthed]=useState(false);
  const[view,setView]=useState("cats");
  const[cats,setCats]=useState([]);
  const[selCat,setSelCat]=useState(null);
  const[items,setItems]=useState([]);
  const[loading,setLoading]=useState(false);
  const[toast,setToast]=useState("");
  const[newItem,setNewItem]=useState({name:"",tag:"",sub_section:"",description:""});
  const[newOpts,setNewOpts]=useState([{size_label:"Regular",price:""}]);
  const[settings,setSettings]=useState({
    facebook:"https://www.facebook.com/AlBasit.Restaurant",
    instagram:"https://www.instagram.com/albasitrestaurantofficial/?hl=en",
    youtube:"https://www.youtube.com/channel/UC-1FlxVk5Ams9JpFoXl-yAQ",
    whatsapp:"923145684466",
    phone:"021-34500076",
    email:"info@albasitresturant.com",
    address:"Main Saudabad Chowrangi, Begum Khursheed Road, Malir, Karachi",
    website:"albasitrestaurant.com"
  });
  const[newCat,setNewCat]=useState({name:"",sub:"",slug:"",img_url:""});

  const showToast=(m)=>{setToast(m);setTimeout(()=>setToast(""),3000);};

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
    showToast(cur?"Item hidden":"Item visible");
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
    if(!validOpts.length){showToast("❌ At least 1 price needed");return;}
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
    } else { showToast("❌ Error — check connection"); }
  };

  const saveArUrl=async(catId,url)=>{
    await db("PATCH","categories",`?id=eq.${catId}`,{ar_url:url||null});
    showToast("✅ AR URL saved!");
    loadCats();
  };

  const updateCatImage=async(catId,imgUrl)=>{
    await db("PATCH","categories",`?id=eq.${catId}`,{img_url:imgUrl||null});
    showToast("✅ Image updated!");
    loadCats();
  };

  const toggleCatActive=async(catId,cur)=>{
    await db("PATCH","categories",`?id=eq.${catId}`,{is_active:!cur});
    showToast(cur?"Category hidden":"Category visible");
    loadCats();
  };

  const deleteCat=async(catId,name)=>{
    if(!window.confirm(`Delete category "${name}" and ALL its items?`))return;
    await db("DELETE","categories",`?id=eq.${catId}`);
    showToast("🗑️ Category deleted");
    loadCats();
  };

  const addNewCategory=async()=>{
    if(!newCat.name.trim()||!newCat.slug.trim()){showToast("❌ Name and Slug required");return;}
    const maxOrd=cats.length?Math.max(...cats.map(c=>c.sort_order||0)):0;
    const created=await db("POST","categories","",{
      name:newCat.name.trim(),
      sub:newCat.sub.trim()||"",
      slug:newCat.slug.trim().toLowerCase().replace(/\s+/g,"-"),
      img_url:newCat.img_url.trim()||null,
      sort_order:maxOrd+1,
      is_active:true
    });
    if(created&&created[0]?.id){
      showToast("✅ Category added!");
      setNewCat({name:"",sub:"",slug:"",img_url:""});
      setView("cats");
      loadCats();
    } else { showToast("❌ Error — slug might be duplicate"); }
  };

  const updateCatName=async(catId,name,sub)=>{
    await db("PATCH","categories",`?id=eq.${catId}`,{name,sub});
    showToast("✅ Category updated!");
    loadCats();
  };

  if(!authed) return <LoginScreen onLogin={()=>{setAuthed(true);loadCats();}}/>;

  const S={
    page:{minHeight:"100vh",background:`radial-gradient(ellipse at 50% 0%,${BRM},${BK})`,fontFamily:"'Space Grotesk',sans-serif",color:CR},
    header:{position:"sticky",top:0,zIndex:500,background:`linear-gradient(180deg,${BK}F9,${BRM}EE)`,backdropFilter:"blur(18px)",borderBottom:`1px solid ${O}22`,padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"},
  };

  const views=[
    {id:"cats",icon:"📋",label:"Categories"},
    {id:"arUrls",icon:"🎯",label:"AR Models"},
    {id:"addCat",icon:"➕",label:"Add Category"},
    {id:"settings",icon:"⚙️",label:"Settings"},
  ];

  return(
    <div style={S.page}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&display=swap');*{box-sizing:border-box;}input,select,textarea{font-family:'Space Grotesk',sans-serif;}input::placeholder,textarea::placeholder{color:#8A664455;}::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-thumb{background:${O}44;border-radius:3px;}`}</style>

      {toast&&<div style={{position:"fixed",top:70,left:"50%",transform:"translateX(-50%)",background:`${O}EE`,color:"#fff",padding:"10px 22px",borderRadius:22,fontSize:12,fontWeight:700,zIndex:9999,boxShadow:`0 4px 20px ${O}66`,whiteSpace:"nowrap"}}>{toast}</div>}

      {/* Header */}
      <div style={S.header}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {(view==="items"||view==="addItem")&&<button onClick={()=>setView("cats")} style={{...btn(false),padding:"6px 10px"}}>←</button>}
          <div>
            <div style={{fontSize:7,color:O,letterSpacing:3,fontWeight:700}}>◈ ADMIN PANEL ◈</div>
            <div style={{fontSize:15,fontWeight:800,color:CR}}>Al Basit Menu</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <a href="/" target="_blank" style={{...btn(false),textDecoration:"none",padding:"6px 10px",fontSize:10}}>Menu ↗</a>
          <button onClick={()=>setAuthed(false)} style={{...btn(false,true),padding:"6px 10px",fontSize:10}}>Logout</button>
        </div>
      </div>

      {/* Nav tabs */}
      {view!=="items"&&view!=="addItem"&&(
        <div style={{display:"flex",gap:6,padding:"10px 14px",background:`${O}08`,borderBottom:`1px solid ${O}1C`,overflowX:"auto"}}>
          {views.map(v=>(
            <button key={v.id} onClick={()=>setView(v.id)} style={{...btn(view===v.id),padding:"7px 12px",fontSize:10,whiteSpace:"nowrap",flexShrink:0}}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>
      )}

      <div style={{maxWidth:860,margin:"0 auto",padding:"14px 14px 50px"}}>

        {/* ══ CATEGORIES ══ */}
        {view==="cats"&&(
          <>
            <h2 style={{margin:"0 0 12px",fontSize:15,fontWeight:800}}>📋 Categories</h2>
            {loading?<div style={{textAlign:"center",padding:40,color:CM}}>Loading...</div>:
            cats.length===0?<div style={{textAlign:"center",padding:30,color:CM,background:`${O}08`,border:`1px solid ${O}1C`,borderRadius:12}}>No categories. Run SQL first.</div>:
            cats.map(cat=>(
              <div key={cat.id} style={{...card,opacity:cat.is_active?1:.5}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                      <span style={{fontSize:13,fontWeight:700,color:CR}}>{cat.name}</span>
                      <span style={{fontSize:9,color:CM,background:`${O}12`,padding:"1px 6px",borderRadius:20}}>{cat.slug}</span>
                      {!cat.is_active&&<span style={{fontSize:8,color:"#E63946",background:"#E6394615",padding:"1px 6px",borderRadius:20}}>Hidden</span>}
                    </div>
                    <div style={{fontSize:10,color:CM}}>{cat.sub}</div>
                  </div>
                  <div style={{display:"flex",gap:5,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    <button onClick={()=>{setSelCat(cat);setView("items");loadItems(cat.slug);}} style={{...btn(true,false,true)}}>Items →</button>
                    <button onClick={()=>toggleCatActive(cat.id,cat.is_active)} style={{...btn(false,false,true),color:cat.is_active?"#2DC653":"#E8620A"}}>{cat.is_active?"Hide":"Show"}</button>
                    <button onClick={()=>deleteCat(cat.id,cat.name)} style={{...btn(false,true,true)}}>🗑</button>
                  </div>
                </div>
                {/* Edit name & sub inline */}
                <div style={{display:"flex",gap:6,marginBottom:6}}>
                  <input defaultValue={cat.name} id={`cn_${cat.id}`} placeholder="Category name" style={{...inp(),flex:2,fontSize:11}}/>
                  <input defaultValue={cat.sub} id={`cs_${cat.id}`} placeholder="Subtitle" style={{...inp(),flex:2,fontSize:11}}/>
                  <button onClick={()=>updateCatName(cat.id,document.getElementById(`cn_${cat.id}`).value,document.getElementById(`cs_${cat.id}`).value)} style={{...btn(true,false,true),flexShrink:0}}>Save</button>
                </div>
                {/* Image URL */}
                <div style={{display:"flex",gap:6,marginBottom:6}}>
                  <input defaultValue={cat.img_url||""} id={`ci_${cat.id}`} placeholder="Image URL (https://...)" style={{...inp(),flex:1,fontSize:10}}/>
                  <button onClick={()=>updateCatImage(cat.id,document.getElementById(`ci_${cat.id}`).value)} style={{...btn(false,false,true),flexShrink:0}}>Update Image</button>
                </div>
                {cat.img_url&&<img src={cat.img_url} alt="" style={{width:60,height:40,objectFit:"cover",borderRadius:6,border:`1px solid ${O}33`}}/>}
              </div>
            ))}
          </>
        )}

        {/* ══ ITEMS ══ */}
        {view==="items"&&selCat&&(
          <>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}>
              <h2 style={{margin:0,fontSize:15,fontWeight:800,flex:1}}>{selCat.name}</h2>
              <button style={btn(true)} onClick={()=>setView("addItem")}>＋ Add Item</button>
            </div>
            {loading?<div style={{textAlign:"center",padding:30,color:CM}}>Loading...</div>:
            items.length===0?<div style={{textAlign:"center",padding:25,color:CM,background:`${O}08`,border:`1px solid ${O}1C`,borderRadius:10,fontSize:11}}>No items. Add one!</div>:
            items.map(item=>(
              <div key={item.id} style={{...card,opacity:item.is_active?1:.5}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:8,marginBottom:8}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap",marginBottom:2}}>
                      <span style={{fontSize:13,fontWeight:700,color:CR}}>{item.name}</span>
                      {item.tag&&<span style={{background:TAG_C[item.tag]||O,color:"#fff",fontSize:7,fontWeight:700,padding:"1px 6px",borderRadius:20}}>{item.tag}</span>}
                      {!item.is_active&&<span style={{fontSize:7,color:"#E63946",background:"#E6394615",padding:"1px 6px",borderRadius:20,border:"1px solid #E6394433"}}>Hidden</span>}
                    </div>
                    {item.sub_section&&<div style={{fontSize:9,color:O,opacity:.8,marginBottom:1}}>{item.sub_section}</div>}
                    {item.description&&<div style={{fontSize:10,color:CM,lineHeight:1.4}}>{item.description}</div>}
                  </div>
                  <div style={{display:"flex",gap:5,flexShrink:0}}>
                    <button onClick={()=>toggleActive(item.id,item.is_active)} style={{...btn(false,false,true),color:item.is_active?"#2DC653":O}}>{item.is_active?"Hide":"Show"}</button>
                    <button onClick={()=>deleteItem(item.id,item.name)} style={{...btn(false,true,true)}}>🗑</button>
                  </div>
                </div>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                  {(item.item_options||[]).sort((a,b)=>(a.sort_order||0)-(b.sort_order||0)).map(opt=>(
                    <div key={opt.id} style={{display:"flex",alignItems:"center",gap:5,background:`${O}0E`,border:`1px solid ${O}22`,borderRadius:8,padding:"5px 10px"}}>
                      <span style={{fontSize:9,color:CM,whiteSpace:"nowrap"}}>{opt.size_label}</span>
                      <span style={{fontSize:10,color:O,fontWeight:700}}>Rs.</span>
                      <input defaultValue={opt.price} type="number"
                        onBlur={e=>{const v=parseInt(e.target.value);if(v&&v!==opt.price)updatePrice(opt.id,v);}}
                        style={{width:65,background:"transparent",border:"none",color:O,fontSize:13,fontWeight:800,outline:"none",fontFamily:"'Space Grotesk',sans-serif"}}/>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* ══ ADD ITEM ══ */}
        {view==="addItem"&&selCat&&(
          <>
            <h2 style={{margin:"0 0 14px",fontSize:15,fontWeight:800}}>＋ Add Item — {selCat.name}</h2>
            <div style={card}>
              <label style={lbl}>ITEM NAME *</label>
              <input value={newItem.name} onChange={e=>setNewItem(p=>({...p,name:e.target.value}))} placeholder="e.g. Chicken Tikka" style={inp()}/>
              <label style={lbl}>TAG</label>
              <select value={newItem.tag} onChange={e=>setNewItem(p=>({...p,tag:e.target.value}))} style={inp()}>
                {TAG_OPTS.map(t=><option key={t} value={t} style={{background:"#1A0800"}}>{t||"— None —"}</option>)}
              </select>
              <label style={lbl}>SUB SECTION</label>
              <input value={newItem.sub_section} onChange={e=>setNewItem(p=>({...p,sub_section:e.target.value}))} placeholder="e.g. Chinese Starters" style={inp()}/>
              <label style={lbl}>DESCRIPTION</label>
              <input value={newItem.description} onChange={e=>setNewItem(p=>({...p,description:e.target.value}))} placeholder="Short description" style={inp()}/>
              <label style={{...lbl,marginTop:14}}>SIZE & PRICE OPTIONS *</label>
              {newOpts.map((opt,i)=>(
                <div key={i} style={{display:"flex",gap:8,marginBottom:8,alignItems:"center"}}>
                  <input value={opt.size_label} onChange={e=>setNewOpts(p=>p.map((o,j)=>j===i?{...o,size_label:e.target.value}:o))} placeholder="Size (Half/Full/Regular)" style={{...inp(),flex:2}}/>
                  <input value={opt.price} onChange={e=>setNewOpts(p=>p.map((o,j)=>j===i?{...o,price:e.target.value}:o))} placeholder="Price" type="number" style={{...inp("90px")}}/>
                  {newOpts.length>1&&<button onClick={()=>setNewOpts(p=>p.filter((_,j)=>j!==i))} style={{width:30,height:30,background:"#E6394615",border:"1px solid #E6394633",borderRadius:8,color:"#E63946",cursor:"pointer",fontSize:16,flexShrink:0}}>✕</button>}
                </div>
              ))}
              <button onClick={()=>setNewOpts(p=>[...p,{size_label:"",price:""}])} style={{...btn(false),marginBottom:16,fontSize:11}}>＋ Add Size Option</button>
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>setView("items")} style={{...btn(false),flex:1}}>Cancel</button>
                <button onClick={saveNewItem} style={{...btn(true),flex:2,padding:12,fontSize:13}}>SAVE ITEM ✓</button>
              </div>
            </div>
          </>
        )}

        {/* ══ AR URLS ══ */}
        {view==="arUrls"&&(
          <>
            <h2 style={{margin:"0 0 8px",fontSize:15,fontWeight:800}}>🎯 AR 3D Model URLs</h2>
            <div style={{fontSize:10,color:CM,marginBottom:14,background:`${O}08`,border:`1px solid ${O}1C`,borderRadius:10,padding:"10px 14px",lineHeight:1.7}}>
              Sirf file naam daalo: <span style={{color:O}}>pizza.glb</span> ya poora raw URL.<br/>
              GitHub raw URL: <span style={{color:O,fontSize:9}}>https://raw.githubusercontent.com/Vividar/albasit-menu/main/public/pizza.glb</span>
            </div>
            {loading?<div style={{textAlign:"center",padding:30,color:CM}}>Loading...</div>:
            cats.map(cat=>(
              <div key={cat.id} style={card}>
                <label style={{...lbl,marginTop:0}}>{cat.name.toUpperCase()}</label>
                <div style={{display:"flex",gap:8}}>
                  <input id={`ar_${cat.id}`} defaultValue={cat.ar_url||""} placeholder="pizza.glb or full URL..." style={{...inp(),flex:1,fontSize:10}}/>
                  <button onClick={()=>saveArUrl(cat.id,document.getElementById(`ar_${cat.id}`).value)} style={{...btn(true),flexShrink:0}}>Save</button>
                </div>
                {cat.ar_url&&<div style={{fontSize:9,color:"#06D6A0",marginTop:4}}>✓ AR linked: {cat.ar_url}</div>}
              </div>
            ))}
          </>
        )}

        {/* ══ ADD CATEGORY ══ */}
        {view==="addCat"&&(
          <>
            <h2 style={{margin:"0 0 14px",fontSize:15,fontWeight:800}}>➕ Add New Category</h2>
            <div style={card}>
              <label style={{...lbl,marginTop:0}}>CATEGORY NAME *</label>
              <input value={newCat.name} onChange={e=>setNewCat(p=>({...p,name:e.target.value,slug:e.target.value.toLowerCase().replace(/\s+/g,"-").replace(/[^a-z0-9-]/g,"")}))} placeholder="e.g. Seafood" style={inp()}/>
              <label style={lbl}>SUBTITLE</label>
              <input value={newCat.sub} onChange={e=>setNewCat(p=>({...p,sub:e.target.value}))} placeholder="e.g. Fresh from Sea" style={inp()}/>
              <label style={lbl}>SLUG * (auto-generated, can edit)</label>
              <input value={newCat.slug} onChange={e=>setNewCat(p=>({...p,slug:e.target.value.toLowerCase().replace(/\s+/g,"-")}))} placeholder="e.g. seafood" style={inp()}/>
              <label style={lbl}>IMAGE URL (optional)</label>
              <input value={newCat.img_url} onChange={e=>setNewCat(p=>({...p,img_url:e.target.value}))} placeholder="https://example.com/image.jpg" style={inp()}/>
              {newCat.img_url&&<img src={newCat.img_url} alt="" style={{width:80,height:55,objectFit:"cover",borderRadius:8,border:`1px solid ${O}33`,marginTop:6}}/>}
              <div style={{display:"flex",gap:10,marginTop:16}}>
                <button onClick={()=>setView("cats")} style={{...btn(false),flex:1}}>Cancel</button>
                <button onClick={addNewCategory} style={{...btn(true),flex:2,padding:12,fontSize:13}}>ADD CATEGORY ✓</button>
              </div>
            </div>
          </>
        )}

        {/* ══ SETTINGS ══ */}
        {view==="settings"&&(
          <>
            <h2 style={{margin:"0 0 14px",fontSize:15,fontWeight:800}}>⚙️ Restaurant Settings</h2>
            <div style={{fontSize:10,color:CM,marginBottom:14,background:`${O}08`,border:`1px solid ${O}1C`,borderRadius:10,padding:"10px 14px"}}>
              Yeh settings sirf reference ke liye hain. Inhe App.jsx mein update karna hoga ya future mein database mein save hongi.
            </div>

            <div style={card}>
              <div style={{fontSize:11,color:O,fontWeight:700,marginBottom:10}}>📱 Social Media Links</div>
              {[
                {key:"facebook",label:"FACEBOOK URL",placeholder:"https://facebook.com/..."},
                {key:"instagram",label:"INSTAGRAM URL",placeholder:"https://instagram.com/..."},
                {key:"youtube",label:"YOUTUBE URL",placeholder:"https://youtube.com/..."},
                {key:"whatsapp",label:"WHATSAPP NUMBER",placeholder:"923145684466"},
              ].map(({key,label,placeholder})=>(
                <div key={key}>
                  <label style={lbl}>{label}</label>
                  <input value={settings[key]} onChange={e=>setSettings(p=>({...p,[key]:e.target.value}))} placeholder={placeholder} style={inp()}/>
                </div>
              ))}
            </div>

            <div style={card}>
              <div style={{fontSize:11,color:O,fontWeight:700,marginBottom:10}}>📞 Contact Info</div>
              {[
                {key:"phone",label:"PHONE NUMBER",placeholder:"021-34500076"},
                {key:"email",label:"EMAIL",placeholder:"info@..."},
                {key:"website",label:"WEBSITE",placeholder:"albasitrestaurant.com"},
              ].map(({key,label,placeholder})=>(
                <div key={key}>
                  <label style={lbl}>{label}</label>
                  <input value={settings[key]} onChange={e=>setSettings(p=>({...p,[key]:e.target.value}))} placeholder={placeholder} style={inp()}/>
                </div>
              ))}
              <label style={lbl}>ADDRESS</label>
              <textarea value={settings.address} onChange={e=>setSettings(p=>({...p,address:e.target.value}))}
                placeholder="Restaurant address..."
                style={{...inp(),height:70,resize:"vertical"}}/>
            </div>

            <div style={{background:`${O}08`,border:`1px solid ${O}22`,borderRadius:12,padding:14,marginTop:4}}>
              <div style={{fontSize:10,color:CM,lineHeight:1.7}}>
                <strong style={{color:CR}}>Current Values Preview:</strong><br/>
                📘 Facebook: <span style={{color:O}}>{settings.facebook}</span><br/>
                📸 Instagram: <span style={{color:O}}>{settings.instagram}</span><br/>
                ▶️ YouTube: <span style={{color:O}}>{settings.youtube}</span><br/>
                💬 WhatsApp: <span style={{color:O}}>{settings.whatsapp}</span><br/>
                📞 Phone: <span style={{color:O}}>{settings.phone}</span><br/>
                ✉️ Email: <span style={{color:O}}>{settings.email}</span><br/>
                📍 Address: <span style={{color:O}}>{settings.address}</span>
              </div>
            </div>

            <div style={{marginTop:12,padding:12,background:"#E8620A12",border:"1px solid #E8620A33",borderRadius:10,fontSize:10,color:CM,lineHeight:1.6}}>
              ℹ️ Social links aur contact info update karne ke liye App.jsx mein yeh values change karo aur GitHub par push karo. Agle version mein yeh bhi database se save hoga.
            </div>
          </>
        )}

      </div>
    </div>
  );
}
