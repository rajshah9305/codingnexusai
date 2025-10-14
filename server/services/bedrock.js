const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

class BedrockService {
  constructor() {
    const config = {
      region: process.env.AWS_REGION || 'us-east-1'
    };
    
    // Only add credentials if they're explicitly set
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      config.credentials = {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      };
    }
    // Otherwise, AWS SDK will use default credential chain (AWS CLI, IAM role, etc.)
    
    this.client = new BedrockRuntimeClient(config);
    
    // Using inference profiles for on-demand access
    this.models = {
      'claude-3.7-sonnet': 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
      'claude-3.5-sonnet-v2': 'us.anthropic.claude-3-5-sonnet-20241022-v2:0',
      'claude-3.5-sonnet': 'us.anthropic.claude-3-5-sonnet-20240620-v1:0',
      'claude-3.5-haiku': 'us.anthropic.claude-3-5-haiku-20241022-v1:0',
      'claude-3-sonnet': 'us.anthropic.claude-3-sonnet-20240229-v1:0',
      'claude-3-haiku': 'us.anthropic.claude-3-haiku-20240307-v1:0',
      'claude-3-opus': 'us.anthropic.claude-3-opus-20240229-v1:0',
      'titan-text': 'amazon.titan-text-express-v1',
      'titan-text-lite': 'amazon.titan-text-lite-v1'
    };
  }

  async getAvailableModels() {
    return Object.keys(this.models).map(key => ({
      id: key,
      name: key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      provider: this.getProvider(key)
    }));
  }

  getProvider(modelKey) {
    if (modelKey.includes('claude')) return 'Anthropic';
    if (modelKey.includes('titan')) return 'Amazon';
    if (modelKey.includes('jurassic')) return 'AI21';
    if (modelKey.includes('command')) return 'Cohere';
    return 'Unknown';
  }

  async generateCode(prompt, modelKey = 'claude-3.7-sonnet') {
    const modelId = this.models[modelKey];
    
    const systemPrompt = `You are an expert full-stack developer. Generate clean, production-ready code with modern best practices, proper error handling, and complete implementations.`;

    let body;
    if (modelKey.includes('claude')) {
      body = JSON.stringify({
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }]
      });
    } else if (modelKey.includes('titan')) {
      body = JSON.stringify({
        inputText: `${systemPrompt}\n\nUser Request: ${prompt}`,
        textGenerationConfig: { maxTokenCount: 4000, temperature: 0.7 }
      });
    }

    const command = new InvokeModelCommand({
      modelId,
      contentType: 'application/json',
      accept: 'application/json',
      body
    });

    try {
      const response = await this.client.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      let generatedText;
      if (modelKey.includes('claude')) {
        generatedText = responseBody.content[0].text;
      } else if (modelKey.includes('titan')) {
        generatedText = responseBody.results[0].outputText;
      }

      return {
        code: this.extractCode(generatedText),
        explanation: this.extractExplanation(generatedText),
        language: this.detectLanguage(generatedText),
        model: modelKey
      };
    } catch (error) {
      throw new Error(`Bedrock API error: ${error.message}`);
    }
  }

  extractCode(text) {
    const codeBlocks = text.match(/```[\s\S]*?```/g);
    return codeBlocks ? codeBlocks.map(block => 
      block.replace(/```\w*\n?/, '').replace(/```$/, '')
    ) : [text];
  }

  extractExplanation(text) {
    return text.replace(/```[\s\S]*?```/g, '').trim();
  }

  detectLanguage(text) {
    if (text.includes('import React') || text.includes('jsx')) return 'javascript';
    if (text.includes('def ') || text.includes('import ')) return 'python';
    if (text.includes('public class')) return 'java';
    if (text.includes('function') || text.includes('const ')) return 'javascript';
    return 'text';
  }
}

module.exports = BedrockService;