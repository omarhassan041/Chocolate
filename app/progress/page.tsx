"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Progress as ProgressBar } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { Progress } from "@/types/learning"

const STATUS_OPTIONS = [
  { value: "not-started", label: "Not Started", color: "bg-gray-100 text-gray-800" },
  { value: "in-progress", label: "In Progress", color: "bg-blue-100 text-blue-800" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800" },
]

export default function ProgressPage() {
  const [progressList, setProgressList] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    topic: "",
    completed_hours: 0,
    target_hours: 10,
    status: "not-started" as const,
    notes: "",
  })

  const supabase = createClient()

  useEffect(() => {
    fetchProgress()
  }, [])

  async function fetchProgress() {
    const { data } = await supabase.from("progress").select("*").order("created_at", { ascending: false })
    if (data) setProgressList(data)
    setLoading(false)
  }

  async function addProgress(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from("progress").insert([formData])
    if (!error) {
      setOpen(false)
      setFormData({ topic: "", completed_hours: 0, target_hours: 10, status: "not-started", notes: "" })
      fetchProgress()
    }
  }

  async function updateHours(id: string, hours: number) {
    await supabase
      .from("progress")
      .update({ completed_hours: hours, last_updated: new Date().toISOString() })
      .eq("id", id)
    fetchProgress()
  }

  async function updateStatus(id: string, status: string) {
    await supabase.from("progress").update({ status, last_updated: new Date().toISOString() }).eq("id", id)
    fetchProgress()
  }

  async function deleteProgress(id: string) {
    await supabase.from("progress").delete().eq("id", id)
    fetchProgress()
  }

  const totalHours = progressList.reduce((sum, p) => sum + p.completed_hours, 0)
  const completedTopics = progressList.filter((p) => p.status === "completed").length

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
              <h1 className="text-xl font-bold">Learning Progress</h1>
              <p className="text-sm text-muted-foreground">Track your learning hours</p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add Topic
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Learning Topic</DialogTitle>
              </DialogHeader>
              <form onSubmit={addProgress} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Topic</Label>
                  <Input
                    id="topic"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="completed">Completed Hours</Label>
                    <Input
                      id="completed"
                      type="number"
                      min="0"
                      value={formData.completed_hours}
                      onChange={(e) => setFormData({ ...formData, completed_hours: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="target">Target Hours</Label>
                    <Input
                      id="target"
                      type="number"
                      min="1"
                      value={formData.target_hours}
                      onChange={(e) => setFormData({ ...formData, target_hours: Number(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(v: "not-started" | "in-progress" | "completed") =>
                      setFormData({ ...formData, status: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add Topic
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
            <p className="text-3xl font-bold text-primary">{totalHours}</p>
            <p className="text-sm text-muted-foreground">Total Hours</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{progressList.length}</p>
            <p className="text-sm text-muted-foreground">Topics</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{completedTopics}</p>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading...</p>
        ) : progressList.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No topics yet. Add your first learning topic!</p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {progressList.map((item) => {
              const percentage = Math.min((item.completed_hours / item.target_hours) * 100, 100)
              const statusInfo = STATUS_OPTIONS.find((s) => s.value === item.status)!
              return (
                <Card key={item.id} className="group relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{item.topic}</CardTitle>
                      <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          {item.completed_hours} / {item.target_hours}h
                        </span>
                      </div>
                      <ProgressBar value={percentage} className="h-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        max={item.target_hours}
                        value={item.completed_hours}
                        onChange={(e) => updateHours(item.id, Number(e.target.value))}
                        className="h-8 w-20"
                      />
                      <Select value={item.status} onValueChange={(v) => updateStatus(item.id, v)}>
                        <SelectTrigger className="h-8 flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS_OPTIONS.map((s) => (
                            <SelectItem key={s.value} value={s.value}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteProgress(item.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    {item.notes && <p className="text-sm text-muted-foreground">{item.notes}</p>}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
