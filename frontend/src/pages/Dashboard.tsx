import { useState, useEffect } from "react";
import type { Project } from "../types"
import { projectAdd, projectDelete, projectEdit, projectFetch } from "../api/projects";
import { useAuth } from "../hooks/useAuth";
import ProjectItem from "../components/ProjectItem";
import { useProjects } from "../hooks/useProjects";

function Dashboard() {
  const { logout } = useAuth();
  console.log("Dashboard Opened");
  const { projects, loading, tryAdd, tryEdit, tryDelete } = useProjects();


  const [newProject, setNewProject] = useState<string>("");

  if (loading) {
    return (
      <h1>Loading ...</h1>
    )
  }



  return (
    <div>
      {(projects.length === 0) &&
        <div className="m-5">

          <h1 >No Projects Created.</h1>
          <h1>Add a new project to view.</h1>
        </div>
      }

      {projects.map((item) => (
        <ProjectItem
          details={item}
          tryDelete={tryDelete}
          tryEdit={tryEdit}
          key={item.id}
        />

      ))}

      <div>
        <input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="Enter New Project Name" className="p-2 border-2 m-4 rounded-lg max-w-xs" />
        <button onClick={() => {
          tryAdd(newProject);
          setNewProject("");
        }} className="p-2 bg-emerald-300 border-2 m-4 rounded-lg max-w-xs" >Add</button>

      </div>
      <div>
        <button onClick={logout} className="p-2 bg-lime-300 border-2 m-4 rounded-lg max-w-xs" >Log Out</button>
      </div>
    </div >
  )
}

export default Dashboard
