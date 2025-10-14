const CodeService = require('../code');

jest.mock('../bedrock');

describe('CodeService', () => {
  let service;

  beforeEach(() => {
    service = new CodeService();
    jest.clearAllMocks();
  });

  describe('detectLanguage', () => {
    it('should detect React/JavaScript', () => {
      expect(service.detectLanguage('import React from "react"')).toBe('javascript');
      expect(service.detectLanguage('const x = 1;')).toBe('javascript');
    });

    it('should detect HTML', () => {
      expect(service.detectLanguage('<!DOCTYPE html>')).toBe('html');
      expect(service.detectLanguage('<html><body></body></html>')).toBe('html');
    });

    it('should detect Python', () => {
      expect(service.detectLanguage('def hello():')).toBe('python');
    });

    it('should detect Java', () => {
      expect(service.detectLanguage('public class Test {}')).toBe('java');
    });

    it('should default to text', () => {
      expect(service.detectLanguage('random text')).toBe('text');
    });
  });

  describe('getPosition', () => {
    it('should calculate correct position from cursor', () => {
      const code = 'line1\nline2\nline3';
      const position = service.getPosition(code, { line: 1, column: 2 });
      
      expect(position).toBe(8); // 'line1\n' (6) + 2
    });

    it('should handle first line', () => {
      const code = 'test';
      const position = service.getPosition(code, { line: 0, column: 2 });
      
      expect(position).toBe(2);
    });

    it('should handle missing column', () => {
      const code = 'line1\nline2';
      const position = service.getPosition(code, { line: 1 });
      
      expect(position).toBe(6); // Just after first newline
    });
  });

  describe('classifyError', () => {
    it('should classify syntax errors', () => {
      expect(service.classifyError('SyntaxError: unexpected token')).toBe('syntax');
    });

    it('should classify type errors', () => {
      expect(service.classifyError('TypeError: cannot read property')).toBe('type');
    });

    it('should classify reference errors', () => {
      expect(service.classifyError('ReferenceError: x is not defined')).toBe('reference');
    });

    it('should classify undefined errors', () => {
      expect(service.classifyError('Cannot read property of undefined')).toBe('undefined');
    });

    it('should default to runtime errors', () => {
      expect(service.classifyError('Some other error')).toBe('runtime');
    });
  });

  describe('getSuggestionType', () => {
    it('should identify function suggestions', () => {
      expect(service.getSuggestionType('function test()')).toBe('function');
      expect(service.getSuggestionType('myFunc()')).toBe('function');
    });

    it('should identify variable suggestions', () => {
      expect(service.getSuggestionType('const x')).toBe('variable');
      expect(service.getSuggestionType('let y')).toBe('variable');
    });

    it('should identify import suggestions', () => {
      expect(service.getSuggestionType('import React')).toBe('import');
    });

    it('should identify method suggestions', () => {
      expect(service.getSuggestionType('obj.method')).toBe('method');
    });

    it('should default to keyword', () => {
      expect(service.getSuggestionType('if')).toBe('keyword');
    });
  });

  describe('extractAnalysis', () => {
    it('should extract analysis section', () => {
      const text = 'Analysis: This is the problem\n\nOther text';
      const result = service.extractAnalysis(text);
      
      expect(result).toContain('This is the problem');
    });

    it('should handle cause keyword', () => {
      const text = 'Cause: Root issue here\n\nMore text';
      const result = service.extractAnalysis(text);
      
      expect(result).toContain('Root issue');
    });

    it('should return default if not found', () => {
      const result = service.extractAnalysis('No analysis here');
      
      expect(result).toBe('Analysis not found');
    });
  });

  describe('extractChanges', () => {
    it('should extract changes section', () => {
      const text = 'Changes: Modified file X\n\nOther text';
      const result = service.extractChanges(text);
      
      expect(result).toContain('Modified file X');
    });

    it('should return default if not found', () => {
      const result = service.extractChanges('No changes here');
      
      expect(result).toBe('Changes not specified');
    });
  });

  describe('extractPrevention', () => {
    it('should extract prevention tips', () => {
      const text = 'Prevention: Always validate input\n\nMore text';
      const result = service.extractPrevention(text);
      
      expect(result).toContain('validate input');
    });

    it('should return default if not found', () => {
      const result = service.extractPrevention('No tips here');
      
      expect(result).toBe('No prevention tips provided');
    });
  });

  describe('extractOverview', () => {
    it('should extract overview section', () => {
      const text = 'Overview: High-level summary\n\nDetails';
      const result = service.extractOverview(text);
      
      expect(result).toContain('High-level summary');
    });

    it('should use first 200 chars if no overview found', () => {
      const text = 'A'.repeat(300);
      const result = service.extractOverview(text);
      
      expect(result.length).toBe(200);
    });
  });

  describe('extractBreakdown', () => {
    it('should extract numbered lines', () => {
      const text = '1. First step\n2. Second step\nRandom text';
      const result = service.extractBreakdown(text);
      
      expect(result.length).toBe(2);
      expect(result[0]).toContain('First step');
    });

    it('should extract lines with Line keyword', () => {
      const text = 'Line 1: Code\nLine 2: More code\nOther';
      const result = service.extractBreakdown(text);
      
      expect(result.length).toBe(2);
    });

    it('should return default if no breakdown', () => {
      const result = service.extractBreakdown('No breakdown here');
      
      expect(result).toEqual(['Breakdown not available']);
    });
  });

  describe('extractConcepts', () => {
    it('should extract concepts section', () => {
      const text = 'Concepts:\n- MVC\n- REST\n\nMore text';
      const result = service.extractConcepts(text);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array if not found', () => {
      const result = service.extractConcepts('No concepts');
      
      expect(result).toEqual([]);
    });
  });

  describe('extractImprovements', () => {
    it('should extract improvements section', () => {
      const text = 'Improvements:\n- Add tests\n- Refactor\n\nMore';
      const result = service.extractImprovements(text);
      
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array if not found', () => {
      const result = service.extractImprovements('No improvements');
      
      expect(result).toEqual([]);
    });
  });

  describe('parseSuggestions', () => {
    it('should parse numbered suggestions', () => {
      const text = '1. const x = 1\n2. let y = 2\n3. var z = 3';
      const result = service.parseSuggestions(text);
      
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(5);
    });

    it('should parse bullet suggestions', () => {
      const text = '• suggestion 1\n- suggestion 2';
      const result = service.parseSuggestions(text);
      
      expect(result.length).toBe(2);
    });

    it('should limit to 5 suggestions', () => {
      const text = Array.from({ length: 10 }, (_, i) => `${i + 1}. suggestion`).join('\n');
      const result = service.parseSuggestions(text);
      
      expect(result.length).toBe(5);
    });

    it('should include type for each suggestion', () => {
      const text = '1. function test()\n2. const x = 1';
      const result = service.parseSuggestions(text);
      
      result.forEach(suggestion => {
        expect(suggestion).toHaveProperty('text');
        expect(suggestion).toHaveProperty('type');
      });
    });
  });

  describe('generatePreview', () => {
    it('should return empty preview for no code', async () => {
      const result = await service.generatePreview('');
      
      expect(result).toEqual({ html: '', css: '', js: '' });
    });

    it('should generate React preview for React code', async () => {
      const code = 'import React from "react"\nfunction App() { return <div>Hello</div>; }';
      const result = await service.generateReactPreview(code);
      
      expect(result.html).toContain('<!DOCTYPE html>');
      expect(result.html).toContain('react');
      expect(result.type).toBe('react');
    });

    it('should generate HTML preview for HTML code', async () => {
      const code = '<html><body>Test</body></html>';
      const result = await service.generateHTMLPreview(code);
      
      expect(result.html).toBe(code);
      expect(result.type).toBe('html');
    });
  });

  describe('generateIntegration', () => {
    it('should return null for unknown integration type', async () => {
      const result = await service.generateIntegration('unknown', {});
      
      expect(result).toBeNull();
    });
  });
});

