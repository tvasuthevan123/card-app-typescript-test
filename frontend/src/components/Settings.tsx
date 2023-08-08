import { Dialog, Switch } from "@headlessui/react";
import { useState } from "react";
import { MdSettings } from "react-icons/md";

interface SettingsProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Settings({ darkMode, toggleDarkMode }: SettingsProps) {
  const [isSettingsOpen, setSettingsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setSettingsOpen(true)}
        className="inline-flex items-center justify-center w-10 h-10 m-3 p-2 text-xl bg-blue-400 dark:bg-slate-600 hover:bg-blue-500 dark:hover:bg-slate-400 rounded-md text-white dark:hover:text-slate-900"
      >
        <MdSettings />
      </button>
      <Dialog
        open={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        className={`relative z-50 ${darkMode ? "dark" : "light"}`}
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="p-3 w-full max-w-sm rounded bg-white dark:bg-slate-600">
            <Dialog.Title className="font-bold p-1 mb-2 dark:text-white">Settings</Dialog.Title>
            <Switch.Group>
              <div className="flex items-center space-x-4">
                <Switch.Label className="ml-2 mr-2 relative inline-flex items-center dark:text-white">
                  Dark Mode
                </Switch.Label>
                <Switch
                  checked={darkMode}
                  onChange={toggleDarkMode}
                  className="dark:bg-slate-700 bg-slate-100 relative inline-flex h-6 w-11 items-center outline outline-1 dark:outline-none dark:outline-white rounded-full"
                >
                  <span className="sr-only">Dark Mode</span>
                  <span
                    className={`${
                      darkMode ? "translate-x-6" : "translate-x-1"
                    } inline-block h-4 w-4 transform rounded-full bg-slate-800 dark:bg-white transition`}
                  />
                </Switch>
              </div>
            </Switch.Group>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}
