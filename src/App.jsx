import React, { useState, useRef, useEffect } from 'react';
import { FiDownload, FiSettings, FiExternalLink, FiGithub, FiX } from 'react-icons/fi';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import CodeEditor from './components/CodeEditor';
import ChatPanel from './components/ChatPanel';

function App() {
  const [activeTab, setActiveTab] = useState('code');
  const [activeFile, setActiveFile] = useState('greeting.js');
  const [aiPrompt, setAiPrompt] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [projectProgress, setProjectProgress] = useState(0);
  const terminalRef = useRef(null);
  const xtermRef = useRef(null);

  const [files, setFiles] = useState({
    'greeting.js': 'console.log("Cześć!");',
    'index.html': '<h1>Hello World</h1>'
  });

  useEffect(() => {
    if (terminalRef.current && !xtermRef.current) {
      const fitAddon = new FitAddon();
      const webLinksAddon = new WebLinksAddon();
      const term = new Terminal({
        theme: { background: '#202124', foreground: '#fff' },
      });

      term.loadAddon(fitAddon);
      term.loadAddon(webLinksAddon);
      term.open(terminalRef.current);
      fitAddon.fit();
      xtermRef.current = term;

      term.write('~/project\r\n');
      term.write('> node greeting.js\r\n');
      term.write('Cześć!\r\n');
      term.write('~/project\r\n');
    }
  }, []);

  const handleTabClick = (tab) => setActiveTab(tab);
  const handleFileClick = (file) => setActiveFile(file);

  const handleCodeChange = (value) => {
    setFiles((prevFiles) => ({ ...prevFiles, [activeFile]: value }));
  };

  const handleAiPromptChange = (e) => setAiPrompt(e.target.value);

  const handleAiSubmit = () => {
    if (!aiPrompt.trim()) return;

    setChatMessages((prev) => [...prev, { sender: 'user', text: aiPrompt }]);
    setAiPrompt('');

    const response = generateAiResponse(aiPrompt);
    setChatMessages((prev) => [...prev, { sender: 'ai', text: response }]);
  };

  const generateAiResponse = (prompt) => {
    if (prompt.toLowerCase().includes('aplikację do zarządzania zadaniami')) {
      const newFiles = {
        'index.html': '<h1>Aplikacja do zarządzania zadaniami</h1>',
        'app.js': 'console.log("Aplikacja do zarządzania zadaniami")',
        'server.js': `
const express = require('express');
const app = express();
const port = 3000;
app.get('/', (req, res) => res.send('Hello World from backend!'));
app.listen(port, () => console.log(\`Serwer działa na http://localhost:\${port}\`));`,
        'style.css': 'body { font-family: sans-serif; }',
        'package.json': `{
  "name": "task-manager",
  "version": "1.0.0",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^4.18.2" }
}`,
      };

      setFiles((prev) => ({ ...prev, ...newFiles }));
      setProjectProgress(20);
      return 'Dodano pliki aplikacji do zarządzania zadaniami.';
    }

    if (prompt.toLowerCase().includes('uruchom aplikację')) {
      if (files['server.js']) {
        xtermRef.current.write('Uruchamianie serwera...\r\n');
        xtermRef.current.write('Serwer dostępny pod adresem http://localhost:3000\r\n');
        return 'Uruchomiono aplikację.';
      }
      return 'Nie znaleziono pliku server.js. Wygeneruj backend.';
    }

    return 'Nie rozumiem zapytania. Spróbuj sformułować je precyzyjniej.';
  };

  const handleAddFile = () => {
    const newFileName = prompt("Podaj nazwę pliku:");
    if (newFileName && !files[newFileName]) {
      setFiles((prev) => ({ ...prev, [newFileName]: '' }));
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div className="sidebar">
        <h2>Projekt</h2>
        <p>Postęp: {projectProgress}%</p>
        <ChatPanel
          aiPrompt={aiPrompt}
          chatMessages={chatMessages}
          handleAiPromptChange={handleAiPromptChange}
          handleAiSubmit={handleAiSubmit}
        />
      </div>
      <div className="main-content">
        <div className="code-header">
          <button><FiDownload /></button>
          <button><FiSettings /></button>
          <button><FiExternalLink /></button>
          <button><FiGithub /></button>
          <button><FiX /></button>
        </div>
        <div className="code-preview-tabs">
          <button className={activeTab === 'code' ? 'active' : ''} onClick={() => handleTabClick('code')}>
            Kod
          </button>
          <button className={activeTab === 'preview' ? 'active' : ''} onClick={() => handleTabClick('preview')}>
            Podgląd
          </button>
        </div>
        {activeTab === 'code' && (
          <div className="code-editor">
            <div className="code-editor-files">
              <button onClick={handleAddFile}>Dodaj plik</button>
              {Object.keys(files).map((file) => (
                <div key={file} className={activeFile === file ? 'active' : ''} onClick={() => handleFileClick(file)}>
                  {file}
                </div>
              ))}
            </div>
            <div className="code-editor-content">
              <CodeEditor value={files[activeFile]} onChange={handleCodeChange} />
            </div>
          </div>
        )}
        {activeTab === 'preview' && (
          <div style={{ flex: 1, padding: '20px', backgroundColor: '#333' }}>
            {activeFile.endsWith('.html') ? (
              <div dangerouslySetInnerHTML={{ __html: files[activeFile] }} />
            ) : (
              <p>Podgląd dostępny tylko dla plików HTML.</p>
            )}
          </div>
        )}
        <div className="terminal">
          <div className="terminal-content" ref={terminalRef} />
        </div>
      </div>
    </div>
  );
}

export default App;
