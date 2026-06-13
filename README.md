# AI Support Knowledge Assistant

A production-style backend platform that enables administrators to upload knowledge-base documents and allows users to ask natural-language questions using Retrieval-Augmented Generation (RAG).

## Features

### Authentication

* JWT Authentication
* Role-Based Access Control
* Secure Password Hashing

### Document Management

* PDF Upload
* Metadata Storage
* Document Lifecycle Tracking

### AI Pipeline (In Progress)

* PDF Text Extraction
* Document Chunking
* Embedding Generation
* Semantic Search
* Retrieval-Augmented Generation (RAG)

## Tech Stack

* Node.js
* Express.js
* TypeScript
* MongoDB Atlas
* Mongoose
* JWT
* Zod
* Ollama
* OpenAI
* Docker

## Architecture

Client
→ Express API
→ MongoDB Atlas

Future Pipeline:

PDF
→ Text Extraction
→ Chunking
→ Embeddings
→ Vector Search
→ AI Response

## Current Status

Completed:

* Project Setup
* MongoDB Integration
* User Model
* Authentication
* Role-Based Access Control
* PDF Upload System

In Progress:

* Text Extraction
* Chunking
* Embeddings
* RAG Chat
