# Rekursion & Listen – offline version

Interactive course for Informatik Q12 (Kurs 2INF1): Python from zero, Rekursion, Listen
and exam preparation. 21 lessons, 101 Python blocks with automatic checks, quizzes,
exam tasks and step-by-step visualisations. The course itself is in German.

This folder is the complete course: the unzipped offline package, or the `docs/` folder
of the GitHub repository. It runs on your own computer and needs no internet connection.


## 1. Requirements

- **Computer:** Windows 10/11, macOS or Linux.
- **Browser:** an up-to-date version of Chrome, Edge, Firefox or Safari.
- **Python 3.7 or newer** installed on the computer. It is only used to run the small
  local web server that start.py starts. Your exercises run on the Python 3.12 inside
  the course, so the version on your computer does not matter otherwise.
  If you already use PyCharm, you very likely have Python installed already.
- **About 20 MB** of free disk space.
- **No internet needed.** The only things loaded from the web are the fonts. Without
  internet, the browser uses its own fonts and everything else works the same.
- **No admin rights** needed, except to install Python if it is missing.

### Checking for Python

- **Windows:** open PowerShell and type `py --version`
- **macOS / Linux:** open Terminal and type `python3 --version`

If a version number like `Python 3.12.4` appears, you are ready.

### Installing Python (only if it is missing)

1. Download it from https://www.python.org/downloads/
2. **Windows:** on the first installer screen, tick **"Add python.exe to PATH"**,
   then click "Install Now".
3. **macOS:** run the installer. Alternatively, if the Mac offers to install the
   "command line developer tools" when you type `python3`, click Install. Those tools
   include Python 3 as well.


## 2. What is in the folder

| File / folder                      | What it is                                            |
|------------------------------------|-------------------------------------------------------|
| `start.bat`                        | Start file for **Windows** (double-click)             |
| `start.command`                    | Start file for **macOS** (double-click)               |
| `start.py`                         | The actual starter: local web server + opens browser  |
| `index.html`                       | The course page                                       |
| `content.js`                       | All lessons, exercises, quizzes and exam tasks        |
| `engine.js`, `viz.js`, `tracer.js`, `diagrams.js` | Course logic, visualisations and diagrams |
| `pyodide/`                         | Python 3.12 for the browser (runs your code)          |
| `lib/codemirror/`                  | The code editor                                       |

Keep all files together in this folder. Do not rename or move the subfolders.


## 3. Start the course

**First unzip the whole ZIP file.** Do not start anything from inside the ZIP.

### Windows

1. Double-click **`start.bat`**.
2. A black window opens and the course opens in your browser.
3. Keep the black window open while you work.

### macOS

1. Double-click **`start.command`**.
2. A Terminal window opens and the course opens in your browser.
3. Keep the Terminal window open while you work.

### Linux

Open a terminal in this folder and run `python3 start.py`
(or `bash start.command`).

The course runs at **http://127.0.0.1:8765/**. You can also open this address yourself
or bookmark it, as long as the start window is open.


## 4. Security warnings on the first start

The start files are not signed by a known developer, so the system may ask once.

### Windows: "Windows protected your PC"

Click **More info**, then **Run anyway**.

### macOS: "start.command cannot be opened" / "Apple could not verify ..."

- **macOS 14 or older:** Control-click (right-click) `start.command`, choose
  **Open**, then click **Open** again in the dialog.
- **macOS 15 or newer:** click **Done** in the warning. Then open
  **System Settings → Privacy & Security**, scroll down to the message about
  `start.command`, click **Open Anyway** and confirm.
- **Or skip the start file:** open Terminal, type `python3 ` (with a space), drag
  `start.py` into the window and press Enter.

After the first time, a double-click works normally.


## 5. Working with the course

- **Stop:** press `Ctrl+C` in the start window, or just close it. The course page
  stops working until you start it again.
- **Next time:** double-click the start file again. If the course is already running,
  the start file only opens it in the browser.
- **Your progress** (solved blocks and your code) is saved in your browser, under the
  address http://127.0.0.1:8765. It stays there as long as you
  - use the **same browser**,
  - do not use a private/incognito window,
  - and do not delete the browser's site data.

  Progress in this offline version is separate from the online version of the course.
- **Sending code to Claude:** the button "Für Claude kopieren" copies the task, your code
  and the check results. Paste that into a chat.


## 6. Starting without the start files

If the start files do not work on your computer, you can start the same server by hand:

1. Open a terminal in this folder.
   - **Windows:** open the folder in Explorer, click the address bar, type `powershell`
     and press Enter.
   - **macOS:** open Terminal, type `cd ` (with a space), drag this folder into the
     window and press Enter.
2. Run
   - **Windows:** `py start.py`
   - **macOS / Linux:** `python3 start.py`
3. If the browser does not open by itself, go to http://127.0.0.1:8765/


## 7. Troubleshooting

| Problem | Cause and fix |
|---|---|
| The course shows **"Python konnte nicht starten"** | The page was opened directly from the file (the address starts with `file://`). Browsers block Python there. Always start with the start file and use the `http://127.0.0.1:...` address. |
| **"start.py not found"** or **"Course files not found"** | The ZIP is not unzipped, or files were moved. Unzip the whole ZIP and start from the unzipped folder. |
| **"Python 3 was not found"** | Install Python (see section 1). On Windows, tick "Add python.exe to PATH". |
| Typing `python` on Windows opens the **Microsoft Store** | That is a placeholder, not Python. Install Python from python.org as described in section 1. |
| The window says **"port 8765 was busy"** | Another program uses that port, so the course runs on 8766 or higher this time. Your progress from 8765 does not show at the new address. Close the other program (or another course window) and start again. |
| The page does not load | The start window was closed. Start the course again. |
| The page looks old after an update of the files | Reload without cache: `Ctrl+F5` (Windows) or `Cmd+Shift+R` (macOS). |
| The code editor is a plain text box without line numbers | The folder `lib/codemirror` is missing. Unzip the complete ZIP again. |


## 8. Why is a start file needed?

Your Python code runs inside the browser on Pyodide, which is Python compiled to
WebAssembly. Browsers only allow a page to load these files when it comes from a web
server, not when it is opened as a local file. `start.py` starts a tiny web server that
only your own computer can reach (address 127.0.0.1). It reads the course files from
this folder and nothing else.


## 9. Third-party software

- **Pyodide 0.27.7**, Mozilla Public License 2.0: https://pyodide.org
  (includes CPython 3.12, Python Software Foundation License)
- **CodeMirror 5.65.16**, MIT License: https://codemirror.net/5/
  (license in `lib/codemirror/LICENSE`)
