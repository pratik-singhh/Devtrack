import { useState } from "react";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse uppercase tracking-widest text-sm opacity-50">
          [ ACCESSING DATABASE... ]
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-8 max-w-6xl mx-auto">
      {/* Header / Session Bar */}
      <header className="paper-container mb-12 p-6 flex justify-between items-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-ink-color/20"></div>
        <div>
          <h1 className="text-2xl">My Projects</h1>
          <p className="text-[10px] opacity-60 uppercase">Signed in as: {localStorage.getItem('user_id') || "User"}</p>
        </div>
        <button 
          onClick={logout} 
          className="stamped-btn text-xs"
        >
          Log Out
        </button>
      </header>

      {/* Main Content Area */}
      <div className="space-y-12">
        <section>
          <div className="flex justify-between items-end mb-6 border-b-2 border-ink-color/10 pb-2">
            <h2 className="text-xl">Saved Projects</h2>
            <p className="text-[10px] opacity-40 uppercase">{projects.length} Total</p>
          </div>

          {(projects.length === 0) ? (
            <div className="paper-container p-20 text-center opacity-40 border-dashed">
              <p className="text-lg">[ NO PROJECTS YET ]</p>
              <p className="text-xs">Start a new project below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((item) => (
                <ProjectItem
                  details={item}
                  tryDelete={tryDelete}
                  tryEdit={tryEdit}
                  key={item.id}
                />
              ))}
            </div>
          )}
        </section>

        {/* Action Area */}
        <section className="paper-container p-8 max-w-2xl mx-auto">
          <h3 className="text-sm mb-6 opacity-60">Create New Project</h3>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-bold mb-1 block opacity-50">Project Name:</label>
              <input 
                value={newProject} 
                onChange={(e) => setNewProject(e.target.value)} 
                placeholder="What are you working on?" 
                className="input-typewriter w-full mb-0" 
              />
            </div>
            <button 
              onClick={() => {
                if (newProject.trim()) {
                  tryAdd(newProject);
                  setNewProject("");
                }
              }} 
              className="stamped-btn py-1"
            >
              Create
            </button>
          </div>
        </section>
      </div>

      <footer className="mt-20 text-center text-[10px] opacity-30 uppercase tracking-[0.2em]">
        TaskMaster Dashboard
      </footer>
    </div>
  )
}

export default Dashboard
