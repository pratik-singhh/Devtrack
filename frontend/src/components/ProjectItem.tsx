import type { Project } from "../types"
import { useState } from "react";
type Props = {
  details: Project
  tryDelete: (id: number) => void
  tryEdit: (id: number, newName: string) => void
}

function ProjectItem(props: Props) {
  const { details, tryDelete, tryEdit } = props;
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editedName, setEditedName] = useState<string>("");
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

    </div>
  )
}

export default ProjectItem
