# PROJETO INTEGRADOR : DESENVOLVIMENTO DE SISTEMAS ORIENTADO A DISPOSITIVOS MÓVEIS E BASEADOS NA WEB

## 👥 Integrantes do Grupo 05

| Nome | Função |
| :--- | :--- |
| ELIEZER SANTOS MONTEIRO | Desenvolvedor Backend 
| GABRIEL HENRIQUE PEREIRA | Desenvolvedor Frontend
| JOÃO PEDRO DE PAIVA ANDRADE | Documentação / GitHub
| JULIANA SARA LOPES | Desenvolvedor Backend
| RICHARD VILLALBA DUARTE | Desenvolvedor Frontend 

---

## 🎯 Prova de Conceito (PoC)

A PoC implementa a funcionalidade central da nossa plataforma de combate ao desperdício de alimentos. Focamos na **intermediação de ofertas** e na **conscientização** através de uma arquitetura completa de produção.

### 🌟 Funcionalidades Implementadas

* **Jornada de Carlos Almeida (Gerente):** Interface para **Cadastrar Ofertas** (Venda com Desconto ou Doação) e **Remover Ofertas** ativas após o escoamento.
* **Jornada de Mariana Lima (Estudante):** Interface para **Buscar e Visualizar Ofertas** ativas, consumindo a API em tempo real.
* **Dimensão Educativa:** Seção dedicada com **dicas práticas e vídeo tutorial** sobre o reaproveitamento de alimentos.

### 🛠️ Arquitetura e Tecnologias de Produção

| Serviço | Tecnologia | Host de Produção |
| :--- | :--- | :--- |
| **Frontend (Web)** | React (Vite) | **Vercel** |
| **Backend (API)** | Node.js com Express | **Render** |
| **Banco de Dados** | **PostgreSQL** | **Render (Serviço Persistente)** |

---

## 🚀 Instruções para Execução Local do Projeto

O projeto foi configurado para ser executado com variáveis de ambiente do Render/Vercel. Para rodar localmente, siga estes passos:

### 1. Preparação Local (Configuração do DB)

1.  Crie um arquivo `.env` na pasta **`backend`**.
2.  Insira a URL de conexão do seu PostgreSQL (do Render) nesse arquivo:
    ```
    DATABASE_URL="sua_external_database_url_do_render_aqui"
    ```

### 2. Iniciar o Backend

O Backend deve ser iniciado primeiro.

1.  Abra o terminal e navegue até a pasta `backend`:
    ```bash
    cd backend
    ```
2.  Execute o servidor:
    ```bash
    npm install 
    npm run dev
    ```
    *O servidor deve iniciar na porta **3001**.*

### 3. Iniciar o Frontend

1.  Crie um arquivo `.env` na pasta **`frontend`**.
2.  Insira a URL do seu Backend local (pois o Vercel só injeta a variável quando está em produção):
    ```
    VITE_API_BASE_URL="http://localhost:3001"
    ```
3.  Abra um **novo terminal** e navegue até a pasta `frontend`:
    ```bash
    cd ..
    cd frontend
    ```
4.  Execute o aplicativo React:
    ```bash
    npm install 
    npm run dev
    ```
    *O aplicativo deve iniciar na porta **5173**.*

---

## 🔗 Link Público (URL para Teste Final e Entrega)

**A URL pública do projeto finalizado no Vercel é: **(https://projeto-integrador-grupo-05.vercel.app/)**
