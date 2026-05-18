'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function Chat() {
  // useChat in v5+ no longer manages the input state automatically
  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat',
    }),
  });
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <h1 className="text-2xl font-bold mb-8 text-center">Nexus: Core Agent</h1>

      {/* Loop through messages and display them */}
      {messages.map(m => (
        <div key={m.id} className="whitespace-pre-wrap mb-4 p-4 rounded-lg bg-slate-100 text-black">
          <strong>{m.role === 'user' ? 'You: ' : 'Nexus: '}</strong>
          {m.parts.map((part, index) =>
            part.type === 'text' ? <span key={index}>{part.text}</span> : null
          )}
        </div>
      ))}

      {/* The Chat Input Form */}
      <form onSubmit={handleSubmit} className="fixed bottom-0 w-full max-w-md p-2 mb-8">
        <input
          className="w-full p-4 border border-gray-300 rounded-lg shadow-xl text-black"
          value={input}
          placeholder="Ask Nexus something..."
          onChange={e => setInput(e.target.value)}
        />
      </form>
    </div>
  );
}