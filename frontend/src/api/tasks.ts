const tryFetchTasks = async (id: number, token: string) => {
  const response = await fetch(`https://devtrack-production.up.railway.app/projects/${id}/tasks`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  if (!response.ok) {
    throw new Error("Request Failed");
  }
  const data = await response.json();
  return data;





}
const tryUpdateTasks = async (id: number, completed: boolean, token: string) => {
  const response = await fetch(`https://devtrack-production.up.railway.app/tasks/${id}`, {
    method: "PUT",
    headers: {

      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "completed": completed
    })
  });
  if (!response.ok) {
    throw new Error("Request Failed");
  }
  const data = await response.json();
  return data;



}

const tryDeleteTasks = async (id: number, token: string) => {
  const response = await fetch(`https://devtrack-production.up.railway.app/tasks/${id}`, {
    method: "DELETE",
    headers: {

      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
  });
  if (!response.ok) {
    throw new Error("Request Failed");
  }
  const data = await response.json();
  return data;



}

const tryAddTasks = async (id: number, name: string, token: string) => {
  const response = await fetch(`https://devtrack-production.up.railway.app/projects/${id}/tasks`, {
    method: "POST",
    headers: {

      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      "name": name
    })
  });
  if (!response.ok) {
    throw new Error("Request Failed");
  }
  const data = await response.json();
  return data;



}

export { tryFetchTasks, tryUpdateTasks, tryDeleteTasks, tryAddTasks };
