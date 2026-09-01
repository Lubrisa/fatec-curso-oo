# 15. Conjuntos

## O Que É um Conjunto

Um conjunto é uma coleção que **não permite elementos duplicados**. Tentar
adicionar um elemento que já existe simplesmente não tem efeito — sem erro, sem
exceção.

A interface `Set<E>` define o contrato. Suas implementações mais comuns são
`HashSet`, `LinkedHashSet` e `TreeSet`.

> O `<E>` indica que `Set` é um tipo genérico (detalhado no [Guia de
> Generics](../../java-moderno/02-generics/01-fundamentos.md)). Você substitui
> `E` pelo tipo dos elementos (`String`, `Integer`, etc.) e o compilador passa a
> garantir a integridade do tipo.

## Criando Conjuntos

```java
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

// 1. Sem requisito de ordem — implementação padrão mais rápida
Set<String> tags = new HashSet<>();

// 2. Preserva a ordem exata de inserção
Set<String> ordered = new LinkedHashSet<>();

// 3. Mantém os elementos sempre ordenados (ex: ordem alfabética ou crescente)
Set<Integer> sorted = new TreeSet<>();

// 4. Conjunto imutável — somente leitura
Set<String> fixed = Set.of("java", "oo", "design");
```

`Set.of(...)` cria um conjunto imutável. Qualquer tentativa de modificá-lo lança
`UnsupportedOperationException`.

## Operações Fundamentais

```java
Set<String> tags = new HashSet<>();

tags.add("java");        // adiciona; retorna true se inseriu com sucesso
tags.add("java");        // ignorado silenciosamente — retorna false (duplicata)
tags.remove("java");     // remove; retorna false se não existia
tags.contains("java");   // busca instantânea — retorna true se existir
tags.size();             // quantidade de elementos únicos
tags.isEmpty();          // true se vazio
tags.clear();            // remove todos os elementos
```

## Iteração

```java
Set<String> tags = new HashSet<>(Set.of("java", "oo", "design"));

for (String tag : tags) {
    System.out.println(tag);
}
```

A ordem da iteração depende da implementação escolhida:

- `HashSet`: Não garante nenhuma ordem (pode sair em qualquer sequência).
- `LinkedHashSet`: Itera na sequência exata em que os itens foram inseridos.
- `TreeSet`: Itera em ordem natural (alfabética para strings, crescente para
  números).

## Operações da Teoria dos Conjuntos

A interface `Set` suporta as operações clássicas da matemática diretamente sobre
as coleções:

```java
Set<String> a = new HashSet<>(Set.of("x", "y", "z"));
Set<String> b = new HashSet<>(Set.of("y", "z", "w"));

// 1. União — reúne todos os elementos de a e b (sem duplicatas)
a.addAll(b);         // a vira {x, y, z, w}

// 2. Interseção — mantém apenas os elementos presentes em AMBOS
a.retainAll(b);      // a vira {y, z}

// 3. Diferença — remove de a tudo o que existir em b
a.removeAll(b);      // a vira {x}
```

> **Nota:** Essas operações modificam o conjunto que as chamou. Se precisar
> preservar o conjunto original, crie uma cópia antes: `new HashSet<>(a)`.

## `HashSet`, `LinkedHashSet` e `TreeSet`

As três implementações resolvem o mesmo problema de unicidade, mas atendem a
necessidades diferentes de ordenação e memória:

1. **`HashSet` (Baseado em Tabela Hash):**
   - É a implementação **padrão e mais rápida**.
   - Usa o `hashCode()` dos objetos para distribuir os itens em gavetas
     (_buckets_).
   - **Performance:** Busca, inserção e remoção em tempo constante médio
     (**$O(1)$**). A ordem de iteração é imprevisível.

2. **`LinkedHashSet` (Tabela Hash + Lista Encadeada):**
   - Mantém a velocidade média de **$O(1)$**, mas adiciona ponteiros para
     lembrar a **ordem de chegada** dos elementos.
   - **Performance:** Ao iterar, os itens saem na ordem exata em que foram
     adicionados. Consome um pouco mais de memória por elemento.

3. **`TreeSet` (Baseado em Árvore Binária Rubro-Negra):**
   - Mantém todos os itens **sempre ordenados** (1, 2, 3... ou "Ana",
     "Bruno"...).
   - **Performance:** Busca e inserção em **$O(\log n)$**. Não aceita elementos
     que não sejam comparáveis entre si.

---

> 🔍 **Aprofundamento — Abrindo a Caixa Preta:**
>
> Quer entender como o `hashCode` encontra os buckets, como as árvores se
> auto-balanceiam e como funcionam as colisões?
>
> - 📄 [Apêndice: Anatomia do HashSet](estruturas/hashset.md)
> - 📄 [Apêndice: Anatomia do TreeSet](estruturas/treeset.md)
> - 📄 [Apêndice: Anatomia do LinkedHashSet](estruturas/linkedhashset.md)

### Tabela Comparativa de Complexidade

| Operação / Característica     | `HashSet`    | `LinkedHashSet`              | `TreeSet`                           |
| :---------------------------- | :----------- | :--------------------------- | :---------------------------------- |
| `add` / `contains` / `remove` | **O(1)\***   | **O(1)\***                   | O(log n)                            |
| `addAll` (união)              | **O(m)\***   | **O(m)\***                   | O(m log n)                          |
| `retainAll` (interseção)      | **O(n)\***   | **O(n)\***                   | O(n log n)                          |
| `removeAll` (diferença)       | **O(m)\***   | **O(m)\***                   | O(m log n)                          |
| **Ordem de iteração**         | Imprevisível | Ordem de inserção            | Ordem natural / Comparator          |
| **Memória por elemento**      | Baixa        | Média (+ ponteiros de ordem) | Média (+ nós e ponteiros da árvore) |

Onde:

- $n$ é a quantidade de elementos do conjunto atual;
- $m$ é a quantidade de elementos do outro conjunto.

\* _Custo médio._

> **Regra prática:**
>
> **Comece sempre com `HashSet`**. Use `LinkedHashSet` quando a ordem de chegada
> importar (como histórico de navegação ou filtros) e `TreeSet` apenas quando
> você precisar dos elementos constantemente classificados em ordem alfabética
> ou numérica.

---

<a href="14-listas.md">← Listas</a>

<p align="right"><a href="16-mapas.md">Próximo: Mapas →</a></p>
