import type { Project } from "../types"
import { tryDeleteTasks, tryFetchTasks, tryUpdateTasks, tryAddTasks } from "../api/tasks";
import { useEffect, useState } from "react";
type Props = {
  details: Project
  tryDelete: (id: number) => void
  tryEdit: (id: number, newName: string) => void
}
import type { Task } from "../types";
import { useAuth } from "../hooks/useAuth";




function ProjectItem(props: Props) {

  const changeComplete = async (id: number, truth: boolean) => {
    try {

      const token = tokenVerify();
      await tryUpdateTasks(id, truth, token);

      const updatedTasks = tasks.map((item: Task) => {

        if (item.id === id) {
          return {
            id: item.id,
            name: item.name,
            completed: truth,
            project_id: item.project_id,
            created_at: item.created_at,
          }

        }
        else return item;
      })
      setTasks(updatedTasks);
    } catch (error) {
      console.error(error);


    }


  }

  const deleteTask = async (id: number) => {
    try {

      const token = tokenVerify();
      await tryDeleteTasks(id, token);

      const updatedTasks = tasks.filter((item: Task) => item.id !== id);
      setTasks(updatedTasks);


    } catch (error) {

      console.error(error);

    }

  }

  const addTask = async (id: number) => {
    try {

      if (newTask.trim() === "") return;
      const token = tokenVerify();
      const data = await tryAddTasks(id, newTask, token);


      setTasks((old) => [...old, data]);


    } catch (error) {

      console.error(error);

    }

  }

  const { details, tryDelete, tryEdit } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedName, setEditedName] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<string>("");
  const { authError, tokenVerify, logout } = useAuth();

  useEffect(() => {
    async function fetchTasks() {
      try {

        const token = tokenVerify();
        const data = await tryFetchTasks(details.id, token)
        console.log(data);

        setTasks(data);
      } catch (error) {
        console.log(error);

      }

    }
    fetchTasks();

  }, [])


  return (
    <div className="flex flex-col">
      {(!isEditing) &&

        <div>

          <h3 className="min-w-xs border-2 p-2 m-4 rounded-md bg-teal-200" key={details.id}>{details.name}</h3>
          <button className="p-2 bg-rose-300 border-2 m-4 rounded-lg max-w-xs" onClick={() => {
            setEditedName(details.name);
            setIsEditing(true);

          }}>Edit</button>
          <button className="p-2 bg-rose-300 border-2 m-4 rounded-lg max-w-xs" onClick={() => tryDelete(details.id)}>Delete</button>
        </div>
      }

      {(isEditing) &&
        <div>
          <input value={editedName} onChange={(e) => setEditedName(e.target.value)} className="p-2 border-2 m-4 rounded-lg max-w-xs" /> <br />
          <button className="p-2 bg-rose-300 border-2 m-4 rounded-lg max-w-xs" onClick={() => {
            tryEdit(details.id, editedName)
            setIsEditing(false);
          }} >Save</button>
          <button className="p-2 bg-rose-300 border-2 m-4 rounded-lg max-w-xs" onClick={() => tryDelete(details.id)}>Delete</button>
        </div>
      }
      <div className="flex max-h-fit">
        {tasks.map((item) => (
          <div className="flex" key={item.id}>

            <p className="m-5 border-2 p-2 max-w-xs">{item.name}</p>

            <input onChange={(e) => { changeComplete(item.id, e.target.checked) }} checked={item.completed} className="m-2 p-2 border-3" type="checkbox" />
            <button className="border-2 rounded-lg bg-red-300 max-w-xs" onClick={() => deleteTask(item.id)}>Delete</button>
          </div>
        ))}
        <div>
          <input onChange={(e) => setNewTask(e.target.value)} value={newTask} className="border-2 m-5 " />
          <button onClick={() => {
            addTask(details.id);
            setNewTask("");

          }
          } className="border-2 m-5 p-1" >Add Task</button>
        </div>

      </div>

    </div >
  )
}

export default ProjectItem
