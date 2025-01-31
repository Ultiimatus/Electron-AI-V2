import React, { Suspense, lazy, useEffect, useState } from 'react';
import * as githubTheme from '@uiw/codemirror-theme-github';
import { autocompletion } from '@codemirror/autocomplete';

const CodeMirror = lazy(() => import('@uiw/react-codemirror'));

function CodeEditor({ value, onChange, javascriptExtension }) {
  const [extensions, setExtensions] = useState([]);

  useEffect(() => {
    if (javascriptExtension && typeof javascriptExtension === 'function') {
      setExtensions([javascriptExtension(), autocompletion()]);
    } else {
      setExtensions([]);
    }
  }, [javascriptExtension]);

  return (
    <Suspense fallback={<div>Ładowanie edytora...</div>}>
      <CodeMirror
        value={value}
        height="100%"
        theme={githubTheme.github}
        extensions={extensions}
        onChange={(val, viewUpdate) => {
          console.log('Zmiana kodu:', val);
          if (onChange) onChange(val);
        }}
      />
    </Suspense>
  );
}

export default CodeEditor;
