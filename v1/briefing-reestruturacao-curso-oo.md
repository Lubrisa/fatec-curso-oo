# Briefing — Reestruturação do Material de OO/Java

Documento de handoff para continuar no Claude Code. Cole isto como contexto
inicial da sessão (ou aponte o Claude Code pra ele) antes de pedir os próximos
capítulos.

## 1. Contexto do Projeto

Curso com material de Orientação a Objetos + Java, atualmente no 4º semestre.
O material original tinha 14 arquivos organizados em duas trilhas paralelas
que se cruzavam de forma confusa (numeração `Módulo N` vs. `0N`). Estamos
reescrevendo do zero, com foco em acessibilidade para uma turma insegura em
programação.

## 2. Perfil do Público-Alvo

- 4º semestre, mas com pouco contato real com código/projetos.
- Maioria ainda sem domínio sólido de algoritmo básico.
- Objetivo explícito: reduzir a barreira de entrada, não simplificar o
  conteúdo tecnicamente — a precisão técnica não pode cair, o que muda é
  ritmo, tom e ordem de exposição.

## 3. Material Original (Inventário)

Duas trilhas que existiam antes da reestruturação:

**Trilha conceitual ("Módulo N"):**
`02-o-que-e-um-objeto.md`, `03-mecanica-dos-objetos.md`, `04-classes.md`,
`05-encapsulamento.md`, `06-abstracao.md`, `07-heranca.md`,
`08-polimorfismo.md` (não havia "Módulo 1" no lote inicial — foi enviado
depois, ver seção 3.1).

**Trilha de sintaxe Java ("0N. Tópico"):**
`01-quickstart-java-25.md`, `02-dados-variaveis-e-expressoes.md`,
`03-controle-de-fluxo-escopo-e-excecoes.md`, `04-classes-e-objetos.md`,
`05-aplicando-os-pilares-da-oo-em-java.md`,
`06-bibliotecas-importantes-da-api-padrao.md`.

### 3.1 Módulo 1 (Paradigmas) — enviado à parte

Arquivo `01-paradigmas-de-programacao.md` — cobre: o que é paradigma,
Programação Estruturada (goto vs. estruturado, teorema de Böhm-Jacopini,
Dijkstra), Programação Procedural (funções, modularização, módulo vs.
namespace vs. pacote vs. biblioteca), colapso do modelo procedural e
transição pra OO, classificação imperativo vs. declarativo.

## 4. Revisão Técnica — Erros Encontrados no Material Original

Precisam ser corrigidos na reescrita (não repetir):

1. **Wrapper classes erradas.** `03-controle-de-fluxo-escopo-e-excecoes.md`
   listava `Char` e `Int` como wrapper classes do switch clássico. Correto:
   `Character` e `Integer`.
2. **`@Override` descrito como obrigatório.** É opcional/recomendado, não
   obrigatório pelo compilador. (`05-aplicando-os-pilares-da-oo-em-java.md`)
3. **Pacote errado da classe `IO` do Java 25.** O material dizia
   `java.io.IO`; o correto é `java.lang.IO`. Além disso, os exemplos de
   código chamavam `println(...)` / `readln(...)` sem qualificador — isso
   **não compila**. Os métodos estáticos de `IO` não são importados
   implicitamente; é obrigatório `IO.println(...)`, `IO.readln(...)`.
   (`06-bibliotecas-importantes-da-api-padrao.md`)
4. **Definição de `protected` incompleta/inconsistente entre capítulos.** O
   capítulo conceitual definia `protected` como "própria classe +
   subclasses", omitindo que em Java também dá acesso a qualquer classe do
   mesmo pacote — o capítulo de sintaxe Java acertava isso na tabela, criando
   contradição entre os dois textos.
5. **Menor:** a frase "historicamente, os objetos vieram antes das classes"
   é uma leitura defensável mas não um consenso — vale suavizar o tom
   ("segundo uma leitura comum da história...") em vez de afirmar como fato.
6. **Menor:** o modelo de VTable/`vptr` usado pra explicar despacho dinâmico
   em Java é emprestado de C++; a JVM real usa outro mecanismo (ponteiro de
   `Klass`, itables, inline caching). Vale nota de rodapé deixando claro que
   é um modelo conceitual, não a implementação literal do HotSpot.

## 5. Revisão Pedagógica — Diagnóstico

**Pontos fortes do material original (manter na reescrita):**
- Estrutura por capítulo: pergunta motivadora → conceito → código →
  diagrama → antipadrão → tabela-síntese → gancho pro próximo capítulo.
- Confronto direto de modelos mentais errados ("falso encapsulamento",
  "polimorfismo não é herança").
- Domínio de exemplo consistente entre capítulos (reduz carga cognitiva).

**Problema central identificado:** descompasso de nível — o material tinha
conteúdo de nível sênior (SOLID formal, LSP com notação matemática, GoF
patterns, Fragile Base Class Problem, mecânica de objeto em C com endereços
hex) misturado com introdução básica de OO, sem sinalizar o que é núcleo vs.
aprofundamento. Isso sobrecarrega quem ainda está inseguro em algoritmo.

## 6. Princípios de Escrita Acessível (Checklist para Todo Capítulo Novo)

1. **Um termo novo por vez.** Nunca introduzir dois conceitos novos no mesmo
   parágrafo.
2. **Validar a intuição antes de corrigir.** Trocar "confusão comum" /
   "antipadrão mais comum" por framing que normaliza o erro antes de
   explicar por que ele acontece.
3. **Mostrar o raciocínio quebrando, não só o resultado.** Preferir exemplos
   que executam e dão o valor errado (como o caso do `CountableList` que
   conta 6 em vez de 3) a explicações puramente abstratas.
4. **Checkpoints curtos e frequentes**, não um resumo só no final do
   capítulo. Sem nota, só autoavaliação.
5. **Nomes próprios/autoridade em caixa lateral opcional**, não embutidos no
   fluxo principal da explicação (Liskov, Dijkstra, GoF etc.).
6. **Suavizar linguagem absoluta.** Trocar "regra de ouro", "nunca", "é
   ilegítimo" por "na prática", "quase sempre", "vale reconsiderar quando".
7. **Revelar estruturas complexas em partes**, não como diagrama/taxonomia
   completa de uma vez (ex: árvore de tipos de polimorfismo).

## 7. Estrutura Nova Acordada

```
00-fundamentos/
├── 01-o-que-e-um-paradigma.md         # JÁ ESCRITO (ver seção 9)
├── 02-paradigma-estruturado.md        # goto vs estruturado, usando BankAccount.withdraw()
├── 03-paradigma-procedural.md         # funções/módulos soltos: deposit/withdraw/transfer
├── 04-rumo-a-orientacao-a-objetos.md  # colapso procedural + BankAccount vira classe
└── 05-classificacao-de-paradigmas.md  # imperativo vs declarativo, multiparadigma

01-java-basico/
├── 01-quickstart-java-25.md
├── 02-dados-variaveis-e-expressoes.md
├── 03-controle-de-fluxo-escopo-e-excecoes.md
└── 04-io-e-utilitarios-basicos.md      # NOVO: Math, String básica, System.out/Scanner, java.lang.IO

02-java-oo/
├── 01-classes.md                # pra que serve, membros, construtor-guardião, static
├── 02-objetos.md                # criação, ciclo de vida simples, mensagens, equals/hashCode/toString
├── 03-encapsulamento.md         # propósito, modificadores, invariantes, Tell-Don't-Ask (sem nome formal ainda)
├── 04-abstracao.md              # propósito, interface vs abstract class, "programe pra interface" (sem nomear DIP)
├── 05-heranca.md                # propósito, reuso/override, cuidados, composição como alternativa
├── 06-polimorfismo.md           # propósito, tipos, overload/override em Java
└── 07-tipos-especiais.md        # NOVO: enum simples, record básico, Optional<T>

03-aprofundamento-oo/
├── 01-historia-e-filosofia.md          # Alan Kay, Smalltalk vs Simula 67
├── 02-ciclo-de-vida-e-recursos.md      # NOVO: reachability, GC vs RAII, AutoCloseable/IDisposable
└── 03-principios-emergentes.md         # 2ª passada: nomeia LSP, DIP, OCP, Tell-Don't-Ask,
                                         # Fragile Base Class, Anemic vs Rich Model, Strategy

apendices/
├── a-sintaxe-avancada/
│   ├── 01-colecoes-e-generics.md
│   ├── 02-java-time.md
│   ├── 03-arquivos-e-streams.md
│   └── 04-enums-e-records-avancado.md
├── b-solid.md                    # consolida O/L/D já vistos + desenvolve S e I do zero
├── c-object-calisthenics-e-antipatterns.md
└── d-mecanica-em-c.md            # mecânica de objeto em C / VTable — assume familiaridade com C
```

Decisão-chave: a mecânica de objeto em C (antigo Módulo 3 conceitual) foi
movida para apêndice porque **não há garantia de que a turma tenha base em
C** — se isso mudar, pode voltar a ser núcleo em `03-aprofundamento-oo/`.

## 8. Mapa de Migração (Conteúdo Antigo → Destino Novo)

| Arquivo antigo | Destino |
|---|---|
| `04-classes-e-objetos.md` | Sintaxe classe/construtor/static → `02-java-oo/01`. Enum/Record → `02-java-oo/07`. equals/hashCode/toString → `02-java-oo/02`. |
| `04-classes.md` (conceitual) | Blueprint/construtor-guardião → `02-java-oo/01`. Reachability simples → `02-java-oo/02`. RAII vs GC teoria → `03-aprofundamento-oo/02`. |
| `05-aplicando-os-pilares-da-oo-em-java.md` | Cada seção migra pro arquivo do pilar correspondente em `02-java-oo/03-06`. |
| `05-encapsulamento.md`, `06-abstracao.md`, `07-heranca.md`, `08-polimorfismo.md` | Propósito + mecânica prática → `02-java-oo/03-06`. Nomes formais dos princípios + antipadrões → `03-aprofundamento-oo/03`. |
| `06-bibliotecas-importantes-da-api-padrao.md` | Math/String/IO → `01-java-basico/04`. `Optional<T>` → `02-java-oo/07`. Collections/Generics/java.time/Files/Streams → `apendices/a-sintaxe-avancada/*`. |
| `03-mecanica-dos-objetos.md` | Inteiro → `apendices/d-mecanica-em-c.md`. |
| `01-paradigmas-de-programacao.md` | Fatiado nos 5 arquivos de `00-fundamentos/` (ver seção 7). |

## 9. Status Atual — Já Produzido

**`00-fundamentos/01-o-que-e-um-paradigma.md` — rascunho completo, escrito.**

Estrutura aplicada: abre com a mesma dúvida de negócio ("dá pra sacar R$
100?") reformulada em três lentes de pensamento (passos / donos / regras),
sem código e sem nomear paradigma ainda; só depois nomeia a ideia central
("paradigma é a lente..."); duas dimensões (fluxo/modelagem) reformuladas
como perguntas; analogia de apoio (rota passo a passo vs. destino declarado,
pra usar de novo no capítulo de classificação); fecha com diagrama de
roadmap dos próximos capítulos e move a linha do tempo histórica pro final
como leitura opcional.

Conteúdo completo do arquivo:

<details>
<summary>Clique para expandir o conteúdo integral do capítulo 1</summary>

```markdown
# 1. O Que É um Paradigma de Programação?

## A Mesma Pergunta, Três Jeitos de Perguntar

Imagine que você trabalha na área de tecnologia de um banco. Alguém te procura
com uma dúvida simples:

> "Dá pra sacar R$ 100 dessa conta?"

Parece uma pergunta única. Mas, dependendo de como você pensa sobre esse
problema, você vai formular essa dúvida de jeitos bem diferentes pra chegar na
resposta. Veja três formas possíveis de encarar a mesma dúvida:

**Pensando em passos:**

> "Que sequência de verificações eu preciso seguir, em que ordem, pra chegar
> na resposta? Primeiro eu pego o saldo. Depois comparo com o valor pedido. Se
> for maior ou igual, eu debito e confirmo. Se não for, eu recuso."

**Pensando em donos:**

> "De quem é essa informação? A conta é quem sabe o próprio saldo — então eu
> não vou mexer nesse dado por fora. Eu pergunto pra própria conta: 'você
> consegue sacar R$ 100?', e deixo ela decidir e responder por si."

**Pensando em regras:**

> "Que regra descreve quando um saque é permitido? Um saque é válido quando o
> valor solicitado não ultrapassa o saldo disponível. Eu não preciso descrever
> o passo a passo de como checar isso — só preciso declarar a regra."

Repare: o problema é exatamente o mesmo. O resultado esperado é o mesmo. Mas a
pergunta que você faz para chegar lá muda por completo em cada uma das três
versões.

> Checkpoint rápido: antes de continuar, tenta responder com suas
> palavras — qual dessas três formas de pensar te parece mais natural agora?
> Não tem resposta errada aqui; a ideia é só notar que você já tem uma
> preferência, mesmo sem saber nomeá-la ainda.

## Nomeando a Ideia: Isso é um Paradigma

Cada uma dessas três formas de encarar o problema representa uma filosofia
diferente de pensar sobre software. É a essa filosofia que damos o nome de
paradigma de programação.

> Paradigma de programação é a lente através da qual você enxerga um
> problema — do jeito mais abstrato de pensar sobre ele até a solução concreta
> que você escreve.

Um paradigma não é, em primeiro lugar, uma questão de sintaxe. É uma questão de
hábito mental: qual pergunta você faz primeiro quando se depara com um
problema novo?

- Quem pensa em passos vai naturalmente perguntar: "qual é a sequência de
  ações que resolve isso?"
- Quem pensa em donos vai naturalmente perguntar: "quem é responsável por
  essa informação, e o que eu peço a essa entidade?"
- Quem pensa em regras vai naturalmente perguntar: "que condição descreve
  o resultado que eu quero, sem eu precisar descrever como chegar nele?"

Nenhuma dessas perguntas está "certa" ou "errada" de forma absoluta. Cada uma
delas deu origem a uma família de paradigmas que resolveu bem certos tipos de
problema — e vamos explorar cada uma dessas famílias, na prática, ao longo dos
próximos capítulos, sempre voltando para essa mesma conta bancária.

## O que Exatamente um Paradigma Molda?

Se um paradigma é uma lente, o que exatamente ela muda na hora de você
enxergar um problema? De forma geral, duas perguntas:

1. Como as instruções deveriam se organizar? É a pergunta sobre o
   fluxo — a ordem e a forma como as ações do programa se conectam entre si.
2. Como os elementos do problema deveriam ser representados? É a pergunta
   sobre a modelagem — como conceitos do mundo real (uma conta, um cliente,
   um pedido) viram algo que o código consegue manipular.

Um paradigma não te dá uma resposta pronta para essas duas perguntas — ele te
dá uma forma consistente de respondê-las toda vez que um problema novo
aparecer. É por isso que dizemos que um paradigma é uma filosofia de design, e
não apenas um conjunto de palavras-chave de uma linguagem: a filosofia é o que
te guia a tomar a mesma decisão de organização, de forma repetível, em
situações diferentes.

## Uma Analogia Fora da Programação

Essa ideia de "a mesma tarefa, perguntas diferentes" não é exclusiva de
programação. Pense em como você chega a um endereço novo:

Rota passo a passo: alguém te dá instruções tipo "siga 500 metros, vire à
esquerda na segunda rua, depois siga até o sinal e vire à direita". Você
executa uma sequência de ações, uma de cada vez, na ordem exata em que foram
ditas.

Destino declarado: você abre um aplicativo de mapa, digita o endereço de
destino, e deixa o aplicativo decidir a rota. Você não pensa em "vire aqui,
siga ali" — você só declarou onde quer chegar, e deixou outra coisa
resolver o como.

Chegar ao mesmo lugar, duas filosofias completamente diferentes de pedir a
direção. Guarda essa analogia — ela vai ser muito útil mais pra frente, quando
formos comparar programação que descreve passo a passo com programação que
descreve apenas o resultado esperado.

## Fechando: Para Onde Vamos a Partir Daqui

Cada um dos próximos capítulos vai pegar a mesma pergunta do saque de R$ 100
e mostrar como uma filosofia específica resolve esse problema na prática — com
código de verdade, sempre na mesma conta bancária, evoluindo capítulo após
capítulo. [diagrama mermaid: Q "Dá pra sacar R$ 100?" -> Cap.2 "Pensando em
passos bem organizados" -> Cap.3 "Pensando em quem é dono de cada tarefa" ->
Cap.4 "Pensando em quem é dono do dado"]

Você vai ver a mesma BankAccount sendo resolvida de formas diferentes, e em
cada capítulo vai ficar mais claro o que muda de verdade quando a filosofia
por trás do código muda — não só a sintaxe na tela, mas a pergunta que você
faz antes mesmo de escrever a primeira linha.

---

### Contexto Histórico (Leitura Opcional)

[linha do tempo 1957-1995, ver arquivo original para o texto completo]
```

</details>

## 10. Pendências / Itens em Aberto (Resolver Antes de Prosseguir)

1. **Inconsistência conceitual no roadmap do capítulo 1, já identificada mas
   não corrigida.** As "três lentes" da abertura são: passos (→ Estruturado),
   donos (→ OO), regras (→ Declarativo/Funcional). O diagrama de fechamento,
   porém, mapeia capítulo por capítulo como se "Procedural" fosse uma quarta
   lente equivalente às três primeiras — mas Procedural não responde "dá pra
   sacar R$ 100?" com uma filosofia própria; ele resolve um problema
   diferente (como organizar várias funções em arquivos/módulos), ortogonal
   às três lentes. **Decisão pendente:** ou (a) ajustar o roadmap do
   capítulo 1 pra deixar claro que Procedural é uma camada de organização
   que se soma ao Estruturado, não uma quarta lente concorrente, ou (b)
   revisar a ordem dos capítulos 2-5 pra não prometer algo que a abertura não
   estabeleceu. Recomendo (a): é mais rápido e não exige reabrir a
   arquitetura de capítulos já decidida.
2. Capítulos `02` a `05` de `00-fundamentos/` ainda não foram escritos —
   só estruturados como outline (ver seção 7).
3. Confirmar com a coordenação/prerequisitos do curso se C é garantido em
   alguma disciplina anterior — isso decide se `apendices/d-mecanica-em-c.md`
   fica mesmo como apêndice opcional ou sobe pra `03-aprofundamento-oo/`.
