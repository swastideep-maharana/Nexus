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

          {m.parts.map((part, index) => {
            // 1. If it's normal text, render it like usual
            if (part.type === 'text') {
              return <span key={index}>{part.text}</span>;
            }

            // 2. If it's our getEnterpriseRevenue tool call, intercept it!
            if (part.type === 'tool-getEnterpriseRevenue') {
              // Only render something if the tool has finished executing and output is available
              if (part.state === 'output-available') {
                const output = part.output as any;
                return (
                  <div key={part.toolCallId} className="mt-4 p-6 bg-white border border-blue-200 rounded-xl shadow-sm">
                    <h3 className="text-lg font-bold text-blue-600 mb-2">
                      Revenue Report: {output.quarter}
                    </h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 font-medium">Total Revenue:</span>
                      <span className="text-2xl font-extrabold text-green-600">{output.revenue}</span>
                    </div>
                    <div className="text-sm text-gray-500 italic border-t pt-2">
                      Growth: {output.growth} <br />
                      Top Sector: {output.topPerformingSector}
                    </div>
                  </div>
                );
              } else if (part.state === 'output-error') {
                return <div key={part.toolCallId} className="mt-2 text-red-500">Error: {part.errorText}</div>;
              } else {
                // This shows a loading state while the backend fetches the data!
                return <div key={part.toolCallId} className="mt-2 text-blue-400 animate-pulse">Fetching database...</div>;
              }
            }
            return null;
          })}
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