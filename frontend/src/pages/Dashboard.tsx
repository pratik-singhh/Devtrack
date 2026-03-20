import { useState, useEffect } from "react";
import type { Project } from "../types"
import { projectAdd, projectDelete, projectEdit, projectFetch } from "../api/projects";
import { useAuth } from "../hooks/useAuth";
import ProjectItem from "../components/ProjectItem";

function Dashboard() {
  const { authError, tokenVerify, logout } = useAuth();
  console.log("Dashboard Opened");

  const [projects, setProjects] = useState<Project[]>([]);

  const [newProject, setNewProject] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    setLoading(true);

    const token = tokenVerify();
    const tryFetch = async () => {
      try {

        const Data = await projectFetch(token);
        setProjects(Data);
      }

      catch (error) {
        console.error(error);
        authError();

      }
      finally {

        setLoading(false);
      }
    }
    tryFetch();
  }, [])

  const tryAdd = async () => {
    if (newProject.trim() !== "") {

      try {

        const token = tokenVerify();

        const Data = await projectAdd(token, newProject);
        setProjects((old) => [...old, Data]);
        setNewProject("");

      } catch (error) {
        console.error(error);
        authError();


      }
    }
  }
  const tryDelete = async (id: number): Promise<void> => {
    try {

      const token = tokenVerify();

      const Data = await projectDelete(id, token);
      console.log(Data);



      setProjects((old) => (old.filter((element) => (element.id !== id))))

    } catch (error) {
      console.error(error);

      authError();
    }

  }

  const tryEdit = async (id: number, newName: string) => {
    try {

      const token = tokenVerify();

      const data = await projectEdit(token, id, newName);
      console.log(data);

      const editedProject = projects.map((item) => {
        if (item.id === id) {
          return data;
        }
        else return item;
      })
      setProjects(editedProject);


    } catch (error) {
      console.error(error);
      authError();


    }

  }
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
        <button onClick={tryAdd} className="p-2 bg-emerald-300 border-2 m-4 rounded-lg max-w-xs" >Add</button>

      </div>
      <div>
        <button onClick={logout} className="p-2 bg-lime-300 border-2 m-4 rounded-lg max-w-xs" >Log Out</button>
      </div>
    </div >
  )
}

export default Dashboard
