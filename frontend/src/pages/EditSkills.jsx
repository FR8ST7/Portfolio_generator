import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

export default function EditSkills(){
  const uid = localStorage.getItem("uid");
  const nav = useNavigate();
  const [user,setUser]=useState(null);
  const [skillInput,setSkillInput]=useState("");

  const fetchUser = async()=>{
    const res = await api.get(`/portfolio/${uid}`);
    setUser(res.data);
  };

  useEffect(()=>{
    if(!uid) nav("/");
    fetchUser();
  },[]);

  const addSkill = ()=>{
    if(!skillInput.trim()) return;
    setUser({...user, skills:[...(user.skills||[]), skillInput.trim()]});
    setSkillInput("");
  };

  const removeSkill = (i)=>{
    const copy=[...user.skills];
    copy.splice(i,1);
    setUser({...user, skills:copy});
  };

  const save = async()=>{
    await api.put(`/portfolio/${uid}`, user);
    alert("updated ✅");
    nav("/dashboard");
  };

  if(!user) return <div>Loading...</div>;

  return(
    <div style={{padding:30}}>
      <h2>Edit Skills</h2>

      <div style={{marginTop:20}}>
        <input
          placeholder="Add new skill"
          style={inp}
          value={skillInput}
          onChange={(e)=>setSkillInput(e.target.value)}
          onKeyDown={(e)=>e.key==="Enter" && addSkill()}
        />
        <button onClick={addSkill} style={btn}>Add Skill</button>

        <div style={{marginTop:20}}>
          {user.skills?.map((s,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",marginBottom:8,background:"white",borderRadius:6,boxShadow:"0 1px 3px rgba(0,0,0,0.1)"}}>
              <span>{s}</span>
              <button style={del} onClick={()=>removeSkill(i)}>×</button>
            </div>
          ))}
        </div>

        <button style={{...btn,marginTop:20}} onClick={save}>Save</button>
      </div>
    </div>
  )
}

const inp={width:"100%",padding:10,marginBottom:12,borderRadius:6,border:"1px solid #ccc"};
const btn={padding:10,border:"none",borderRadius:6,background:"#1976d2",color:"white",cursor:"pointer"};
const del={border:"none",background:"transparent",color:"#c62828",fontSize:20, cursor:"pointer"};
