# 14. Listas

## O Que É uma Lista

Uma lista é uma coleção ordenada que aceita elementos duplicados e cresce ou
encolhe dinamicamente. Ao contrário de arrays, você não precisa definir o
tamanho na criação.

A interface `List<E>` define o contrato; `ArrayList` é a implementação mais
utilizada no dia a dia.

> O `<E>` indica que `List` é um tipo genérico — explorado em profundidade no
> [Guia de Generics](../03-java-in-depth/02-generics/01-fundamentos.md). Por ora,
> basta saber que você substitui `E` pelo tipo dos elementos (`String`,
> `Integer`, `BankAccount`, etc.) e o compilador passa a garantir que todas as
> operações respeitam esse tipo.

## Criando Listas

```java
import java.util.ArrayList;
import java.util.List;

// 1. Lista mutável vazia (padrão)
List<String> cities = new ArrayList<>();

// 2. Lista mutável com elementos iniciais
List<String> cities = new ArrayList<>(List.of("São Paulo", "Rio de Janeiro"));

// 3. Lista imutável — não aceita add, remove ou set
List<String> fixed = List.of("São Paulo", "Rio de Janeiro", "Belo Horizonte");
```

`List.of(...)` cria uma lista imutável. Qualquer tentativa de modificá-la lança
`UnsupportedOperationException`. Use quando a lista for apenas para leitura.

## Operações Fundamentais

```java
List<String> cities = new ArrayList<>();

cities.add("São Paulo");           // adiciona ao final
cities.add(0, "Brasília");         // insere na posição 0, deslocando os demais
cities.get(0);                     // "Brasília" — acesso por índice
cities.set(0, "Curitiba");         // substitui o elemento na posição 0
cities.remove("São Paulo");        // remove por valor (primeira ocorrência)
cities.remove(0);                  // remove por índice
cities.size();                     // quantidade de elementos
cities.isEmpty();                  // true se vazia
cities.contains("São Paulo");      // true se o elemento existe
cities.indexOf("São Paulo");       // posição da primeira ocorrência (-1 se não encontrar)
cities.clear();                    // remove todos os elementos
```

## Iteração

Com `for-each` — a forma preferida e mais segura:

```java
for (String city : cities) {
    System.out.println(city);
}
```

Com `for` clássico indexado — quando você realmente precisa da posição `i`:

```java
for (int i = 0; i < cities.size(); i++) {
    System.out.println(i + ": " + cities.get(i));
}
```

## Convertendo entre Array e Lista

```java
// Array → Lista
String[] array = {"SP", "RJ", "MG"};
List<String> list = Arrays.asList(array);

// Lista → Array
String[] back = list.toArray(new String[0]);
```

## `ArrayList` vs `LinkedList`

Java oferece duas implementações principais para a interface `List`, com
estratégias de armazenamento e perfis de performance bem diferentes:

1. **`ArrayList` (Baseado em Array Dinâmico):**
   - Os elementos ficam em **posições contíguas de memória** (como uma fileira
     de cadeiras no cinema).
   - **Ponto forte:** Acesso instantâneo a qualquer posição por índice (`get(i)`
     em $O(1)$).
   - **Ponto fraco:** Inserir no início (`add(0, v)`) exige empurrar todos os
     outros elementos para a direita ($O(n)$).

2. **`LinkedList` (Baseado em Nós Encadeados):**
   - Cada elemento é um **nó independente** no Heap que aponta para o anterior e
     para o próximo (como as locomotivas de um trem).
   - **Ponto forte:** Inserir ou remover nas pontas (`addFirst`, `removeFirst`)
     é instantâneo ($O(1)$), pois basta atualizar os ponteiros do nó vizinho.
   - **Ponto fraco:** Para buscar `get(i)`, o Java precisa percorrer a corrente
     nó por nó até a posição desejada ($O(n)$).

---

> 🔍 **Aprofundamento — Abrindo a Caixa Preta:**
>
> Quer ver como os elementos estão dispostos em memória, o que acontece quando
> precisamos adicionar novos elementos, e mais detalhes de como as listas
> funcionam internamente? Confira os apêndices abaixo:
>
> - 📄 [Apêndice: Anatomia do ArrayList](estruturas/arraylist.md)
> - 📄 [Apêndice: Anatomia do LinkedList](estruturas/linkedlist.md)

### Tabela Comparativa de Complexidade

| Operação               | `ArrayList` | `LinkedList`                 |
| ---------------------- | ----------- | ---------------------------- |
| `get(i)` / `set(i, v)` | **O(1)**    | O(n)                         |
| `add(v)` — final       | **O(1)\***  | **O(1)**                     |
| `add(0, v)` — início   | O(n)        | **O(1)**                     |
| `add(i, v)` — meio     | O(n)        | O(n)                         |
| `remove` — final       | **O(1)**    | **O(1)**                     |
| `remove` — início      | O(n)        | **O(1)**                     |
| Memória por elemento   | Compacta    | Overhead de 2 ponteiros + nó |

Onde:

- $n$ é o número de elementos na lista.

\* _Custo constante amortizado._

> **Regra prática:**
>
> **Comece sempre com `ArrayList`**. Seu acesso instantâneo por índice e menor
> uso de memória fazem dele a escolha certa em 99% dos sistemas reais. Considere
> `LinkedList` apenas se o perfil de uso da sua aplicação for dominado por
> inserções e remoções contínuas no início da fila.

---

<a href="13-arrays.md">← Arrays</a>

<p align="right"><a href="15-conjuntos.md">Próximo: Conjuntos →</a></p>
