# PROJETO INTEGRADOR II: DESENVOLVIMENTO DE SISTEMAS ORIENTADO A DISPOSITIVOS MÓVEIS E BASEADOS NA WEB

## 👥 Integrantes do Grupo 09

| Nome | Função |
| :--- | :--- |
| ELIEZER SANTOS MONTEIRO | Desenvolvedor Backend 
| GABRIEL HENRIQUE PEREIRA | Desenvolvedor Frontend 
| JOÃO PEDRO DE PAIVA ANDRADE | Documentação / GitHub
| JULIANA SARA LOPES | Desenvolvedor Backend
| RICHARD VILLALBA DUARTE | Desenvolvedor Frontend

---

## 🎯 Prova de Conceito (PoC)

A PoC implementa a funcionalidade central da nossa plataforma de combate ao desperdício de alimentos. Focamos na **intermediação de ofertas** e na **conscientização**.

### 🌟 Funcionalidades Implementadas

* **Jornada de Carlos Almeida (Gerente):** Interface para **Cadastrar Ofertas** (Venda com Desconto ou Doação) e **Remover Ofertas** ativas após o escoamento, garantindo a gestão eficiente do estoque.
* **Jornada de Mariana Lima (Estudante):** Interface para **Buscar e Visualizar Ofertas** ativas em sua região em tempo real.
* [cite_start]**Dimensão Educativa:** Seção dedicada com **dicas práticas e vídeo tutorial** sobre o reaproveitamento de alimentos, promovendo hábitos mais conscientes e sustentáveis[cite: 18, 30, 50].

### 🛠️ Tecnologias Utilizadas

* **Backend (API):** Node.js com Express
* **Banco de Dados:** SQLite (arquivo local `database.db`)
* **Frontend (Web):** React com Vite

---

## 🚀 Instruções para Execução do Projeto

Siga os passos abaixo para subir a aplicação completa (Backend e Frontend).

### 1. Iniciar o Backend

O Backend deve ser iniciado primeiro para que o Frontend possa se conectar ao banco de dados e obter os dados das ofertas.

1.  Abra o terminal e navegue até a pasta `backend`:
    ```bash
    cd backend
    ```
2.  Execute o servidor:
    ```bash
    npm install # Garante que todas as dependências estejam instaladas (inclusive sqlite3)
    npm run dev
    ```
    *O servidor deve iniciar na porta **3001**.* Mantenha este terminal aberto.

### 2. Iniciar o Frontend

1.  Abra um **novo terminal** e volte para a raiz do projeto (ou navegue diretamente para a pasta `frontend`):
    ```bash
    cd ..
    cd frontend
    ```
2.  Execute o aplicativo React:
    ```bash
    npm install # Garante que todas as dependências estejam instaladas
    npm run dev
    ```
    *O aplicativo deve iniciar na porta **5173** (ou similar).*

### 3. Acessar a Aplicação

Abra o seu navegador e acesse a URL indicada no terminal do Frontend (ex: `http://localhost:5173/`).

A aplicação permitirá que você:
* Clique em **"Ver Ofertas (Mariana)"** para navegar na lista de produtos.
* Clique em **"Cadastrar Oferta (Carlos)"** para adicionar novas ofertas e remover itens.
* Clique em **"Educação / Dicas"** para acessar o conteúdo de conscientização.