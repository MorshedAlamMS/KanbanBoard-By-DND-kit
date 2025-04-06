import { useState } from "react"
import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { MoreHorizontal, Plus, Trash2, Edit2 } from "lucide-react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import SortableTaskCard from "./SortableTaskCard"
import { Status, Task } from "~/types/BoardType"

interface ColumnProps {
    id: string
    status: Status
    tasks: Task[]
    onAddTask: (statusId: string, title: string) => void
    onEditStatus: (id: string, newName: string) => void
    onDeleteStatus: (id: string) => void
    onEditTask: (task: Task) => void
    isDraggingActive?: boolean
}

export default function Column({
    id,
    status,
    tasks,
    onAddTask,
    onEditStatus,
    onDeleteStatus,
    onEditTask,
    isDraggingActive = false,
}: ColumnProps) {
    const [isAddingTask, setIsAddingTask] = useState(false)
    const [newTaskTitle, setNewTaskTitle] = useState("")
    const [isEditingStatus, setIsEditingStatus] = useState(false)
    const [editedStatusName, setEditedStatusName] = useState(status.name)

    // Set up the droppable area for the entire column
    const { setNodeRef, isOver } = useDroppable({
        id,
    })

    const handleAddTask = () => {
        if (newTaskTitle.trim()) {
            onAddTask(status.id, newTaskTitle.trim())
            setNewTaskTitle("")
            setIsAddingTask(false)
        }
    }

    const handleEditStatus = () => {
        if (editedStatusName.trim()) {
            onEditStatus(status.id, editedStatusName.trim())
            setIsEditingStatus(false)
        }
    }

    // Determine column highlight style
    const columnStyle = isOver
        ? ""
        : isDraggingActive
            ? ""
            : ""

    return (
        // Apply the droppable ref to the entire column container
        <div
            ref={setNodeRef}
            className={`flex-shrink-0 w-72 bg-muted rounded-lg p-3 flex flex-col h-full min-h-[200px] ${columnStyle}`}
        >
            <div className="flex items-center justify-between mb-3">
                {isEditingStatus ? (
                    <div className="flex gap-2 w-full">
                        <Input
                            value={editedStatusName}
                            onChange={(e) => setEditedStatusName(e.target.value)}
                            className="h-8"
                        //   autoFocus
                        />
                        <Button size="sm" onClick={handleEditStatus}>
                            Save
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setIsEditingStatus(false)
                                setEditedStatusName(status.name)
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                ) : (
                    <>
                        <h3 className="font-medium text-sm">
                            {status.name} ({tasks.length})
                        </h3>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => setIsEditingStatus(true)}>
                                    <Edit2 className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                {status.id !== "todo" && (
                                    <DropdownMenuItem
                                        className="text-destructive focus:text-destructive"
                                        onClick={() => onDeleteStatus(status.id)}
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                )}
            </div>

            {/* Make the task list take up most of the column space */}
            <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 flex-grow">
                    {tasks.map((task) => (
                        <SortableTaskCard key={task.id} task={task} onEditTask={onEditTask} />
                    ))}
                </div>
            </SortableContext>

            {isAddingTask ? (
                <div className="mt-2">
                    <Input
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task title"
                        className="mb-2"
                    // autoFocus
                    />
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleAddTask}>
                            Add
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                                setIsAddingTask(false)
                                setNewTaskTitle("")
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            ) : (
                <Button variant="ghost" className="w-full justify-start mt-2" onClick={() => setIsAddingTask(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Task
                </Button>
            )}
        </div>
    )
}

