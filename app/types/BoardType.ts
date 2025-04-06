// Define types for the board system
export type Task = {
    id: string
    title: string
    description: string
    status: string
    boardId: string
  }
  
  export type Status = {
    id: string
    name: string
  }
  
  export type Board = {
    id: string
    name: string
    statuses: Status[]
    tasks: Task[]
  }
  
  