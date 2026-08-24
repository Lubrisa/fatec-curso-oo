# 15. Conjuntos

## O Que É um Conjunto

Um conjunto é uma coleção que **não permite elementos duplicados**. Tentar
adicionar um elemento que já existe simplesmente não tem efeito — sem erro, sem
exceção.

A interface `Set<E>` define o contrato. As três implementações mais comuns são
`HashSet`, `LinkedHashSet` e `TreeSet`.

> O `<E>` indica que `Set` é um tipo genérico — assunto para outro momento. Por
> ora, basta saber que você substitui `E` pelo tipo dos elementos (`String`,
> `Integer`, etc.) e o compilador passa a garantir que todas as operações do
> conjunto respeitam esse tipo.

## Criando Conjuntos

```java
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.TreeSet;

// sem requisito de ordem — implementação padrão
Set<String> tags = new HashSet<>();

// preserva a ordem de inserção
Set<String> ordered = new LinkedHashSet<>();

// mantém os elementos em ordem natural
Set<Integer> sorted = new TreeSet<>();

// conjunto imutável — não aceita add ou remove
Set<String> fixed = Set.of("java", "oo", "design");
```

`Set.of(...)` cria um conjunto imutável. Qualquer tentativa de modificá-lo lança
`UnsupportedOperationException`.

## Operações Fundamentais

As operações são as mesmas nas três implementações — a diferença está no
comportamento de ordenação e na performance:

```java
Set<String> tags = new HashSet<>();

tags.add("java");        // adiciona; retorna false se já existia
tags.add("java");        // ignorado — duplicata
tags.remove("java");     // remove; retorna false se não existia
tags.contains("java");   // verifica existência
tags.size();
tags.isEmpty();
tags.clear();
```

## Iteração

```java
Set<String> tags = new HashSet<>(Set.of("java", "oo", "design"));

for (String tag : tags) {
    System.out.println(tag);
}
```

A ordem de iteração depende da implementação: `HashSet` não garante nenhuma
ordem; `LinkedHashSet` itera na ordem de inserção; `TreeSet` itera em ordem
natural.

## Operações de Conjunto

`Set` suporta as operações clássicas de teoria dos conjuntos diretamente sobre
as coleções:

```java
Set<String> a = new HashSet<>(Set.of("x", "y", "z"));
Set<String> b = new HashSet<>(Set.of("y", "z", "w"));

// união — todos os elementos de a e b
a.addAll(b);         // a = {x, y, z, w}

// interseção — apenas os elementos em comum
a.retainAll(b);      // a = {y, z}

// diferença — elementos de a que não estão em b
a.removeAll(b);      // a = {x}
```

> Essas operações modificam o conjunto original. Se precisar preservar `a`, crie
> uma cópia antes: `new HashSet<>(a)`.

## `HashSet`, `LinkedHashSet` e `TreeSet`

As três implementações de `Set` têm estruturas internas diferentes, o que
resulta em perfis de performance e comportamento de ordenação distintos.

### `HashSet`

Implementação mais usada. Usa um array de _buckets_ e hashing para atingir custo
O(1) nas operações principais.

**Estrutura interna:**

O objeto rastreia quantos elementos foram inseridos e mantém um array auxiliar.
Cada posição desse array é chamada de _bucket_, e cada bucket pode guardar uma
lista encadeada de elementos.

**Encontrando o bucket certo:**

Para qualquer operação — inserção, busca ou remoção — precisamos saber em qual
bucket o elemento está ou deve ir. Para isso, o Java chama o método `hashCode()`
do elemento, que devolve um número inteiro. Como esse número pode ser muito
grande, tiramos o módulo pelo tamanho do array para obter um índice válido.

O ponto importante: `hashCode()` sempre leva o mesmo tempo para rodar,
independente do conteúdo. Daí o custo O(1) — encontrar o bucket é sempre igual,
não importa quantos elementos o conjunto tenha.

**Colisões:**

Dois elementos diferentes podem produzir o mesmo índice de bucket — isso se
chama **colisão**. A solução do Java é fazer com que cada bucket guarde uma
lista encadeada. Quando há colisão, o novo elemento vai para o final da lista.

![Estrutura interna do HashSet](./imgs/hashset.png)

Na imagem, os valores 1 e 9 caíram no mesmo bucket. O valor 1 está na cabeça da
lista; 9 vem depois, ligado pelo ponteiro do nó. Os valores 7 e 12 não colidiram
com ninguém e ficaram sozinhos nos seus buckets.

Na busca, o Java vai ao bucket calculado e percorre a lista comparando os
elementos um a um com `equals()` até encontrar o item — ou confirmar que ele não
está presente.

> Isso tem uma consequência importante que veremos com mais detalhes quando
> falarmos de classes: para que o `HashSet` funcione corretamente, o objeto
> armazenado precisa implementar `hashCode()` e `equals()` usando os mesmos
> critérios. O `hashCode()` localiza o bucket; o `equals()` identifica o
> elemento dentro da lista. Se os dois não concordam sobre o que significa
> "mesmo elemento", o conjunto vai se comportar de forma inesperada.

**Quando o array fica cheio:**

Se continuarmos inserindo elementos, eventualmente muitos deles vão cair no
mesmo bucket e as listas vão crescer — o que degrada a performance de busca. A
solução é dobrar o tamanho do array a partir de um certo ponto e reposicionar
todos os elementos.

Por que reposicionar? Porque o índice do bucket depende do módulo pelo tamanho
do array. Quando o array dobra, os índices mudam e cada elemento precisa ser
reinserido na posição correta.

Essa operação é cara, mas acontece raramente. Se você não estiver fazendo
centenas ou milhares de inserções seguidas, dificilmente vai notar o impacto — e
a performance geral de consulta continua excelente.

### `TreeSet`

Mantém os elementos em **ordem natural** (ou por um `Comparator` fornecido),
usando uma árvore binária auto-balanceada para garantir custo O(log n).

**Estrutura interna:**

O objeto rastreia a quantidade de elementos e mantém um ponteiro para a raiz de
uma árvore. Cada nó da árvore guarda um valor e dois ponteiros: um para o filho
à esquerda e outro para o filho à direita.

**Encontrando a posição certa:**

A propriedade fundamental de uma árvore binária é que todo elemento à esquerda
de um nó é menor que ele, e todo elemento à direita é maior. Isso nos diz
exatamente onde cada elemento vai e onde buscar um elemento existente: descemos
a árvore comparando — se o elemento que procuramos é menor, vamos para a
esquerda; se é maior, vamos para a direita.

![Estrutura interna do TreeSet](./imgs/treeset.png)

Na imagem, a raiz é 2. Para buscar o valor 9, comparamos com 2 (maior, vai para
a direita), depois com 7 (maior, vai para a direita), depois com 9 — encontrado.
A cada passo descemos um nível na árvore. Se a árvore tem n elementos e está
balanceada, a altura é proporcional a log n — daí o custo O(log n).

Iterar em ordem é igualmente direto: percorremos a árvore sempre visitando o
filho à esquerda antes do nó atual, e o filho à direita depois.

```java
Set<Integer> scores = new TreeSet<>();
scores.add(42);
scores.add(7);
scores.add(19);
scores.add(7);                  // ignorado — duplicata

for (int score : scores) {
    System.out.println(score);  // 7, 19, 42 — sempre em ordem crescente
}
```

**Mantendo o balanceamento:**

O custo O(log n) pressupõe que a árvore esteja **balanceada**. Uma árvore
desbalanceada pode degenerar: se você inserir 1, 2, 3, 4… em ordem, cada novo nó
vai sempre para a direita e a árvore vira uma lista — O(n) para tudo.

![Exemplo de Árvore Binária Desbalanceada](./imgs/arvore-desbalanceada.png)

O `TreeSet` usa uma **árvore rubro-negra**, que é uma árvore binária
auto-balanceada. A cada inserção ou remoção ela faz um pequeno trabalho de
reordenação para garantir que a árvore nunca fique muito desequilibrada — e
portanto que o custo O(log n) seja mantido sempre, não apenas em média.

O `TreeSet` em si é simples: delega quase tudo para a árvore. A parte complexa
está na implementação da árvore rubro-negra, mas você não precisa conhecer os
detalhes para usá-la com eficiência.

<details>
<summary>Como a árvore rubro-negra mantém o balanceamento</summary>

A ideia é atribuir uma cor — vermelho ou preto — a cada nó, seguindo regras
fixas: nenhum caminho da raiz até uma folha pode ter dois nós vermelhos
consecutivos, e todo caminho deve ter o mesmo número de nós pretos. Essas
restrições garantem que a altura máxima da árvore seja no máximo o dobro da
mínima — o suficiente para manter O(log n) no pior caso.

Após cada inserção ou remoção, a árvore verifica se as regras de coloração foram
violadas. Se foram, ela recolore nós e faz rotações — reorganizações locais de
ponteiros — para restaurar o equilíbrio. Esse trabalho extra é O(log n), o mesmo
custo da operação em si.

Os nós destacados em vermelho na imagem são justamente os nós "vermelhos" dessa
coloração interna.

</details>

### `LinkedHashSet`

Combina o mecanismo do `HashSet` com dois ponteiros extras por nó que rastreiam
a ordem de inserção, permitindo iterar sempre na sequência em que os elementos
foram adicionados.

**Estrutura interna:**

O objeto rastreia a quantidade de elementos, o array de buckets e ponteiros para
o primeiro e o último nó inseridos. Cada nó tem três responsabilidades: guarda o
valor, aponta para o próximo nó no mesmo bucket (como no `HashSet`) e aponta
para o nó inserido antes e para o nó inserido depois.

![Estrutura interna do LinkedHashSet](./imgs/linkedhashset.png)

Na imagem vemos a estrutura completa. Os elementos estão distribuídos nos
buckets pelo hash — 1 e 9 colidiram no mesmo slot, 12 e 7 ficaram em buckets
próprios. Ao mesmo tempo, cada nó está ligado ao anterior e ao próximo na ordem
de inserção, formando uma cadeia que atravessa todos os buckets.

Pode parecer confuso ter tantas ligações ao mesmo tempo. A imagem abaixo mostra
a mesma estrutura de duas perspectivas separadas — mas não são duas estruturas
distintas, são dois aspectos do mesmo nó.

![LinkedHashSet — perspectiva da hash table e da cadeia de
inserção](./imgs/linkedhashset-reorganizado.png)

Na parte superior, a visão da hash table: cada bucket com seus elementos (1 e 9
no mesmo slot, 12 e 7 sozinhos). Na parte inferior, a visão da cadeia de
inserção: 1 ↔ 7 ↔ 12 ↔ 9. É essa cadeia que a iteração percorre — daí a ordem
previsível.

**Similaridades com o `HashSet`:**

O cálculo do bucket é idêntico — `hashCode()` seguido de módulo pelo tamanho do
array, O(1). Colisões são resolvidas da mesma forma: lista encadeada dentro do
bucket, busca com `equals()`. O contrato de `hashCode()` e `equals()` se aplica
pelos mesmos motivos.

**Mantendo a ordem de inserção:**

Ao inserir um elemento, além de colocá-lo no bucket correto, atualizamos os
ponteiros de antes e depois: o nó anterior passa a apontar para o novo nó como
"próximo na cadeia de inserção", e o novo nó aponta de volta para ele como
"anterior".

```java
Set<String> ordered = new LinkedHashSet<>();
ordered.add("banana");
ordered.add("apple");
ordered.add("cherry");
ordered.add("banana");          // ignorado — duplicata

for (String fruit : ordered) {
    System.out.println(fruit);  // banana, apple, cherry — sempre na ordem de inserção
}
```

As operações continuam O(1) na média. O custo constante é ligeiramente maior que
no `HashSet`: a cada inserção ou remoção, além do trabalho da hash table, é
preciso atualizar os ponteiros de antes e depois dos nós vizinhos. Cada nó
também ocupa mais memória, carregando esses dois ponteiros extras.

### Comparação

| Operação             | `HashSet`    | `LinkedHashSet`               | `TreeSet`                    |
| -------------------- | ------------ | ----------------------------- | ---------------------------- |
| `add`                | O(1) médio   | O(1) médio                    | O(log n)                     |
| `remove`             | O(1) médio   | O(1) médio                    | O(log n)                     |
| `contains`           | O(1) médio   | O(1) médio                    | O(log n)                     |
| Ordem de iteração    | imprevisível | inserção                      | natural                      |
| Memória por elemento | compacta     | + ponteiros de ordem inserção | + ponteiros de filho esq/dir |

\* O(1) médio — colisões frequentes degradam para O(n) no pior caso, mas são
raras com uma função hash bem distribuída.

Na prática, comece com `HashSet`. Use `LinkedHashSet` quando a ordem de inserção
importa para o resultado, e `TreeSet` quando precisar iterar sempre em ordem
natural sem ordenar manualmente.

---

<a href="14-listas.md">← Listas</a>

<p align="right"><a href="16-mapas.md">Próximo: Mapas →</a></p>
