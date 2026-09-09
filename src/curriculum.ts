import { ModuleNode, ChapterItem } from './types';

export const CURRICULUM_TREE: ModuleNode[] = [
  {
    id: 'visao-geral',
    title: 'Início',
    badge: 'FATEC',
    files: [
      {
        id: 'README.md',
        title: 'Visão Geral do Curso',
        subtitle: 'Estrutura da Trilha Core e Eixos Temáticos',
        moduleTitle: 'Programação Orientada a Objetos — FATEC',
        estimatedMinutes: 5,
      },
    ],
  },
  {
    id: '00-fundamentos',
    title: '00 · Fundamentos de Paradigmas',
    badge: 'Core',
    description: 'Compreensão histórica e conceitual dos paradigmas antes de escrever Java.',
    files: [
      {
        id: '00-fundamentos/01-o-que-e-um-paradigma.md',
        title: '01. O que é um paradigma',
        subtitle: 'O que é um paradigma de programação e por que importa',
        moduleTitle: '00 · Fundamentos de Paradigmas',
        estimatedMinutes: 7,
      },
      {
        id: '00-fundamentos/02-paradigma-estruturado.md',
        title: '02. Paradigma Estruturado',
        subtitle: 'Sequência, seleção e iteração como base',
        moduleTitle: '00 · Fundamentos de Paradigmas',
        estimatedMinutes: 8,
      },
      {
        id: '00-fundamentos/03-paradigma-procedural.md',
        title: '03. Paradigma Procedural',
        subtitle: 'Sub-rotinas, funções, procedimentos e decomposição',
        moduleTitle: '00 · Fundamentos de Paradigmas',
        estimatedMinutes: 9,
      },
      {
        id: '00-fundamentos/04-rumo-a-orientacao-a-objetos.md',
        title: '04. Rumo à Orientação a Objetos',
        subtitle: 'Limitações do procedural e a transição para OO',
        moduleTitle: '00 · Fundamentos de Paradigmas',
        estimatedMinutes: 10,
      },
      {
        id: '00-fundamentos/05-classificacao-de-paradigmas.md',
        title: '05. Classificação de Paradigmas',
        subtitle: 'Imperativo vs Declarativo e posicionamento dos paradigmas',
        moduleTitle: '00 · Fundamentos de Paradigmas',
        estimatedMinutes: 8,
      },
    ],
  },
  {
    id: '01-java-basico',
    title: '01 · Java Básico',
    badge: 'Core',
    description: 'Sintaxe fundamental, tipos de dados, fluxo de controle, funções e coleções.',
    files: [
      {
        id: '01-java-basico/01-instalacao-e-primeiro-programa.md',
        title: '01. Instalação e Primeiro Programa',
        subtitle: 'Instalação do JDK, configuração de ambiente e Hello World',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 10,
      },
      {
        id: '01-java-basico/02-tipos-primitivos.md',
        title: '02. Tipos Primitivos',
        subtitle: 'int, double, boolean, char e tamanhos em memória',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 10,
      },
      {
        id: '01-java-basico/03-tipos-por-referencia.md',
        title: '03. Tipos por Referência',
        subtitle: 'Stack vs Heap, referências e valor null',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 12,
      },
      {
        id: '01-java-basico/04-string.md',
        title: '04. String',
        subtitle: 'Imutabilidade, String Pool, StringBuilder e text blocks',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 11,
      },
      {
        id: '01-java-basico/05-variaveis.md',
        title: '05. Variáveis',
        subtitle: 'Variáveis locais, inferência com var e constantes (final)',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 8,
      },
      {
        id: '01-java-basico/06-expressoes-e-operadores.md',
        title: '06. Expressões e Operadores',
        subtitle: 'Operadores aritméticos, lógicos, ternário e instanceof',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 9,
      },
      {
        id: '01-java-basico/07-conversoes-de-tipo.md',
        title: '07. Conversões de Tipo',
        subtitle: 'Widening, narrowing, casting e autoboxing/unboxing',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 9,
      },
      {
        id: '01-java-basico/08-condicionais.md',
        title: '08. Condicionais',
        subtitle: 'if/else, switch clássico e switch expressions',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 10,
      },
      {
        id: '01-java-basico/09-lacos.md',
        title: '09. Laços',
        subtitle: 'for, while, do-while, for-each, break e continue',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 10,
      },
      {
        id: '01-java-basico/10-funcoes.md',
        title: '10. Funções',
        subtitle: 'Assinatura, métodos estáticos vs instância, retorno e guard clauses',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 11,
      },
      {
        id: '01-java-basico/11-escopo.md',
        title: '11. Escopo',
        subtitle: 'Escopo de bloco, tempo de vida de variáveis e shadowing',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 8,
      },
      {
        id: '01-java-basico/12-excecoes.md',
        title: '12. Exceções',
        subtitle: 'try-catch-finally, checked vs unchecked e boas práticas',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 13,
      },
      {
        id: '01-java-basico/13-arrays.md',
        title: '13. Arrays',
        subtitle: 'Arrays unidimensionais, multidimensionais e classe utilitária Arrays',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 10,
      },
      {
        id: '01-java-basico/14-listas.md',
        title: '14. Listas',
        subtitle: 'Contrato List, ArrayList vs LinkedList',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 12,
      },
      {
        id: '01-java-basico/15-conjuntos.md',
        title: '15. Conjuntos',
        subtitle: 'Contrato Set, HashSet, TreeSet e LinkedHashSet',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 12,
      },
      {
        id: '01-java-basico/16-mapas.md',
        title: '16. Mapas',
        subtitle: 'Contrato Map, pares chave-valor, HashMap e TreeMap',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 12,
      },
      {
        id: '01-java-basico/17-filas-e-pilhas.md',
        title: '17. Filas e Pilhas',
        subtitle: 'Filas (Queue), pilhas (Stack) e uso moderno com ArrayDeque',
        moduleTitle: '01 · Java Básico',
        estimatedMinutes: 11,
      },
    ],
    submodules: [
      {
        id: '01-java-basico/estruturas',
        title: 'Estruturas de Coleções (Aprofundamento)',
        badge: 'Estruturas',
        description: 'Funcionamento interno de cada implementação de List, Set, Queue e Deque.',
        files: [
          {
            id: '01-java-basico/estruturas/README.md',
            title: 'Estruturas: Visão Geral',
            subtitle: 'Comparativo de complexidade O(1) vs O(n) e mapa mental',
            moduleTitle: '01 · Java Básico (Estruturas)',
            estimatedMinutes: 6,
          },
          {
            id: '01-java-basico/estruturas/arraylist.md',
            title: 'Estruturas: ArrayList em Detalhe',
            subtitle: 'Crescimento dinâmico, cópia de array e amortização',
            moduleTitle: '01 · Java Básico (Estruturas)',
            estimatedMinutes: 9,
          },
          {
            id: '01-java-basico/estruturas/linkedlist.md',
            title: 'Estruturas: LinkedList em Detalhe',
            subtitle: 'Nós duplamente encadeados e trade-offs de cache',
            moduleTitle: '01 · Java Básico (Estruturas)',
            estimatedMinutes: 9,
          },
          {
            id: '01-java-basico/estruturas/hashset.md',
            title: 'Estruturas: HashSet em Detalhe',
            subtitle: 'Tabela hash, buckets, colisões e contrato hashCode/equals',
            moduleTitle: '01 · Java Básico (Estruturas)',
            estimatedMinutes: 9,
          },
          {
            id: '01-java-basico/estruturas/linkedhashset.md',
            title: 'Estruturas: LinkedHashSet em Detalhe',
            subtitle: 'Ordem de inserção preservada com lista duplamente encadeada',
            moduleTitle: '01 · Java Básico (Estruturas)',
            estimatedMinutes: 8,
          },
          {
            id: '01-java-basico/estruturas/treeset.md',
            title: 'Estruturas: TreeSet em Detalhe',
            subtitle: 'Árvore rubro-negra balanceada e Comparable/Comparator',
            moduleTitle: '01 · Java Básico (Estruturas)',
            estimatedMinutes: 10,
          },
          {
            id: '01-java-basico/estruturas/arraydeque.md',
            title: 'Estruturas: ArrayDeque em Detalhe',
            subtitle: 'Ring buffer redimensionável para Pilhas e Filas modernas',
            moduleTitle: '01 · Java Básico (Estruturas)',
            estimatedMinutes: 9,
          },
        ],
      },
    ],
  },
  {
    id: '02-oo',
    title: '02 · Orientação a Objetos',
    badge: 'Core',
    description: 'Pilares da orientação a objetos demonstrados com modelo bancário BankAccount.',
    files: [
      {
        id: '02-oo/01-classes.md',
        title: '01. Classes',
        subtitle: 'O problema dos dados soltos, classes como moldes e convenções',
        moduleTitle: '02 · Orientação a Objetos',
        estimatedMinutes: 9,
      },
      {
        id: '02-oo/02-objetos.md',
        title: '02. Objetos',
        subtitle: 'Instanciação com new, identidade de objetos e estado em memória',
        moduleTitle: '02 · Orientação a Objetos',
        estimatedMinutes: 9,
      },
      {
        id: '02-oo/03-campos-e-metodos.md',
        title: '03. Campos e Métodos',
        subtitle: 'Membros de instância vs estáticos e a palavra-chave this',
        moduleTitle: '02 · Orientação a Objetos',
        estimatedMinutes: 11,
      },
      {
        id: '02-oo/04-construtores.md',
        title: '04. Construtores',
        subtitle: 'Inicialização segura, validação de invariantes e sobrecarga',
        moduleTitle: '02 · Orientação a Objetos',
        estimatedMinutes: 10,
      },
      {
        id: '02-oo/05-abstracao.md',
        title: '05. Abstração',
        subtitle: 'Interfaces como contratos puros e o poder do desacoplamento',
        moduleTitle: '02 · Orientação a Objetos',
        estimatedMinutes: 12,
      },
      {
        id: '02-oo/06-encapsulamento.md',
        title: '06. Encapsulamento',
        subtitle: 'Proteção de regras de negócio e modificadores de acesso',
        moduleTitle: '02 · Orientação a Objetos',
        estimatedMinutes: 11,
      },
      {
        id: '02-oo/07-heranca.md',
        title: '07. Herança',
        subtitle: 'Reúso via extends, super, classes abstratas e limites da herança',
        moduleTitle: '02 · Orientação a Objetos',
        estimatedMinutes: 13,
      },
      {
        id: '02-oo/08-composicao.md',
        title: '08. Composição',
        subtitle: 'Composição sobre herança ("tem um" vs "é um") e flexibilidade',
        moduleTitle: '02 · Orientação a Objetos',
        estimatedMinutes: 12,
      },
      {
        id: '02-oo/09-polimorfismo.md',
        title: '09. Polimorfismo',
        subtitle: 'Despacho dinâmico, código extensível e pattern matching',
        moduleTitle: '02 · Orientação a Objetos',
        estimatedMinutes: 14,
      },
    ],
  },
  {
    id: '03-java-in-depth',
    title: '03 · Java in-Depth',
    badge: 'Core',
    description: 'Generics, Programação Funcional, Lambdas e Streams API.',
    submodules: [
      {
        id: '03-java-in-depth/generics',
        title: 'Generics',
        badge: 'Generics',
        description: 'Parametrização de tipos, Type Safety e eliminação de castings.',
        files: [
          {
            id: '03-java-in-depth/02-generics/01-fundamentos.md',
            title: 'Generics: 01. Fundamentos',
            subtitle: 'O perigo de Object e ClassCastException; Type Safety em tempo de compilação',
            moduleTitle: '03 · Java in-Depth (Generics)',
            estimatedMinutes: 10,
          },
          {
            id: '03-java-in-depth/02-generics/02-classes-e-interfaces-genericas.md',
            title: 'Generics: 02. Classes e Interfaces',
            subtitle: 'Parâmetros de tipo (<T>, <K, V>), convenções e contratos',
            moduleTitle: '03 · Java in-Depth (Generics)',
            estimatedMinutes: 11,
          },
          {
            id: '03-java-in-depth/02-generics/03-metodos-genericos.md',
            title: 'Generics: 03. Métodos Genéricos',
            subtitle: 'Parâmetros de tipo em métodos, inferência de tipos e flexibilidade',
            moduleTitle: '03 · Java in-Depth (Generics)',
            estimatedMinutes: 10,
          },
        ],
      },
      {
        id: '03-java-in-depth/funcional',
        title: 'Java Funcional & Streams API',
        badge: 'Funcional',
        description: 'Interfaces funcionais, Lambdas, Optional e processamento de Streams.',
        files: [
          {
            id: '03-java-in-depth/03-java-funcional/01-o-pensamento-funcional.md',
            title: 'Funcional: 01. Pensamento Funcional',
            subtitle: 'Imperativo vs declarativo, funções de 1ª classe e sinergia OO + FP',
            moduleTitle: '03 · Java in-Depth (Funcional & Streams)',
            estimatedMinutes: 10,
          },
          {
            id: '03-java-in-depth/03-java-funcional/02-interfaces-funcionais-e-classes-anonimas.md',
            title: 'Funcional: 02. Interfaces Funcionais',
            subtitle: 'Contratos SAM, @FunctionalInterface e catálogo java.util.function',
            moduleTitle: '03 · Java in-Depth (Funcional & Streams)',
            estimatedMinutes: 11,
          },
          {
            id: '03-java-in-depth/03-java-funcional/03-expressoes-lambda-e-method-references.md',
            title: 'Funcional: 03. Lambdas & Method References',
            subtitle: 'Sintaxe de lambdas, captura de variáveis (effectively final) e ::',
            moduleTitle: '03 · Java in-Depth (Funcional & Streams)',
            estimatedMinutes: 12,
          },
          {
            id: '03-java-in-depth/03-java-funcional/04-optional.md',
            title: 'Funcional: 04. Optional',
            subtitle: 'Eliminação de NullPointerException, contêiner Optional<T> e operações fluentes',
            moduleTitle: '03 · Java in-Depth (Funcional & Streams)',
            estimatedMinutes: 11,
          },
          {
            id: '03-java-in-depth/03-java-funcional/05-streams-fundamentos.md',
            title: 'Funcional: 05. Streams Fundamentos',
            subtitle: 'Pipelines de processamento, Lazy Evaluation e operações intermediárias',
            moduleTitle: '03 · Java in-Depth (Funcional & Streams)',
            estimatedMinutes: 13,
          },
          {
            id: '03-java-in-depth/03-java-funcional/06-streams-coletores-e-reducao.md',
            title: 'Funcional: 06. Coletores & Redução',
            subtitle: 'Consumo de streams, reduções com reduce e agrupamentos com Collectors',
            moduleTitle: '03 · Java in-Depth (Funcional & Streams)',
            estimatedMinutes: 13,
          },
        ],
      },
    ],
  },
  {
    id: 'ecossistema',
    title: '🛠️ Eixo: Ecossistema',
    badge: 'Eixo',
    description: 'Maven, Lombok, Jackson, JDBC SQLite e Hibernate JPA.',
    submodules: [
      {
        id: 'ecossistema/maven',
        title: 'Maven (Build & Dependências)',
        badge: 'Maven',
        description: 'Gerenciamento de dependências, pom.xml e ciclos de vida de build.',
        files: [
          {
            id: 'ecossistema/maven/01-fundamentos-e-estrutura.md',
            title: 'Maven: 01. Fundamentos e Estrutura',
            subtitle: 'Build tools, Convention over Configuration e árvore padrão',
            moduleTitle: 'Ecossistema · Maven',
            estimatedMinutes: 9,
          },
          {
            id: 'ecossistema/maven/02-pom-xml-e-dependencias.md',
            title: 'Maven: 02. POM.xml e Dependências',
            subtitle: 'Anatomia do pom.xml, coordenadas GAV, repositórios e escopos',
            moduleTitle: 'Ecossistema · Maven',
            estimatedMinutes: 10,
          },
          {
            id: 'ecossistema/maven/03-ciclo-de-vida-e-build.md',
            title: 'Maven: 03. Ciclo de Vida e Build',
            subtitle: 'Fases de build (compile, test, package), geração de JAR e execução',
            moduleTitle: 'Ecossistema · Maven',
            estimatedMinutes: 9,
          },
        ],
      },
      {
        id: 'ecossistema/lombok',
        title: 'Lombok (Redução de Boilerplate)',
        badge: 'Lombok',
        description: 'Anotações para geração em tempo de compilação de getters, setters e construtores.',
        files: [
          {
            id: 'ecossistema/lombok/01-fundamentos-e-setup.md',
            title: 'Lombok: 01. Fundamentos e Setup',
            subtitle: 'O problema do boilerplate, processamento de anotações e pom.xml',
            moduleTitle: 'Ecossistema · Lombok',
            estimatedMinutes: 8,
          },
          {
            id: 'ecossistema/lombok/02-anotacoes-de-acesso-e-utilidades.md',
            title: 'Lombok: 02. Acesso e Utilidades',
            subtitle: '@Getter, @Setter, @ToString e @EqualsAndHashCode',
            moduleTitle: 'Ecossistema · Lombok',
            estimatedMinutes: 9,
          },
          {
            id: 'ecossistema/lombok/03-construtores-automaticos.md',
            title: 'Lombok: 03. Construtores Automáticos',
            subtitle: '@NoArgsConstructor, @AllArgsConstructor e proteção',
            moduleTitle: 'Ecossistema · Lombok',
            estimatedMinutes: 8,
          },
          {
            id: 'ecossistema/lombok/04-anotacoes-agregadoras-data-e-value.md',
            title: 'Lombok: 04. Data & Value',
            subtitle: 'Entidades mutáveis (@Data) vs objetos de valor imutáveis (@Value)',
            moduleTitle: 'Ecossistema · Lombok',
            estimatedMinutes: 9,
          },
          {
            id: 'ecossistema/lombok/05-lombok-vs-records.md',
            title: 'Lombok: 05. Lombok vs Records',
            subtitle: 'Comparativo funcionalidade por funcionalidade e bússola de decisão',
            moduleTitle: 'Ecossistema · Lombok',
            estimatedMinutes: 9,
          },
        ],
      },
      {
        id: 'ecossistema/jackson',
        title: 'Jackson (JSON & Serialização)',
        badge: 'Jackson',
        description: 'Serialização e desserialização de JSON, anotações de mapeamento e polimorfismo.',
        files: [
          {
            id: 'ecossistema/jackson/01-fundamentos-e-setup.md',
            title: 'Jackson: 01. Fundamentos e Setup',
            subtitle: 'Fundamentos de JSON, módulos Jackson e dependência no pom.xml',
            moduleTitle: 'Ecossistema · Jackson',
            estimatedMinutes: 8,
          },
          {
            id: 'ecossistema/jackson/02-object-mapper-e-operacoes-basicas.md',
            title: 'Jackson: 02. ObjectMapper Básico',
            subtitle: 'Serialização, desserialização e coleções com TypeReference',
            moduleTitle: 'Ecossistema · Jackson',
            estimatedMinutes: 9,
          },
          {
            id: 'ecossistema/jackson/03-anotacoes-essenciais.md',
            title: 'Jackson: 03. Anotações Essenciais',
            subtitle: '@JsonProperty, @JsonIgnore, segurança e tolerância a novos campos',
            moduleTitle: 'Ecossistema · Jackson',
            estimatedMinutes: 9,
          },
          {
            id: 'ecossistema/jackson/04-records-enums-e-datas.md',
            title: 'Jackson: 04. Records, Enums e Datas',
            subtitle: 'Mapeamento com Records, Enums, java.time e polimorfismo JSON',
            moduleTitle: 'Ecossistema · Jackson',
            estimatedMinutes: 10,
          },
          {
            id: 'ecossistema/jackson/05-integracoes-e-ecossistema.md',
            title: 'Jackson: 05. Integrações',
            subtitle: 'Integração Lombok + Jackson e funcionamento no Spring Boot',
            moduleTitle: 'Ecossistema · Jackson',
            estimatedMinutes: 9,
          },
        ],
      },
      {
        id: 'ecossistema/jdbc-sqlite',
        title: 'JDBC com SQLite (Persistência Relacional)',
        badge: 'JDBC',
        description: 'Operações de banco nativas com JDBC, PreparedStatement, transações e DAO.',
        files: [
          {
            id: 'ecossistema/jdbc-sqlite/01-fundamentos-e-setup-sqlite.md',
            title: 'JDBC: 01. Setup SQLite & Arquitetura',
            subtitle: 'Arquitetura JDBC, drivers, SQLite e try-with-resources',
            moduleTitle: 'Ecossistema · JDBC SQLite',
            estimatedMinutes: 10,
          },
          {
            id: 'ecossistema/jdbc-sqlite/02-manipulacao-de-tabelas-com-statement.md',
            title: 'JDBC: 02. DDL com Statement',
            subtitle: 'CREATE TABLE, ALTER TABLE e tipos de dados no SQLite',
            moduleTitle: 'Ecossistema · JDBC SQLite',
            estimatedMinutes: 9,
          },
          {
            id: 'ecossistema/jdbc-sqlite/03-sql-injection-e-prepared-statement.md',
            title: 'JDBC: 03. SQL Injection & PreparedStatement',
            subtitle: 'Vulnerabilidades de concatenação e proteção com PreparedStatement',
            moduleTitle: 'Ecossistema · JDBC SQLite',
            estimatedMinutes: 10,
          },
          {
            id: 'ecossistema/jdbc-sqlite/04-operacoes-de-escrita.md',
            title: 'JDBC: 04. Operações de Escrita',
            subtitle: 'executeUpdate() (INSERT, UPDATE, DELETE) e chaves autogeradas',
            moduleTitle: 'Ecossistema · JDBC SQLite',
            estimatedMinutes: 9,
          },
          {
            id: 'ecossistema/jdbc-sqlite/05-operacoes-de-leitura.md',
            title: 'JDBC: 05. Operações de Leitura',
            subtitle: 'SELECT, navegação de cursor com ResultSet e mapeamento',
            moduleTitle: 'Ecossistema · JDBC SQLite',
            estimatedMinutes: 10,
          },
          {
            id: 'ecossistema/jdbc-sqlite/06-transacoes-e-atomicidade.md',
            title: 'JDBC: 06. Transações & ACID',
            subtitle: 'Propriedades ACID, setAutoCommit(false), commit() e rollback()',
            moduleTitle: 'Ecossistema · JDBC SQLite',
            estimatedMinutes: 10,
          },
          {
            id: 'ecossistema/jdbc-sqlite/07-padrao-dao.md',
            title: 'JDBC: 07. Padrão DAO',
            subtitle: 'Arquitetura em camadas, isolamento e Padrão Data Access Object',
            moduleTitle: 'Ecossistema · JDBC SQLite',
            estimatedMinutes: 11,
          },
        ],
      },
      {
        id: 'ecossistema/hibernate-jpa',
        title: 'Hibernate JPA (ORM)',
        badge: 'JPA',
        description: 'Mapeamento Objeto-Relacional, ciclo de vida do EntityManager e JPQL.',
        files: [
          {
            id: 'ecossistema/hibernate-jpa/01-fundamentos-e-conceito-orm.md',
            title: 'JPA: 01. Fundamentos & ORM',
            subtitle: 'Impedance Mismatch, JPA vs Hibernate e setup',
            moduleTitle: 'Ecossistema · Hibernate JPA',
            estimatedMinutes: 10,
          },
          {
            id: 'ecossistema/hibernate-jpa/02-configuracao-persistence-xml.md',
            title: 'JPA: 02. persistence.xml',
            subtitle: 'Anatomia do persistence.xml, provedores, dialetos e hbm2ddl',
            moduleTitle: 'Ecossistema · Hibernate JPA',
            estimatedMinutes: 10,
          },
          {
            id: 'ecossistema/hibernate-jpa/03-mapeamento-de-entidades.md',
            title: 'JPA: 03. Mapeamento de Entidades',
            subtitle: '@Entity, @Id, chaves autogeradas, @EmbeddedId, datas e enums',
            moduleTitle: 'Ecossistema · Hibernate JPA',
            estimatedMinutes: 11,
          },
          {
            id: 'ecossistema/hibernate-jpa/04-entity-manager-e-operacoes-crud.md',
            title: 'JPA: 04. EntityManager & CRUD',
            subtitle: 'EntityManager, ciclo de vida (4 estados JPA), transações e CRUD',
            moduleTitle: 'Ecossistema · Hibernate JPA',
            estimatedMinutes: 12,
          },
          {
            id: 'ecossistema/hibernate-jpa/05-consultas-com-jpql.md',
            title: 'JPA: 05. Consultas com JPQL',
            subtitle: 'Consultas orientadas a objetos com JPQL, paginação e agregações',
            moduleTitle: 'Ecossistema · Hibernate JPA',
            estimatedMinutes: 12,
          },
        ],
      },
    ],
  },
];

/**
 * Recursively collects all ChapterItem instances from a module tree
 */
export function flattenModuleChapters(node: ModuleNode): ChapterItem[] {
  const result: ChapterItem[] = [];
  if (node.files && node.files.length > 0) {
    result.push(...node.files);
  }
  if (node.submodules && node.submodules.length > 0) {
    for (const sub of node.submodules) {
      result.push(...flattenModuleChapters(sub));
    }
  }
  return result;
}

export const ALL_CHAPTERS: ChapterItem[] = CURRICULUM_TREE.flatMap(flattenModuleChapters);

export function getChapterById(id: string): ChapterItem {
  return ALL_CHAPTERS.find((c) => c.id === id) || ALL_CHAPTERS[0];
}

export function getPrevNextChapter(currentId: string) {
  const index = ALL_CHAPTERS.findIndex((c) => c.id === currentId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? ALL_CHAPTERS[index - 1] : null,
    next: index < ALL_CHAPTERS.length - 1 ? ALL_CHAPTERS[index + 1] : null,
  };
}
