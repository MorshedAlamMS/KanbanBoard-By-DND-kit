import type React from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import TaskCard from "./TaskCard"
import { Task } from "~/types/BoardType"
// import type { Task } from "@/types/board-types"
// import TaskCard from "./task-card"

interface SortableTaskCardProps {
    task: Task
    onEditTask: (task: Task) => void
}

export default function SortableTaskCard({ task, onEditTask }: SortableTaskCardProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    // Handle click event separately from drag listeners
    const handleTaskClick = (e: React.MouseEvent) => {
        // Stop propagation to prevent conflicts with drag handlers
        e.stopPropagation()
        onEditTask(task)
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="touch-manipulation">
            <button onClick={handleTaskClick}>
                <TaskCard task={task} />
            </button>
        </div>
    )
}

