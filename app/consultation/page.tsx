"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Hammer, Users } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = `Neue Individualberatungs-Anfrage von ${formData.name}`
    const body = `
Name: ${formData.name}
E-Mail: ${formData.email}
Telefon: ${formData.phone || "Nicht angegeben"}
Projektart: ${formData.projectType}

Projektbeschreibung:
${formData.description}
    `.trim()

    const mailtoLink = `mailto:hofmann.btb@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailtoLink
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Hammer className="h-6 w-6 text-[#0B6E99]" />
              <span className="text-xl font-bold text-[#0B6E99]">Bau kein Scheiss</span>
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" asChild>
                <Link href="/chat">Chat</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0B6E99]/10">
                <Users className="h-8 w-8 text-[#0B6E99]" />
              </div>
            </div>
            <h1 className="mb-2 text-balance text-3xl font-bold text-[#0B6E99] md:text-4xl">Individualberatung</h1>
            <p className="text-pretty text-lg text-gray-600">
              Persönliche Beratung für dein spezifisches Projekt – sende uns deine Anfrage
            </p>
          </div>

          <Card className="border-2 border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="email">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="phone">Telefon (optional)</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="project_type">Art des Projekts *</Label>
                <select
                  id="project_type"
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  required
                  className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="Hausbau">Hausbau</option>
                  <option value="Umbau">Umbau</option>
                  <option value="Sanierung">Sanierung</option>
                  <option value="Wohnungskauf">Wohnungskauf</option>
                  <option value="Sonstiges">Sonstiges</option>
                </select>
              </div>

              <div>
                <Label htmlFor="description">Beschreibung deines Projekts *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="mt-2 min-h-[150px]"
                  placeholder="Beschreibe dein Projekt und deine spezifischen Fragen..."
                />
              </div>

              <Button type="submit" className="w-full bg-[#0B6E99] hover:bg-[#0B6E99]/90">
                Anfrage absenden
              </Button>
            </form>
          </Card>

          <Card className="mt-6 border-2 border-[#0B6E99]/20 bg-[#0B6E99]/5 p-6">
            <h3 className="mb-2 font-bold text-[#0B6E99]">Was passiert als Nächstes?</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>✓ Wir prüfen deine Anfrage innerhalb von 24 Stunden</li>
              <li>✓ Du erhältst eine E-Mail mit möglichen Terminen</li>
              <li>✓ Wir vereinbaren ein individuelles Beratungsgespräch</li>
            </ul>
          </Card>
        </div>
      </div>

      <footer className="border-t-2 border-gray-100 bg-gray-50 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2 text-center">
              <Hammer className="h-5 w-5 text-[#0B6E99]" />
              <p className="text-sm font-semibold text-gray-700">Lieber zweimal messen als einmal fluchen!</p>
            </div>
            <p className="text-sm text-gray-500">
              © 2025 Bau kein Scheiss – Dein ehrlicher Helfer in allen Fragen zum Thema Wohnraum
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
