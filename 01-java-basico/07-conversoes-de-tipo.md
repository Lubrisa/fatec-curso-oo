# 7. Conversões de Tipo

## Conversão Implícita

Quando você atribui um valor de um tipo menor a uma variável de um tipo maior, o
Java faz a conversão automaticamente — não há risco de perda de dados:

```java
int intValue = 42;
long longValue = intValue;    // int cabe em long sem perda
double doubleValue = intValue; // int cabe em double sem perda
```

A hierarquia de tipos numéricos do menor para o maior é:

```text
byte → short → int → long → float → double
```

Qualquer atribuição que siga essa direção é aceita sem cast.

## Conversão Explícita (Cast)

Na direção contrária — de um tipo maior para um menor — o Java exige que você
declare explicitamente a intenção com um **cast**:

```java
double price = 9.99;
int truncated = (int) price;  // 9 — a parte decimal é descartada, não arredondada
```

O cast não arredonda: ele simplesmente remove a parte fracionária. Se o valor
não couber no tipo de destino, o resultado é um overflow silencioso — o Java não
lança exceção, apenas trunca os bits:

```java
int big = 130;
byte small = (byte) big;  // -126 — 130 não cabe em byte (-128 a 127), resultado imprevisível
```

Use cast com consciência. Quando o valor pode estar fora do intervalo do tipo de
destino, verifique antes de converter.

## Autoboxing e Unboxing

Java tem dois mundos paralelos de tipos: os **primitivos** (`int`, `double`,
`boolean`, `char`…) e as **classes wrapper** correspondentes (`Integer`,
`Double`, `Boolean`, `Character`…). As classes wrapper existem para quando
precisamos tratar um primitivo como um objeto — por exemplo, ao usar generics
(assunto para outro momento).

O Java converte automaticamente entre os dois quando necessário:

```java
Integer boxed = 42;  // autoboxing: int → Integer
int unboxed = boxed; // unboxing: Integer → int
```

Essa conversão é automática na maioria dos contextos, mas tem uma armadilha: os
tipos wrappers são tipos por referência e podem ser `null`. Fazer unboxing de
`null` lança `NullPointerException`:

```java
Integer value = null;
int x = value; // NullPointerException
```

## Conversão com `String`

Converter um primitivo para `String` pode ser feito com `String.valueOf` ou
simplesmente concatenando com uma string vazia — ambas as formas produzem o
mesmo resultado:

```java
int age = 30;
String s1 = String.valueOf(age);  // "30"
String s2 = age + "";             // "30" — funciona, mas String.valueOf é mais claro
```

O caminho inverso — de `String` para um tipo numérico — é feito pelos métodos de
parse das classes wrapper:

```java
String input = "42";
int parsed = Integer.parseInt(input);      // 42
double parsedD = Double.parseDouble("3.14"); // 3.14
```

Se a string não representar um número válido, `parseInt` e `parseDouble` lançam
`NumberFormatException` — uma das exceções mais comuns ao processar entradas do
usuário.

---

<a href="06-expressoes-e-operadores.md">← Operadores e Expressões</a>

<p align="right"><a href="08-condicionais.md">Próximo: Condicionais →</a></p>
