class CodeService {
  constructor() {
    this.BedrockService = require('./bedrock');
    this.bedrock = new this.BedrockService();
  }

  async generatePreview(code) {
    if (!code) return { html: '', css: '', js: '' };

    const language = this.detectLanguage(code);
    
    if (language === 'javascript' && code.includes('React')) {
      return this.generateReactPreview(code);
    } else if (language === 'html') {
      return this.generateHTMLPreview(code);
    } else {
      return this.generateGenericPreview(code);
    }
  }

  async generateReactPreview(code) {
    const previewCode = `
<!DOCTYPE html>
<html>
<head>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
    ${code}
    ReactDOM.render(<App />, document.getElementById('root'));
  </script>
</body>
</html>`;
    
    return { html: previewCode, type: 'react' };
  }

  async generateHTMLPreview(code) {
    return { html: code, type: 'html' };
  }

  async generateGenericPreview(code) {
    const prompt = `Convert this code to a live HTML preview:
${code}

Create a complete HTML page with inline CSS and JavaScript that demonstrates the functionality.`;
    
    const result = await this.bedrock.generateCode(prompt);
    return { html: result.code[0] || '', type: 'generated' };
  }

  async processLiveEdit(changes) {
    const { code, line, column, newText } = changes;
    
    const lines = code.split('\n');
    if (lines[line]) {
      lines[line] = lines[line].substring(0, column) + newText + lines[line].substring(column);
    }
    
    const updatedCode = lines.join('\n');
    const preview = await this.generatePreview(updatedCode);
    
    return {
      updatedCode,
      preview,
      suggestions: await this.getAutocompleteSuggestions(updatedCode, { line, column: column + newText.length })
    };
  }

  async debugCode(code, issue, model) {
    const prompt = `Debug this code and fix the issue:

CODE:
${code}

ISSUE:
${issue}

Provide:
1. Root cause analysis
2. Fixed code
3. Explanation of changes
4. Prevention tips`;

    const result = await this.bedrock.generateCode(prompt, model);
    
    return {
      analysis: this.extractAnalysis(result.explanation),
      fixedCode: result.code,
      changes: this.extractChanges(result.explanation),
      prevention: this.extractPrevention(result.explanation)
    };
  }

  async explainCode(code, model) {
    const prompt = `Explain this code in detail:

${code}

Provide:
1. High-level overview
2. Line-by-line breakdown
3. Key concepts used
4. Potential improvements`;

    const result = await this.bedrock.generateCode(prompt, model);
    
    return {
      overview: this.extractOverview(result.explanation),
      breakdown: this.extractBreakdown(result.explanation),
      concepts: this.extractConcepts(result.explanation),
      improvements: this.extractImprovements(result.explanation)
    };
  }

  async fixCode(code, error, model) {
    const prompt = `Fix this code error:

CODE:
${code}

ERROR:
${error}

Provide the corrected code with explanation.`;

    const result = await this.bedrock.generateCode(prompt, model);
    
    return {
      fixedCode: result.code,
      explanation: result.explanation,
      errorType: this.classifyError(error)
    };
  }

  async getAutocompleteSuggestions(code, cursor, model = 'claude-3-haiku') {
    const beforeCursor = code.substring(0, this.getPosition(code, cursor));
    const afterCursor = code.substring(this.getPosition(code, cursor));
    
    const prompt = `Provide autocomplete suggestions for this code context:

BEFORE CURSOR:
${beforeCursor}

AFTER CURSOR:
${afterCursor}

Suggest 3-5 relevant completions.`;

    const result = await this.bedrock.generateCode(prompt, model);
    
    return this.parseSuggestions(result.explanation);
  }

  async generateIntegration(type, config) {
    const integrations = {
      database: () => this.generateDatabaseIntegration(config),
      api: () => this.generateAPIIntegration(config),
      auth: () => this.generateAuthIntegration(config),
      payment: () => this.generatePaymentIntegration(config)
    };

    return integrations[type] ? await integrations[type]() : null;
  }

  async generateDatabaseIntegration(config) {
    const { type = 'mongodb', host, database } = config;
    
    const prompt = `Generate ${type} database integration code with:
- Connection setup
- Model definitions
- CRUD operations
- Error handling
- Connection pooling

Database: ${database}
Host: ${host}`;

    return await this.bedrock.generateCode(prompt);
  }

  async generateAPIIntegration(config) {
    const { service, endpoints, auth } = config;
    
    const prompt = `Generate API integration for ${service}:
- HTTP client setup
- Authentication: ${auth}
- Endpoint methods: ${endpoints.join(', ')}
- Error handling
- Rate limiting`;

    return await this.bedrock.generateCode(prompt);
  }

  detectLanguage(code) {
    if (code.includes('import React') || code.includes('jsx')) return 'javascript';
    if (code.includes('<!DOCTYPE html>') || code.includes('<html>')) return 'html';
    if (code.includes('def ') && code.includes(':')) return 'python';
    if (code.includes('public class')) return 'java';
    if (code.includes('function') || code.includes('const ')) return 'javascript';
    return 'text';
  }

  getPosition(code, cursor) {
    const lines = code.split('\n');
    let position = 0;
    
    for (let i = 0; i < cursor.line && i < lines.length; i++) {
      position += lines[i].length + 1; // +1 for newline
    }
    
    return position + (cursor.column || 0);
  }

  extractAnalysis(text) {
    const match = text.match(/(?:analysis|cause):(.*?)(?:\n\n|\n[A-Z]|$)/is);
    return match ? match[1].trim() : 'Analysis not found';
  }

  extractChanges(text) {
    const match = text.match(/(?:changes|modifications):(.*?)(?:\n\n|\n[A-Z]|$)/is);
    return match ? match[1].trim() : 'Changes not specified';
  }

  extractPrevention(text) {
    const match = text.match(/(?:prevention|tips):(.*?)(?:\n\n|\n[A-Z]|$)/is);
    return match ? match[1].trim() : 'No prevention tips provided';
  }

  extractOverview(text) {
    const match = text.match(/(?:overview|summary):(.*?)(?:\n\n|\n[A-Z]|$)/is);
    return match ? match[1].trim() : text.substring(0, 200);
  }

  extractBreakdown(text) {
    const lines = text.split('\n').filter(line => 
      line.match(/^\d+\./) || line.includes('Line') || line.includes('->'));
    return lines.length > 0 ? lines : ['Breakdown not available'];
  }

  extractConcepts(text) {
    const match = text.match(/(?:concepts|patterns):(.*?)(?:\n\n|\n[A-Z]|$)/is);
    return match ? match[1].split('\n').filter(l => l.trim()) : [];
  }

  extractImprovements(text) {
    const match = text.match(/(?:improvements|suggestions):(.*?)(?:\n\n|\n[A-Z]|$)/is);
    return match ? match[1].split('\n').filter(l => l.trim()) : [];
  }

  classifyError(error) {
    if (error.includes('SyntaxError')) return 'syntax';
    if (error.includes('TypeError')) return 'type';
    if (error.includes('ReferenceError')) return 'reference';
    if (error.includes('undefined')) return 'undefined';
    return 'runtime';
  }

  parseSuggestions(text) {
    const suggestions = [];
    const lines = text.split('\n');
    
    lines.forEach(line => {
      if (line.match(/^\d+\./) || line.includes('•') || line.includes('-')) {
        const suggestion = line.replace(/^[\d\.\-•\s]+/, '').trim();
        if (suggestion.length > 0) {
          suggestions.push({
            text: suggestion,
            type: this.getSuggestionType(suggestion)
          });
        }
      }
    });
    
    return suggestions.slice(0, 5);
  }

  getSuggestionType(suggestion) {
    if (suggestion.includes('function') || suggestion.includes('()')) return 'function';
    if (suggestion.includes('const') || suggestion.includes('let')) return 'variable';
    if (suggestion.includes('import')) return 'import';
    if (suggestion.includes('.')) return 'method';
    return 'keyword';
  }
}

module.exports = CodeService;