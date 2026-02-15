import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const AIChatbot: React.FC = () => {
    const { currentUser } = useAppContext();
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: `Hello ${currentUser?.name.split(' ')[0]}! I'm your Svadhyaya AI Guide. How can I assist you with your learning path today?` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "HTTP-Referer": window.location.origin, // Optional, for including your app on openrouter.ai rankings.
                    "X-Title": "Svadhyaya", // Optional. Shows in rankings on openrouter.ai.
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "model": "meta-llama/llama-3.1-8b-instruct",
                    "messages": [
                        { role: 'system', content: 'You are Svadhyaya AI, an intelligent learning assistant. You are helpful, concise, and futuristic. You help employees with their learning paths, technical questions, and career development.' },
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: userMessage }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to get response');
            }

            const data = await response.json();
            const botMessage = data.choices[0].message.content;

            setMessages(prev => [...prev, { role: 'assistant', content: botMessage }]);
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Something went wrong. Please try again.');
            // Add a temporary error message to chat
            setMessages(prev => [...prev, { role: 'assistant', content: "I'm encountering a temporary connection flux. Please try again in a moment." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-700 relative">
            {/* Header */}
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center">
                        AI Learning Companion
                        <Sparkles className="w-5 h-5 text-indigo-400 ml-3 animate-pulse" />
                    </h1>
                    <p className="text-gray-400 mt-1">Powered by Llama 3.1 8B • Neural Interface Active</p>
                </div>
                <button
                    onClick={() => setMessages([{ role: 'assistant', content: `Hello ${currentUser?.name.split(' ')[0]}! I'm your Svadhyaya AI Guide. How can I assist you with your learning path today?` }])}
                    className="p-2 text-gray-500 hover:text-indigo-400 transition-colors rounded-lg hover:bg-white/5"
                    title="Reset Conversation"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
            </div>

            {/* Chat Container */}
            <div className="flex-1 bg-[#1e293b]/60 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl overflow-hidden flex flex-col relative">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-50"></div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth">
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} gap-4 group`}>
                                {/* Avatar */}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white'
                                        : 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white'
                                    }`}>
                                    {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-6 h-6" />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`p-4 rounded-2xl shadow-sm relative ${msg.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-[#0f172a]/80 border border-white/10 text-gray-100 rounded-tl-none'
                                    }`}>
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                    <span className="text-[10px] opacity-50 absolute bottom-[-20px] block w-full text-right pt-1">
                                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex max-w-[80%] gap-4">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-lg">
                                    <Loader2 className="w-5 h-5 text-white animate-spin" />
                                </div>
                                <div className="bg-[#0f172a]/80 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    {error && (
                        <div className="flex justify-center my-4">
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm flex items-center">
                                <AlertCircle className="w-4 h-4 mr-2" />
                                {error}
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 bg-[#0f172a]/50 border-t border-white/5">
                    <form onSubmit={handleSend} className="relative max-w-4xl mx-auto">
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur"></div>
                            <div className="relative flex items-center bg-[#1e293b] rounded-xl overflow-hidden border border-white/10">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask anything about your learning path..."
                                    className="w-full bg-transparent border-none px-6 py-4 text-white placeholder-gray-500 focus:ring-0 focus:outline-none"
                                    disabled={isLoading}
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="p-3 mr-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/20"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                        <p className="text-center text-[10px] text-gray-600 mt-3">
                            AI responses may vary. Model: meta-llama/llama-3.1-8b-instruct
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AIChatbot;
