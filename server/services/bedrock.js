const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');

class BedrockService {
  constructor() {
    const config = {
      region: process.env.AWS_REGION || 'us-west-2'
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
    
    // Using foundation models available in us-west-2
    this.models = {
      // Claude models (Anthropic)
      'claude-3.7-sonnet': 'anthropic.claude-3-7-sonnet-20250219-v1:0',
      'claude-3.5-sonnet-v2': 'anthropic.claude-3-5-sonnet-20241022-v2:0',
      'claude-3.5-sonnet': 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      'claude-3.5-haiku': 'anthropic.claude-3-5-haiku-20241022-v1:0',
      'claude-3-sonnet': 'anthropic.claude-3-sonnet-20240229-v1:0',
      'claude-3-haiku': 'anthropic.claude-3-haiku-20240307-v1:0',
      'claude-3-opus': 'anthropic.claude-3-opus-20240229-v1:0',
      
      // Llama models (Meta)
      'llama3-70b-instruct': 'meta.llama3-70b-instruct-v1:0',
      'llama3.1-8b-instruct': 'meta.llama3-1-8b-instruct-v1:0',
      'llama3.1-70b-instruct': 'meta.llama3-1-70b-instruct-v1:0',
      'llama3.1-405b-instruct': 'meta.llama3-1-405b-instruct-v1:0',
      'llama3.2-1b-instruct': 'meta.llama3-2-1b-instruct-v1:0',
      'llama3.2-3b-instruct': 'meta.llama3-2-3b-instruct-v1:0',
      'llama3.2-11b-instruct': 'meta.llama3-2-11b-instruct-v1:0',
      'llama3.2-90b-instruct': 'meta.llama3-2-90b-instruct-v1:0',
      'llama3.3-70b-instruct': 'meta.llama3-3-70b-instruct-v1:0',
      'llama4-scout-17b': 'meta.llama4-scout-17b-instruct-v1:0',
      'llama4-maverick-17b': 'meta.llama4-maverick-17b-instruct-v1:0',
      
      // Mistral models
      'mistral-7b-instruct': 'mistral.mistral-7b-instruct-v0:2',
      'mixtral-8x7b-instruct': 'mistral.mixtral-8x7b-instruct-v0:1',
      'mistral-large-2402': 'mistral.mistral-large-2402-v1:0',
      'mistral-large-2407': 'mistral.mistral-large-2407-v1:0',
      'pixtral-large': 'mistral.pixtral-large-2502-v1:0',
      
      // Amazon Titan models
      'titan-text': 'amazon.titan-text-express-v1',
      'titan-text-lite': 'amazon.titan-text-lite-v1',
      
      // Other providers
      'palmyra-x4': 'writer.palmyra-x4-v1:0',
      'palmyra-x5': 'writer.palmyra-x5-v1:0'
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
    if (modelKey.includes('llama')) return 'Meta';
    if (modelKey.includes('mistral') || modelKey.includes('mixtral') || modelKey.includes('pixtral')) return 'Mistral AI';
    if (modelKey.includes('titan')) return 'Amazon';
    if (modelKey.includes('palmyra')) return 'Writer';
    if (modelKey.includes('pegasus')) return 'TwelveLabs';
    if (modelKey.includes('ray')) return 'Luma AI';
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