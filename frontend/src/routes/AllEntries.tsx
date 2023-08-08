import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";

export default function AllEntries() {
  const { entries, deleteEntry } = useContext(EntryContext) as EntryContextType;
  let navigate = useNavigate();
  if (entries.length == 0) {
    return (
      <section>
        <h1 className="text-center font-semibold text-2xl m-5 dark:text-white">You don't have any card</h1>
        <p className="text-center font-medium text-md dark:text-white">
          Lets{" "}
          <Link className="text-blue-400 dark:text-white dark:font-bold underline underline-offset-1" to="/create">
            Create One
          </Link>
        </p>
      </section>
    );
  }
  return (
    <section className="grid grid-cols-2 md:grid-cols-4">
      {entries.map((entry: Entry, index: number) => {
        return (
          <div
            id={entry.id}
            key={index}
            className="bg-gray-300 dark:bg-slate-600 shadow-md shadow-gray-500 dark:shadow-slate-200 m-3 p-4 rounded flex flex-col justify-between"
          >
            <h1 className="font-bold text-sm md:text-lg dark:text-white">{entry.title}</h1>
            <p className="text-center text-lg font-light md:mt-2 md:mb-4 mt-1 mb-3 dark:text-white">
              {entry.description}
            </p>
            <section className="flex items-center justify-between flex-col md:flex-row pt-2 md:pt-0">
              <div className="flex justify-center">
                <button
                  onClick={() => {
                    deleteEntry(entry.id as string);
                  }}
                  className="m-1 md:m-2 p-1 font-semibold rounded-md bg-red-500 hover:bg-red-700"
                >
                  ✖
                </button>
                <button
                  onClick={() => {
                    navigate(`/edit/${entry.id}`, { replace: true });
                  }}
                  className="m-1 md:m-2 p-1 font-semibold rounded-md bg-blue-500 hover:bg-blue-700"
                >
                  🖊
                </button>
              </div>
              <time className="text-right text-sm md:text-lg dark:text-white">
                {new Date(entry.created_at.toString()).toLocaleDateString()}
              </time>
            </section>
          </div>
        );
      })}
    </section>
  );
}
