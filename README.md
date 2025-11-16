# Documentação da API Esculapy

**Guia de referência rápida para os endpoints da API Esculapy**, refletindo a arquitetura com separação entre **Catálogo de Produtos** e **Estoque de Lojistas**.

> **URL Base:** `http://localhost:8080`

---

## Sumário
- [Autenticação](#autenticação)
  - [Obter Token JWT](#obter-token-jwt)
  - [Usar o Token](#usar-o-token)
- [Perfis de Acesso (Roles)](#perfis-de-acesso-roles)
- [Endpoints da API](#endpoints-da-api)
  - [1. Auth (Autenticação)](#1-auth-autenticação)
  - [2. Catálogo (Público)](#2-catálogo-público)
  - [3. Estoque (Público)](#3-estoque-público)
  - [4. User (Usuário)](#4-user-usuário)
  - [5. Pedidos (Cliente)](#5-pedidos-cliente)
  - [6. Farmacêutico](#6-farmacêutico)
  - [7. Farmácia Admin (Lojista)](#7-farmácia-admin-lojista)
  - [8. Admin Master](#8-admin-master)

---

## Autenticação

A maioria dos endpoints da API **requer autenticação via Token JWT**.

### Obter Token JWT

**POST** `/api/auth/login`

**Permissão:** Público

**Corpo da Requisição (JSON):**
```json
{
    "email": "seu-email@exemplo.com",
    "senha": "sua-senha-123"
}
