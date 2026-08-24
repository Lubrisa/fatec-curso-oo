# 12. Exceções

## O Que É uma Exceção

Uma exceção é um sinal de que algo inesperado aconteceu durante a execução do
programa. Quando o Java não consegue continuar normalmente — divisão por zero,
referência nula, arquivo não encontrado — ele lança uma exceção, interrompendo o
fluxo normal.

Se a exceção não for capturada, ela sobe pela pilha de chamadas até chegar ao
topo e encerrar o programa, exibindo um _stack trace_ no console.

> **Stack trace** é o relatório que o Java imprime quando uma exceção não é
> tratada. Ele mostra a sequência de métodos que estavam em execução no momento
> do erro — do mais interno (onde a exceção foi lançada) ao mais externo (ponto
> de entrada do programa). Cada linha indica o arquivo e o número da linha
> correspondente, o que permite localizar exatamente onde o problema ocorreu.
> Aprender a ler um stack trace é uma das habilidades mais práticas do dia a dia
> em Java.

## Hierarquia de Exceções

Todas as exceções em Java herdam de `Throwable`, que se divide em dois ramos:

- **`Error`** — problemas graves da JVM que o programa normalmente não consegue
  tratar: falta de memória (`OutOfMemoryError`), stack overflow
  (`StackOverflowError`). Não tente capturar `Error`.
- **`Exception`** — situações que o programa pode detectar e tratar.

`Exception` se divide em:

- **Checked exceptions** — o compilador exige que você as trate ou declare.
  Representam falhas previsíveis e recuperáveis: arquivo não encontrado, falha
  de rede. Exemplos: `IOException`, `SQLException`.
- **Unchecked exceptions** — herdam de `RuntimeException`. O compilador não
  exige tratamento. Representam bugs de programação: acesso a referência nula,
  índice fora dos limites. Exemplos: `NullPointerException`,
  `ArrayIndexOutOfBoundsException`, `IllegalArgumentException`.

## `try-catch-finally`

```java
try {
    // código que pode lançar uma exceção
    int result = 10 / divisor;
} catch (ArithmeticException e) {
    // executado se a exceção ocorrer
    System.out.println("Divisão por zero: " + e.getMessage());
} finally {
    // executado sempre — com ou sem exceção
    System.out.println("Operação concluída.");
}
```

- O bloco `catch` captura exceções do tipo especificado (e subtipos).
- O bloco `finally` é opcional e executa sempre, mesmo que uma exceção não
  capturada continue subindo pela pilha. É usado para liberar recursos.
- Você pode ter múltiplos `catch` para tipos diferentes:

```java
try {
    String input = readInput();
    int value = Integer.parseInt(input);
} catch (NullPointerException e) {
    System.out.println("Entrada nula.");
} catch (NumberFormatException e) {
    System.out.println("Entrada não é um número: " + e.getMessage());
}
```

Para capturar mais de um tipo no mesmo bloco, use `|`:

```java
} catch (NullPointerException | NumberFormatException e) {
    System.out.println("Entrada inválida: " + e.getMessage());
}
```

## Lançando Exceções

Use `throw` para lançar uma exceção explicitamente — útil para comunicar que uma
precondição foi violada:

```java
void withdraw(double amount) {
    if (amount <= 0) {
        throw new IllegalArgumentException("Valor de saque deve ser positivo: " + amount);
    }
    if (amount > balance) {
        throw new IllegalStateException("Saldo insuficiente.");
    }
    balance -= amount;
}
```

Prefira `IllegalArgumentException` para parâmetros inválidos e
`IllegalStateException` para operações inválidas dado o estado atual do objeto.
Inclua informações úteis na mensagem — quem vai ler o stack trace vai agradecer.

## Checked Exceptions e `throws`

Métodos que podem lançar checked exceptions precisam declará-las na assinatura
com `throws`, ou capturá-las internamente:

```java
void readFile(String path) throws IOException {
    // IOException é checked — declaramos que este método pode lançá-la
    Files.readAllLines(Path.of(path));
}
```

Quem chamar `readFile` será obrigado pelo compilador a tratar ou propagar a
`IOException`.

## Boas Práticas

**Não engula exceções.** Um `catch` vazio esconde problemas e torna bugs
impossíveis de rastrear:

```java
try {
    // ...
} catch (Exception e) {
    // não faça isso — a exceção desaparece silenciosamente
}
```

**Capture o tipo mais específico possível.** `catch (Exception e)` captura tudo
— inclusive coisas que você não previa e não sabe tratar.

**Lance exceções com mensagens úteis.** A mensagem é o primeiro dado disponível
para quem está depurando o problema.

**Não use exceções para controle de fluxo.** Quando possível, valide os dados de
entrada antes de operar sobre eles — assim a exceção nunca chega a ser lançada:

```java
// errado — deixando a exceção decidir o fluxo:
void processAge(String input) {
    try {
        int age = Integer.parseInt(input);
        System.out.println("Idade: " + age);
    } catch (NumberFormatException e) {
        System.out.println("Entrada inválida.");  // situação previsível tratada como exceção
    }
}

// certo — valide antes, reserve a exceção para o verdadeiramente inesperado:
void processAge(String input) {
    if (input == null || !input.matches("\\d+")) {
        System.out.println("Entrada inválida.");
        return;
    }

    int age = Integer.parseInt(input);
    System.out.println("Idade: " + age);
}
```

Existem dois motivos para isso. O primeiro é de **leitura**: exceções quebram o
fluxo normal de execução e forçam quem lê o código a rastrear mentalmente o que
acontece em cada `catch` — um `if` simples é mais direto. O segundo é de
**custo**: quando uma exceção é lançada, a JVM precisa montar o stack trace
percorrendo a pilha de chamadas e localizar o bloco `catch` correspondente; é um
trabalho significativamente mais caro que uma comparação com `if`.

> **Dica avançada:** em alguns contextos, nem lançar nem capturar exceções é a
> melhor opção. Uma alternativa é usar um tipo de retorno que representa
> explicitamente sucesso ou falha — por exemplo, um `boolean`, um `Optional`, ou
> um tipo customizado como `Result<T>`. Isso mantém o fluxo de controle visível
> e legível para quem chama o método, sem depender de exceções para comunicar
> situações esperadas. É um padrão mais avançado, mas vale ter em mente que
> exceções não são a única forma de sinalizar que algo não saiu como esperado.

<details>
<summary>try-with-resources</summary>

Recursos que precisam ser fechados após o uso — conexões, arquivos, streams —
implementam a interface `AutoCloseable`. O bloco `try-with-resources` garante
que o recurso seja fechado automaticamente ao sair do bloco, mesmo que uma
exceção ocorra:

```java
try (BufferedReader reader = new BufferedReader(new FileReader("data.txt"))) {
    String line = reader.readLine();
    System.out.println(line);
}
// reader.close() é chamado automaticamente aqui
```

Isso substitui o padrão antigo de fechar recursos manualmente no `finally`, que
era verboso e propenso a erros.

</details>

---

<a href="11-escopo.md">← Escopo</a>

<p align="right"><a href="13-arrays.md">Próximo: Arrays →</a></p>
