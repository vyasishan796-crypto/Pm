"use client";

import { useState, useCallback } from "react";
import { ChatMessage } from "@/types";
import api from "@/lib/api";
import { generateId } from "@/lib/utils";

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (question: string, language: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: "user",
      content: question,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("prakriti_token");
      const res = await api.post(
        "/api/ai/query",
        { question, language },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      const data = res.data;
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: data.answer,
        sources: data.sources,
        confidence: data.confidence,
        relatedQuestions: data.related_questions,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch {
      const mockResponse: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: `Thank you for your question about "${question}". The AI service is currently being set up. Please try again later or check the API server.`,
        sources: [],
        confidence: 0.1,
        relatedQuestions: [],
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, mockResponse]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, isLoading, error, sendMessage, clearMessages };
}
