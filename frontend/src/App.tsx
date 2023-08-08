import React, { useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import Settings from "./components/Settings";
import AllEntries from "./routes/AllEntries";
import EditEntry from "./routes/EditEntry";
import NewEntry from "./routes/NewEntry";
import { EntryProvider } from "./utilities/globalContext";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    console.log("Dark mode: " + darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <section>
      <Router>
        <EntryProvider>
          <div className={`${darkMode ? "dark" : "light"}`}>
            <div className="dark:bg-slate-700 duration-150 h-screen w-full">
              <Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
              <NavBar></NavBar>
              <Routes>
                <Route path="/" element={<AllEntries />}></Route>
                <Route path="create" element={<NewEntry />}></Route>
                <Route path="edit/:id" element={<EditEntry />}></Route>
              </Routes>
            </div>
          </div>
        </EntryProvider>
      </Router>
    </section>
  );
}
