import axios from 'axios';
import { Gender, Language} from '@/types/chat';
import * as Location from 'expo-location';
import { SYSTEM_PROMPT, INITIAL_MESSAGE_PROMPT, getGenderAwarePrompt } from '@/constants/prompts';
import { INITIAL_MESSAGES } from '@/constants/messages';
import { EMERGENCY_TERMS, RESPONSE_BANK } from '@/constants/responseBank';

interface ChatResponse {
  text: string;
}

type ResponseCategory = 'anxiety' | 'panic' | 'general';
type AnxietySubCategory = 'symptoms' | 'thoughts';

export class ChatService {
  // private readonly API_URL = 'https://api.cohere.ai/v1/generate';
  // private readonly API_KEY = ENV.EXPO_PUBLIC_COHERE_API_KEY;
  // private readonly TRANSLATE_API_URL = 'https://deep-translate1.p.rapidapi.com/language/translate/v2';
  // private readonly RAPID_API_KEY = ENV.EXPO_PUBLIC_RAPID_API_DEEP_TRANSLATE_KEY; 
  private readonly EXPO_PUBLIC_AZURE_ENDPOINT = process.env.EXPO_PUBLIC_AZURE_ENDPOINT;
  private readonly EXPO_PUBLIC_AZURE_API_KEY = process.env.EXPO_PUBLIC_AZURE_API_KEY; 
  private readonly MODEL_DEPLOYMENT = process.env.EXPO_PUBLIC_AZURE_MODEL_DEPLOYMENT; 
  private readonly API_VERSION_DEPLOYMENT = process.env.EXPO_PUBLIC_AZURE_API_VERSION_DEPLOYMENT; 
  private readonly SERVER_URL = process.env.EXPO_PUBLIC_SERVER_URL; 
  private conversationHistory: string[] = [];
  private readonly userId: string;
  private readonly responseBank = RESPONSE_BANK;
  private readonly emergencyTerms = EMERGENCY_TERMS;

  constructor(
    userId: string, 
    private gender: string | null, 
    private language: Language = 'en',
    private fullName: string
  ) {
    this.userId = userId;
  }

async generateInitialMessage(language: string): Promise<string | null> {
  if (!this.gender) return null;
  
  try {
    const prompt = getGenderAwarePrompt(INITIAL_MESSAGE_PROMPT, language as Language, this.gender as Gender);
 
    const response = await axios.post(
      `${this.EXPO_PUBLIC_AZURE_ENDPOINT}/openai/deployments/${this.MODEL_DEPLOYMENT}/chat/completions?api-version=${this.API_VERSION_DEPLOYMENT}`,
      {
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: "Generate initial greeting" }
        ],
        temperature: 0.7,
        max_tokens: 250,
        top_p: 0.95,
        presence_penalty: 0.1,
        frequency_penalty: 0.1
      },
      {
        headers: {
          'api-key': this.EXPO_PUBLIC_AZURE_API_KEY,
          'Content-Type': 'application/json',
          'Accept-Charset': 'UTF-8'
        },
        responseType: 'json',
        responseEncoding: 'utf8'
      }
    );
    
    let botResponse = response.data.choices[0].message.content.trim();
 
    if (!this.isCompleteSentence(botResponse)) {
      const messages = INITIAL_MESSAGES[language as 'en' | 'he'];
      const randomIndex = Math.floor(Math.random() * messages.length);
      botResponse = messages[randomIndex];
    }
 
    this.conversationHistory.push(`Assistant: ${botResponse}`);
    return botResponse;
 
  } catch (error) {
    const messages = INITIAL_MESSAGES[language as 'en' | 'he'];
    const randomIndex = Math.floor(Math.random() * messages.length);
    const fallbackMessage = messages[randomIndex];
    
    this.conversationHistory.push(`Assistant: ${fallbackMessage}`);
    return fallbackMessage;
  }
 }

  private determineCategory(message: string): {
    category: ResponseCategory;
    subCategory?: AnxietySubCategory;
  } {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('anxi')) {
      const subCategory: AnxietySubCategory = 
        lowerMessage.includes('feel') || lowerMessage.includes('body')
          ? 'symptoms'
          : 'thoughts';
      return { category: 'anxiety', subCategory };
    }
    
    if (lowerMessage.includes('panic')) {
      return { category: 'panic' };
    }
    
    return { category: 'general' };
  }

  private getFallbackResponse(message: string): ChatResponse {
    const { category, subCategory } = this.determineCategory(message);
    
    let responseArray: string[];
    if (category === 'anxiety' && subCategory) {
      responseArray = this.responseBank[this.language].anxiety[subCategory];
    } else if (category === 'panic') {
      responseArray = this.responseBank[this.language].panic;
    } else {
      responseArray = this.responseBank[this.language].general;
    }
   
    return {
      text: responseArray[Math.floor(Math.random() * responseArray.length)]
    };
   }

  private isEmergency(message: string): boolean {
    return this.emergencyTerms[this.language].some(term => 
      message.toLowerCase().includes(term.toLowerCase())
    );
  }

  private isCompleteSentence(text: string): boolean {
    const lastChar = text.trim().slice(-1);
    return ['.', '!', '?'].includes(lastChar);
  }

  private sendEmergencyAlert(message: string) {
    return new Promise<void>((resolve) => {
      setTimeout(async () => {
        try {
          let locationString = 'Location not available';
          try {
            const { status } = await Location.getForegroundPermissionsAsync();
            if (status === 'granted') {
              const location = await Location.getCurrentPositionAsync({});
              locationString = `Latitude: ${location.coords.latitude}, Longitude: ${location.coords.longitude}`;
              
              try {
                const [address] = await Location.reverseGeocodeAsync({
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude
                });
                
                if (address) {
                  locationString = `${address.street || ''} ${address.city || ''} ${address.region || ''} ${address.country || ''}`.trim();
                }
              } catch (geocodeError) {
                console.error('Error getting address:', geocodeError);
              }
            }
          } catch (locationError) {
            console.error('Error getting location:', locationError);
          }
  
          // Send alert
          try { 
            const response = await fetch(`${this.SERVER_URL}/api/emergency-alert`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userMessage: message,
                userId: this.userId,
                userName: this.fullName,
                location: locationString
              }),
            });
  
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
  
            const data = await response.json();
            console.log('Emergency alert sent successfully:', data);
          } catch (fetchError) {
            console.error('Failed to send emergency alert:', fetchError);
          }
        } catch (error) {
          console.error('Error in emergency alert process:', error);
        } finally {
          resolve();
        }
      }, 0);
    });
  }

  async getChatResponse(userMessage: string, language: string = 'en'): Promise<ChatResponse> {
    try {
      if (this.isEmergency(userMessage)) {
         this.sendEmergencyAlert(userMessage);
         this.conversationHistory.push(`Admin: The user expressed concerning thoughts. Please help them deal with the situation compassionately.`);
        }
      else
      {
        this.conversationHistory.push(`User: ${userMessage}`);
      }
      
      if (this.conversationHistory.length > 6) {
        this.conversationHistory = this.conversationHistory.slice(-6);
      }

    let botResponse = await this.attemptResponse(language, false);
    
    if (!this.isCompleteSentence(botResponse)) {
      console.log('First response incomplete, retrying with stricter parameters');
      botResponse = await this.attemptResponse(language, true);

      if (!this.isCompleteSentence(botResponse)) {
          const fallbackResponse = this.getFallbackResponse(userMessage);
          botResponse = fallbackResponse.text;
      }
    }

      this.conversationHistory.push(`Assistant: ${botResponse}`);
      return { text: botResponse };

    } catch (error) {
      console.error('Chat API Error:', error);

      if (axios.isAxiosError(error) && error.response) {
        console.error('Error response:', {
          status: error.response.status,
          data: error.response.data
        });
      }

      return this.getFallbackResponse(userMessage);
    }
  }

  private async attemptResponse(language: string, isRetry: boolean): Promise<string> {
    const systemPrompt = getGenderAwarePrompt(SYSTEM_PROMPT, language as Language, this.gender as Gender, this.conversationHistory);
    console.log(systemPrompt)
    const enhancedPrompt = isRetry ? 
      `${systemPrompt}\n\nVERY IMPORTANT: Previous response was incomplete. You must provide a complete, well-formed response with proper punctuation and at least 2-3 full sentences.` :
      systemPrompt;

    const response = await axios.post(
      `${this.EXPO_PUBLIC_AZURE_ENDPOINT}/openai/deployments/${this.MODEL_DEPLOYMENT}/chat/completions?api-version=${this.API_VERSION_DEPLOYMENT}`,
      {
        messages: [
          {
            role: "system",
            content: enhancedPrompt
          },
          ...this.conversationHistory.map(msg => ({
            role: msg.startsWith("User:") ? "user" : "assistant",
            content: msg.replace(/^(User:|Assistant:|Admin:)\s*/, '')
          }))
        ],
        temperature: isRetry ? 0.5 : 0.7,
        max_tokens: 250,
        top_p: isRetry ? 0.8 : 0.95,
        presence_penalty: isRetry ? 0.2 : 0.1,
        frequency_penalty: isRetry ? 0.2 : 0.1,
        stop: ["User:", "Assistant:"]
      },
      {
        headers: {
          'api-key': this.EXPO_PUBLIC_AZURE_API_KEY,
          'Content-Type': 'application/json',
          'Accept-Charset': 'UTF-8'
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  }
}

export const createChatService = (userId: string, gender: string | null, language: Language = 'en', fullname: string) => 
  new ChatService(userId, gender, language, fullname);



  // private async translateText(text: string, from: string, to: string): Promise<string> {
  //   try {
  //     const response = await axios.post(
  //       this.TRANSLATE_API_URL,
  //       {
  //         q: text,
  //         source: from,
  //         target: to
  //       },
  //       {
  //         headers: {
  //           'content-type': 'application/json',
  //           'X-RapidAPI-Key': this.RAPID_API_KEY,
  //           'X-RapidAPI-Host': 'deep-translate1.p.rapidapi.com'
  //         }
  //       }
  //     );
      
  //     console.log('Translation response:', response.data);
      
  //     // Updated to match the actual response structure
  //     if (response.data?.data?.translations?.translatedText) {
  //       return response.data.data.translations.translatedText;
  //     }
  //     return text;
  //   } catch (error) {
  //     console.error('Translation error:', error);
  //     return text;
  //   }
  // }

  // async getChatResponse(userMessage: string, language: string = 'en'): Promise<ChatResponse> {
  //   try {
  //     let processedMessage = userMessage;
      
  //     // If Hebrew, translate user message to English for processing
  //     if (language === 'he') {
  //       processedMessage = await this.translateText(userMessage, 'he', 'en');
  //     }
  
  //     // Check for emergency with English message
  //     if (this.isEmergency(processedMessage)) {
  //       await this. sendEmergencyAlert(processedMessage);
  //       // const emergencyResponse = {
  //       //   text: "I'm very concerned about what you're sharing. Help is available 24/7:\n" +
  //       //        "Crisis Hotline: 988\n" +
  //       //        "Crisis Text Line: Text HOME to 741741\n\n" +
  //       //        "Would you like to talk about what's troubling you?"
  //       // };
  
  //       // // Only translate emergency response if user is in Hebrew
  //       // if (language === 'he') {
  //       //   emergencyResponse.text = await this.translateText(emergencyResponse.text, 'en', 'he');
  //       // }
        
  //       // this.conversationHistory.push(`Assistant: ${emergencyResponse}`);
  //       // return emergencyResponse;
  //     }
  
  //     // Add English message to history for context
  //     this.conversationHistory.push(`User: ${processedMessage}`);
      
  //     if (this.conversationHistory.length > 6) {
  //       this.conversationHistory = this.conversationHistory.slice(-6);
  //     }
  
  //     // Always use English prompt with Cohere
  //     const prompt = `${this.systemPrompt}${this.conversationHistory.join('\n')}\nAssistant:`;
  
  //     const response = await axios.post(
  //       this.API_URL,
  //       {
  //         model: 'command',
  //         prompt: prompt,
  //         max_tokens: 150,
  //         temperature: 0.7,
  //         k: 0,
  //         stop_sequences: ["User:", "Assistant:"],
  //         return_likelihoods: 'NONE',
  //         truncate: 'END'
  //       },
  //       {
  //         headers: {
  //           'Authorization': `Bearer ${this.API_KEY}`,
  //           'Content-Type': 'application/json',
  //         }
  //       }
  //     );
  
  //     let botResponse = response.data.generations[0].text.trim()
  //     .replace(/Assistant:|User:/g, '')
  //     .trim();
  
  //   if (!this.isCompleteSentence(botResponse)) {
  //     const fallbackResponse = this.getFallbackResponse(processedMessage);
  //     botResponse = fallbackResponse.text;
  //   }
      
  //   // If user is in Hebrew, translate the response to Hebrew before showing
  //   if (language === 'he') {
  //     const translatedResponse = await this.translateText(botResponse, 'en', 'he');
  //     console.log('Final translated response:', translatedResponse); // Add this log
  //     this.conversationHistory.push(`Assistant: ${translatedResponse}`);
  //     return { text: translatedResponse };
  //   }
    
  //   this.conversationHistory.push(`Assistant: ${botResponse}`);
  //   return { text: botResponse };
      
  //   } catch (error) {
  //     console.error('Chat API Error:', error);
  //     let fallbackResponse = this.getFallbackResponse(userMessage);
      
  //     // If user is in Hebrew, translate the fallback response
  //     if (language === 'he') {
  //       fallbackResponse.text = await this.translateText(fallbackResponse.text, 'en', 'he');
  //     }
      
  //     return fallbackResponse;
  //   }
  // }




///////////////////// last ////////////////////
// async getChatResponse(userMessage: string, language: string = 'en'): Promise<ChatResponse> {
//   try {
//     if (this.isEmergency(userMessage)) {
//        this.sendEmergencyAlert(userMessage);
//        this.conversationHistory.push(`Admin: The user expressed concerning thoughts. Please help them deal with the situation compassionately.`);
//       }
//     else
//     {
//       this.conversationHistory.push(`User: ${userMessage}`);
//     }
    
//     if (this.conversationHistory.length > 6) {
//       this.conversationHistory = this.conversationHistory.slice(-6);
//     }

//     const response = await axios.post(
//       `${this.EXPO_PUBLIC_AZURE_ENDPOINT}/openai/deployments/${this.MODEL_DEPLOYMENT}/chat/completions?api-version=${this.API_VERSION_DEPLOYMENT}`,
//       {
//         messages: [
//           {
//             role: "system",
//             content: getGenderAwarePrompt(SYSTEM_PROMPT, language as Language, this.gender as Gender, this.conversationHistory)
//           },
//           ...this.conversationHistory.map(msg => ({
//             role: msg.startsWith("User:") ? "user" : "assistant",
//             content: msg.replace(/^(User:|Assistant:)\s*/, '')
//           }))
//         ],
//         temperature: 0.7,
//         max_tokens: 250,
//         top_p: 0.95,
//         presence_penalty: 0.1, 
//         frequency_penalty: 0.1,
//         stop: ["User:", "Assistant:"]
//       },
//       {
//         headers: {
//           'api-key': this.EXPO_PUBLIC_AZURE_API_KEY,
//           'Content-Type': 'application/json',
//           'Accept-Charset': 'UTF-8'
//         },
//         responseType: 'json',
//         responseEncoding: 'utf8'
//       }
//     );

//     let botResponse = response.data.choices[0].message.content.trim();

//     if (!this.isCompleteSentence(botResponse)) {
//       const fallbackResponse = this.getFallbackResponse(userMessage);
//       botResponse = fallbackResponse.text;
//     }

//     this.conversationHistory.push(`Assistant: ${botResponse}`);
//     return { text: botResponse };

//   } catch (error) {
//     console.error('Chat API Error:', error);

//     if (axios.isAxiosError(error) && error.response) {
//       console.error('Error response:', {
//         status: error.response.status,
//         data: error.response.data
//       });
//     }

//     return this.getFallbackResponse(userMessage);
//   }
// }