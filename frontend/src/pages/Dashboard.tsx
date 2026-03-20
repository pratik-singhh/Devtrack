import { useState, useEffect } from "react";
import type { Project } from "../types"
import { projectAdd, projectDelete, projectEdit, projectFetch } from "../api/projects";
import { useAuth } from "../hooks/useAuth";

function Dashboard() {
  const { authError, tokenVerify, logout } = useAuth();
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null)
  const [editedName, setEditedName] = useState<string>("");
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
  const startEditProject = (id: number, name: string) => {
    setEditingProjectId(id);
    setEditedName(name);

  }
  const saveEditProject = async (): Promise<void> => {

    try {

      const token = tokenVerify();


      const Data = await projectEdit(token, editingProjectId, editedName);
      setProjects((old) => old.map((element) => {
        if (element.id === editingProjectId) {
          return Data;
        }
        return element;
      }))

      setEditingProjectId(null);
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
      {projects.map((element) => (
        <div className="flex">
          {(element.id !== editingProjectId) &&

            <div>

              <h3 className="min-w-xs border-2 p-2 m-4 rounded-md bg-teal-200" key={element.id}>{element.name}</h3>
              <button className="p-2 bg-rose-300 border-2 m-4 rounded-lg max-w-xs" onClick={() => startEditProject(element.id, element.name)}>Edit</button>
            </div>
          }

          {(element.id === editingProjectId) &&
            <div>
              <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="p-2 border-2 m-4 rounded-lg max-w-xs" /> <br />
              <button className="p-2 bg-rose-300 border-2 m-4 rounded-lg max-w-xs" onClick={() => saveEditProject()}>Save</button>
            </div>
          }
          <button className="p-2 bg-rose-300 border-2 m-4 rounded-lg max-w-xs" onClick={() => tryDelete(element.id)}>Delete</button>

        </div>
      ))
      }

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
