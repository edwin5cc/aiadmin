import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AIModulePromptConfig from '@/components/AIModulePromptConfig';
import { toast } from "sonner";
import { aiSettingsApi, apiKeysApi, chatbotsApi, portalsApi, Portal } from '@/services/api';
import { AISettings, APIKey, Chatbot } from '@/types/api';

// AI Models Configuration - Easy to add/remove models here
const AI_MODELS = {
  openai: [
    { value: 'gpt-5', label: 'GPT-5 (Advanced reasoning)' },
    { value: 'gpt-5-pro', label: 'GPT-5 Pro (Premium reasoning)' },
    { value: 'gpt-5-codex', label: 'GPT-5 Codex (Specialized for coding)' },
    { value: 'gpt-5-mini', label: 'GPT-5 Mini (Smaller, faster)' },
    { value: 'gpt-5-nano', label: 'GPT-5 Nano (Fastest, most affordable)' },
    { value: 'gpt-5-chat', label: 'GPT-5 Chat (Reasoning version)' },
    { value: 'gpt-4.1', label: 'GPT-4.1 (Latest multimodal)' },
    { value: 'gpt-4o', label: 'GPT-4o (GPT-4 Omni - default)' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini (Smaller, faster)' },
    { value: 'gpt-4.5', label: 'GPT-4.5 (Research preview)' },
  ],
  gemini: [
    { value: 'gemini-2.5-pro', label: 'Gemini 2.5 Pro (Most powerful)' },
    { value: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash (Best price-performance)' },
    { value: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash Lite (Fastest, most cost-efficient)' },
    { value: 'gemini-2.5-computer-use', label: 'Gemini 2.5 Computer Use (UI interaction/control)' },
  ],
};

const AIConfigPage = () => {
  // API Key states
  const [apiKey, setApiKey] = useState('');
  const [apiKeyProvider, setApiKeyProvider] = useState<'openai' | 'gemini'>('openai');
  const [isSavingApiKey, setIsSavingApiKey] = useState(false);
  const [existingAPIKeys, setExistingAPIKeys] = useState<APIKey[]>([]);

  // AI Settings states
  const [founderSettings, setFounderSettings] = useState<AISettings | null>(null);
  const [businessOwnerSettings, setBusinessOwnerSettings] = useState<AISettings | null>(null);
  const [isLoadingSettings, setIsLoadingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [currentPortal, setCurrentPortal] = useState<'founder' | 'business-owner'>('founder');
  const [activeTab, setActiveTab] = useState<'openai' | 'gemini'>('openai');
  const [providerToUse, setProviderToUse] = useState<'openai' | 'gemini'>('openai');
  
  // OpenAI settings
  const [openaiModel, setOpenaiModel] = useState('gpt-4o');
  const [openaiTemperature, setOpenaiTemperature] = useState('0.7');
  
  // Gemini settings
  const [geminiModel, setGeminiModel] = useState('gemini-2.5-flash');
  const [geminiTemperature, setGeminiTemperature] = useState('0.7');

  // Portals and Chatbots states
  const [portals, setPortals] = useState<Portal[]>([]);
  const [chatbotsForPortal, setChatbotsForPortal] = useState<Chatbot[]>([]);
  const [isLoadingChatbots, setIsLoadingChatbots] = useState(false);
  const [selectedPortalId, setSelectedPortalId] = useState<string>('');

  // Load API keys on mount
  useEffect(() => {
    loadAPIKeys();
    loadAISettings();
    loadPortals();
  }, []);

  // Update form fields when settings are loaded or portal changes
  useEffect(() => {
    const settings = currentPortal === 'founder' ? founderSettings : businessOwnerSettings;
    if (settings) {
      setProviderToUse(settings.provider_to_use);
      // Load OpenAI settings
      setOpenaiModel(settings.openai.ai_model);
      setOpenaiTemperature(settings.openai.temperature.toString());
      // Load Gemini settings
      setGeminiModel(settings.gemini.ai_model);
      setGeminiTemperature(settings.gemini.temperature.toString());
    }
  }, [currentPortal, founderSettings, businessOwnerSettings]);

  const loadAPIKeys = async () => {
    try {
      const response = await apiKeysApi.getAPIKeys();
      if (!response.error && response.data) {
        setExistingAPIKeys(response.data);
      }
    } catch (error: any) {
      console.error('Failed to load API keys:', error);
      toast.error('Failed to load API keys');
    }
  };

  const loadPortals = async () => {
    try {
      const response = await portalsApi.getPortals();
      if (!response.error && response.portals) {
        setPortals(response.portals);
      }
    } catch (error: any) {
      console.error('Failed to load portals:', error);
      toast.error('Failed to load portals');
    }
  };

  // Update selected portal ID when portal changes
  useEffect(() => {
    if (portals.length > 0) {
      const portal = portals.find(p => p.slug === currentPortal);
      if (portal) {
        console.log('Selected portal:', portal.slug, 'with ID:', portal.id);
        setSelectedPortalId(portal.id);
      }
    }
  }, [currentPortal, portals]);

  const loadChatbots = async () => {
    if (!selectedPortalId) {
      console.log('❌ No portal ID selected, skipping chatbot load');
      return;
    }
    
    console.log('🔍 Loading chatbots for portal_id:', selectedPortalId);
    setIsLoadingChatbots(true);
    try {
      // Use the portal-specific endpoint
      const response = await chatbotsApi.getChatbotsByPortal(selectedPortalId, true);
      console.log('✅ Chatbots API response:', response);
      console.log('📊 Response structure:', {
        error: response.error,
        message: response.message,
        hasData: !!response.data,
        dataLength: response.data?.length,
        count: response.count
      });
      
      // Check if response is successful
      if (!response.error) {
        // response.data should be an array
        if (response.data && Array.isArray(response.data)) {
          console.log('📋 Loaded chatbots:', response.data);
          setChatbotsForPortal(response.data);
        } else {
          console.log('⚠️ Response data is not an array:', response.data);
          setChatbotsForPortal([]);
        }
      } else {
        console.log('⚠️ Error in response:', response.message);
        setChatbotsForPortal([]);
      }
    } catch (error: any) {
      console.error('❌ Failed to load chatbots:', error);
      toast.error('Failed to load chatbots: ' + (error.message || 'Unknown error'));
      setChatbotsForPortal([]);
    } finally {
      setIsLoadingChatbots(false);
    }
  };

  // Load chatbots when portal ID changes
  useEffect(() => {
    if (selectedPortalId) {
      loadChatbots();
    }
  }, [selectedPortalId]);

  const loadAISettings = async () => {
    setIsLoadingSettings(true);
    try {
      const [founderResponse, businessOwnerResponse] = await Promise.all([
        aiSettingsApi.getAISettings('founder').catch(() => null),
        aiSettingsApi.getAISettings('business-owner').catch(() => null),
      ]);

      if (founderResponse && !founderResponse.error) {
        setFounderSettings(founderResponse.data);
      }

      if (businessOwnerResponse && !businessOwnerResponse.error) {
        setBusinessOwnerSettings(businessOwnerResponse.data);
      }
    } catch (error: any) {
      console.error('Failed to load AI settings:', error);
      toast.error('Failed to load AI settings');
    } finally {
      setIsLoadingSettings(false);
    }
  };

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast.error('Please enter an API key');
      return;
    }

    setIsSavingApiKey(true);
    try {
      // Check if key exists for the selected provider
      try {
        await apiKeysApi.getActiveAPIKey(apiKeyProvider);
        // Key exists, update it
        await apiKeysApi.updateAPIKey(apiKeyProvider, {
          api_key: apiKey,
          key_name: `${apiKeyProvider === 'openai' ? 'OpenAI' : 'Gemini'} API Key`,
        });
        toast.success('API Key updated successfully!');
      } catch (error) {
        // Key doesn't exist, create it
        await apiKeysApi.createAPIKey({
          provider: apiKeyProvider,
          key_name: `${apiKeyProvider === 'openai' ? 'OpenAI' : 'Gemini'} API Key`,
          api_key: apiKey,
          is_active: true,
        });
        toast.success('API Key created successfully!');
      }
      setApiKey('');
      loadAPIKeys();
    } catch (error: any) {
      console.error('Failed to save API key:', error);
      toast.error(error.message || 'Failed to save API key');
    } finally {
      setIsSavingApiKey(false);
    }
  };

  const handleSaveGeneralAISettings = async () => {
    setIsSavingSettings(true);
    try {
      // Get current settings for the selected portal
      const currentSettings = currentPortal === 'founder' ? founderSettings : businessOwnerSettings;
      
      // Build the update payload with both providers
      const updatePayload: any = {
        provider_to_use: providerToUse,
        openai: {
          ...(currentSettings?.openai || {
            max_tokens: 2000,
            allow_file_upload: false,
            allowed_file_types: ['pdf', 'txt'],
            max_file_size_mb: 5,
          }),
          ai_model: openaiModel,
          temperature: parseFloat(openaiTemperature),
        },
        gemini: {
          ...(currentSettings?.gemini || {
            max_tokens: 3000,
            allow_file_upload: false,
            allowed_file_types: ['pdf', 'txt'],
            max_file_size_mb: 5,
          }),
          ai_model: geminiModel,
          temperature: parseFloat(geminiTemperature),
        },
      };

      await aiSettingsApi.updateAISettings(currentPortal, updatePayload);
      toast.success('AI settings saved successfully!');
      loadAISettings();
    } catch (error: any) {
      console.error('Failed to save AI settings:', error);
      toast.error(error.message || 'Failed to save AI settings');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold mb-6">AI Configuration</h2>

      <div className="bg-white p-6 rounded-lg shadow space-y-6 mb-8">
        <h3 className="text-lg font-semibold mb-4">General AI Settings</h3>

        {/* Portal Selection */}
        <div className="space-y-2">
          <Label htmlFor="portal">Portal</Label>
          <Select value={currentPortal} onValueChange={(value: 'founder' | 'business-owner') => {
            setCurrentPortal(value);
          }}>
            <SelectTrigger id="portal">
              <SelectValue placeholder="Select portal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="founder">Founder</SelectItem>
              <SelectItem value="business-owner">Business Owner</SelectItem>
            </SelectContent>
          </Select>
          {isLoadingSettings && <p className="text-sm text-slate-500">Loading settings...</p>}
        </div>

        {/* Active Provider Selection */}
        <div className="space-y-2">
          <Label>Active AI Provider</Label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="active-provider-openai"
                name="active-provider"
                checked={providerToUse === 'openai'}
                onChange={() => setProviderToUse('openai')}
                className="h-4 w-4 text-indigo-600"
              />
              <Label htmlFor="active-provider-openai" className="font-normal cursor-pointer">
                OpenAI {providerToUse === 'openai' && <span className="text-green-600 ml-2">✓ Active</span>}
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="active-provider-gemini"
                name="active-provider"
                checked={providerToUse === 'gemini'}
                onChange={() => setProviderToUse('gemini')}
                className="h-4 w-4 text-indigo-600"
              />
              <Label htmlFor="active-provider-gemini" className="font-normal cursor-pointer">
                Gemini {providerToUse === 'gemini' && <span className="text-green-600 ml-2">✓ Active</span>}
              </Label>
            </div>
          </div>
          <p className="text-sm text-slate-500">Select which provider to use for AI operations</p>
        </div>

        {/* Tabs for Provider Settings */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'openai' | 'gemini')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="openai">
              OpenAI Settings {activeTab === 'openai' && <span className="ml-1">⚙️</span>}
            </TabsTrigger>
            <TabsTrigger value="gemini">
              Gemini Settings {activeTab === 'gemini' && <span className="ml-1">⚙️</span>}
            </TabsTrigger>
          </TabsList>

          {/* OpenAI Settings Tab */}
          <TabsContent value="openai" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="openai-model">AI Model</Label>
                <Select value={openaiModel} onValueChange={setOpenaiModel}>
                  <SelectTrigger id="openai-model">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.openai.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openai-temperature">Temperature</Label>
                <Input 
                  id="openai-temperature" 
                  type="number" 
                  value={openaiTemperature}
                  onChange={(e) => setOpenaiTemperature(e.target.value)}
                  step="0.1" 
                  min="0" 
                  max="2" 
                />
                <p className="text-sm text-slate-500">Controls randomness: lower for more focused, higher for more creative.</p>
              </div>
            </div>
          </TabsContent>

          {/* Gemini Settings Tab */}
          <TabsContent value="gemini" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
                <Label htmlFor="gemini-model">AI Model</Label>
                <Select value={geminiModel} onValueChange={setGeminiModel}>
                  <SelectTrigger id="gemini-model">
                    <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                    {AI_MODELS.gemini.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
                <Label htmlFor="gemini-temperature">Temperature</Label>
                <Input 
                  id="gemini-temperature" 
                  type="number" 
                  value={geminiTemperature}
                  onChange={(e) => setGeminiTemperature(e.target.value)}
                  step="0.1" 
                  min="0" 
                  max="2" 
                />
            <p className="text-sm text-slate-500">Controls randomness: lower for more focused, higher for more creative.</p>
          </div>
        </div>
          </TabsContent>
        </Tabs>

        {/* New API Key Input Section */}
        <div className="space-y-2">
          <Label htmlFor="api-provider">Provider</Label>
          <Select value={apiKeyProvider} onValueChange={(value: 'openai' | 'gemini') => setApiKeyProvider(value)}>
            <SelectTrigger id="api-provider">
              <SelectValue placeholder="Select provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="api-key">
            {apiKeyProvider === 'openai' ? 'OpenAI' : 'Gemini'} API Key
          </Label>
          <Input
            id="api-key"
            type="password" // Use type="password" for sensitive input
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={`Enter your ${apiKeyProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key`}
          />
          <p className="text-sm text-slate-500">
            This key will be used to authenticate with your chosen AI service.
            {existingAPIKeys.some(k => k.provider === apiKeyProvider && k.is_active) && (
              <span className="ml-2 text-green-600">✓ {apiKeyProvider === 'openai' ? 'OpenAI' : 'Gemini'} API key is configured</span>
            )}
          </p>
        </div>

        <div className="flex justify-end space-x-2">
          <Button 
            onClick={handleSaveApiKey} 
            disabled={isSavingApiKey}
            className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            {isSavingApiKey ? 'Saving...' : 'Save API Key'}
          </Button>
          <Button 
            onClick={handleSaveGeneralAISettings}
            disabled={isSavingSettings}
            className="bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          >
            {isSavingSettings ? 'Saving...' : 'Save General AI Settings'}
          </Button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">AI Chatbot Prompts</h3>
          <div className="text-sm text-slate-500">
            <p>Portal: <span className="font-semibold capitalize">{currentPortal === 'founder' ? 'Founder' : 'Business Owner'}</span></p>
            {chatbotsForPortal.length > 0 && (
              <p className="text-green-600 mt-1">{chatbotsForPortal.length} chatbot(s) loaded</p>
            )}
          </div>
        </div>

        {isLoadingChatbots ? (
          <div className="text-center py-8">
            <p className="text-slate-500">Loading chatbots...</p>
          </div>
        ) : chatbotsForPortal.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500">No chatbots found for this portal. Create chatbots to manage their prompts here.</p>
          </div>
        ) : (
        <Accordion type="single" collapsible className="w-full">
            {chatbotsForPortal.map((chatbot, index) => (
              <AccordionItem key={chatbot.id} value={`chatbot-${chatbot.id}`} className="border p-4 rounded-lg mb-2">
            <AccordionTrigger className="flex items-center justify-between w-full text-left font-bold text-lg hover:no-underline">
                  {chatbot.name}
            </AccordionTrigger>
            <AccordionContent className="mt-4">
              <AIModulePromptConfig
                    chatbot={chatbot}
                    portalId={selectedPortalId}
                    onUpdate={loadChatbots}
              />
            </AccordionContent>
          </AccordionItem>
            ))}
        </Accordion>
        )}
      </div>
    </div>
  );
};

export default AIConfigPage;