import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { ChevronDown, Code } from 'lucide-react';

const CodeEditor = ({ code, language, onChange, onLanguageChange }) => {
  const editorRef = useRef(null);

  const languages = [
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'json', name: 'JSON' },
    { id: 'markdown', name: 'Markdown' }
  ];

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      lineHeight: 22,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      automaticLayout: true,
      suggestOnTriggerCharacters: true,
      quickSuggestions: true,
      parameterHints: { enabled: true },
      tabSize: 2,
      insertSpaces: true,
    });

    // Add custom keybindings
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      console.log('Save triggered');
    });

    // Add autocomplete provider
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: () => {
        return { suggestions: [] };
      }
    });
  };

  const editorOptions = {
    theme: 'vs',
    fontSize: 14,
    lineHeight: 22,
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    minimap: { enabled: false },
    wordWrap: 'on',
    automaticLayout: true,
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'always',
    contextmenu: true,
    mouseWheelZoom: true,
    cursorSmoothCaretAnimation: true,
    cursorBlinking: 'blink',
    renderLineHighlight: 'line',
    selectOnLineNumbers: true,
    lineDecorationsWidth: 8,
    lineNumbersMinChars: 3,
    glyphMargin: false,
    rulers: [80, 120],
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    scrollbar: {
      vertical: 'visible',
      horizontal: 'visible',
      useShadows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10
    }
  };

  return (
    <div className="panel h-full">
      {/* Editor Header */}
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <div className="icon-primary w-8 h-8">
            <Code className="w-4 h-4" />
          </div>
          <span className="heading-4 text-base">Code Editor</span>
          
          {/* Language Selector */}
          <div className="relative">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="select py-1.5 pr-8 text-sm font-semibold min-w-[140px]"
            >
              {languages.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-3 caption hide-mobile">
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold border border-gray-200">Ctrl+S</kbd>
            <span>save</span>
          </div>
          <span className="text-gray-300">•</span>
          <div className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold border border-gray-200">Ctrl+/</kbd>
            <span>comment</span>
          </div>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={editorOptions}
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="loading-spinner text-orange-500 w-8 h-8 border-3"></div>
            </div>
          }
        />
      </div>
    </div>
  );
};

export default CodeEditor;
