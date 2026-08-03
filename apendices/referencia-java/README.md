# Guia de Referência Rápida: Java Moderno

Este apêndice serve como um guia de referência rápida para a sintaxe,
utilitários e recursos do **Java Moderno (Java 25)**, servindo de apoio prático
para os módulos teóricos e exercícios do curso.

## 📚 Estrutura dos Documentos

Os arquivos estão organizados em uma sequência semi-linear lógica para
acompanhar a evolução no aprendizado da linguagem:

1. **`1-quickstart-java-25.md`**

   Instalação e verificação do JDK, estrutura de programas Java (comparando o
   `main` tradicional com o `main` de instância e classes implícitas no Java
   25), formas de execução (`java` direto vs. fluxo `javac` + `java`) e
   organização com pacotes (`package` e `import`).

2. **`2-dados-variaveis-expressoes.md`**

   Tipos primitivos e por classe (`Object`, `String`, Arrays), ciclo de vida de
   variáveis (declaração, atribuição e inicialização), inferência com `var`,
   constantes (`final` vs. `static final`), casting implícito e explícito,
   semântica de valor vs. referência (`null` e `NullPointerException`), além de
   operadores, Pattern Matching para `instanceof`, precedência e
   associatividade.

3. **`3-controle-de-fluxo-escopo-excessoes.md`**

   Estruturas condicionais (`if`/`else`, `switch`), loops (`for`, `while`),
   escopo de variáveis e ciclo de vida de objetos (Stack vs. Heap), tratamento
   de erros (`try`/`catch`/`finally`) e gerenciamento determinístico de recursos
   (`try-with-resources`).

4. **`4-classes-objetos.md`**

   Declaração de classes, atributos, métodos, o uso do `this`, construtores como
   guardiões de invariantes, membros estáticos (`static`), `Enums`, `Records` e
   o trio fundamental (`equals`, `hashCode`, `toString`).

5. **`5-aplicando-pilares-da-oo.md`**

   Os quatro pilares aplicados na prática: Encapsulamento (proteção de
   invariantes e prevenção de vazamento de referências), Abstração (`interface`
   e `abstract class`), Herança vs. Composição e Polimorfismo (despacho dinâmico
   e pattern matching).

6. **`6-bibliotecas-importantes.md`**

   Utilitários essenciais da API padrão: `Math`, `String` vs. `StringBuilder`,
   Framework de Coleções com Generics (`List`, `Set`, `Map`), API imutável de
   Data e Hora (`java.time`), `Optional<T>` e Entrada/Saída de dados (`IO`,
   `Scanner`, `Files` e `Streams`).

## 💡 Como Utilizar Este Guia

> **Nota sobre a Progressão do Conteúdo:**
>
> A leitura do guia foi desenhada para ser **semi-linear**. Embora os capítulos
> sigam uma ordem lógica de dificuldade e complexidade, **alguns tópicos
> avançados são apresentados antecipadamente** dentro do seu respectivo contexto
> para tornar cada arquivo uma referência completa sobre o tema.
>
> _Exemplo:_ No arquivo `3-controle-de-fluxo-escopo-excessoes.md`, além da
> sintaxe tradicional do `switch`, você encontrará conteúdos avançados como
> _Switch Expressions_, _Pattern Matching_ e cláusulas guardiãs (`when`).

Sinta-se à vontade para consultar este guia pontualmente sempre que tiver
dúvidas de sintaxe durante a resolução dos exercícios ou para relembrar decisões
de design idiomáticas do Java moderno!
