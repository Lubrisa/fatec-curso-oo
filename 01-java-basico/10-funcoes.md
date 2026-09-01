# 10. Funções

## O Que É uma Função

No [capítulo sobre o paradigma
procedural](../00-fundamentos/03-paradigma-procedural.md) vimos que sub-rotinas
são blocos de código nomeados que podem ser chamados de qualquer ponto do
programa — a principal ferramenta para evitar repetição e organizar a lógica em
partes com sentido próprio.

Esse conceito recebe nomes diferentes dependendo da linguagem e do contexto:

- **Sub-rotina** é o termo histórico genérico para qualquer bloco nomeado e
  reutilizável.
- **Procedimento** (_procedure_) é uma sub-rotina que executa ações mas não
  devolve um valor.
- **Função** é uma sub-rotina que calcula e devolve um valor.

Na prática, a maioria das linguagens modernas usa _função_ para os dois casos,
independentemente de haver retorno.

## O Que É um Método

Em Java — e nas linguagens orientadas a objetos em geral — funções não existem
de forma independente: todo bloco de código nomeado precisa estar associado a
uma classe. Quando uma função pertence a uma classe ou a um objeto criado a
partir dela, chamamos de **método**.

Há dois tipos de método:

**Métodos estáticos** pertencem à classe em si. Você já encontrou alguns:

```java
String.valueOf(42);      // converte int para String
Integer.parseInt("42");  // converte String para int
Arrays.sort(arr);        // ordena um array
```

**Métodos de instância** pertencem a um objeto específico e precisam ser
invocados a partir de uma instância. Você também já os encontrou — [no capítulo
sobre `String`](04-string.md), todos os métodos que chamamos diretamente num
valor de texto são de instância:

```java
String text = "hello";
text.toUpperCase();   // método de instância — chamado no objeto text
text.contains("ell"); // idem
```

## Definindo um Método

Todo método tem quatro elementos: tipo de retorno, nome, parâmetros e corpo.

**Método estático:**

```java
static double circleArea(double radius) { // double: retorno; circleArea: nome; double radius: parâmetro
    return Math.PI * radius * radius;     // corpo
}
```

**Método de instância** — igual em estrutura, mas sem `static`:

```java
double getBalance() {
    return balance;
}
```

O **tipo de retorno** é declarado antes do nome. Use `void` quando o método não
devolve nada:

```java
static void printLine(String text) {
    System.out.println(">>> " + text);
}
```

> **Convenção de Nomenclatura**
>
> Nomes de métodos usam **camelCase**: primeira palavra em minúsculo, cada
> palavra seguinte começa em maiúsculo (`circleArea`, `getBalance`,
> `printLine`).
>
> Por representarem ações ou operações, métodos costumam ser nomeados com verbos
> ou expressões verbais (`deposit`, `withdraw`, `calculateTotal`).

Os **parâmetros** são variáveis locais que recebem os valores passados pelo
chamador — existem apenas dentro do método. Quando você chama `circleArea(5.0)`,
o valor `5.0` é o **argumento** passado para o parâmetro `radius`.

O **`return`** devolve um valor e encerra o método imediatamente. Qualquer
código que venha depois e não tenha como ser evitado é erro de compilação:

```java
static double circleArea(double radius) {
    return Math.PI * radius * radius;

    System.out.println("done"); // erro: unreachable statement
}
```

O compilador só reclama quando tem certeza que o código nunca será alcançado.
Com um condicional, ambos os caminhos são possíveis, então não há erro:

```java
static int abs(int n) {
    if (n < 0) return -n;

    return n; // atingível quando n >= 0
}
```

> **Guard clauses** são um padrão que usa `return` antecipado para tratar casos
> especiais logo no início do método, antes da lógica principal. Em vez de
> aninhar o caminho feliz dentro de um `if`, retornamos cedo quando a condição
> não é satisfeita:
>
> ```java
> // sem guard clause — lógica principal aninhada
> static double sqrt(double n) {
>     if (n >= 0) {
>         return Math.sqrt(n);
>     } else {
>         throw new IllegalArgumentException("negative number");
>     }
> }
>
> // com guard clause — caso inválido eliminado no início
> static double sqrt(double n) {
>     if (n < 0) throw new IllegalArgumentException("negative number");
>
>     return Math.sqrt(n);
> }
> ```
>
> O resultado é o mesmo, mas o segundo é mais fácil de ler: o leitor descarta o
> caso inválido de imediato e segue para a lógica sem carregar o `else` em
> mente.

## Invocando um Método

**Métodos estáticos** são chamados pelo nome da classe. Dentro da própria
classe, o prefixo pode ser omitido:

```java
// de outra classe
double area = ShapeUtils.circleArea(5.0);

// dentro da própria ShapeUtils
double area = circleArea(5.0);
```

**Métodos de instância** exigem um objeto. Para criar um objeto, usamos `new`
seguido do nome da classe — como criamos objetos de forma completa vai ser
explicado no módulo de orientação a objetos:

```java
BankAccount account = new BankAccount(); // cria o objeto
account.deposit(500.0);                  // invoca o método no objeto
System.out.println(account.getBalance()); // 500.0
```

---

<a href="09-lacos.md">← Laços</a>

<p align="right"><a href="11-escopo.md">Próximo: Escopo →</a></p>
