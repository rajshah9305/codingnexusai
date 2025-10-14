import axios from 'axios';

export class AIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
    this.ws = null;
  }

  async getModels() {
    try {
      const response = await axios.get(`${this.baseURL}/models`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch models: ${error.message}`);
    }
  }

  async generateCode(prompt, model, type = 'component') {
    try {
      const response = await axios.post(`${this.baseURL}/generate`, {
        prompt,
        model,
        type
      });
      return response.data;
    } catch (error) {
      throw new Error(`Code generation failed: ${error.message}`);
    }
  }

  async debugCode(code, issue, model) {
    try {
      const response = await axios.post(`${this.baseURL}/generate`, {
        code,
        prompt: issue,
        model,
        type: 'debug'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Debug failed: ${error.message}`);
    }
  }

  async explainCode(code, model) {
    try {
      const response = await axios.post(`${this.baseURL}/generate`, {
        code,
        model,
        type: 'explain'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Code explanation failed: ${error.message}`);
    }
  }

  async fixCode(code, error, model) {
    try {
      const response = await axios.post(`${this.baseURL}/generate`, {
        code,
        error,
        model,
        type: 'fix'
      });
      return response.data;
    } catch (error) {
      throw new Error(`Code fix failed: ${error.message}`);
    }
  }

  async getAutocompleteSuggestions(code, cursor, model) {
    try {
      const response = await axios.post(`${this.baseURL}/autocomplete`, {
        code,
        cursor,
        model
      });
      return response.data;
    } catch (error) {
      console.error('Autocomplete failed:', error);
      return [];
    }
  }

  async generateIntegration(type, config) {
    try {
      const response = await axios.post(`${this.baseURL}/integrate`, {
        type,
        config
      });
      return response.data;
    } catch (error) {
      throw new Error(`Integration generation failed: ${error.message}`);
    }
  }

  connectWebSocket(onMessage) {
    const wsURL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';
    this.ws = new WebSocket(wsURL);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('WebSocket message parse error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Reconnect after 3 seconds
      setTimeout(() => this.connectWebSocket(onMessage), 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  updatePreview(code) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'code_preview',
        code
      }));
    }
  }

  sendLiveEdit(changes) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'live_edit',
        changes
      }));
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}