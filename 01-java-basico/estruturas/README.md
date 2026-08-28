# Apêndices: Anatomia Interna das Estruturas de Dados

Este diretório reúne guias visuais e aprofundados sobre o funcionamento interno
das principais estruturas de dados da biblioteca padrão do Java.

Enquanto os capítulos da trilha principal ensinam **como usar** as coleções no
dia a dia através de suas interfaces (`List`, `Set`, `Map`, `Queue`), os
documentos abaixo abrem a **"caixa preta"** para mostrar como a memória é
alocada, como os ponteiros se conectam e por que cada estrutura se comporta de
maneira diferente em termos de performance.

---

## Índice das Estruturas

| Estrutura           | Assunto Principal                                                             | Guia Dedicado                                 |
| :------------------ | :---------------------------------------------------------------------------- | :-------------------------------------------- |
| **`ArrayList`**     | Array dinâmico, capacidade vs. tamanho, redimensionamento e custo amortizado  | [Anatomia do ArrayList](arraylist.md)         |
| **`LinkedList`**    | Nós duplamente encadeados, ponteiros `prev`/`next`, custo de busca e inserção | [Anatomia do LinkedList](linkedlist.md)       |
| **`HashSet`**       | Tabela hash, cálculo de buckets, colisões e o contrato `hashCode`/`equals`    | [Anatomia do HashSet](hashset.md)             |
| **`TreeSet`**       | Árvore binária de busca, ordem natural, balanceamento e árvore rubro-negra    | [Anatomia do TreeSet](treeset.md)             |
| **`LinkedHashSet`** | Estrutura híbrida: tabela hash combinada com cadeia de inserção               | [Anatomia do LinkedHashSet](linkedhashset.md) |
| **`ArrayDeque`**    | Buffer circular, índices modulares `head`/`tail` e operação como Fila e Pilha | [Anatomia do ArrayDeque](arraydeque.md)       |

---

> **Dica de estudo:** Não se preocupe em memorizar todos os detalhes de
> implementação de uma vez. Use estes documentos como material de consulta
> visual sempre que quiser entender o que acontece na memória por baixo dos
> panos.
