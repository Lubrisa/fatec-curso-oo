# 14. Listas

## O Que É uma Lista

Uma lista é uma coleção ordenada que aceita elementos duplicados e cresce ou
encolhe dinamicamente. Ao contrário de arrays, você não precisa definir o
tamanho na criação.

A interface `List<E>` define o contrato; `ArrayList` é a implementação mais
usada — internamente usa um array que é redimensionado automaticamente quando
necessário.

> O `<E>` indica que `List` é um tipo genérico — assunto para outro momento. Por
> ora, basta saber que você substitui `E` pelo tipo dos elementos (`String`,
> `Integer`, etc.) e o compilador passa a garantir que todas as operações do
> conjunto respeitam esse tipo.

## Criando Listas

```java
import java.util.ArrayList;
import java.util.List;

// lista mutável vazia
List<String> cities = new ArrayList<>();

// lista mutável a partir de valores iniciais
List<String> cities = new ArrayList<>(List.of("São Paulo", "Rio de Janeiro"));

// lista imutável — não aceita add, remove ou set
List<String> fixed = List.of("São Paulo", "Rio de Janeiro", "Belo Horizonte");
```

`List.of(...)` cria uma lista imutável. Qualquer tentativa de modificá-la lança
`UnsupportedOperationException`. Use quando o conteúdo não deve mudar.

## Operações Fundamentais

```java
List<String> cities = new ArrayList<>();

cities.add("São Paulo");           // adiciona ao final
cities.add(0, "Brasília");         // insere na posição 0, desloca os demais
cities.get(0);                     // "Brasília" — acesso por índice
cities.set(0, "Curitiba");         // substitui o elemento na posição 0
cities.remove("São Paulo");        // remove por valor (primeira ocorrência)
cities.remove(0);                  // remove por índice
cities.size();                     // quantidade de elementos
cities.isEmpty();                  // true se vazia
cities.contains("São Paulo");      // true se o elemento existe
cities.indexOf("São Paulo");       // posição da primeira ocorrência, -1 se não encontrar
cities.clear();                    // remove todos os elementos
```

## Iteração

Com `for-each` — preferido quando o índice não importa:

```java
for (String city : cities) {
    System.out.println(city);
}
```

Com `for` clássico — quando o índice é necessário:

```java
for (int i = 0; i < cities.size(); i++) {
    System.out.println(i + ": " + cities.get(i));
}
```

## `ArrayList` vs `LinkedList`

As duas implementações mais comuns de `List` têm estruturas internas diferentes,
o que resulta em perfis de performance distintos.

### `ArrayList`

`ArrayList` usa um array internamente. O objeto guarda dois campos: quantos
elementos estão em uso e um ponteiro para o array que guarda os dados de fato.
Dizemos que a capacidade de um `ArrayList` é o tamanho do array interno, ditando
quando o redimensionamento deverá ocorrer.

![Estrutura interna do ArrayList](./imgs/arraylist.png)

Na imagem: `meuArrayList` tem 4 elementos (`size = 4`) e `items` aponta para um
array de 16 posições. As 12 posições não usadas ficam `null`. Esse espaço extra
evita um redimensionamento a cada `add`.

Os elementos ficam em posições contíguas de memória — daí o acesso O(1) por
índice e o custo de iteração baixo.

<details>
<summary>O que acontece quando a capacidade esgota</summary>

Quando todos os slots do array interno estão ocupados e você adiciona mais um
elemento, o `ArrayList` aloca um novo array maior (tipicamente o dobro do
tamanho atual), copia todos os elementos para ele e atualiza o ponteiro `items`.
O array antigo fica sem referência no heap e aguarda o _garbage collector_.

![ArrayList após redimensionamento](./imgs/arraylist-resized.png)

Na imagem: o array interno dobrou de 16 para 32 posições. `size` passou para 17
(os 16 anteriores mais o novo elemento). O ponteiro `items` agora aponta para o
novo array; o array antigo (em baixo) ainda existe no heap, mas nenhuma variável
o referencia — o GC pode coletá-lo. Esse custo de cópia acontece raramente, por
isso dizemos que `add` ao final é O(1) **amortizado**.

</details>

### `LinkedList`

`LinkedList` usa uma lista duplamente encadeada: cada elemento é um nó
independente com três campos — um ponteiro para o nó anterior, um ponteiro para
o próximo e o valor em si. O objeto `LinkedList` em si guarda três campos: o
ponteiro para o primeiro nó, ponteiro para o último e a quantidade de elementos.
Cada nó é alocado separadamente no heap, podendo estar em qualquer endereço.

![Estrutura interna do LinkedList](./imgs/linkedlist.png)

Na imagem, `meuLinkedList` aponta para o primeiro nó (valor 1, `prev = null`) e
para o último (valor 9, `next = null`). Os demais nós, com valores 7 e 12, estão
espalhados pelo heap — não há garantia de posições contíguas. Os ponteiros
`prev` e `next` conectam cada nó ao anterior e ao próximo da sequência.

Para visualizar a ordem lógica, imagine os mesmos nós dispostos em linha:

![LinkedList com nós em ordem lógica](./imgs/linkedlist-ordenado.png)

Inserir ou remover no início ou no final é O(1) — basta atualizar os ponteiros
do nó vizinho. O custo aparece no acesso por índice: para chegar à posição `i`,
é preciso percorrer os nós um a um desde a cabeça (ou a cauda, se `i` estiver
mais próximo do final) — O(n).

### Comparação

A tabela abaixo resume a complexidade das operações principais:

| Operação               | `ArrayList` | `LinkedList`                 |
| ---------------------- | ----------- | ---------------------------- |
| `get(i)` / `set(i, v)` | O(1)        | O(n)                         |
| `add(v)` — final       | O(1)\*      | O(1)                         |
| `add(0, v)` — início   | O(n)        | O(1)                         |
| `add(i, v)` — meio     | O(n)        | O(n)\*\*                     |
| `remove` — final       | O(1)        | O(1)                         |
| `remove` — início      | O(n)        | O(1)                         |
| `remove` — meio        | O(n)        | O(n)\*\*                     |
| Memória por elemento   | compacta    | overhead de 2 ponteiros + nó |

\* O(1) amortizado — ocasionalmente O(n) quando o array interno precisa crescer.  
\*\* O(n) para localizar a posição, O(1) para a operação em si após localizar.

Na prática, comece sempre com `ArrayList`. Seu acesso O(1) por índice e a
localidade de memória tornam-no mais eficiente na maioria dos casos reais.
Considere `LinkedList` apenas se o perfil de uso for dominado por inserções e
remoções no início da lista — e após medir que o custo de acesso por índice não
é relevante no seu contexto.

## Convertendo entre Array e Lista

APIs mais antigas frequentemente retornam ou recebem arrays; a API de coleções
trabalha com `List`. As conversões entre os dois são diretas:

```java
// array → lista (imutável)
String[] array = {"SP", "RJ", "MG"};
List<String> list = Arrays.asList(array);

// lista → array
String[] back = list.toArray(new String[0]);
```

---

<a href="13-arrays.md">← Arrays</a>

<p align="right"><a href="15-conjuntos.md">Próximo: Conjuntos →</a></p>
