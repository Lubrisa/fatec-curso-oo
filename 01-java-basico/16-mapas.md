# 16. Mapas

## O Que É um Mapa

Um mapa é uma coleção de pares **chave → valor**. Cada chave é única — inserir
um par com uma chave que já existe substitui o valor anterior. Os valores não
precisam ser únicos.

A interface `Map<K, V>` define o contrato, com dois parâmetros de tipo: `K` para
o tipo da chave e `V` para o tipo do valor. As três implementações mais comuns
são `HashMap`, `LinkedHashMap` e `TreeMap`.

> Assim como `List<E>` e `Set<E>`, o `Map<K, V>` é um tipo genérico — assunto
> para outro momento. Por ora, basta saber que você substitui `K` e `V` pelos
> tipos concretos (`String`, `Integer`, etc.) e o compilador garante que as
> operações respeitam esses tipos.

## Criando Mapas

```java
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

// sem requisito de ordem — implementação padrão
Map<String, Integer> scores = new HashMap<>();

// preserva a ordem de inserção das chaves
Map<String, Integer> ordered = new LinkedHashMap<>();

// mantém as chaves em ordem natural
Map<String, Integer> sorted = new TreeMap<>();

// mapa imutável — não aceita put ou remove
Map<String, Integer> fixed = Map.of("Alice", 90, "Bob", 85);
```

`Map.of(...)` cria um mapa imutável. Qualquer tentativa de modificá-lo lança
`UnsupportedOperationException`.

## Operações Fundamentais

```java
Map<String, Integer> scores = new HashMap<>();

scores.put("Alice", 90);          // insere ou substitui o valor da chave
scores.put("Bob", 85);
scores.put("Alice", 95);          // substitui — chave já existia

scores.get("Alice");              // 95 — retorna o valor, ou null se a chave não existir
scores.getOrDefault("Carol", 0);  // 0 — retorna o valor, ou o padrão se a chave não existir
scores.containsKey("Bob");        // true
scores.containsValue(85);         // true
scores.remove("Bob");             // remove o par pela chave
scores.size();
scores.isEmpty();
scores.clear();
```

> `get` retorna `null` quando a chave não existe. Se o tipo do valor for um
> primitivo encaixotado (como `Integer`), uma atribuição direta pode lançar
> `NullPointerException` por unboxing. Prefira `getOrDefault` quando a ausência
> da chave for uma situação esperada.

## Iteração

A forma mais comum é iterar sobre as entradas (par chave + valor):

```java
Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 85);
scores.put("Carol", 78);

for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

Para iterar apenas sobre as chaves ou apenas sobre os valores:

```java
for (String name : scores.keySet()) {
    System.out.println(name);
}

for (int score : scores.values()) {
    System.out.println(score);
}
```

A ordem de iteração depende da implementação — o mesmo comportamento dos
conjuntos.

## `HashMap`, `LinkedHashMap` e `TreeMap`

As três implementações seguem a mesma lógica das suas contrapartes em `Set`:
`HashMap` ↔ `HashSet`, `LinkedHashMap` ↔ `LinkedHashSet`, `TreeMap` ↔ `TreeSet`.
A diferença é que cada nó guarda um par chave-valor em vez de um único elemento.

### `HashMap`

Implementação mais usada. O hash é calculado a partir da **chave** — o valor não
participa do posicionamento. O custo de `put`, `get` e `remove` é O(1) na média.
A ordem de iteração é imprevisível.

```java
Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 85);
scores.put("Carol", 78);

for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
    // ordem imprevisível
}
```

O contrato de `hashCode()` e `equals()` da chave é o que determina a unicidade
e o posicionamento — o mesmo raciocínio do `HashSet`, aplicado à chave.

### `LinkedHashMap`

Mesmas características do `HashMap` no que diz respeito a performance e
tratamento de colisões. Adiciona ponteiros de ordem de inserção em cada nó,
garantindo que a iteração sempre percorra as chaves na sequência em que foram
inseridas.

```java
Map<String, Integer> ordered = new LinkedHashMap<>();
ordered.put("Alice", 95);
ordered.put("Bob", 85);
ordered.put("Carol", 78);

for (String name : ordered.keySet()) {
    System.out.println(name);  // Alice, Bob, Carol — sempre na ordem de inserção
}
```

### `TreeMap`

Mantém as chaves em **ordem natural** (ou por um `Comparator` fornecido),
usando internamente uma árvore rubro-negra — o mesmo mecanismo do `TreeSet`,
aplicado às chaves. O custo de `put`, `get` e `remove` é O(log n).

```java
Map<String, Integer> sorted = new TreeMap<>();
sorted.put("Carol", 78);
sorted.put("Alice", 95);
sorted.put("Bob", 85);

for (String name : sorted.keySet()) {
    System.out.println(name);  // Alice, Bob, Carol — sempre em ordem alfabética
}
```

### Comparação

| Operação            | `HashMap`    | `LinkedHashMap`               | `TreeMap`                    |
| ------------------- | ------------ | ----------------------------- | ---------------------------- |
| `put` / `get`       | O(1) médio   | O(1) médio                    | O(log n)                     |
| `remove`            | O(1) médio   | O(1) médio                    | O(log n)                     |
| `containsKey`       | O(1) médio   | O(1) médio                    | O(log n)                     |
| Ordem de iteração   | imprevisível | inserção                      | natural                      |
| Memória por entrada | compacta     | + ponteiros de ordem inserção | + ponteiros de filho esq/dir |

Na prática, comece com `HashMap`. Use `LinkedHashMap` quando a ordem de inserção
das chaves importa, e `TreeMap` quando precisar iterar sempre em ordem natural
sem ordenar manualmente.

---

<a href="15-conjuntos.md">← Conjuntos</a>

<p align="right"><a href="17-filas-e-pilhas.md">Próximo: Filas e Pilhas →</a></p>
