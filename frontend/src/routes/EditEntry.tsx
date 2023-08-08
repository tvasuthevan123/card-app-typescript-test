import { ChangeEvent, MouseEvent, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Entry, EntryContextType } from "../@types/context";
import { EntryContext } from "../utilities/globalContext";

export default function EditEntry() {
  const { id } = useParams();
  const emptyEntry: Entry = { title: "", description: "", created_at: new Date(), scheduled_for: new Date() };

  const { updateEntry, entries } = useContext(EntryContext) as EntryContextType;
  const [newEntry, setNewEntry] = useState<Entry>(emptyEntry);

  useEffect(() => {
    const entry = entries.filter((entry) => entry.id == id)[0];
    setNewEntry(entry);
  }, []);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewEntry({
      ...newEntry,
      [event.target.name]: event.target.value,
    });
  };
  const handleSend = (e: MouseEvent<HTMLButtonElement>) => {
    updateEntry(id as string, newEntry);
  };
  return (
    <section className="flex justify-center flex-col w-fit ml-auto mr-auto mt-10 bg-gray-300 dark:bg-slate-600 p-8 rounded-md">
      <input
        className="mb-3 p-3 rounded-md dark:bg-slate-400 dark:text-white dark:placeholder:text-white"
        type="text"
        placeholder="Title"
        name="title"
        value={newEntry.title}
        onChange={handleInputChange}
      />
      <textarea
        className="mb-2 p-3 rounded-md dark:bg-slate-400 dark:text-white dark:placeholder:text-white"
        placeholder="Description"
        name="description"
        value={newEntry.description}
        onChange={handleInputChange}
      />
      <label className="mb-1 font-bold dark:text-white">Created At</label>
      <input
        className="mb-2 p-3 rounded-md dark:bg-slate-400 dark:text-white dark:placeholder:text-white"
        type="date"
        name="created_at"
        value={new Date(newEntry.created_at).toISOString().split("T")[0]}
        onChange={handleInputChange}
      />
      <label className="mb-1 font-bold dark:text-white">Scheduled For</label>
      <input
        className="mb-3 p-3 rounded-md dark:bg-slate-400 dark:text-white dark:placeholder:text-white"
        type="date"
        name="scheduled_for"
        value={new Date(newEntry.scheduled_for).toISOString().split("T")[0]}
        onChange={handleInputChange}
      />
      <button
        onClick={(e) => {
          handleSend(e);
        }}
        className="bg-blue-400 hover:bg-blue-600 font-semibold text-white p-3 rounded-md dark:hover:bg-slate-500 dark:bg-slate-600 dark:outline dark:outline-2"
      >
        Update
      </button>
    </section>
  );
}
