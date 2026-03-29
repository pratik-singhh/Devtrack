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

      setNewTask("");

    } catch (error) {

      console.error(error);

    }

  }

  const { details, tryDelete, tryEdit } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedName, setEditedName] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<string>("");
  const { tokenVerify } = useAuth();

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

  }, [details.id])


  return (
    <div className="paper-container p-6 relative flex flex-col min-h-[300px]">
      {/* Decorative vertical line */}
      <div className="absolute top-0 left-4 w-px h-full bg-ink-color/10"></div>
      
      <div className="pl-6">
        <div className="flex justify-between items-start mb-6">
          {!isEditing ? (
            <div className="flex-1">
              <h3 className="text-xl mb-1">{details.name}</h3>
              <p className="text-[10px] opacity-40 uppercase">Project No. {details.id}</p>
            </div>
          ) : (
            <div className="flex-1 mr-4">
              <input 
                value={editedName} 
                onChange={(e) => setEditedName(e.target.value)} 
                className="input-typewriter w-full" 
                autoFocus
              />
            </div>
          )}

          <div className="flex gap-2">
            {!isEditing ? (
              <button 
                className="text-[10px] uppercase border border-ink-color/30 px-2 py-1 hover:bg-ink-color hover:text-paper-bg transition-colors"
                onClick={() => {
                  setEditedName(details.name);
                  setIsEditing(true);
                }}
              >
                Edit
              </button>
            ) : (
              <button 
                className="text-[10px] uppercase border border-ink-color/30 px-2 py-1 hover:bg-green-800 hover:text-white transition-colors"
                onClick={() => {
                  tryEdit(details.id, editedName)
                  setIsEditing(false);
                }}
              >
                Save
              </button>
            )}
            <button 
              className="text-[10px] uppercase border border-red-800/30 text-red-800/60 px-2 py-1 hover:bg-red-800 hover:text-white transition-colors"
              onClick={() => tryDelete(details.id)}
            >
              Delete
            </button>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          <div className="border-t border-ink-color/10 pt-4">
            <p className="text-[10px] uppercase font-bold mb-4 opacity-50 tracking-widest">Tasks to do</p>
            
            <div className="space-y-2">
              {tasks.map((item) => (
                <div className="flex items-center group" key={item.id}>
                  <input 
                    type="checkbox"
                    onChange={(e) => { changeComplete(item.id, e.target.checked) }} 
                    checked={item.completed} 
                    className="appearance-none w-4 h-4 border border-ink-color relative cursor-pointer checked:bg-ink-color checked:after:content-['✓'] checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-[10px] checked:after:text-paper-bg" 
                  />
                  <p className={`ml-3 text-sm flex-1 ${item.completed ? 'line-through opacity-40' : ''}`}>
                    {item.name}
                  </p>
                  <button 
                    className="opacity-0 group-hover:opacity-100 text-[8px] uppercase text-red-800/60 ml-2"
                    onClick={() => deleteTask(item.id)}
                  >
                    [ Remove ]
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-dashed border-ink-color/20">
          <div className="flex gap-2 items-center">
            <input 
              onChange={(e) => setNewTask(e.target.value)} 
              value={newTask} 
              placeholder="New entry..."
              className="bg-transparent border-b border-ink-color/20 text-xs py-1 flex-1 focus:outline-none focus:border-ink-color" 
            />
            <button 
              onClick={() => addTask(details.id)} 
              className="text-[10px] uppercase font-bold opacity-60 hover:opacity-100"
            >
              + Add
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectItem
