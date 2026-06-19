import os
import shutil
import subprocess
import sys

# Define styling & metadata
AUTHOR_NAME = "Aryan Jadile"
PROJECT_TITLE = "PomeGuard"
SUBTITLE = "Precision Horticulture Intelligence Platform"
DOCUMENT_TYPE = "COMPLETE SOURCE CODE FOR COPYRIGHT REGISTRATION"
CONFIDENTIAL_TEXT = "CONFIDENTIAL - For Copyright Registration Only"
YEAR = "2026"

# Source files to compile
FILES_TO_INCLUDE = [
    # 1. Database Schemas
    {
        "category": "Database Schemas",
        "path": "database.sql",
        "language": "SQL",
        "title": "Main SQLite Schema (database.sql)"
    },
    {
        "category": "Database Schemas",
        "path": "supabase_init.sql",
        "language": "SQL",
        "title": "Cloud Supabase Migration (supabase_init.sql)"
    },
    # 2. FastAPI Backend Application
    {
        "category": "FastAPI Backend Application",
        "path": "api/main.py",
        "language": "Python",
        "title": "Application Entrypoint & Routing Core (api/main.py)"
    },
    {
        "category": "FastAPI Backend Application",
        "path": "api/routers/chat.py",
        "language": "Python",
        "title": "Chatbot Endpoints & Routing (api/routers/chat.py)"
    },
    {
        "category": "FastAPI Backend Application",
        "path": "api/agents/vision_agent.py",
        "language": "Python",
        "title": "Gemini Vision Agent (api/agents/vision_agent.py)"
    },
    {
        "category": "FastAPI Backend Application",
        "path": "api/utils/gemini.py",
        "language": "Python",
        "title": "Gemini AI Core Utility (api/utils/gemini.py)"
    },
    {
        "category": "FastAPI Backend Application",
        "path": "api/utils/firebase_admin.py",
        "language": "Python",
        "title": "Firebase Administrative Layer (api/utils/firebase_admin.py)"
    },
    # 3. React Frontend Client
    {
        "category": "React Frontend Client",
        "path": "frontend/src/main.jsx",
        "language": "JavaScript",
        "title": "Vite React Client Entrypoint (frontend/src/main.jsx)"
    },
    {
        "category": "React Frontend Client",
        "path": "frontend/src/App.jsx",
        "language": "JavaScript",
        "title": "React Routing & State Management (frontend/src/App.jsx)"
    },
    {
        "category": "React Frontend Client",
        "path": "frontend/src/components/Navbar.jsx",
        "language": "JavaScript",
        "title": "Navigation Control Component (frontend/src/components/Navbar.jsx)"
    },
    {
        "category": "React Frontend Client",
        "path": "frontend/src/pages/Home.jsx",
        "language": "JavaScript",
        "title": "Marketing Landing View (frontend/src/pages/Home.jsx)"
    },
    {
        "category": "React Frontend Client",
        "path": "frontend/src/pages/HowItWorks.jsx",
        "language": "JavaScript",
        "title": "Instructional Flow View (frontend/src/pages/HowItWorks.jsx)"
    },
    {
        "category": "React Frontend Client",
        "path": "frontend/src/pages/Login.jsx",
        "language": "JavaScript",
        "title": "Authentication: Login Screen (frontend/src/pages/Login.jsx)"
    },
    {
        "category": "React Frontend Client",
        "path": "frontend/src/pages/Signup.jsx",
        "language": "JavaScript",
        "title": "Authentication: Registration Screen (frontend/src/pages/Signup.jsx)"
    },
    {
        "category": "React Frontend Client",
        "path": "frontend/src/pages/Analyse.jsx",
        "language": "JavaScript",
        "title": "AI Image Classification & Disease Scanning View (frontend/src/pages/Analyse.jsx)"
    },
    {
        "category": "React Frontend Client",
        "path": "frontend/src/pages/Dashboard.jsx",
        "language": "JavaScript",
        "title": "Agronomic Analytics Dashboard View (frontend/src/pages/Dashboard.jsx)"
    },
    {
        "category": "React Frontend Client",
        "path": "frontend/src/pages/History.jsx",
        "language": "JavaScript",
        "title": "Historical Diagnostic Reports View (frontend/src/pages/History.jsx)"
    }
]

TEMP_DIR = "temp_sources"

def tex_escape(text):
    """Escapes special LaTeX characters for titles/section headings."""
    conv = {
        '&': r'\&',
        '%': r'\%',
        '$': r'\$',
        '#': r'\#',
        '_': r'\_',
        '{': r'\{',
        '}': r'\}',
        '~': r'\textasciitilde{}',
        '^': r'\textasciicircum{}',
        '\\': r'\textbackslash{}',
    }
    import re
    regex = re.compile('|'.join(re.escape(str(key)) for key in sorted(conv.keys(), key=lambda item: -len(item))))
    return regex.sub(lambda match: conv[match.group()], text)

def sanitize_and_copy_files():
    """Reads each file, translates non-ASCII symbols to safe representations, and writes to temp folder."""
    print("[INFO] Sanitizing and preparing pure-ASCII versions of code files...")
    
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
    os.makedirs(TEMP_DIR, exist_ok=True)
    
    replacements = {
        '—': '--',
        '°': 'o',
        '²': '2',
        '←': '<-',
        '…': '...',
        '©': '(c)',
        '“': '"',
        '”': '"',
        '‘': "'",
        '’': "'",
        '™': '(TM)',
        '®': '(R)',
    }
    
    for file_info in FILES_TO_INCLUDE:
        file_path = file_info["path"]
        if not os.path.exists(file_path):
            continue
            
        # Read with UTF-8
        with open(file_path, "r", encoding="utf-8", errors="replace") as f:
            content = f.read()
            
        # Apply replacements
        for orig, rep in replacements.items():
            content = content.replace(orig, rep)
            
        # Guarantee 100% pure ASCII for listings
        safe_chars = []
        for char in content:
            if ord(char) < 128:
                safe_chars.append(char)
            else:
                safe_chars.append('?') # Replace any other exotic unicode with '?'
                
        sanitized_content = "".join(safe_chars)
        
        # Write to temp folder mimicking the directory structure
        temp_path = os.path.join(TEMP_DIR, file_path)
        os.makedirs(os.path.dirname(temp_path), exist_ok=True)
        with open(temp_path, "w", encoding="ascii") as f:
            f.write(sanitized_content)

def build_latex():
    print("[INFO] Building LaTeX file...")
    
    latex_content = r"""\documentclass[10pt,a4paper]{article}
\usepackage[utf8]{inputenc}
\usepackage{geometry}
\geometry{a4paper, margin=0.85in}
\usepackage{courier}
\usepackage{listings}
\usepackage{xcolor}
\usepackage{hyperref}
\usepackage{fancyhdr}
\usepackage{titlesec}
\usepackage{tocloft}

% Set hyperref colors
\hypersetup{
    colorlinks=true,
    linkcolor=brandred,
    filecolor=brandred,      
    urlcolor=brandred,
}

% Brand Color definitions
\definecolor{brandred}{RGB}{139, 26, 26} % #8B1A1A matching PomeGuard brand
\definecolor{codegreen}{rgb}{0,0.5,0}
\definecolor{codegray}{rgb}{0.45,0.45,0.45}
\definecolor{codepurple}{rgb}{0.58,0,0.82}
\definecolor{backcolour}{rgb}{0.98,0.98,0.99}
\definecolor{codeblue}{rgb}{0.1,0.25,0.65}

% Listings configurations (Files are already pure ASCII, so listings runs at maximum speed)
\lstset{
    backgroundcolor=\color{backcolour},   
    commentstyle=\color{codegreen}\itshape,
    keywordstyle=\color{codeblue}\bfseries,
    numberstyle=\tiny\color{codegray},
    stringstyle=\color{codepurple},
    basicstyle=\ttfamily\scriptsize,
    breakatwhitespace=false,         
    breaklines=true,                 
    captionpos=b,                    
    keepspaces=true,                 
    numbers=left,                    
    numbersep=10pt,                  
    showspaces=false,                
    showstringspaces=false,
    showtabs=false,                  
    tabsize=2,
    frame=single,
    rulecolor=\color{codegray!25},
    framesep=4pt,
    xleftmargin=12pt,
}

% Define Javascript/JSX dialect
\lstdefinelanguage{JavaScript}{
  keywords={break, case, catch, class, const, continue, debugger, default, delete, do, else, export, extends, false, finally, for, function, if, import, in, instanceof, new, null, return, super, switch, this, throw, true, try, typeof, var, void, while, with, yield, let, static, await, async},
  keywordstyle=\color{codeblue}\bfseries,
  ndkeywords={class, export, boolean, throw, implements, import, this, default},
  ndkeywordstyle=\color{codepurple}\bfseries,
  identifierstyle=\color{black},
  sensitive=true,
  comment=[l]{//},
  morecomment=[s]{/*}{*/},
  commentstyle=\color{codegreen}\itshape,
  stringstyle=\color{codepurple}\ttfamily,
  morestring=[b]',
  morestring=[b]",
  morestring=[s]{`}{`}
}

% Styling titles and sections
\titleformat{\section}
  {\color{brandred}\normalfont\Large\bfseries}{\thesection}{1em}{}
\titleformat{\subsection}
  {\color{black}\normalfont\large\bfseries}{\thesubsection}{1em}{}

% Table of contents customization
\renewcommand{\cftsecleader}{\cftdotfill{\cftdotsep}}

% Running Header & Footer Setup
\pagestyle{fancy}
\fancyhf{}
\lhead{\small \textcolor{brandred}{\textbf{PomeGuard}} \-- Source Code Registry}
\rhead{\small Page \thepage}
\lfoot{\tiny \copyright\ """ + YEAR + r""" Aryan Jadile. All Rights Reserved.}
\rfoot{\tiny \textbf{CONFIDENTIAL \-- COPYRIGHT SUBMISSION}}
\renewcommand{\headrulewidth}{0.4pt}
\renewcommand{\footrulewidth}{0.4pt}

% Title page details
\begin{document}

\begin{titlepage}
    \centering
    \vspace*{2cm}
    
    % Brand logo or icon styled representation
    {\color{brandred}\Huge\textbf{POMEGUARD}}\\
    \vspace{0.3cm}
    {\large\textcolor{gray}{\textbf{""" + SUBTITLE + r"""}}}\\
    \vspace{2.5cm}
    
    {\Large\textbf{""" + DOCUMENT_TYPE + r"""}}\\
    \vspace{1.5cm}
    
    \begin{minipage}{0.8\textwidth}
        \centering
        \textbf{Applicant / Author:} \\
        Aryan Jadile \\
        \vspace{0.4cm}
        \textbf{Year of Development:} \\
        """ + YEAR + r""" \\
        \vspace{0.4cm}
        \textbf{Programming Languages:} \\
        Python (FastAPI), JavaScript / JSX (React, Vite), SQL \\
        \vspace{0.4cm}
        \textbf{Target Operating Environment:} \\
        Web Browser (Client) / FastAPI Cloud Host (Server)
    \end{minipage}
    
    \vfill
    
    {\color{brandred!75}\hrule height 1.5pt}
    \vspace{0.4cm}
    {\small\textbf{""" + CONFIDENTIAL_TEXT + r"""}}\\
    \vspace{0.2cm}
    {\small Generated on: \today}
\end{titlepage}

\newpage
\thispagestyle{empty}
\tableofcontents
\newpage
\setcounter{page}{1}
"""

    current_category = None
    for file_info in FILES_TO_INCLUDE:
        file_path = file_info["path"]
        if not os.path.exists(file_path):
            print(f"[WARNING] Skipping missing file: {file_path}")
            continue

        category = file_info["category"]
        title = file_info["title"]
        language = file_info["language"]

        # Path in the temporary directory
        temp_file_path = os.path.join(TEMP_DIR, file_path).replace("\\", "/")

        # Group by category sections in ToC
        if category != current_category:
            current_category = category
            latex_content += f"\n\\addtocontents{{toc}}{{\\vspace{{1em}}}}\\section{{{tex_escape(category)}}}\n"
            latex_content += "\\hrule\\vspace{1em}\n"

        latex_content += f"\\subsection{{{tex_escape(title)}}}\n"
        latex_content += f"\\noindent\\textbf{{Relative Path:}} \\texttt{{{tex_escape(file_path)}}} \\\\\n"
        
        # Determine language block
        lang_option = f"language={language}" if language else ""
        latex_content += f"\\lstinputlisting[{lang_option}]{{{temp_file_path}}}\n"
        latex_content += "\\newpage\n"

    latex_content += r"\end{document}"

    # Write LaTeX file
    with open("copyright_code.tex", "w", encoding="utf-8") as f:
        f.write(latex_content)
    print("[INFO] LaTeX file 'copyright_code.tex' written successfully.")

def run_latex():
    print("[INFO] Compiling LaTeX to PDF via pdflatex...")
    
    # Compilation 1 to generate TOC/AUX structures
    result1 = subprocess.run(
        ["pdflatex", "-interaction=nonstopmode", "copyright_code.tex"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    stdout1 = result1.stdout.decode("utf-8", errors="replace") if result1.stdout else ""
    
    if result1.returncode != 0:
        print("[ERROR] pdflatex compilation 1 failed.")
        print(stdout1[:1200])
        sys.exit(1)
        
    print("[INFO] Phase 1 compilation successful. Compiling Phase 2 to resolve page numbers...")
    
    # Compilation 2 to resolve Page numbers in TOC
    result2 = subprocess.run(
        ["pdflatex", "-interaction=nonstopmode", "copyright_code.tex"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    stdout2 = result2.stdout.decode("utf-8", errors="replace") if result2.stdout else ""
    
    if result2.returncode != 0:
        print("[ERROR] pdflatex compilation 2 failed.")
        print(stdout2[:1200])
        sys.exit(1)
        
    print("[INFO] Phase 2 compilation complete. PDF generated: copyright_code.pdf")
    
    # Rename output PDF to match requested project convention
    if os.path.exists("copyright_code.pdf"):
        if os.path.exists("pomeguard_source_code.pdf"):
            os.remove("pomeguard_source_code.pdf")
        os.rename("copyright_code.pdf", "pomeguard_source_code.pdf")
        print("[INFO] PDF successfully renamed to 'pomeguard_source_code.pdf'")

def clean_auxiliary():
    print("[INFO] Cleaning up intermediate build files...")
    
    # Remove temp sources folder
    if os.path.exists(TEMP_DIR):
        shutil.rmtree(TEMP_DIR)
        print(f"Removed temp folder: {TEMP_DIR}")
        
    extensions = [".aux", ".log", ".out", ".toc", "copyright_code.tex"]
    for ext in extensions:
        file_to_remove = f"copyright_code{ext}" if ext != "copyright_code.tex" else ext
        if os.path.exists(file_to_remove):
            os.remove(file_to_remove)
            print(f"Removed build file: {file_to_remove}")
            
    print("[INFO] Workspace cleaned successfully.")

if __name__ == "__main__":
    sanitize_and_copy_files()
    build_latex()
    run_latex()
    clean_auxiliary()
    print("[SUCCESS] Complete source code PDF 'pomeguard_source_code.pdf' generated successfully!")
