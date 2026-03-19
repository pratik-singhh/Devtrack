import { useState, useEffect } from "react";
import type { Project } from "../types"
function Dashboard() {

  console.log("Dashboard Opened");

  const [projects, setProjects] = useState<Project[]>([]);

  const [newProject, setNewProject] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    async function projectFetch() {
      const response = await fetch('http://localhost:3000/projects', {
        method: "GET",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        }

      });
      const Data = await response.json();
      setProjects(Data);
      console.log(Data);

    }
    projectFetch();
  }, [])

  const handleAddProject = async () => {
    if (newProject.trim() !== "") {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/projects', {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: newProject
        })
      })
      const Data = await response.json();
      console.log(Data);
      setProjects((old) => [...old, Data]);
      setNewProject("");




    }
  }



  return (
    <div>
      {projects.map((element) => (
        <h3 className="border-2 p-2 m-4 rounded-md bg-teal-200" key={element.id}>{element.name}</h3>
      ))}

      <div>
        <input value={newProject} onChange={(e) => setNewProject(e.target.value)} placeholder="Enter New Project Name" className="p-2 border-2 m-4 rounded-lg max-w-xs" />
        <button onClick={handleAddProject} className="p-2 border-2 m-4 rounded-lg max-w-xs" >Add</button>

      </div>
    </div>
  )
}

export default Dashboard
