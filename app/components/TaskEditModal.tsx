import { useState, useEffect } from "react"
import { Status, Task } from "~/types/BoardType"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Button } from "./ui/button"
// import type { Task, Status } from "@/types/board-types"

interface TaskEditModalProps {
  task: Task | null
  statuses: Status[]
  isOpen: boolean
  onClose: () => void
  onSave: (updatedTask: Task) => void
}

export default function TaskEditModal({ task, statuses, isOpen, onClose, onSave }: TaskEditModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState("")

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setStatus(task.status)
    }
  }, [task])

  const handleSave = () => {
    if (!task) return

    onSave({
      ...task,
      title: title.trim(),
      description: description.trim(),
      status,
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task description"
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((statusOption) => (
                  <SelectItem key={statusOption.id} value={statusOption.id}>
                    {statusOption.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

