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
      {/* Editor Header */}
      <div className="panel-header">
        <div className="flex items-center gap-3">
          <div className="icon-primary w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600">
            <Code className="w-4 h-4" />
          </div>
          <div>
            <span className="heading-4 text-base">Code Editor</span>
            <div className="flex items-center gap-2 caption mt-0.5">
              <span>{getLineCount()} lines</span>
              <span>•</span>
              <span>{code.length} chars</span>
            </div>
          </div>
          
          {/* Language Selector */}
          <div className="relative ml-auto">
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="select py-1.5 pr-8 text-sm font-semibold min-w-[140px] focus-ring-orange"
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

        <div className="flex items-center gap-2">
          {/* Action Buttons */}
          <button
            onClick={copyCode}
            className="btn-icon btn-sm text-gray-600 hover:text-orange-500 hover-lift"
            title="Copy Code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={downloadCode}
            className="btn-icon btn-sm text-gray-600 hover:text-orange-500 hover-lift"
            title="Download Code"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="btn-icon btn-sm text-gray-600 hover:text-orange-500 hover-lift"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Keyboard Shortcuts */}
          <div className="flex items-center gap-3 caption hide-mobile ml-3 pl-3 border-l border-gray-200">
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
