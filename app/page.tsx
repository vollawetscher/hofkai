"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4F8] via-white to-[#E8F4F8]">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center">
          <div className="mb-10">
            <Image
              src="/images/photo-2025-11-13-14-11-36.jpg"
              alt="Bau kein Scheiss Logo - Bauki der Helfer"
              width={560}
              height={560}
              className="h-78 w-78 md:h-101 md:w-101 drop-shadow-lg"
              priority
            />
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-[#1E3A4C] md:text-5xl lg:text-6xl text-balance max-w-4xl">
            Dein ehrlicher Helfer in allen Fragen zum Thema Wohnraum
          </h1>
          <p className="mb-12 max-w-3xl text-lg text-[#4A6A7C] md:text-xl text-pretty leading-relaxed">
            Klare Tipps, Checklisten und Unterstützung, damit dein Bauprojekt oder dein Immobilienerwerb gelingt – ohne
            Stress, ohne Pfusch, ohne Scheiss.
          </p>

          <Link href="/auth/login">
            <Button className="bg-[#F7C948] text-[#1E3A4C] hover:bg-[#e6b834] hover:scale-110 hover:shadow-xl font-bold h-14 px-10 text-lg whitespace-nowrap transition-all duration-200 cursor-pointer">
              Jetzt loslegen
            </Button>
          </Link>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid gap-8 md:grid-cols-3 max-w-6xl mx-auto">
          <Card className="border-2 border-[#0B6E99]/20 bg-white shadow-md">
            <CardContent className="p-10 text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/generated-20image-20november-2013-2c-202025-20-202-24pm-20-281-29-20-281-29.png"
                  alt="Bauki - Ehrlich"
                  width={140}
                  height={140}
                  className="drop-shadow-md"
                />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#1E3A4C]">Ehrlich</h3>
              <p className="text-[#4A6A7C] leading-relaxed text-base">
                Kein Fachchinesisch, keine Tricks. Nur klare Antworten, die dir wirklich helfen.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#F7C948]/30 bg-white shadow-md">
            <CardContent className="p-10 text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/generated-20image-20november-2013-2c-202025-20-202-23pm.png"
                  alt="Bauki - Einfach"
                  width={140}
                  height={140}
                  className="drop-shadow-md"
                />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#1E3A4C]">Einfach</h3>
              <p className="text-[#4A6A7C] leading-relaxed text-base">
                Komplizierte Immobilien- und Bauthemen verständlich erklärt. Hilfestellungen, die du wirklich nutzen
                kannst.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#8BC34A]/30 bg-white shadow-md">
            <CardContent className="p-10 text-center">
              <div className="mb-6 flex justify-center">
                <Image
                  src="/images/generated-20image-20november-2013-2c-202025-20-202-25pm.png"
                  alt="Bauki - Hilfreich"
                  width={140}
                  height={140}
                  className="drop-shadow-md"
                />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-[#1E3A4C]">Hilfreich</h3>
              <p className="text-[#4A6A7C] leading-relaxed text-base">
                Praktische Hilfe, die dich effektiv voranbringt – vom ersten Gedanken bis zum letzten Handgriff.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="border-2 border-[#0B6E99] bg-gradient-to-br from-[#0B6E99] to-[#0a5f88] text-white shadow-2xl overflow-hidden">
          <CardContent className="p-12 md:p-16 text-center relative">
            <div className="mb-8 flex justify-center">
              <Image
                src="/images/photo-2025-11-13-14-17-09.jpg"
                alt="Bauki"
                width={140}
                height={140}
                className="drop-shadow-2xl"
              />
            </div>
            <h2 className="mb-6 text-4xl font-bold md:text-5xl text-balance">Frag Bauki</h2>
            <p className="mb-10 text-lg md:text-xl text-pretty max-w-2xl mx-auto leading-relaxed">
              Starte jetzt mit deiner ersten Frage und erlebe, wie einfach Bauen sein kann.
            </p>
            <Link href="/auth/login">
              <Button className="bg-[#F7C948] text-[#1E3A4C] hover:bg-[#e6b834] hover:scale-110 hover:shadow-xl font-bold h-14 px-10 text-lg whitespace-nowrap transition-all duration-200 cursor-pointer">
                Loslegen
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="mb-16 text-center text-3xl font-bold text-[#1E3A4C] md:text-4xl">Was dich erwartet</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {[
            {
              title: "Checklisten",
              description: "Schritt für Schritt durch dein Bauvorhaben. Nichts vergessen, alles im Blick.",
              interactive: true,
              link: "/checklisten",
            },
            {
              title: "Sofortantworten",
              description: "Stelle deine Fragen und bekomme direkt hilfreiche Antworten – rund um die Uhr.",
              interactive: false,
            },
            {
              title: "Expertenwissen",
              description: "Von der Planung bis zur Abnahme: Bauki kennt sich aus und gibt dir die besten Tipps.",
              interactive: true,
              link: "/expertenwissen",
            },
            {
              title: "Community",
              description: "Tausche dich mit anderen Bauherren aus. Lerne aus ihren Erfahrungen.",
              interactive: true,
              link: "/community",
            },
            {
              title: "Individualberatung",
              description: "Für komplexe Fragen: Buche eine persönliche Beratung.",
              interactive: true,
              link: "/consultation",
            },
            {
              title: "Immer aktuell",
              description: "Bauki lernt ständig dazu und bleibt auf dem neuesten Stand der Bauvorschriften.",
              interactive: false,
            },
          ].map((feature, index) => {
            const CardWrapper = feature.interactive ? Link : "div"
            const cardProps = feature.interactive
              ? {
                  href: feature.link,
                  className: "block",
                }
              : {}

            return (
              <CardWrapper key={index} {...cardProps}>
                <Card
                  className={`border border-[#0B6E99]/20 bg-white ${
                    feature.interactive
                      ? "hover:border-[#0B6E99] hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                      : ""
                  }`}
                >
                  <CardContent className="p-8">
                    <h3 className="mb-4 text-xl font-bold text-[#1E3A4C]">{feature.title}</h3>
                    <p className="text-[#4A6A7C] leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </CardWrapper>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-[#0B6E99]/20 bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-center">
            <Image
              src="/images/generated-20image-20november-2013-2c-202025-20-202-24pm.png"
              alt="Bauki"
              width={100}
              height={100}
              className="drop-shadow-md"
            />
          </div>
          <div className="flex flex-wrap justify-center gap-6 mb-6 text-[#4A6A7C]">
            <Link
              href="/impressum"
              className="hover:text-[#0B6E99] hover:underline transition-all duration-200 font-medium cursor-pointer"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="hover:text-[#0B6E99] hover:underline transition-all duration-200 font-medium cursor-pointer"
            >
              Datenschutz
            </Link>
            <Link
              href="/kontakt"
              className="hover:text-[#0B6E99] hover:underline transition-all duration-200 font-medium cursor-pointer"
            >
              Kontakt
            </Link>
          </div>
          <p className="text-center text-[#4A6A7C] text-lg font-bold mb-3">Lieber zweimal messen als einmal fluchen!</p>
          <p className="text-center text-[#4A6A7C] text-base">
            © 2025 Bau kein Scheiss – Dein ehrlicher Helfer in allen Fragen zum Thema Wohnraum
          </p>
        </div>
      </footer>
    </div>
  )
}
