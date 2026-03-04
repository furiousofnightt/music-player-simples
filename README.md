# 🎧 Furious Music Player

Um reprodutor de música moderno e interativo, desenvolvido com **HTML, CSS, JavaScript, Flask e Python**, ideal para praticar conceitos de frontend, backend e deploy com Docker no Fly.io.

---

## 🚀 Funcionalidades

- ✨ Interface responsiva e estilizada com CSS moderno
- 🎵 Reprodução de áudio HTML5 diretamente no navegador
- 🎧 Gêneros dinâmicos (baseado em subpastas)
- ⏮️ Botões de próxima e anterior música
- ⏳ Temporizador e barra de progresso sincronizados
- 🔁 Modo Shuffle (aleatório)
- 🔂 Modo Repeat (repetir atual)
- 🤝 Integração com API Flask RESTful
- ⚙️ Deploy via Docker + Fly.io

---

## 📂 Estrutura do Projeto

```bash
music-player-simples/
├── music_player.py             # Lógica do player (sem pygame)
├── server.py                   # API principal com Flask
├── static/
│   ├── css/style.css           # Estilização visual
│   └── js/script.js            # Controle da interface e reprodução
├── templates/
│   └── index.html              # Frontend HTML principal
├── songs/                      # Pasta com subpastas por gênero e músicas
├── Dockerfile                  # Configuração do container
├── fly.toml                    # Config Fly.io
├── requirements.txt            # Dependências Python
└── README.md                   # Documentação (este arquivo)
```

---

## 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/furiousofnightgames/music-player-simples.git
cd music-player-simples

# Crie o ambiente virtual e ative
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Instale as dependências
pip install -r requirements.txt

# Inicie o servidor
python server.py

# Acesse: http://localhost:8080
```

---

## 🌐 Deploy na Nuvem (Fly.io)

```bash
fly launch     # Configuração inicial
fly deploy     # Realiza o deploy com Docker
fly open       # Abre o projeto no navegador
```

> ⬆️ O projeto detecta automaticamente o ambiente de produção via `RENDER=true` para não usar pygame.

---

## 📊 Tecnologias Utilizadas

- HTML5 / CSS3 / JavaScript
- Python 3.10+
- Flask + Flask-CORS
- Mutagen (para metadados das músicas)
- Docker + Fly.io

---

## 📚 Aprendizados

Esse projeto foi uma jornada de aprendizado completa, com:

- ✏️ Manipulação de DOM e eventos no navegador
- 🔗 Integração de APIs REST com frontend
- ⚖️ Lógica de controle de player de música
- ⚙️ Experiência com Docker e ambientes de produção reais

---

## 💼 Autor

Desenvolvido por **FURIOUSOFNIGHT** com o apoio técnico da Queen (ChatGPT). 

> Este projeto é parte de um ciclo de aprendizado em programação iniciado em 2025. 
> Orgulho de cada conquista no código. 

---

## ✨ Licença

Este projeto é de uso livre para fins educacionais. Sinta-se à vontade para usar, estudar, adaptar e evoluir!