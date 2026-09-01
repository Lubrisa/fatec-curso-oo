# 16. Mapas

## O Que É um Mapa

Um mapa é uma coleção de pares **chave → valor** (dicionário). Cada chave é
única — inserir um par com uma chave que já existe substitui o valor anterior.
Os valores associados podem se repetir à vontade.

A interface `Map<K, V>` define o contrato, com dois parâmetros de tipo: `K` para
o tipo da chave e `V` para o tipo do valor. As três implementações mais comuns
são `HashMap`, `LinkedHashMap` e `TreeMap`.

> O `Map<K, V>` é um tipo genérico com dois parâmetros (detalhado no [Guia de
> Generics](../../java-moderno/02-generics/01-fundamentos.md)). Você substitui
> `K` e `V` pelos tipos concretos (por exemplo: `Map<String, BankAccount>`) e o
> compilador garante a consistência de ambos.

## Criando Mapas

```java
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.TreeMap;

// 1. Sem requisito de ordem — implementação padrão mais rápida
Map<String, Integer> scores = new HashMap<>();

// 2. Preserva a ordem exata de inserção das chaves
Map<String, Integer> ordered = new LinkedHashMap<>();

// 3. Mantém as chaves sempre em ordem alfabética ou numérica
Map<String, Integer> sorted = new TreeMap<>();

// 4. Mapa imutável — somente leitura
Map<String, Integer> fixed = Map.of("Alice", 90, "Bob", 85);
```

`Map.of(...)` cria um mapa imutável. Qualquer tentativa de modificá-lo lança
`UnsupportedOperationException`.

## Operações Fundamentais

```java
Map<String, Integer> scores = new HashMap<>();

scores.put("Alice", 90);          // insere um novo par
scores.put("Bob", 85);
scores.put("Alice", 95);          // substitui 90 por 95 (chave já existia)

scores.get("Alice");              // 95 — retorna o valor correspondente
scores.get("Carol");              // null — chave não encontrada
scores.getOrDefault("Carol", 0);  // 0 — retorna o valor padrão se a chave não existir

scores.containsKey("Bob");        // true — busca por chave em O(1)
scores.containsValue(85);         // true — busca por valor (varre o mapa)
scores.remove("Bob");             // remove o par pela chave
scores.size();                    // 2 pares restantes
scores.isEmpty();                 // false
scores.clear();                   // remove todos os pares
```

> **Dica:** `get` retorna `null` quando a chave não existe. Se o tipo do valor
> for um primitivo encaixotado (`Integer`, `Double`), atribuir diretamente a um
> primitivo (`int x = scores.get("Carol");`) lançará `NullPointerException` por
> unboxing. Prefira `getOrDefault` quando a chave puder estar ausente.

## Iteração

A forma mais comum e recomendada é iterar sobre as entradas completas (par chave

- valor):

```java
Map<String, Integer> scores = new HashMap<>();
scores.put("Alice", 95);
scores.put("Bob", 85);

for (Map.Entry<String, Integer> entry : scores.entrySet()) {
    System.out.println(entry.getKey() + ": " + entry.getValue());
}
```

Se você precisar apenas das chaves ou apenas dos valores:

```java
// Apenas as chaves:
for (String name : scores.keySet()) {
    System.out.println(name);
}

// Apenas os valores:
for (int score : scores.values()) {
    System.out.println(score);
}
```

## `HashMap`, `LinkedHashMap` e `TreeMap`

As três implementações de `Map` utilizam **exatamente as mesmas estruturas
internas** das suas contrapartes em `Set` (vistas no capítulo anterior). A única
diferença é que cada nó armazena uma **chave e um valor associado**, em vez de
apenas um elemento:

1. **`HashMap` (Tabela Hash):**
   - Calcula o `hashCode()` e realiza as comparações com `equals()` a partir da
     **chave**.
   - **Performance:** Inserção, busca e remoção em **$O(1)$ constante**. A ordem
     de iteração é imprevisível.

2. **`LinkedHashMap` (Tabela Hash + Lista Encadeada):**
   - Mantém o acesso rápido de **$O(1)$** e preserva a **ordem de chegada** das
     chaves durante loops.

3. **`TreeMap` (Árvore Binária Rubro-Negra):**
   - Mantém as chaves **sempre ordenadas** (alfabética ou crescente).
   - **Performance:** Busca e inserção em **$O(\log n)$**.

> 🔍 **Aprofundamento — Abrindo a Caixa Preta:**
>
> Como os mapas compartilham as engrenagens internas dos conjuntos, veja como a
> memória funciona nos apêndices:
>
> - 📄 [Apêndice: Anatomia da Tabela Hash (HashMap)](estruturas/hashset.md)
> - 📄 [Apêndice: Anatomia da Árvore Rubro-Negra
>   (TreeMap)](estruturas/treeset.md)
> - 📄 [Apêndice: Anatomia da Ordem de Inserção
>   (LinkedHashMap)](estruturas/linkedhashset.md)

### Tabela Comparativa

| Operação                          | `HashMap`      | `LinkedHashMap`      | `TreeMap`                |
| :-------------------------------- | :------------- | :------------------- | :----------------------- |
| **`put` / `get` / `containsKey`** | **O(1) médio** | **O(1) médio**       | **O(log n)**             |
| **Ordem de iteração**             | Imprevisível   | Ordem de inserção    | Ordem natural das chaves |
| **Memória por entrada**           | Compacta       | + ponteiros de ordem | + ponteiros de árvore    |

> **Regra prática:**
>
> **Comece sempre com `HashMap`**. Use `LinkedHashMap` quando a ordem em que as
> chaves foram cadastradas importar (como um cache LRU ou formulários) e
> `TreeMap` quando precisar iterar sobre as chaves em ordem alfabética ou
> numérica.

---

<a href="15-conjuntos.md">← Conjuntos</a>

<p align="right"><a href="17-filas-e-pilhas.md">Próximo: Filas e Pilhas →</a></p>
