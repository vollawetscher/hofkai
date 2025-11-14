"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { ImageUpload } from "./image-upload"
import { createClient } from "@/lib/supabase/client"

interface NewPostFormProps {
  userId: string
  username: string
}

export function NewPostForm({ userId, username }: NewPostFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageRightsConfirmed, setImageRightsConfirmed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleImageChange = (url: string | null, rightsConfirmed: boolean) => {
    setImageUrl(url)
    setImageRightsConfirmed(rightsConfirmed)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !content || !category) {
      alert("Bitte fülle alle Pflichtfelder aus")
      return
    }

    if (imageUrl && !imageRightsConfirmed) {
      alert("Bitte bestätige die Bildrechte, bevor du den Beitrag veröffentlichst")
      return
    }

    setSubmitting(true)

    try {
      const supabase = createClient()

      const { error } = await supabase.from("community_posts").insert({
        user_id: userId,
        username,
        title,
        content,
        category,
        image_url: imageUrl,
        image_rights_confirmed: imageUrl ? imageRightsConfirmed : null,
        image_uploaded_at: imageUrl ? new Date().toISOString() : null,
      })

      if (error) throw error

      router.push("/community")
      router.refresh()
    } catch (error) {
      console.error("Error creating post:", error)
      alert("Fehler beim Erstellen des Beitrags. Bitte versuche es erneut.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="border-2 border-gray-100 p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="category">Kategorie *</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Wähle eine Kategorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Hausbau">Hausbau</SelectItem>
              <SelectItem value="Umbau">Umbau</SelectItem>
              <SelectItem value="Sanierung">Sanierung</SelectItem>
              <SelectItem value="Wohnungskauf">Wohnungskauf</SelectItem>
              <SelectItem value="Sonstiges">Sonstiges</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="title">Titel *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Gib deinem Beitrag einen aussagekräftigen Titel"
            maxLength={200}
            required
          />
        </div>

        <div>
          <Label htmlFor="content">Inhalt *</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Beschreibe deine Erfahrungen, Tipps oder stelle eine Frage..."
            rows={10}
            required
            className="resize-none"
          />
        </div>

        <ImageUpload onImageChange={handleImageChange} value={imageUrl} />

        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={submitting || (imageUrl !== null && !imageRightsConfirmed)}
            className="flex-1 bg-[#74A57F] hover:bg-[#74A57F]/90"
          >
            {submitting ? "Wird veröffentlicht..." : "Beitrag veröffentlichen"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Abbrechen
          </Button>
        </div>
      </form>
    </Card>
  )
}
