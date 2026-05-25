# Realtime Chat App

A realtime chat application built to learn how modern live systems work internally using WebSockets and Socket.IO.

This project focuses heavily on:
- realtime communication
- persistent connections
- event-driven architecture
- React synchronization
- socket lifecycle management
- effect cleanup
- transient realtime state
- frontend/backend synchronization

The main goal of this project was understanding how live systems behave rather than building a polished production UI.

---

# Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Socket.IO Client

## Backend
- Express.js
- Socket.IO
- Node.js

---

# Features

- Realtime messaging
- Multiple tab synchronization
- Join/leave notifications
- Typing indicators
- Live broadcasting
- Socket connection lifecycle handling
- Effect cleanup handling
- Structured realtime event payloads

---

# Learning Goals

This project was built to deeply understand:

- WebSocket mental model
- Persistent client/server communication
- Realtime synchronization
- React effect lifecycle
- Cleanup importance
- Async event coordination
- State synchronization
- Event-driven architecture
- Transient realtime UI state
- Mutable runtime coordination using `useRef`

---

# Important Concepts Explored

## Realtime Synchronization

Understanding how:

```txt
server event
↓
client receives event
↓
React state updates
↓
UI rerenders