# 8. Condicionais

## `if` e `else`

A estrutura condicional mais fundamental: executa um bloco se a condição for
verdadeira, e opcionalmente outro bloco se for falsa.

```java
double balance = 500.0;
double amount = 300.0;

if (amount > balance) {
    System.out.println("Saldo insuficiente.");
} else {
    balance -= amount;
    System.out.println("Saque realizado.");
}
```

A condição deve ser uma expressão do tipo `boolean`. Qualquer expressão de
comparação ou lógica serve — desde que produza `true` ou `false`.

Para mais de duas possibilidades, encadeie com `else if`:

```java
int score = 75;

if (score >= 90) {
    System.out.println("A");
} else if (score >= 75) {
    System.out.println("B");
} else if (score >= 60) {
    System.out.println("C");
} else {
    System.out.println("F");
}
```

As condições são avaliadas de cima para baixo: o primeiro bloco cujo `if` for
verdadeiro é executado, e os demais são ignorados.

## Boas Práticas com `if`

**Sempre use chaves.** Omitir as chaves em blocos de uma única linha é
sintaticamente válido, mas cria armadilhas ao editar o código:

```java
// funciona, mas é perigoso:
if (amount > balance)
    System.out.println("Saldo insuficiente.");
    balance = 0;  // esta linha SEMPRE executa — não faz parte do if

// prefira sempre:
if (amount > balance) {
    System.out.println("Saldo insuficiente.");
}
```

**Evite condições negadas desnecessariamente.** `if (!isInvalid)` é mais difícil
de ler que `if (isValid)`. Quando possível, nomeie as variáveis booleanas de
forma que a condição positiva seja o caso normal.

**Retorne cedo para reduzir aninhamento.** Em vez de aninhar vários `if`s, trate
os casos inválidos primeiro e retorne:

```java
// muito aninhado:
boolean withdraw(double amount) {
    if (amount > 0) {
        if (amount <= balance) {
            balance -= amount;
            return true;
        }
    }
    return false;
}

// mais legível — casos inválidos saem cedo:
boolean withdraw(double amount) {
    if (amount <= 0) return false;

    if (amount > balance) return false;

    balance -= amount;
    return true;
}
```

## `switch`

O `switch` compara uma única expressão contra múltiplos valores. É uma
alternativa ao `else if` quando todos os ramos testam a mesma variável.

Historicamente, o `switch` aceitava apenas tipos numéricos inteiros (`byte`,
`short`, `int`), `char`, enums, e `String` (adicionado no Java 7). A partir do
Java 21, o suporte foi expandido para outros tipos, incluindo padrões mais
complexos — mas isso faz parte do switch moderno, mencionado ao final desta
seção.

```java
int day = 3;
String name;

switch (day) {
    case 1:
        name = "Segunda";
        break;
    case 2:
        name = "Terça";
        break;
    case 3:
        name = "Quarta";
        break;
    default:
        name = "Outro";
}
```

O bloco `default` executa quando nenhum `case` corresponde ao valor — é o
equivalente ao `else` final de uma cadeia de `if/else if`. Ele é opcional: se
omitido e nenhum `case` corresponder, o `switch` simplesmente não executa nada.

### Fall-through

Sem `break`, a execução continua para o próximo `case` independentemente do
valor — isso é chamado de **fall-through**. Na maioria das vezes é um bug:

```java
int day = 2;

switch (day) {
    case 1:
        System.out.println("Segunda");
    case 2:
        System.out.println("Terça");   // executa — corresponde ao valor
    case 3:
        System.out.println("Quarta");  // também executa — fall-through acidental!
    default:
        System.out.println("Outro");   // também executa
}
// imprime: Terça, Quarta, Outro
```

Em alguns casos, porém, o fall-through é intencional — útil quando vários
valores devem executar a mesma lógica:

```java
switch (day) {
    case 1:
    case 2:
    case 3:
    case 4:
    case 5:
        System.out.println("Dia útil");
        break;
    case 6:
    case 7:
        System.out.println("Fim de semana");
        break;
}
```

Quando usar fall-through intencionalmente, um comentário deixa claro que a
ausência de `break` não é descuido.

<details>
<summary>Switch moderno (Java 14+)</summary>

A partir do Java 14, o `switch` ganhou uma sintaxe mais expressiva — sem
`break`, sem fall-through acidental, podendo ser usado como expressão que
retorna um valor diretamente. O mesmo exemplo de dias da semana, reescrito:

```java
int day = 3;

String name = switch (day) {
    case 1 -> "Segunda";
    case 2 -> "Terça";
    case 3 -> "Quarta";
    case 4 -> "Quinta";
    case 5 -> "Sexta";
    case 6 -> "Sábado";
    case 7 -> "Domingo";
    default -> "Inválido";
};
```

Sem `break`, sem fall-through, e o resultado vai direto para a variável. O
compilador também verifica se todos os casos possíveis foram cobertos, o que
torna o código mais seguro. A partir do Java 21, o suporte a tipos foi expandido
para além de inteiros, `String` e enums. Vale buscar sobre `switch expressions`
na documentação oficial quando se sentir confortável com a sintaxe clássica.

</details>

---

<a href="07-conversoes-de-tipo.md">← Conversões de Tipo</a>

<p align="right"><a href="09-lacos.md">Próximo: Laços →</a></p>
