export interface ApiMessage {
  _id: string
  content: string
  createdAt: string
}

export interface ApiResponse {
  success: boolean
  message: string
  isAcceptingMessages?: boolean
  messages?: ApiMessage[]
  questions?: string[]
}