"use client"

import React, { useState, useRef } from "react"
import { sendMessage } from "../../services/geminiService"
import { SendIcon, LoaderIcon, SparklesIcon } from "../icons/Icons"

interface Message {
  role: "user" | "model"
  text: string
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "Hello! I am Poisé AI. How can I help you with your posture or wellness today?" },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(scrollToBottom, [messages, isLoading])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = { role: "user", text: inputValue }
    setMessages((prev) => [...prev, userMessage])
    const currentInput = inputValue
    setInputValue("")
    setIsLoading(true)

    try {
      const systemContext =
        "You are Poisé AI, a friendly and helpful wellness and posture assistant. Your goal is to provide supportive, concise, and actionable advice. Keep your answers friendly and relatively short."
      const fullPrompt = `${systemContext}\n\nUser: ${currentInput}`
      const text = await sendMessage(fullPrompt)

      const modelMessage: Message = { role: "model", text }
      setMessages((prev) => [...prev, modelMessage])
    } catch (error) {
      console.error("Error sending message to Gemini:", error)
      const errorMessage: Message = {
        role: "model",
        text: "Sorry, I'm having trouble connecting right now. Please try again later.",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)]">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">AI Assistant</h1>
      <div className="flex-grow bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="flex-grow p-6 space-y-6 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start gap-4 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "model" && (
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white">
                  <SparklesIcon className="w-5 h-5" />
                </div>
              )}
              <div
                className={`max-w-lg px-4 py-3 rounded-2xl ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              {message.role === "user" && (
                <img
                  src="https://i.pravatar.cc/150?u=margaret"
                  alt="User"
                  className="w-8 h-8 rounded-full flex-shrink-0"
                />
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center text-white">
                <SparklesIcon className="w-5 h-5" />
              </div>
              <div className="max-w-lg px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 rounded-bl-none">
                <LoaderIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-gray-600">
          <form onSubmit={handleSendMessage} className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about posture, exercises, or wellness..."
              className="w-full pl-4 pr-12 py-3 bg-gray-100 dark:bg-gray-700 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute inset-y-0 right-0 flex items-center justify-center w-12 h-full text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Chatbot
