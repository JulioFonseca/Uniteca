
# 📚 Uniteca

Uniteca é um aplicativo moderno e intuitivo de **gestão de biblioteca universitária**, desenvolvido com **React Native (Expo)** e inspirado pela identidade visual da Faculdade Estácio. O objetivo do app é facilitar o cadastro, aluguel e devolução de materiais como livros e apostilas, proporcionando mais organização e agilidade aos alunos e à instituição.

---

## 🚀 Funcionalidades

- 📖 Cadastro de materiais (livros, apostilas, etc.)
- 📲 Aluguel e devolução com scanner de código de barras / QR Code
- 🔔 Notificações push para lembrar prazos de devolução
- 👤 Autenticação de usuários (alunos, administradores)
- 🧾 Histórico de empréstimos
- 🏷️ Sistema de categorias e filtros de busca

---

## 🛠️ Tecnologias Utilizadas

- [React Native (Expo)](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [NativeWind (Tailwind CSS for React Native)](https://www.nativewind.dev/)
- [React Native Paper](https://callstack.github.io/react-native-paper/)
- [TypeScript](https://www.typescriptlang.org/)
- [Expo Router](https://expo.github.io/router/)

---

## 📁 Estrutura de Pastas

```
uniteca/
│
├── app/                  # Páginas principais com roteamento (Expo Router)
│   ├── index.tsx         # Tela inicial (Login)
│   ├── _layout.tsx       # Layout principal com Stack navigation
│
├── src/
│   ├── screens/          # Telas (Login, Home, etc.)
│   ├── templates/        # Componentes reutilizáveis e templates de UI
│   └── types/            # Tipos TypeScript globais
│
├── assets/               # Imagens e ícones
├── docs/                 # Documentação
├── tailwind.config.js    # Configuração do NativeWind
├── package.json          # Dependências e scripts do projeto
└── README.md             # Este arquivo
```

---

## 👨‍💻 Equipe de Desenvolvimento

- **Julio Cezar da Silva Fonseca**
- **Fernando da Silva Ávila Filho**
- **João Victor da Cunha Lopes**
- **Caio Uchoa do Nascimento Gois**

---

## 💙 Identidade Visual

O aplicativo utiliza uma paleta de cores baseada no **azul institucional da Estácio**:

- Azul Principal: `#002855`
- Branco: `#FFFFFF`
- Acessórios: tons de cinza e azul claro

---

## 📦 Instalação

```bash
git clone https://github.com/JulioFonseca/uniteca.git
cd uniteca
npm install
npm start
```

> 💡 Você pode testar o projeto diretamente no [Expo Go](https://expo.dev) ou usando o [Snack](https://snack.expo.dev).

---

## 📌 Status do Projeto

🚧 Em desenvolvimento — protótipo funcional em progresso.

---

## 📄 Licença

Este projeto é de uso acadêmico e não possui licença de distribuição comercial.

---