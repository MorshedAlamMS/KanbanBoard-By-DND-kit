
import { Task } from "~/types/BoardType"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"

interface TaskCardProps {
    task: Task
}

export default function TaskCard({ task }: TaskCardProps) {
    return (
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader className="p-3 pb-0">
                <CardTitle className="text-sm">{task.title}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-1">
                <CardDescription className="text-xs line-clamp-2">{task.description}</CardDescription>
            </CardContent>
        </Card>
    )
}

