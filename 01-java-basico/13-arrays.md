# 13. Arrays

## O Que É um Array

Um array é uma sequência de elementos do mesmo tipo, armazenados em posições
contíguas de memória. O tamanho é definido na criação e não pode ser alterado
depois.

```java
int[] scores = new int[5];  // array de 5 inteiros, todos inicializados com 0
```

Arrays são tipos por referência: a variável `scores` aponta para o array no
heap, não guarda os elementos diretamente.

## Declaração e Inicialização

Há três formas de criar um array:

```java
// 1. tamanho fixo — elementos recebem valor padrão (0, false, null)
int[] scores = new int[5];

// 2. inicializador literal — tamanho inferido pela quantidade de elementos
int[] primes = {2, 3, 5, 7, 11};

// 3. new com inicializador — equivalente ao anterior, mais verboso
int[] primes = new int[]{2, 3, 5, 7, 11};
```

## Acesso por Índice

Elementos são acessados pelo índice, que começa em `0`:

```java
int[] scores = {10, 20, 30, 40, 50};

scores[0]  // 10 — primeiro elemento
scores[4]  // 50 — último elemento
scores[2] = 99;  // substitui o terceiro elemento
```

Acessar um índice fora dos limites lança `ArrayIndexOutOfBoundsException`:

```java
scores[5]  // erro em tempo de execução: índice 5 não existe em um array de tamanho 5
```

O tamanho do array está disponível na propriedade `length`:

```java
scores.length  // 5
```

## Iteração

Com `for` clássico, quando o índice é necessário:

```java
for (int i = 0; i < scores.length; i++) {
    System.out.println("Posição " + i + ": " + scores[i]);
}
```

Com `for-each`, quando só o valor importa:

```java
for (int score : scores) {
    System.out.println(score);
}
```

## Arrays de Referência

Arrays podem guardar qualquer tipo — inclusive referências a objetos. Cada
posição não inicializada recebe `null`:

```java
BankAccount[] accounts = new BankAccount[3];
accounts[0] = new BankAccount(1000.0);
accounts[1] = new BankAccount(500.0);
// accounts[2] ainda é null
```

## Arrays Multidimensionais

Java representa matrizes como arrays de arrays:

```java
int[][] matrix = new int[3][4];  // 3 linhas, 4 colunas
matrix[0][0] = 1;
matrix[2][3] = 9;
```

Com inicializador literal:

```java
int[][] grid = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};
```

Arrays multidimensionais em Java não precisam ter linhas do mesmo tamanho — cada
linha é um array independente. Isso raramente é intencional; se trabalhar com
matrizes regulares, documente que todas as linhas têm o mesmo comprimento.

## Métodos Úteis — Classe `Arrays`

A classe `java.util.Arrays` oferece operações comuns sobre arrays que você não
precisará reimplementar:

```java
import java.util.Arrays;

int[] numbers = {5, 2, 8, 1, 9, 3};

Arrays.sort(numbers);                  // ordena in-place: [1, 2, 3, 5, 8, 9]
Arrays.binarySearch(numbers, 5);       // 3 — posição do valor (array deve estar ordenado)
Arrays.fill(numbers, 0);               // preenche todos com 0: [0, 0, 0, 0, 0, 0]

int[] copy = Arrays.copyOf(numbers, 3);         // [0, 0, 0] — cópia com novo tamanho
int[] range = Arrays.copyOfRange(numbers, 1, 4); // [0, 0, 0] — cópia do intervalo [1, 4)

Arrays.toString(numbers);  // "[0, 0, 0, 0, 0, 0]" — útil para imprimir o conteúdo
```

Para comparar dois arrays por conteúdo (não por referência), use
`Arrays.equals`:

```java
int[] a = {1, 2, 3};
int[] b = {1, 2, 3};

a == b;               // false — referências diferentes
Arrays.equals(a, b);  // true — conteúdo idêntico
```

## Limitações e Alternativas

O tamanho fixo é a limitação central dos arrays. Para coleções que crescem ou
encolhem dinamicamente, Java oferece a API de coleções — `List`, `Set`, `Map` —
que veremos nos próximos capítulos.

Arrays ainda são a escolha certa quando o tamanho é fixo e conhecido, o
desempenho é crítico, ou você está trabalhando próximo a APIs de baixo nível.

---

<a href="12-excecoes.md">← Exceções</a>

<p align="right"><a href="14-listas.md">Próximo: Listas →</a></p>
