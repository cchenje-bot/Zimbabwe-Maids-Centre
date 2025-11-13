import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Conversation, UserRole, EmployeeProfile, ClientProfile, Message } from '../types';

interface ChatPageProps {
  conversation: Conversation;
  currentUser: { profile: EmployeeProfile | ClientProfile, role: UserRole };
  otherUser: { profile: EmployeeProfile | ClientProfile, role: UserRole };
  onBack: () => void;
}

const ChatPage: React.FC<ChatPageProps> = ({ conversation, currentUser, otherUser, onBack }) => {
  const [messages, setMessages] = useState<Message[]>(conversation.messages);
  const [newMessage, setNewMessage] = useState('');
  const [translations, setTranslations] = useState<Map<number, string>>(new Map());
  const [loadingTranslations, setLoadingTranslations] = useState<Set<number>>(new Set());
  const [showTranslation, setShowTranslation] = useState<Map<number, boolean>>(new Map());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTranslate = async (message: Message) => {
    if (loadingTranslations.has(message.id)) return;

    // If translation exists, just toggle visibility
    if (translations.has(message.id)) {
        setShowTranslation(prev => new Map(prev).set(message.id, !prev.get(message.id)));
        return;
    }

    setLoadingTranslations(prev => new Set(prev).add(message.id));
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Translate the following text from ${message.language} to ${currentUser.profile.preferredLanguage}: "${message.text}"`,
        });
        const translatedText = response.text;
        setTranslations(prev => new Map(prev).set(message.id, translatedText));
        setShowTranslation(prev => new Map(prev).set(message.id, true));
    } catch (error) {
        console.error('Translation failed:', error);
        setTranslations(prev => new Map(prev).set(message.id, 'Translation failed.'));
        setShowTranslation(prev => new Map(prev).set(message.id, true));
    } finally {
        setLoadingTranslations(prev => {
            const newSet = new Set(prev);
            newSet.delete(message.id);
            return newSet;
        });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now(),
      senderId: currentUser.profile.id,
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: currentUser.profile.preferredLanguage,
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-xl max-w-4xl mx-auto flex flex-col h-[80vh]">
      <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="text-emerald-600 hover:text-emerald-800">
                <i className="fas fa-arrow-left"></i>
            </button>
            <img 
                src={otherUser?.profile?.profilePictureUrl || 'https://picsum.photos/seed/client/100/100'} 
                alt={otherUser?.profile?.name} 
                className="w-10 h-10 rounded-full object-cover"
            />
            <h2 className="text-lg font-bold text-slate-800">{otherUser?.profile?.name}</h2>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
        <div className="space-y-4">
          {messages.map((msg) => {
            const isCurrentUser = msg.senderId === currentUser.profile.id;
            const needsTranslation = msg.language !== currentUser.profile.preferredLanguage;
            const isTranslationVisible = showTranslation.get(msg.id);
            
            return (
              <div key={msg.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-3 rounded-lg ${isCurrentUser ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-800'}`}>
                  <p>{msg.text}</p>
                  
                  {isTranslationVisible && translations.has(msg.id) && (
                    <div className={`mt-2 pt-2 ${isCurrentUser ? 'border-t border-emerald-500' : 'border-t border-slate-300'}`}>
                      <p className="text-sm italic">{translations.get(msg.id)}</p>
                    </div>
                  )}

                  <div className="flex justify-between items-end mt-1">
                    <div className="text-left">
                      {needsTranslation && !isCurrentUser && (
                        <button
                          onClick={() => handleTranslate(msg)}
                          disabled={loadingTranslations.has(msg.id)}
                          className={`text-xs font-semibold hover:underline disabled:opacity-50 ${isCurrentUser ? 'text-emerald-200' : 'text-emerald-700'}`}
                        >
                          {loadingTranslations.has(msg.id)
                            ? <><i className="fas fa-spinner fa-spin"></i> Translating...</>
                            : translations.has(msg.id)
                              ? (isTranslationVisible ? 'Hide Translation' : 'Show Translation')
                              : 'Translate'
                          }
                        </button>
                      )}
                    </div>
                    <p className={`text-xs ml-auto pl-2 ${isCurrentUser ? 'text-emerald-100' : 'text-slate-500'} text-right`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <div className="p-4 border-t border-slate-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            aria-label="New message input"
          />
          <button
            type="submit"
            className="bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
            aria-label="Send message"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
