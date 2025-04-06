"use client"

import { useState } from "react"
import {
  DndContext,
  DragOverlay,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import BoardView from "./board-view"
// import TaskCard from "./task-card"
import { Board, Task } from "~/types/BoardType"
import TaskCard from "./TaskCard"
import BoardView from "./BoardView"
import { Button } from "./ui/button"
// import type { Task, Board } from "@/types/board-types"

// Initial boards data
const initialBoards: Board[] = [
  {
    id: "board-1",
    name: "Development Board",
    statuses: [
      { id: "todo", name: "To Do" },
      { id: "in-progress", name: "In Progress" },
      { id: "review", name: "Review" },
      { id: "done", name: "Done" },
    ],
    tasks: [
      {
        id: "task-1",
        title: "Research competitors",
        description: "Analyze top 5 competitors in the market",
        status: "todo",
        boardId: "board-1",
      },
      {
        id: "task-2",
        title: "Design homepage",
        description: "Create wireframes for the new homepage",
        status: "todo",
        boardId: "board-1",
      },
      {
        id: "task-3",
        title: "Implement authentication",
        description: "Set up user login and registration",
        status: "in-progress",
        boardId: "board-1",
      },
      {
        id: "task-4",
        title: "Write API documentation",
        description: "Document all API endpoints",
        status: "review",
        boardId: "board-1",
      },
      {
        id: "task-5",
        title: "Fix navigation bug",
        description: "Mobile menu doesn't close on selection",
        status: "done",
        boardId: "board-1",
      },
    ],
  },
  {
    id: "board-2",
    name: "Marketing Board",
    statuses: [
      { id: "backlog", name: "Backlog" },
      { id: "planning", name: "Planning" },
      { id: "in-progress", name: "In Progress" },
      { id: "completed", name: "Completed" },
    ],
    tasks: [
      {
        id: "task-6",
        title: "Create social media calendar",
        description: "Plan posts for next month",
        status: "backlog",
        boardId: "board-2",
      },
      {
        id: "task-7",
        title: "Design email newsletter",
        description: "Create template for monthly newsletter",
        status: "planning",
        boardId: "board-2",
      },
      {
        id: "task-8",
        title: "Analyze campaign results",
        description: "Review metrics from last campaign",
        status: "in-progress",
        boardId: "board-2",
      },
    ],
  },
]

export default function KanbanBoard() {
  // State for managing multiple boards
  const [boards, setBoards] = useState<Board[]>(initialBoards)

  // State for active drag item
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [activeTaskInitialBoard, setActiveTaskInitialBoard] = useState<string | null>(null)

  // State to highlight drop targets during drag
  const [isDragging, setIsDragging] = useState(false)

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  // Add a new board
  const handleAddBoard = () => {
    const newBoardId = `board-${Date.now()}`
    const newBoard: Board = {
      id: newBoardId,
      name: `New Board ${boards.length + 1}`,
      statuses: [
        { id: "todo", name: "To Do" },
        { id: "in-progress", name: "In Progress" },
        { id: "review", name: "Review" },
        { id: "done", name: "Done" },
      ],
      tasks: [],
    }

    setBoards([...boards, newBoard])
  }

  // Update a board
  const handleUpdateBoard = (updatedBoard: Board) => {
    setBoards(boards.map((board) => (board.id === updatedBoard.id ? updatedBoard : board)))
  }

  // Handle drag start - global handler
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event

    // Find which board the task belongs to
    for (const board of boards) {
      const task = board.tasks.find((t) => t.id === active.id)
      if (task) {
        setActiveTask(task)
        setActiveTaskInitialBoard(board.id)
        setIsDragging(true)
        return
      }
    }
  }

  // Handle drag over - for visual feedback
  const handleDragOver = (event: DragOverEvent) => {
    // Could add additional visual feedback here
  }

  // Handle drag end - global handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || !activeTask || !activeTaskInitialBoard) {
      setActiveTask(null)
      setActiveTaskInitialBoard(null)
      setIsDragging(false)
      return
    }

    // Extract the target board and column from the over ID
    // Format: board-{boardId}:column-{statusId}
    const overParts = over.id.toString().split(":")
    if (overParts.length !== 2) {
      setActiveTask(null)
      setActiveTaskInitialBoard(null)
      setIsDragging(false)
      return
    }

    const targetBoardId = overParts[0]
    const targetColumnId = overParts[1].replace("column-", "")

    // If we're moving between boards
    if (activeTaskInitialBoard !== targetBoardId) {
      // Remove task from source board
      const updatedBoards = boards.map((board) => {
        if (board.id === activeTaskInitialBoard) {
          return {
            ...board,
            tasks: board.tasks.filter((task) => task.id !== active.id),
          }
        }

        // Add task to target board
        if (board.id === targetBoardId) {
          const updatedTask = {
            ...activeTask,
            status: targetColumnId,
            boardId: targetBoardId,
          }

          return {
            ...board,
            tasks: [...board.tasks, updatedTask],
          }
        }

        return board
      })

      setBoards(updatedBoards)
    } else {
      // Just updating status within the same board
      const updatedBoards = boards.map((board) => {
        if (board.id === activeTaskInitialBoard) {
          return {
            ...board,
            tasks: board.tasks.map((task) => (task.id === active.id ? { ...task, status: targetColumnId } : task)),
          }
        }
        return board
      })

      setBoards(updatedBoards)
    }

    setActiveTask(null)
    setActiveTaskInitialBoard(null)
    setIsDragging(false)
  }

  // Handle drag cancel
  const handleDragCancel = () => {
    setActiveTask(null)
    setActiveTaskInitialBoard(null)
    setIsDragging(false)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={rectIntersection}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="flex flex-col gap-8">
        <div className="flex justify-end">
          <Button onClick={handleAddBoard}>
            <Plus className="mr-2 h-4 w-4" />
            Add Board
          </Button>
        </div>

        {boards.map((board, index) => (
          <div key={board.id} className={`flex flex-col gap-4 ${isDragging ? "relative" : ""}`}>
            <div className="flex items-center justify-between border-b pb-2">
              <h2 className="text-xl font-semibold">{board.name}</h2>
              {index > 0 && (
                <Button variant="outline" size="sm" onClick={() => setBoards(boards.filter((b) => b.id !== board.id))}>
                  Remove Board
                </Button>
              )}
            </div>
            <BoardView board={board} onUpdateBoard={handleUpdateBoard} isDragging={isDragging} />
          </div>
        ))}
      </div>

      <DragOverlay>{activeTask ? <TaskCard task={activeTask} /> : null}</DragOverlay>
    </DndContext>
  )
}

