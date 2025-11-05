import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { ChevronDown, Code, Download, Copy, Maximize2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CodeEditor = ({ code, language, onChange, onLanguageChange }) => {
  const editorRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const downloadCode = () => {
    const extensions = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      java: 'java',
      html: 'html',
      css: 'css',
      json: 'json',
      markdown: 'md'
    };
    const ext = extensions[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Code downloaded');
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const getLineCount = () => {
    return (code.match(/\n/g) || []).length + 1;
  };

  return (
    <div className={`panel h-full ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Clear Editor Header */}
      <div className="px-6 py-4 border-b-2 border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Clear Icon */}
            <div className="w-11 h-11 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <Code className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            
            {/* Title & Stats - High Contrast */}
            <div>
              <h3 className="text-xl font-bold text-gray-900">Code Editor</h3>
              <div className="flex items-center gap-3 text-sm text-gray-700 font-semibold mt-1">
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                  {getLineCount()} Lines
                </span>
                <span className="text-gray-400">•</span>
                <span className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-600 rounded-full"></div>
                  {code.length} Characters
                </span>
              </div>
            </div>
            
            {/* Language Selector - Clear */}
            <div className="relative ml-4">
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
                className="appearance-none bg-white text-gray-900 border-2 border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-bold min-w-[140px] hover:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all cursor-pointer shadow-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.id} value={lang.id}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons - Clear & Visible */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 text-gray-900 hover:text-orange-600 border-2 border-gray-300 hover:border-orange-500 transition-all flex items-center gap-2 text-sm font-bold shadow-sm"
              title="Copy Code"
            >
              <Copy className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden md:inline">Copy</span>
            </button>
            <button
              onClick={downloadCode}
              className="px-4 py-2.5 rounded-lg bg-white hover:bg-gray-50 text-gray-900 hover:text-orange-600 border-2 border-gray-300 hover:border-orange-500 transition-all flex items-center gap-2 text-sm font-bold shadow-sm"
              title="Download Code"
            >
              <Download className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden md:inline">Download</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all flex items-center gap-2 text-sm font-bold shadow-md hover:shadow-lg"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Maximize2 className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden lg:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
            </button>
          </div>
        </div>
        
        {/* Keyboard Shortcuts Bar - Clear */}
        <div className="hidden xl:flex items-center gap-4 mt-3 pt-3 border-t-2 border-gray-200">
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Shortcuts:</span>
          <div className="flex items-center gap-4 text-sm text-gray-900 font-semibold">
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1.5 bg-gray-100 rounded-md text-xs font-bold border-2 border-gray-300">Ctrl+S</kbd>
              <span>Save</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1.5 bg-gray-100 rounded-md text-xs font-bold border-2 border-gray-300">Ctrl+/</kbd>
              <span>Comment</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="px-2.5 py-1.5 bg-gray-100 rounded-md text-xs font-bold border-2 border-gray-300">Ctrl+F</kbd>
              <span>Find</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 bg-gray-50">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={onChange}
          onMount={handleEditorDidMount}
          options={editorOptions}
          loading={
            <div className="flex items-center justify-center h-full bg-white">
              <div className="text-center">
                <div className="loading-spinner text-orange-500 w-8 h-8 border-3 mx-auto mb-3"></div>
                <p className="body-sm text-gray-600">Loading Editor...</p>
              </div>
            </div>
          }
        />
      </div>

      {/* Footer Stats */}
      <div className="px-6 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between caption">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">
            {language.toUpperCase()}
          </span>
          <span className="text-gray-500">UTF-8</span>
          <span className="text-gray-500">LF</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Line {getLineCount()}</span>
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">Ready</span>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
