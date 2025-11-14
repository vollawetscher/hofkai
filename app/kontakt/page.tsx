"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function Kontakt() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = encodeURIComponent(`Kontaktanfrage von ${formData.name}`)
    const body = encodeURIComponent(
      `Name: ${formData.name}\n` + `E-Mail: ${formData.email}\n\n` + `Nachricht:\n${formData.message}`,
    )

    window.location.href = `mailto:hofmann.btb@gmail.com?subject=${subject}&body=${body}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4F8] via-white to-[#E8F4F8]">
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-4xl font-bold text-[#1E3A4C] mb-8 text-center">Kontakt</h1>

        <Card className="border-2 border-[#0B6E99]/20 shadow-lg">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-[#1E3A4C] font-semibold mb-2">
                  Name
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-2 border-[#0B6E99]/30 focus:ring-2 focus:ring-[#0B6E99]"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-[#1E3A4C] font-semibold mb-2">
                  E-Mail
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-2 border-[#0B6E99]/30 focus:ring-2 focus:ring-[#0B6E99]"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-[#1E3A4C] font-semibold mb-2">
                  Nachricht
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full min-h-[150px] border-2 border-[#0B6E99]/30 rounded-md p-3 focus:ring-2 focus:ring-[#0B6E99] focus:outline-none"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#F7C948] text-[#1E3A4C] hover:bg-[#f5c133] font-bold h-12 text-base"
              >
                Nachricht senden
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <a href="/" className="text-[#0B6E99] hover:underline font-medium">
            ← Zurück zur Startseite
          </a>
        </div>
      </div>
    </div>
  )
}
