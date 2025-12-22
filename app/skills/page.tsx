"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Plus, Trash2, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Skill } from "@/types/learning"

const SKILL_CATEGORIES = ["frontend", "backend", "database", "devops", "design", "soft-skills", "language", "other"]

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    level: 1,
    category: "frontend",
    description: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchSkills()
  }, [])

  async function fetchSkills() {
    const { data } = await supabase.from("skills").select("*").order("category")
    if (data) setSkills(data)
    setLoading(false)
  }

  async function addSkill(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from("skills").insert([formData])
    if (!error) {
      setOpen(false)
      setFormData({ name: "", level: 1, category: "frontend", description: "" })
      fetchSkills()
    }
  }

  async function updateLevel(id: string, level: number) {
    await supabase.from("skills").update({ level }).eq("id", id)
    fetchSkills()
  }

  async function deleteSkill(id: string) {
    await supabase.from("skills").delete().eq("id", id)
    fetchSkills()
  }

  const skillsByCategory = SKILL_CATEGORIES.map((cat) => ({
    category: cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((group) => group.items.length > 0)

  const averageLevel =
    skills.length > 0 ? (skills.reduce((sum, s) => sum + s.level, 0) / skills.length).toFixed(1) : "0"

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">Skills</h1>
              <p className="text-sm text-muted-foreground">Manage your skill levels</p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Skill</DialogTitle>
              </DialogHeader>
              <form onSubmit={addSkill} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Skill Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat} className="capitalize">
                            {cat.replace("-", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Level (1-10)</Label>
                    <Select
                      value={String(formData.level)}
                      onValueChange={(v) => setFormData({ ...formData, level: Number(v) })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                          <SelectItem key={n} value={String(n)}>
                            {n}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Skill
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Stats */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto grid grid-cols-3 gap-4 px-4 py-6 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">{skills.length}</p>
            <p className="text-sm text-muted-foreground">Total Skills</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{skillsByCategory.length}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{averageLevel}</p>
            <p className="text-sm text-muted-foreground">Avg Level</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : skills.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No skills yet. Add your first skill!</p>
          </Card>
        ) : (
          <div className="space-y-8">
            {skillsByCategory.map(({ category, items }) => (
              <div key={category}>
                <h2 className="mb-4 text-lg font-semibold capitalize">{category.replace("-", " ")}</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {items.map((skill) => (
                    <Card key={skill.id} className="group relative">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-base">{skill.name}</CardTitle>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 opacity-0 group-hover:opacity-100"
                            onClick={() => deleteSkill(skill.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {skill.description && <p className="text-sm text-muted-foreground">{skill.description}</p>}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Level:</span>
                          <div className="flex gap-1">
                            {Array.from({ length: 10 }, (_, i) => (
                              <button
                                key={i}
                                onClick={() => updateLevel(skill.id, i + 1)}
                                className="transition-colors"
                              >
                                <Star
                                  className={`h-4 w-4 ${i < skill.level ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <Badge variant="secondary">{skill.level}/10</Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
