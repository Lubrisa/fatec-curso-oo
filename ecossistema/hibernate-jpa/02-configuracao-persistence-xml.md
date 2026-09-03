# 2. Configuração com persistence.xml

No capítulo anterior, aprendemos o conceito de ORM e adicionamos o Hibernate e o
driver SQLite ao `pom.xml`.

Para que a JPA saiba a qual banco de dados deve se conectar, qual usuário/senha
utilizar e como o Hibernate deve se comportar durante a execução, precisamos de
um arquivo de configuração padronizado: o **`persistence.xml`**.

Neste capítulo, aprenderemos onde posicionar esse arquivo, sua estrutura e as
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
> deve se chamar exatamente `persistence.xml` (em minúsculas). Se o caminho
> estiver incorreto, a JPA não conseguirá inicializar e lançará erro de unidade
> de persistência não encontrada.

## Anatomia do `persistence.xml`

Um arquivo `persistence.xml` típico para SQLite com Hibernate possui a seguinte
estrutura:

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

        <properties>
            <!-- 3. Parâmetros de Conexão JDBC -->
            <property name="jakarta.persistence.jdbc.driver" value="org.sqlite.JDBC" />
            <property name="jakarta.persistence.jdbc.url" value="jdbc:sqlite:loja_jpa.db" />

            <!-- 4. Dialeto do Banco de Dados -->
            <property name="hibernate.dialect" value="org.hibernate.community.dialect.SQLiteDialect" />

            <!-- 5. Logs e Depuração de SQL -->
            <property name="hibernate.show_sql" value="true" />
            <property name="hibernate.format_sql" value="true" />
            <property name="hibernate.highlight_sql" value="true" />

            <!-- 6. Geração Automática do Esquema DDL -->
            <property name="hibernate.hbm2ddl.auto" value="update" />
        </properties>

    </persistence-unit>
</persistence>
```

## Detalhamento dos Elementos

### 1. Unidade de Persistência (`<persistence-unit>`)

A tag `<persistence-unit>` define um agrupamento lógico de configurações para um
banco de dados:

- **`name="loja-pu"`:** O identificador único da sua unidade de persistência. É
  esse nome que você usará no código Java para criar o `EntityManagerFactory`.
- **`transaction-type="RESOURCE_LOCAL"`:** Indica que o controle de transações
  será gerenciado manualmente pela própria aplicação (o padrão para aplicações
  Java SE).

### 2. Provedor JPA (`<provider>`)

Informa qual biblioteca fornecerá a implementação da JPA. Para o Hibernate,
utilizamos `org.hibernate.jpa.HibernatePersistenceProvider`.

### 3. Propriedades de Conexão JDBC (`jakarta.persistence.jdbc.*`)

- **`jdbc.driver`:** Classe do driver (`org.sqlite.JDBC`).
- **`jdbc.url`:** URL de conexão do banco (`jdbc:sqlite:loja_jpa.db`).

## Propriedades Especiais do Hibernate

### Geração Automática de Tabelas (`hibernate.hbm2ddl.auto`)

Uma das maiores facilidades do Hibernate é a capacidade de ler suas classes Java
e criar ou atualizar as tabelas do banco automaticamente:

| Valor             | Comportamento                                                                         | Quando Usar                                   |
| :---------------- | :------------------------------------------------------------------------------------ | :-------------------------------------------- |
| **`update`**      | Cria novas tabelas e adiciona novas colunas sem apagar os dados existentes.           | **Desenvolvimento no dia a dia**              |
| **`create`**      | Apaga as tabelas existentes e as recria do zero a cada inicialização da aplicação.    | **Testes ou protótipos rápidos**              |
| **`create-drop`** | Cria as tabelas na inicialização e as apaga automaticamente quando a aplicação fecha. | **Testes automatizados unitários/integração** |
| **`validate`**    | Não altera o banco; apenas verifica se as tabelas existentes batem com o código Java. | **Ambientes de Produção**                     |

### Exibição de Consultas (`show_sql` e `format_sql`)

- **`hibernate.show_sql = true`:** Imprime no terminal cada instrução SQL que o
  Hibernate gerar em tempo de execução.
- **`hibernate.format_sql = true`:** Formata e indenta o SQL exibido no console,
  facilitando a leitura e o aprendizado durante o desenvolvimento.

No próximo capítulo, aprenderemos a mapear nossas classes de domínio com as
**anotações essenciais da JPA** (`@Entity`, `@Id`, `@Column`, etc.).

---

<a href="01-fundamentos-e-conceito-orm.md">← Fundamentos de JPA, Hibernate e Conceito ORM</a>

<p align="right"><a href="03-mapeamento-de-entidades.md">Próximo: Mapeamento de Entidades e Anotações →</a></p>
