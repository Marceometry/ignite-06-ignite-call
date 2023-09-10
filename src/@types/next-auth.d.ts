import NextAuth from 'next-auth'

declare module 'next-auth' {
  export interface User {
    id: string
    name: string
    username: string
    email: string
    avatarUrl: string
  }
}
