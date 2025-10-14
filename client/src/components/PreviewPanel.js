import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, ExternalLink, Smartphone, Tablet, Monitor } from 'lucide-react';

const PreviewPanel = ({ preview }) => {
  const iframeRef = useRef(null);
  const [viewMode, setViewMode] = useState('desktop');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (preview.html && iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      
      doc.open();
      doc.write(preview.html);
      doc.close();
    }
  }, [preview]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      if (iframeRef.current && preview.html) {
        const iframe = iframeRef.current;
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        doc.open();
        doc.write(preview.html);
        doc.close();
      }
      setIsRefreshing(false);
    }, 500);
  };

  const openInNewTab = () => {
    if (preview.html) {
      const newWindow = window.open();
      newWindow.document.write(preview.html);
      newWindow.document.close();
    }
  };

  const getViewportClass = () => {
    switch (viewMode) {
      case 'mobile':
        return 'w-80 h-full';
      case 'tablet':
        return 'w-96 h-full';
      default:
        return 'w-full h-full';
    }
  };

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 px-6">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-50 rounded-xl mb-3">
        <Monitor className="w-7 h-7 text-gray-400" />
      </div>
      <h3 className="heading-4 mb-2 text-gray-800">Live Preview</h3>
      <p className="body-sm text-center max-w-sm text-gray-600">
        Start coding or generate code with AI to see a live preview
      </p>
    </div>
  );

  const renderError = () => (
    <div className="flex flex-col items-center justify-center h-full px-6">
      <div className="text-5xl mb-3">⚠️</div>
      <h3 className="heading-4 mb-2 text-red-600">Preview Error</h3>
      <p className="body-sm text-center max-w-sm text-gray-600">
        Check your code for syntax errors
      </p>
    </div>
  );

  return (
    <div className="panel h-full">
      {/* Preview Header */}
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <div className="icon-primary w-8 h-8">
            <Monitor className="w-4 h-4" />
          </div>
          <span className="heading-4 text-base">Live Preview</span>
          
          {preview.type && preview.type !== 'empty' && (
            <span className="badge-primary text-xs">
              {preview.type.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Viewport Controls */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('desktop')}
              className={`btn-icon transition-all ${
                viewMode === 'desktop' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Desktop View"
              aria-label="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('tablet')}
              className={`btn-icon transition-all ${
                viewMode === 'tablet' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Tablet View"
              aria-label="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('mobile')}
              className={`btn-icon transition-all ${
                viewMode === 'mobile' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
              }`}
              title="Mobile View"
              aria-label="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing || !preview.html}
            className="btn-icon text-gray-600 hover:text-orange-500 hover:bg-gray-50 disabled:opacity-40"
            title="Refresh Preview"
            aria-label="Refresh Preview"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={openInNewTab}
            disabled={!preview.html}
            className="btn-icon text-gray-600 hover:text-orange-500 hover:bg-gray-50 disabled:opacity-40"
            title="Open in New Tab"
            aria-label="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 bg-gray-50 overflow-auto flex items-center justify-center p-4">
        {!preview.html || preview.type === 'empty' ? (
          renderEmptyState()
        ) : preview.type === 'error' ? (
          renderError()
        ) : (
          <div className={`${getViewportClass()} transition-all duration-300 bg-white rounded-lg shadow-md overflow-hidden border border-gray-200`}>
            <iframe
              ref={iframeRef}
              className="w-full h-full border-0"
              title="Code Preview"
              sandbox="allow-scripts allow-same-origin allow-forms"
              style={{ backgroundColor: 'white' }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviewPanel;
