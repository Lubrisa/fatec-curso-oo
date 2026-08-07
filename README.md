# ☕ Curso de Programação Orientada a Objetos (POO)

Bem-vindo ao repositório oficial do curso de **Programação Orientada a
Objetos**!

Este material foi estruturado para guiar você desde os fundamentos conceituais
até a implementação prática e arquitetura de software, combinando embasamento
teórico agnóstico com o uso moderno da linguagem **Java**.

## 🎯 Proposta Pedagógica

O repositório adota uma abordagem em duas frentes fundamentais:

1. **Agnóstica de Linguagem:** O pensamento em Orientação a Objetos é ensinado
   como um **paradigma de modelagem e resolução de problemas**, independente de
   sintaxe ou recursos nativos de uma linguagem específica.
2. **Separação de Teoria e Prática:** A estrutura do projeto é dividida
   claramente em dois módulos (`teoria/` e `pratica/`), permitindo que você
   estude os conceitos com fluidez e depois aplique o conhecimento em código na
   sua IDE de preferência.

## 📁 Estrutura do Repositório

```text
fatec-curso-oo/
├── README.md                          <-- Portal do curso (você está aqui)
├── teoria/                            <-- Bloco de leitura e fundamentação
│   └── apendices/                     <-- Guias de linguagem (Java) e conteúdos adicionais
└── pratica/                           <-- Bloco de código e desenvolvimento mão na massa
    ├── exemplos/                      <-- Projetos guiados completos e documentados
    └── exercicios/                    <-- Atividades práticas e desafios de fixação
```

## 🗺️ Trilha de Aprendizado & Mapeamento de Módulos

Para uma experiência de estudo organizada, siga a sequência recomendada abaixo:

| Módulo / Assunto         | 📖 Teoria (Conceitos)                    | 💻 Exemplo Prático                               | ✏️ Exercícios |
| ------------------------ | ---------------------------------------- | ------------------------------------------------ | ------------- |
| 01. Paradigmas           | [01-paradigmas-de-programacao.md][mod-1] | N/A                                              | N/A           |
| 02. O que é um Objeto    | [02-o-que-e-um-objeto.md][mod-2]         | N/A                                              | N/A           |
| 03. Mecânica dos Objetos | [03-mecanica-dos-objetos.md][mod-3]      | [mecanica-dos-objetos/][ex-mecanica-dos-objetos] | N/A           |
| 04. Classes              | [04-classes.md][mod-4]                   | Em breve                                         | Em breve      |
| 05. Encapsulamento       | [05-encapsulamento.md][mod-5]            | Em breve                                         | Em breve      |
| 06. Abstração            | [06-abstracao.md][mod-6]                 | Em breve                                         | Em breve      |
| 07. Herança              | [07-heranca.md][mod-7]                   | Em breve                                         | Em breve      |
| 08. Polimorfismo         | [08-polimorfismo.md][mod-8]              | Em breve                                         | Em breve      |

## 🚀 Como Estudar Este Conteúdo

1. **Entenda o Conceito:** Comece lendo o capítulo correspondente no diretório
   [`teoria/`][conceitos]. Foque em compreender **o porquê** daquele conceito
   existir.
2. **Aprenda a Sintaxe:** Consulte o apêndice de referência no diretório
   [`teoria/apendices/referencia-java/`][referencia-java] para entender como
   expressar aquele conceito usando a sintaxe Java.
3. **Analise o Código:** Acesse o projeto correspondente em
   [`pratica/exemplos/`][exemplos] para ver uma aplicação completa do conceito
   funcionando.
4. **Pratique:** Abra o diretório [`pratica/exercicios/`][exercicios] e resolva
   os desafios propostos para fixar o aprendizado.

## 🛠️ Requisitos Técnicos

Para rodar os exemplos e fazer os exercícios práticos do curso, recomenda-se:

- **JDK 25+** (ou uma versão moderna do Java).
- **Compilador C (GCC/Clang)** _(opcional, apenas para o exemplo do Módulo 03 em
  `mecanica-dos-objetos/`)_.
- **IDE / Editor:** VS Code, IntelliJ IDEA ou Eclipse.

## 📄 Licença

Este projeto é um material educacional livre para estudos. Consulte o arquivo
[LICENSE](https://www.google.com/search?q=./LICENSE) para mais detalhes.

[conceitos]: ./teoria/
[referencia-java]: ./teoria/apendices/referencia-java/
[exemplos]: ./pratica/exemplos/
[exercicios]: ./pratica/exercicios/
[mod-1]: ./teoria/01-paradigmas-de-programacao.md
[mod-2]: ./teoria/02-o-que-e-um-objeto.md
[mod-3]: ./teoria/03-mecanica-dos-objetos.md
[mod-4]: ./teoria/04-classes.md
[mod-5]: ./teoria/05-encapsulamento.md
[mod-6]: ./teoria/06-abstracao.md
[mod-7]: ./teoria/07-heranca.md
[mod-8]: ./teoria/08-polimorfismo.md
[ex-mecanica-dos-objetos]: ./pratica/exemplos/mecanica-dos-objetos/
