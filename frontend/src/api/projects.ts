export async function projectFetch(token: string) {
  const response = await fetch('http://localhost:3000/projects', {
    method: "GET",
    headers: {
      "Authorization": token,
      "Content-Type": "application/json"
    }

  });
  if (!response.ok) {
    throw new Error("Invalid Token");
  }
  const Data = await response.json();
  return Data;
}




export async function projectAdd(token: string, newProject: string) {
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
  if (!response.ok) {
    throw new Error("Invalid Token");
  }
  const Data = await response.json();
  console.log(Data);
  return Data;
}







export async function projectDelete(id: number, token: string) {
  const response = await fetch(`http://localhost:3000/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": token,

    }
  })
  if (!response.ok) throw new Error("Invalid Token");
  const data = await response.json();
  return data;



}


export async function projectEdit(token: string, editingProjectId: number | null, editedName: string) {
  const response = await fetch(`http://localhost:3000/projects/${editingProjectId}`, {
    method: "PUT",
    headers: {
      "Authorization": token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: editedName
    })
  })

  if (!response.ok) throw new Error("Invalid Token");
  const data = await response.json();
  return data;

}
