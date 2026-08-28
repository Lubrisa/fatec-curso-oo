# Anatomia Interna do `TreeSet`

Diferente do `HashSet` (que espalha os elementos por buckets de forma
imprevisível), o `TreeSet` garante que os elementos estejam **sempre ordenados
de forma crescente** (ordem natural ou através de um `Comparator`).

Para manter essa ordenação automática e ainda garantir um excelente tempo de
busca e inserção de **$O(\log n)$**, o `TreeSet` utiliza uma **Árvore Binária de
Busca Auto-balanceada (Árvore Rubro-Negra)**.

---

## 1. A Estrutura de Árvore Binária de Busca (BST)

Em uma árvore binária, cada elemento é um **Nó** que possui no máximo dois
filhos:

- Um ponteiro para o filho à **esquerda**.
- Um ponteiro para o filho à **direita**.

A regra sagrada e invariante que mantém a árvore ordenada é: $$\text{Filho à
Esquerda} < \text{Nó Atual} < \text{Filho à Direita}$$

![Estrutura interna do TreeSet](../imgs/treeset.png)

### Rastreando a Busca do Número 9 na Imagem Acima:

1. Começamos na **raiz** (valor `2`). Comparação: `9 > 2` $\rightarrow$ descemos
   pela **direita**.
2. Chegamos no nó `7`. Comparação: `9 > 7` $\rightarrow$ descemos pela
   **direita**.
3. Chegamos no nó `9`. Encontrado!

A cada comparação que você faz, você **elimina metade da árvore restante**. Se a
árvore tiver 1.000.000 de elementos, uma busca leva no máximo cerca de **20
comparações** ($\log_2 1.000.000 \approx 20$).

---

## 2. O Risco da Árvore Desbalanceada (Degeneração em Lista)

Se uma árvore binária for ingênua, inserções em ordem crescente (como `1, 2, 3,
4, 5`) criam um desastre: cada novo elemento vai sempre para a direita,
transformando a árvore em uma **linha reta** (uma lista encadeada):

![Exemplo de Árvore Binária Desbalanceada](../imgs/arvore-desbalanceada.png)

Em uma árvore desbalanceada como a da imagem acima, a altura é igual a $N$. A
busca deixa de ser $O(\log n)$ e volta a ser um lento $O(n)$.

---

## 3. A Solução: A Árvore Rubro-Negra (Red-Black Tree)

O `TreeSet` resolve o problema do desbalanceamento utilizando a estrutura de
**Árvore Rubro-Negra** (_Red-Black Tree_).

Ela atribui uma cor virtual (vermelha ou preta) para cada nó e segue regras
estritas:

1. Todo nó é **vermelho** ou **preto**.
2. A raiz é sempre preta.
3. Não podem existir dois nós vermelhos consecutivos (um nó vermelho nunca pode
   ser pai de outro nó vermelho).
4. Todo caminho da raiz até qualquer folha nula deve conter exatamente a **mesma
   quantidade de nós pretos**.

### Como a Árvore se Auto-Balanceia?

Sempre que uma inserção ou remoção ameaça quebrar essas regras de equilíbrio, a
árvore executa duas correções automáticas:

- **Recoloração:** inverte cores de nós vizinhos.
- **Rotações de Ponteiros:** gira galhos da árvore para a esquerda ou direita,
  puxando nós profundos para cima.

Esse processo de rotação é extremamente rápido ($O(\log n)$) e garante que o
caminho mais longo da raiz até uma folha nunca ultrapasse o dobro do caminho
mais curto, blindando a performance em **$O(\log n)$ garantido no pior caso**.

---

## 4. O Contrato do `Comparable` / `Comparator`

Para colocar objetos customizados em um `TreeSet`, o Java precisa saber como
comparar dois itens para decidir quem vai para a esquerda ou para a direita.

Sua classe deve implementar a interface `Comparable<T>`:

```java
public class Customer implements Comparable<Customer> {
    private String name;
    private int score;

    @Override
    public int compareTo(Customer other) {
        // Retorna negativo se este < outro
        // Retorna zero se este == outro (considerado duplicata no Set!)
        // Retorna positivo se este > outro
        return Integer.compare(this.score, other.score);
    }
}
```

> **⚠️ Cuidado:** Se `compareTo` retornar `0`, o `TreeSet` considerará os dois
> objetos como duplicados e **não inserirá o segundo**, mesmo que eles tenham
> outros campos diferentes!

---

<a href="../15-conjuntos.md">← Voltar para o Capítulo 15 (Conjuntos)</a>
