import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function EditAbout(){
  const uid = localStorage.getItem("uid");
  const nav = useNavigate();

  const [user,setUser]=useState(null);
  const [summaryLimit,setSummaryLimit] = useState(true);
  const [editor,setEditor] = useState("markdown"); // "markdown" or "normal"

  const fetchUser = async()=>{
    const res = await api.get(`/portfolio/${uid}`);
    setUser(res.data);
  };

  useEffect(()=>{
    if(!uid) nav("/");
    fetchUser();
  },[]);

  const save = async()=>{
    const res = await api.put(`/portfolio/${uid}`, user);
    alert("updated ✅");
    nav("/dashboard");
  };

  if(!user) return <div>Loading..</div>;

  const handleAboutChange=(e)=>{
    setUser({
      ...user,
      about:{...user.about,[e.target.name]:e.target.value}
    });
  };

  return(
    <div style={{padding:30}}>
      <h2>Edit About</h2>

      {/* toggle summary limit */}
      <div style={{margin:"15px 0"}}>
        <b>Summary Limit:</b>&nbsp;
        <button onClick={()=>setSummaryLimit(true)} style={summaryLimit?on:off}>ON</button>
        <button onClick={()=>setSummaryLimit(false)} style={!summaryLimit?on:off}>OFF</button>
      </div>

      {/* toggle editor */}
      <div style={{margin:"15px 0"}}>
        <b>Description Editor:</b>&nbsp;
        <button onClick={()=>setEditor("markdown")} style={editor==="markdown"?on:off}>Markdown</button>
        <button onClick={()=>setEditor("normal")} style={editor==="normal"?on:off}>Normal</button>
      </div>

      <div style={{marginTop:20}}>
        <input
          name="title"
          placeholder="Title"
          style={inp}
          value={user.about?.title||""}
          onChange={handleAboutChange}
        />
        <input
          name="summary"
          placeholder="Summary"
          style={inp}
          value={user.about?.summary||""}
          maxLength={summaryLimit?100:9999}
          onChange={handleAboutChange}
        />
        {summaryLimit && <div style={{fontSize:12}}>{100-(user.about?.summary?.length||0)} chars left</div>}

        {editor==="markdown" ?
          <textarea
            name="description"
            placeholder="Markdown supported"
            style={{...inp, height:150}}
            value={user.about?.description||""}
            onChange={handleAboutChange}
          />:
          <textarea
            name="description"
            placeholder="Description"
            style={{...inp, height:150}}
            value={user.about?.description||""}
            onChange={handleAboutChange}
          />
        }

        <button style={btn} onClick={save}>Save</button>
      </div>
    </div>
  )
}

const inp={width:"100%",padding:10,marginBottom:12,borderRadius:6,border:"1px solid #ccc"};
const btn={padding:10,border:"none",borderRadius:6,background:"#1976d2",color:"white",cursor:"pointer"};
const on={padding:"4px 10px",marginRight:5,border:"none",borderRadius:4,background:"#1976d2",color:"white"};
const off={padding:"4px 10px",marginRight:5,border:"1px solid #1976d2",borderRadius:4,background:"white",color:"#1976d2"};
