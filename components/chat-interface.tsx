"use client"

import { useRef } from "react"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { AlertCircle, Send, Hammer } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface ChatInterfaceProps {
  userId: string
  tokens: number
  isAdmin?: boolean // Added isAdmin prop
}

const BAUKI_POSES = {
  happy: "/images/photo-2025-11-13-14-17-09.jpg", // Thumbs up, smiling
  thinking: "/images/generated-20image-20november-2013-2c-202025-20-202-23pm.png", // With lightbulb
  pointing: "/images/generated-20image-20november-2013-2c-202025-20-202-24pm.png", // Pointing gesture
  confident: "/images/generated-20image-20november-2013-2c-202025-20-202-25pm.png", // With wrench
  serious: "/images/generated-20image-20november-2013-2c-202025-20-202-24pm-20-281-29-20-281-29.png", // Arms crossed, stern
}

export function ChatInterface({ userId, tokens, isAdmin = false }: ChatInterfaceProps) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Moin! Ich bin Bauki, dein ehrlicher Helfer. Was kann ich für dich tun?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [showWarning, setShowWarning] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (!isAdmin && tokens <= 3 && tokens > 0) {
      setShowWarning(true)
    }
  }, [tokens, isAdmin])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || (!isAdmin && tokens <= 0)) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to chat
    const newUserMessage: Message = {
      role: "user",
      content: userMessage,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newUserMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          question: userMessage,
        }),
      })

      if (!response.ok) {
        throw new Error("Fehler beim Senden der Nachricht")
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantContent = ""

      // Add empty assistant message that will be filled
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "",
          timestamp: new Date(),
        },
      ])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          assistantContent += chunk

          // Update the last message with new content
          setMessages((prev) => {
            const newMessages = [...prev]
            newMessages[newMessages.length - 1] = {
              role: "assistant",
              content: assistantContent,
              timestamp: new Date(),
            }
            return newMessages
          })
        }
      }

      // Refresh to update token count
      router.refresh()
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getBaukiPose = (messageIndex: number) => {
    if (messageIndex === 0) return BAUKI_POSES.happy // Welcome message
    if (isLoading && messageIndex === messages.length - 1) return BAUKI_POSES.thinking // Loading
    if (messageIndex % 3 === 0) return BAUKI_POSES.confident
    if (messageIndex % 3 === 1) return BAUKI_POSES.pointing
    return BAUKI_POSES.happy
  }

  if (!isAdmin && tokens <= 0) {
    return (
      <div className="flex min-h-[600px] items-center justify-center rounded-lg border-2 border-[#0B6E99]/20 bg-gradient-to-br from-[#0B6E99]/5 to-[#74A57F]/5 p-8">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <Image
              src={BAUKI_POSES.serious || "/placeholder.svg"}
              alt="Bauki"
              width={120}
              height={120}
              className="opacity-50"
            />
          </div>
          <p className="mb-4 text-lg font-semibold text-[#0B6E99]">Keine Bauklötze mehr verfügbar</p>
          <p className="text-gray-600">Bitte kaufe weitere Bauklötze, um Bauki nutzen zu können.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {showWarning && !isAdmin && tokens <= 3 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Du hast nur noch {tokens} Baukl{tokens === 1 ? "otz" : "ötze"}! Jede Frage kostet einen Bauklotz.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col h-[600px] rounded-xl border-2 border-[#0B6E99]/20 bg-white shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-[#0B6E99] to-[#74A57F] p-4 text-white">
          <div className="flex items-center gap-3">
            <Image
              src={BAUKI_POSES.happy || "/placeholder.svg"}
              alt="Bauki"
              width={50}
              height={50}
              className="rounded-full"
            />
            <div>
              <h2 className="text-lg font-bold">Bauki – Dein Helfer</h2>
              <p className="text-sm text-white/90">Frag mich alles rund ums Bauen!</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-br from-white to-gray-50">
          {messages.map((message, index) => (
            <div key={index} className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <div className="flex-shrink-0">
                  <Image
                    src={getBaukiPose(index) || "/placeholder.svg"}
                    alt="Bauki"
                    width={45}
                    height={45}
                    className={`rounded-full ${
                      isLoading && index === messages.length - 1 ? "animate-pulse" : ""
                    } ${index === 0 ? "animate-bounce" : ""}`}
                  />
                </div>
              )}
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
                  message.role === "user"
                    ? "bg-[#0B6E99] text-white"
                    : "bg-white border-2 border-[#0B6E99]/10 text-gray-900"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="flex-shrink-0">
                  <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#0B6E99] shadow-md">
                    <Hammer className="h-5 w-5 text-white" />
                  </div>
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t-2 border-[#0B6E99]/20 bg-gradient-to-r from-[#0B6E99]/5 to-[#74A57F]/5 p-4"
        >
          <div className="flex gap-3">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Stelle Bauki eine Frage..."
              className="flex-1 min-h-[60px] max-h-[120px] resize-none border-2 border-[#0B6E99]/30 focus:border-[#0B6E99] focus-visible:ring-[#0B6E99] rounded-xl bg-white"
              disabled={isLoading || (!isAdmin && tokens <= 0)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              autoFocus
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim() || (!isAdmin && tokens <= 0)}
              className="flex-shrink-0 bg-[#0B6E99] hover:bg-[#0B6E99]/90 h-[60px] px-6 rounded-xl shadow-md"
            >
              {isLoading ? <span className="animate-spin">⏳</span> : <Send className="h-5 w-5" />}
            </Button>
          </div>
          <p className="text-xs text-gray-600 mt-2">Drücke Enter zum Senden, Shift+Enter für neue Zeile</p>
        </form>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gradient-to-r from-[#0B6E99]/5 to-[#74A57F]/5 rounded-lg p-3">
        {isAdmin ? (
          <>
            <span className="font-semibold text-[#0B6E99]">🛡️ Admin-Modus</span>
            <span>•</span>
            <span>Unbegrenzte Bauklötze</span>
          </>
        ) : (
          <>
            <span className="font-semibold text-[#0B6E99]">
              🧱 {tokens} Baukl{tokens === 1 ? "otz" : "ötze"}
            </span>
            <span>•</span>
            <span>Jede Frage kostet 1 Bauklotz</span>
          </>
        )}
      </div>
    </div>
  )
}
