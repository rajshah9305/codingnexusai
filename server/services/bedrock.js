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
      // Claude models (Anthropic) - Available in us-west-2
      'claude-3.5-sonnet-v2': 'anthropic.claude-3-5-sonnet-20241022-v2:0',
      'claude-3.5-sonnet': 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      'claude-3.5-haiku': 'anthropic.claude-3-5-haiku-20241022-v1:0',
      'claude-3-sonnet': 'anthropic.claude-3-sonnet-20240229-v1:0',
      'claude-3-haiku': 'anthropic.claude-3-haiku-20240307-v1:0',
      'claude-3-opus': 'anthropic.claude-3-opus-20240229-v1:0',
      
      // Llama models (Meta) - Available in us-west-2
      'llama3-8b-instruct': 'meta.llama3-8b-instruct-v1:0',
      'llama3-70b-instruct': 'meta.llama3-70b-instruct-v1:0',
      'llama3.1-8b-instruct': 'meta.llama3-1-8b-instruct-v1:0',
      'llama3.1-70b-instruct': 'meta.llama3-1-70b-instruct-v1:0',
      'llama3.1-405b-instruct': 'meta.llama3-1-405b-instruct-v1:0',
      
      // Mistral models - Available in us-west-2
      'mistral-7b-instruct': 'mistral.mistral-7b-instruct-v0:2',
      'mixtral-8x7b-instruct': 'mistral.mixtral-8x7b-instruct-v0:1',
      'mistral-large-2402': 'mistral.mistral-large-2402-v1:0',
      'mistral-large-2407': 'mistral.mistral-large-2407-v1:0',
      
      // Amazon Titan models - Available in us-west-2
      'titan-text-express': 'amazon.titan-text-express-v1',
      'titan-text-lite': 'amazon.titan-text-lite-v1',
      'titan-text-large': 'amazon.titan-tg1-large',
      
      // Cohere models - Available in us-west-2
      'command-r': 'cohere.command-r-v1:0',
      'command-r-plus': 'cohere.command-r-plus-v1:0',
      
      // DeepSeek models - Available in us-west-2
      'deepseek-v3': 'deepseek.v3-v1:0',
      
      // Qwen models - Available in us-west-2
      'qwen3-coder-480b': 'qwen.qwen3-coder-480b-a35b-v1:0',
      'qwen3-235b': 'qwen.qwen3-235b-a22b-2507-v1:0',
      'qwen3-coder-30b': 'qwen.qwen3-coder-30b-a3b-v1:0',
      'qwen3-32b': 'qwen.qwen3-32b-v1:0',
      
      // OpenAI models - Available in us-west-2
      'gpt-oss-120b': 'openai.gpt-oss-120b-1:0',
      'gpt-oss-20b': 'openai.gpt-oss-20b-1:0'
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
    if (modelKey.includes('mistral') || modelKey.includes('mixtral')) return 'Mistral AI';
    if (modelKey.includes('titan')) return 'Amazon';
    if (modelKey.includes('command')) return 'Cohere';
    if (modelKey.includes('deepseek')) return 'DeepSeek';
    if (modelKey.includes('qwen')) return 'Qwen';
    if (modelKey.includes('gpt-oss')) return 'OpenAI';
    return 'Unknown';
  }

  async generateCode(prompt, modelKey = 'claude-3.5-sonnet-v2') {
    const modelId = this.models[modelKey];
    
    if (!modelId) {
      throw new Error(`Model ${modelKey} not found. Available models: ${Object.keys(this.models).join(', ')}`);
    }
    
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
    } else if (modelKey.includes('llama') || modelKey.includes('mistral') || modelKey.includes('mixtral')) {
      body = JSON.stringify({
        prompt: `<s>[INST] ${systemPrompt}\n\n${prompt} [/INST]`,
        max_gen_len: 4000,
        temperature: 0.7,
        top_p: 0.9
      });
    } else if (modelKey.includes('command')) {
      body = JSON.stringify({
        message: prompt,
        preamble: systemPrompt,
        max_tokens: 4000,
        temperature: 0.7
      });
    } else if (modelKey.includes('deepseek') || modelKey.includes('qwen') || modelKey.includes('gpt-oss')) {
      body = JSON.stringify({
        prompt: `${systemPrompt}\n\nUser: ${prompt}\n\nAssistant:`,
        max_tokens: 4000,
        temperature: 0.7,
        top_p: 0.9
      });
    } else {
      // Default format for unknown models
      body = JSON.stringify({
        prompt: `${systemPrompt}\n\n${prompt}`,
        max_tokens: 4000,
        temperature: 0.7
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
      } else if (modelKey.includes('llama') || modelKey.includes('mistral') || modelKey.includes('mixtral')) {
        generatedText = responseBody.generation;
      } else if (modelKey.includes('command')) {
        generatedText = responseBody.text;
      } else if (modelKey.includes('deepseek') || modelKey.includes('qwen') || modelKey.includes('gpt-oss')) {
        generatedText = responseBody.completion || responseBody.text || responseBody.output;
      } else {
        // Try common response fields
        generatedText = responseBody.text || responseBody.completion || responseBody.output || responseBody.generation || JSON.stringify(responseBody);
      }

      return {
        code: this.extractCode(generatedText),
        explanation: this.extractExplanation(generatedText),
        language: this.detectLanguage(generatedText),
        model: modelKey
      };
    } catch (error) {
      console.error(`Bedrock API error for model ${modelKey}:`, error);
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