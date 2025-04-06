import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import Column from "./Column"
import { Board, Task } from "~/types/BoardType"
import TaskEditModal from "./TaskEditModal"

interface BoardViewProps {
  board: Board
  onUpdateBoard: (updatedBoard: Board) => void
  isDragging?: boolean
}

export default function BoardView({ board, onUpdateBoard, isDragging = false }: BoardViewProps) {
  // State for adding new status
  const [isAddingStatus, setIsAddingStatus] = useState(false)
  const [newStatusName, setNewStatusName] = useState("")

  // Add state for the task edit modal
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  // Add a new status
  const handleAddStatus = () => {
    if (newStatusName.trim()) {
      const newId = newStatusName.toLowerCase().replace(/\s+/g, "-")
      const updatedBoard = {
        ...board,
        statuses: [...board.statuses, { id: newId, name: newStatusName.trim() }],
      }
      onUpdateBoard(updatedBoard)
      setNewStatusName("")
      setIsAddingStatus(false)
    }
  }

  // Edit status name
  const handleEditStatus = (id: string, newName: string) => {
    const updatedBoard = {
      ...board,
      statuses: board.statuses.map((status) => (status.id === id ? { ...status, name: newName } : status)),
    }
    onUpdateBoard(updatedBoard)
  }

  // Delete status
  const handleDeleteStatus = (id: string) => {
    // Move tasks from this status to the first status
    const defaultStatus = board.statuses[0]?.id || "todo"
    const updatedTasks = board.tasks.map((task) => (task.status === id ? { ...task, status: defaultStatus } : task))

    // Remove the status
    const updatedBoard = {
      ...board,
      statuses: board.statuses.filter((status) => status.id !== id),
      tasks: updatedTasks,
    }

    onUpdateBoard(updatedBoard)
  }

  // Add a new task
  const handleAddTask = (statusId: string, title: string) => {
    const newTask: Task = {
      id: `task-${board.id}-${Date.now()}`,
      title,
      description: "",
      status: statusId,
      boardId: board.id,
    }

    const updatedBoard = {
      ...board,
      tasks: [...board.tasks, newTask],
    }

    onUpdateBoard(updatedBoard)
  }

  // Update a task
  const handleUpdateTask = (updatedTask: Task) => {
    const updatedBoard = {
      ...board,
      tasks: board.tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
    }

    onUpdateBoard(updatedBoard)
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {board.statuses.map((status) => (
            <Column
              key={status.id}
              id={`${board.id}:column-${status.id}`}
              status={status}
              tasks={board.tasks.filter((task) => task.status === status.id)}
              onAddTask={handleAddTask}
              onEditStatus={handleEditStatus}
              onDeleteStatus={handleDeleteStatus}
              onEditTask={setEditingTask}
              isDraggingActive={isDragging}
            />
          ))}

          {isAddingStatus ? (
            <div className="flex-shrink-0 w-72 bg-muted rounded-lg p-3">
              <div className="flex gap-2 mb-2">
                <Input
                  value={newStatusName}
                  onChange={(e) => setNewStatusName(e.target.value)}
                  placeholder="Status name"
                //   autoFocus
                />
                <Button size="sm" onClick={handleAddStatus}>
                  Add
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsAddingStatus(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="flex-shrink-0 h-12 w-72 justify-start gap-2 border-dashed"
              onClick={() => setIsAddingStatus(true)}
            >
              <Plus className="h-4 w-4" />
              Add Status
            </Button>
          )}
        </div>
      </div>

      {/* Task edit modal */}
      <TaskEditModal
        task={editingTask}
        statuses={board.statuses}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleUpdateTask}
      />
    </>
  )
}

