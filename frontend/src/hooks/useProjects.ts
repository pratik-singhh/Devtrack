import { useEffect, useState } from "react";
import type { Project } from "../types";
import { useAuth } from "./useAuth";
import { projectAdd, projectDelete, projectEdit, projectFetch } from "../api/projects";
export function useProjects() {


  const { authError, tokenVerify, } = useAuth();


  const [projects, setProjects] = useState<Project[]>([]);
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
  const tryAdd = async (newProject: string) => {
    if (newProject.trim() !== "") {

      try {

        const token = tokenVerify();

        const Data = await projectAdd(token, newProject);
        setProjects((old) => [...old, Data]);

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

      setProjects((old) => old.map((item) => {
        if (item.id === id) {
          return data;
        }
        else return item;
      }))


    } catch (error) {
      console.error(error);
      authError();


    }

  }


  return { projects, loading, tryAdd, tryEdit, tryDelete };
}
