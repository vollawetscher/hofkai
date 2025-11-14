"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, ImageIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import Image from "next/image"

interface ImageUploadProps {
  onImageChange: (imageUrl: string | null, rightsConfirmed: boolean) => void
  value?: string | null
}

export function ImageUpload({ onImageChange, value }: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(value || null)
  const [rightsConfirmed, setRightsConfirmed] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Bitte wähle eine Bilddatei aus (JPG, PNG, etc.)")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Das Bild darf maximal 5 MB groß sein")
      return
    }

    setUploading(true)

    try {
      // Upload to Vercel Blob
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      })

      if (!response.ok) {
        throw new Error("Upload fehlgeschlagen")
      }

      const blob = await response.json()
      setImageUrl(blob.url)
      onImageChange(blob.url, rightsConfirmed)
    } catch (error) {
      console.error("Upload error:", error)
      alert("Fehler beim Hochladen des Bildes. Bitte versuche es erneut.")
    } finally {
      setUploading(false)
    }
  }

  const handleRemove = () => {
    setImageUrl(null)
    setRightsConfirmed(false)
    onImageChange(null, false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRightsChange = (checked: boolean) => {
    setRightsConfirmed(checked)
    if (imageUrl) {
      onImageChange(imageUrl, checked)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">Bild hochladen (optional)</label>

        {!imageUrl ? (
          <div className="flex flex-col gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <div className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 transition-colors hover:border-[#74A57F] hover:bg-gray-100">
                {uploading ? (
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#74A57F]" />
                    <span>Bild wird hochgeladen...</span>
                  </div>
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-600">Klicke hier oder ziehe ein Bild hinein (max. 5 MB)</span>
                  </>
                )}
              </div>
            </label>
          </div>
        ) : (
          <div className="relative">
            <div className="relative h-64 w-full overflow-hidden rounded-lg border-2 border-gray-200">
              <Image src={imageUrl || "/placeholder.svg"} alt="Hochgeladenes Bild" fill className="object-cover" />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute right-2 top-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="rounded-lg border-2 border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="image-rights"
              checked={rightsConfirmed}
              onCheckedChange={handleRightsChange}
              className="mt-1"
            />
            <label htmlFor="image-rights" className="flex-1 cursor-pointer text-sm text-gray-700">
              <span className="font-semibold text-amber-900">Bestätigung der Bildrechte (erforderlich)</span>
              <p className="mt-1 text-xs text-gray-600">
                Ich bestätige hiermit, dass ich die Rechte an diesem Bild besitze oder die ausdrückliche Erlaubnis habe,
                es zu verwenden. Ich bin mir bewusst, dass das Hochladen von Bildern ohne entsprechende Rechte gegen
                Urheberrechtsgesetze verstößt und rechtliche Konsequenzen haben kann.
              </p>
            </label>
          </div>
        </div>
      )}

      <div className="rounded-lg bg-gray-50 p-3">
        <div className="flex items-start gap-2">
          <ImageIcon className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
          <p className="text-xs text-gray-600">
            <strong>Hinweis zu Bildrechten:</strong> Lade nur Bilder hoch, die du selbst erstellt hast oder für die du
            eine Nutzungserlaubnis besitzt. Stockfotos, fremde Fotos oder urheberrechtlich geschützte Bilder dürfen
            nicht verwendet werden.
          </p>
        </div>
      </div>
    </div>
  )
}
