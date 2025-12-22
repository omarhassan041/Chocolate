export interface Schedule {
  id: string
  title: string
  description: string | null
  day_of_week: string
  start_time: string
  end_time: string
  category: string
  created_at: string
}

export interface Progress {
  id: string
  topic: string
  completed_hours: number
  target_hours: number
  status: "not-started" | "in-progress" | "completed"
  notes: string | null
  last_updated: string
  created_at: string
}

export interface Skill {
  id: string
  name: string
  level: number
  category: string
  description: string | null
  created_at: string
}
