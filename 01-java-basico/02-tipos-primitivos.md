# 2. Tipos Primitivos

## O Que É um Tipo Primitivo

Em Java, uma variável pode guardar seu valor de duas formas diferentes:
_diretamente_ ou _por referência_ (um endereço que aponta para o valor real na
memória). Tipos primitivos pertencem ao primeiro grupo — o valor fica armazenado
diretamente na variável, sem indireção.

Java tem exatamente **oito tipos primitivos**, organizados em quatro famílias:

| Família         | Tipos                          |
| --------------- | ------------------------------ |
| Inteiros        | `byte`, `short`, `int`, `long` |
| Ponto flutuante | `float`, `double`              |
| Booleano        | `boolean`                      |
| Caractere       | `char`                         |

## Inteiros

Os quatro tipos inteiros diferem apenas no tamanho que ocupam em memória — e,
consequentemente, no intervalo de valores que conseguem representar:

| Tipo    | Tamanho | Mínimo                     | Máximo                    |
| ------- | ------- | -------------------------- | ------------------------- |
| `byte`  | 8 bits  | −128                       | 127                       |
| `short` | 16 bits | −32.768                    | 32.767                    |
| `int`   | 32 bits | −2.147.483.648             | 2.147.483.647             |
| `long`  | 64 bits | −9.223.372.036.854.775.808 | 9.223.372.036.854.775.807 |

Na prática, `int` é o tipo inteiro padrão do Java — é o que o compilador assume
quando você escreve um número inteiro sem sufixo. Use `long` quando o valor pode
ultrapassar os ~2 bilhões do `int`:

```java
int transactionCount = 42;
long accountNumber = 9876543210L;  // o sufixo L indica que é um long
```

O sufixo `L` (maiúsculo ou minúsculo, mas maiúsculo é preferível para evitar
confusão com o número 1) é obrigatório para literais `long` que ultrapassam o
intervalo do `int`.

## Ponto Flutuante

Tipos de ponto flutuante buscam representar números racionais — ou seja, números
com casas decimais. Java oferece dois tamanhos, com diferentes graus de
precisão:

| Tipo     | Tamanho | Precisão aproximada  |
| -------- | ------- | -------------------- |
| `float`  | 32 bits | ~7 dígitos decimais  |
| `double` | 64 bits | ~15 dígitos decimais |

`double` é o tipo de ponto flutuante padrão do Java. Literais sem sufixo são
sempre `double`:

```java
double balance = 1500.50;     // double — padrão
float interestRate = 0.035f;  // sufixo f obrigatório para float
```

Essa representação não é exata para todas as frações decimais, o que pode causar
imprecisões em cálculos. Para valores monetários, o tipo correto é
`java.math.BigDecimal`. Usamos `double` neste curso por simplicidade didática.

> **Para saber mais:** a especificação **IEEE 754** define como números de ponto
> flutuante são armazenados em binário. Entendê-la ajuda a compreender a origem
> das imprecisões — e as estratégias que foram desenvolvidas para mitigá-las.

## Booleano

`boolean` representa um valor lógico: `true` ou `false`. É o resultado natural
de comparações e condições:

```java
boolean isActive = true;
boolean hasEnoughBalance = balance >= 100.0;
```

Ao contrário de algumas linguagens, em Java `boolean` nunca é representado como
0 ou 1 — não há conversão implícita entre `boolean` e inteiros.

## Caractere

`char` representa um único caractere Unicode de 16 bits. Literais de `char` usam
aspas simples:

```java
char accountType = 'S';  // 'S' de Savings, 'C' de Checking
char newline = '\n';     // sequência de escape
char heart = '♥';        // caractere Unicode diretamente
char pi = '\u03A0';      // caractere Unicode em hexadecimal, equivalente a 'Π'
```

## Literais: Formas de Escrever Valores

Além da notação decimal comum, Java aceita formas alternativas para literais
inteiros. As três linhas abaixo declaram exatamente o mesmo valor — `255` —
apenas escritos em bases diferentes:

```java
int decimal     = 255;
int hexadecimal = 0xFF;       // prefixo 0x — base 16
int binary      = 0b11111111; // prefixo 0b — base 2 (Java 7+)
```

Hexadecimal e binário são raros no código de negócio cotidiano, mas aparecem em
contextos específicos onde a base facilita a leitura:

- **Hex:** cores RGB (`0xFF5733`), identificadores de protocolo, assinaturas de
  formato de arquivo (_magic bytes_)
- **Binário:** bitmasks e flags de permissão, onde cada bit representa uma opção
  independente

Para melhorar a legibilidade de números grandes, você pode usar underscores como
separador visual (Java 7+):

```java
long population  = 8_000_000_000L;
double pi        = 3.141_592_653;
int redComponent = 0xFF_57_33;  // componentes R, G, B separados
```

## Valores Padrão

Quando um campo de uma classe é declarado sem valor inicial, o Java atribui um
valor padrão automaticamente:

| Tipo                   | Valor padrão      |
| ---------------------- | ----------------- |
| `byte`, `short`, `int` | `0`               |
| `long`                 | `0L`              |
| `float`                | `0.0f`            |
| `double`               | `0.0`             |
| `boolean`              | `false`           |
| `char`                 | `'\u0000'` (NULL) |

Variáveis locais (dentro de métodos) **não** recebem valor padrão — o compilador
exige que você as inicialize antes de usar.

## Quais Você Mais Vai Usar

Na grande maioria do código Java do dia a dia:

- **`int`** para contagens, índices e quantidades que cabem em ~2 bilhões
- **`long`** para identificadores, timestamps e valores maiores
- **`double`** para valores decimais em geral
- **`boolean`** para flags e resultados de condições
- **`char`** com menos frequência — textos usam `String`, não arrays de `char`

`byte`, `short` e `float` aparecem principalmente em contextos com restrição de
memória (processamento de imagens, protocolos de rede, arquivos binários).

---

<a href="01-instalacao-e-primeiro-programa.md">← Instalação e Primeiro
Programa</a>

<p align="right"><a href="03-tipos-por-referencia.md">Próximo: Tipos por Referência →</a></p>
