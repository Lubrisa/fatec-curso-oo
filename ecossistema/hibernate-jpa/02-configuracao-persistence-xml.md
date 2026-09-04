# 2. Configuração com persistence.xml

No capítulo anterior, compreendemos o conceito de ORM e adicionamos as
dependências do Hibernate e do SQLite ao `pom.xml`.

Para que a JPA saiba a qual banco de dados deve se conectar, quais credenciais
utilizar e como o Hibernate deve se comportar durante a execução, precisamos de
um arquivo de configuração padronizado: o **`persistence.xml`**.

Neste capítulo, aprenderemos onde posicionar esse arquivo, sua anatomia e as
principais propriedades de configuração.

## Localização Obrigatória do Arquivo

A especificação JPA exige que o arquivo de configuração esteja localizado
estritamente no diretório **`META-INF/`** dentro da pasta de recursos do Maven
(`src/main/resources`):

```text
meu-projeto/
├── pom.xml
└── src/
    └── main/
        ├── java/
        │   └── ... (seus arquivos .java)
        └── resources/
            └── META-INF/
                └── persistence.xml   <-- Localização padrão obrigatória
```

> **Atenção à Nomenclatura:**
>
> O nome da pasta deve ser exatamente `META-INF` (em maiúsculas) e o arquivo
> deve se chamar exatamente `persistence.xml` (em minúsculas). Se o caminho ou
> nome estiver incorreto, a JPA não conseguirá inicializar e lançará um erro de
> unidade de persistência não encontrada (`PersistenceException`).

## Anatomia do `persistence.xml`

Um arquivo `persistence.xml` moderno para SQLite com Hibernate 6 possui a
seguinte estrutura:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="https://jakarta.ee/xml/ns/persistence"
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xsi:schemaLocation="https://jakarta.ee/xml/ns/persistence
                                 https://jakarta.ee/xml/ns/persistence/persistence_3_0.xsd"
             version="3.0">

    <!-- 1. Declaração da Unidade de Persistência -->
    <persistence-unit name="loja-pu" transaction-type="RESOURCE_LOCAL">

        <!-- 2. Provedor JPA (Hibernate) -->
        <provider>org.hibernate.jpa.HibernatePersistenceProvider</provider>

        <!-- 3. Mapeamento explícito das entidades (Opcional, mas recomendado no Java SE) -->
        <class>br.com.fatec.model.Product</class>

        <properties>
            <!-- 4. Parâmetros de Conexão JDBC Padrão JPA -->
            <property name="jakarta.persistence.jdbc.driver" value="org.sqlite.JDBC" />
            <property name="jakarta.persistence.jdbc.url" value="jdbc:sqlite:loja_jpa.db" />

            <!-- 5. Dialeto do Banco de Dados -->
            <property name="hibernate.dialect" value="org.hibernate.community.dialect.SQLiteDialect" />

            <!-- 6. Logs e Depuração de SQL -->
            <property name="hibernate.show_sql" value="true" />
            <property name="hibernate.format_sql" value="true" />
            <property name="hibernate.highlight_sql" value="true" />

            <!-- 7. Geração Automática do Esquema DDL -->
            <property name="hibernate.hbm2ddl.auto" value="update" />
        </properties>

    </persistence-unit>
</persistence>
```

## Detalhamento dos Elementos

### 1. Unidade de Persistência (`<persistence-unit>`)

A tag `<persistence-unit>` define um agrupamento lógico de configurações para um
banco de dados específico:

- **`name="loja-pu"`:** O identificador único da sua unidade de persistência
  (_Persistence Unit_). É esse nome que passaremos no código Java para criar o
  `EntityManagerFactory`.
- **`transaction-type="RESOURCE_LOCAL"`:** Indica que o controle de transações
  será gerenciado manualmente pela aplicação via código (o padrão para
  aplicações Java SE sem servidores de aplicação corporativos).

### 2. Provedor JPA (`<provider>`)

Informa qual biblioteca fornecerá a implementação concreta da especificação JPA.
Para o Hibernate, utilizamos a classe
`org.hibernate.jpa.HibernatePersistenceProvider`.

### 3. Declaração de Entidades (`<class>`)

Em aplicações Java SE simples, listar as classes anotadas com `@Entity` dentro
de tags `<class>` garante que o Hibernate as registre imediatamente na
inicialização, evitando problemas de descoberta automática em diferentes IDEs.

### 4. Propriedades de Conexão JDBC (`jakarta.persistence.jdbc.*`)

Utilizamos as chaves padronizadas da JPA para configurar o acesso ao banco:

- **`jakarta.persistence.jdbc.driver`:** Nome da classe do driver JDBC
  (`org.sqlite.JDBC`).
- **`jakarta.persistence.jdbc.url`:** URL de conexão do banco
  (`jdbc:sqlite:loja_jpa.db`).
- Se o banco exigisse autenticação (como PostgreSQL ou MySQL), adicionaríamos
  também as propriedades `jakarta.persistence.jdbc.user` e
  `jakarta.persistence.jdbc.password`.

## Propriedades Especiais do Hibernate

### 1. O que é o Dialeto (`hibernate.dialect`)?

Cada banco de dados relacional possui particularidades sintáticas (por exemplo:
como gerar autoincremento, paginação de resultados com `LIMIT`, tipos de texto e
datas).

O **Dialeto** é o tradutor que ensina o Hibernate a gerar o SQL com a sintaxe
exata do banco utilizado:

- Para SQLite no Hibernate 6: `org.hibernate.community.dialect.SQLiteDialect`
- Para PostgreSQL: `org.hibernate.dialect.PostgreSQLDialect`
- Para MySQL: `org.hibernate.dialect.MySQLDialect`

### 2. Geração Automática de Tabelas (`hibernate.hbm2ddl.auto`)

O Hibernate pode inspecionar suas classes anotadas e sincronizar automaticamente
a estrutura das tabelas no banco de dados:

| Valor             | Comportamento                                                                   | Quando Usar                        |
| :---------------- | :------------------------------------------------------------------------------ | :--------------------------------- |
| **`update`**      | Cria novas tabelas e adiciona novas colunas sem apagar dados existentes.        | **Desenvolvimento no dia a dia**   |
| **`create`**      | Apaga as tabelas existentes e as recria do zero a cada inicialização.           | **Testes ou protótipos rápidos**   |
| **`create-drop`** | Cria as tabelas na inicialização e as destrói quando a aplicação fecha.         | **Testes automatizados com JUnit** |
| **`validate`**    | Não altera o banco; apenas valida se o schema existente bate com o código Java. | **Ambientes de Produção**          |

> **Perigo em Produção:**
>
> **Nunca utilize `create` ou `create-drop` em ambientes de produção!** Toda vez
> que a aplicação for reiniciada, todas as tabelas e dados reais dos clientes
> serão apagados. Em produção, utilize `validate` ou ferramentas de migração de
> schema (como Flyway ou Liquibase).

### 3. Exibição e Formatação de Consultas SQL

Durante a fase de aprendizado e depuração, é fundamental enxergar o SQL que o
Hibernate gera nos bastidores:

- **`hibernate.show_sql = true`:** Imprime no console cada instrução SQL
  executada.
- **`hibernate.format_sql = true`:** Formata e indenta o SQL em várias linhas,
  tornando-o legível.
- **`hibernate.highlight_sql = true`:** Aplica cores ANSI às palavras-chave do
  SQL no terminal.

> **Checkpoint:**
>
> Se você decidir migrar sua aplicação de SQLite para PostgreSQL no futuro,
> quais linhas do arquivo `persistence.xml` precisarão ser alteradas? Você
> precisará reescrever suas classes Java ou suas entidades?

---

<a href="01-fundamentos-e-conceito-orm.md">← Fundamentos de JPA, Hibernate e
Conceito ORM</a>

<p align="right"><a href="03-mapeamento-de-entidades.md">Próximo: Mapeamento de Entidades e Anotações →</a></p>
