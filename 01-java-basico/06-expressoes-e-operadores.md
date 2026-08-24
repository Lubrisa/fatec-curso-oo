# 6. Expressões e Operadores

## Expressões

Uma **expressão** é qualquer trecho de código que produz um valor. `2 + 3`,
`account.getBalance()`, `age > 18` — todos são expressões. Operadores são os
símbolos que combinam valores dentro de uma expressão.

## Operadores Aritméticos

```java
int a = 10;
int b = 3;

a + b   // 13
a - b   // 7
a * b   // 30
a / b   // 3 — divisão inteira: o resultado é truncado (casas decimais são removidas), não arredondado
a % b   // 1 — resto da divisão (módulo)
```

A divisão entre dois inteiros sempre produz um inteiro. Se você precisa de um
resultado com casas decimais, ao menos um dos operandos deve ser `double` ou
`float`:

```java
10 / 3      // 3
10.0 / 3    // 3.3333...
(double) 10 / 3  // 3.3333... — conversão explícita, assunto do próximo capítulo
```

## Atribuição Composta e Incremento

Os operadores de atribuição composta combinam uma operação aritmética com a
atribuição:

```java
int score = 10;

score += 5;   // equivale a: score = score + 5  → 15
score -= 3;   // equivale a: score = score - 3  → 12
score *= 2;   // equivale a: score = score * 2  → 24
score /= 4;   // equivale a: score = score / 4  → 6
score %= 4;   // equivale a: score = score % 4  → 2
```

Para incrementar ou decrementar uma unidade, existem os operadores `++` e `--`.
Eles existem em duas formas — **prefixo** e **sufixo** — que diferem quando
usados dentro de uma expressão maior:

```java
int x = 5;

int a = ++x;  // prefixo: incrementa primeiro, depois usa — x = x + 1, a = x
int b = x++;  // sufixo: usa primeiro, depois incrementa — b = x, x = x + 1
```

Usados sozinhos em uma linha, as duas formas são equivalentes. A distinção só
importa quando o resultado é usado em uma expressão ou passado como argumento.

## Operadores de Comparação

Produzem um valor `boolean` (`true` ou `false`):

```java
int age = 20;

age == 20   // true  — igual
age != 18   // true  — diferente
age > 18    // true  — maior que
age < 18    // false — menor que
age >= 20   // true  — maior ou igual
age <= 19   // false — menor ou igual
```

`==` em referências compara endereços de memória, não conteúdo — conforme vimos
no [capítulo sobre `String`](04-string.md). Para comparar o conteúdo de objetos,
use `equals`.

## Operadores Lógicos

Combinam expressões booleanas:

```java
boolean isAdult = age >= 18;
boolean hasAccount = true;

isAdult && hasAccount   // true — AND: ambos precisam ser true
isAdult || hasAccount   // true — OR: basta um ser true
!isAdult                // false — NOT: inverte o valor
```

Java usa **avaliação em curto-circuito**: em um `&&`, se o lado esquerdo for
`false`, o lado direito nem é avaliado — o resultado já é `false`. Em um `||`,
se o lado esquerdo for `true`, o lado direito é ignorado. Isso tem consequências
práticas: é seguro escrever `obj != null && obj.isValid()`, porque se `obj` for
`null`, a segunda parte nunca é executada.

## Operador Ternário

O operador ternário é uma forma compacta de escrever uma escolha entre dois
valores. A sintaxe é `condição ? valor_se_true : valor_se_false`:

```java
int age = 20;
String label = age >= 18 ? "adulto" : "menor";  // "adulto"
```

É equivalente a:

```java
String label;
if (age >= 18) {
    label = "adulto";
} else {
    label = "menor";
}
```

Use o ternário quando a escolha for simples e caiba confortavelmente em uma
linha. Para condições mais complexas, o `if/else` tradicional é mais legível.

## Precedência e Associatividade

Quando uma expressão tem vários operadores, Java segue uma ordem de precedência
— semelhante à matemática, onde multiplicação vem antes de adição:

```java
2 + 3 * 4    // 14, não 20 — * tem precedência sobre +
(2 + 3) * 4  // 20 — parênteses forçam a ordem
```

Quando dois operadores têm a mesma precedência, entra a **associatividade** — a
direção em que a expressão é avaliada. A maioria dos operadores binários é
**associativa à esquerda**: avaliados da esquerda para a direita.

```java
10 - 3 - 2   // (10 - 3) - 2 = 5, não 10 - (3 - 2) = 9
```

A exceção são os operadores de atribuição, que são **associativos à direita**:

```java
int a, b, c;
a = b = c = 0;  // avaliado como a = (b = (c = 0))
```

A tabela completa de precedência e associatividade tem muitos níveis. A regra
prática é simples: **use parênteses sempre que a ordem não for óbvia**. Código
legível é melhor que código que depende de quem conhece a tabela de cor.

Para consultar a tabela oficial, a documentação do Oracle Java Tutorial cobre
todos os operadores com precedência e associatividade:
[docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html](https://docs.oracle.com/javase/tutorial/java/nutsandbolts/operators.html)

---

<a href="05-variaveis.md">← Variáveis</a>

<p align="right"><a href="07-conversoes-de-tipo.md">Próximo: Conversões de Tipo →</a></p>
