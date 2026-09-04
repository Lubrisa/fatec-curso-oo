# 2. Manipulação de Tabelas com Statement

No capítulo anterior, aprendemos a estabelecer uma conexão segura com o SQLite
utilizando o JDBC e o _try-with-resources_.

Antes de manipular registros, precisamos garantir que as tabelas existam no
banco de dados. Neste capítulo, aprenderemos a executar comandos **DDL** (_Data
Definition Language_) através do objeto **`Statement`**.

## O que é o `Statement`?

A interface **`Statement`** (do pacote `java.sql`) é o canal pelo qual enviamos
instruções SQL estáticas para o banco de dados.

Como o `Statement` também implementa `AutoCloseable`, a boa prática é declará-lo
diretamente dentro do _try-with-resources_ junto com a conexão:

```java
try (Connection conn = DriverManager.getConnection(url);
     Statement stmt = conn.createStatement()) {

    // Execução de comandos SQL via Statement

}
```

## Tipos de Dados no SQLite vs Java

Ao definir colunas no SQLite, mapeamos os tipos de acordo com as classes e tipos
primitivos do Java:

| Tipo SQLite   | Equivalente em Java                   | Descrição                                                                                  |
| :------------ | :------------------------------------ | :----------------------------------------------------------------------------------------- |
| **`INTEGER`** | `Long`, `long`, `Integer`, `int`      | Inteiros de até **64 bits**. Para `INTEGER PRIMARY KEY`, normalmente usa-se `Long`/`long`. |
| **`TEXT`**    | `String`                              | Textos e strings. Datas em formato ISO-8601 também são gravadas como `TEXT`.               |
| **`REAL`**    | `Double`, `double`, `Float`, `float`  | Números decimais de ponto flutuante de 64 bits.                                            |
| **`INTEGER`** | `Boolean`                             | Convenção comum: `0 = false`, `1 = true` (o SQLite não possui tipo booleano nativo).       |
| **`BLOB`**    | `byte[]`                              | Dados binários puros (arquivos, imagens).                                                  |
| **`NULL`**    | `null` (qualquer tipo por referência) | Ausência de valor.                                                                         |

> **Valores Monetários e `BigDecimal` no SQLite:**
>
> O SQLite não possui um tipo nativo para decimais exatos de ponto fixo (como o
> `DECIMAL`/`NUMERIC` de outros bancos). Para valores monetários onde a precisão
> é crítica, a convenção em Java é armazenar como **`TEXT`** (convertendo para
> `BigDecimal` na aplicação) ou como **`INTEGER`** (armazenando o valor em
> centavos).

## Executando Comandos DDL (`stmt.execute`)

Para executar instruções de definição de estrutura (como `CREATE`, `ALTER` e
`DROP`), utilizamos o método **`execute(sql)`**:

```java
String sql = """
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        price REAL NOT NULL,
        quantity INTEGER DEFAULT 0
    );
    """;

try (Connection conn = DriverManager.getConnection(url);
     Statement stmt = conn.createStatement()) {

    stmt.execute(sql);
    System.out.println("Tabela 'products' verificada/criada com sucesso!");

}
```

> **Por que usar `IF NOT EXISTS`?**
>
> A cláusula `IF NOT EXISTS` garante a **idempotência** da instrução: o código
> pode ser executado toda vez que a aplicação iniciar sem lançar erro de tabela
> já existente (`SQLException`).

### Outras Operações DDL com `execute()`

O mesmo método `stmt.execute()` serve para qualquer outra modificação
estrutural:

```java
// Adicionando uma nova coluna:
stmt.execute("ALTER TABLE products ADD COLUMN category TEXT;");

// Excluindo uma tabela existente:
stmt.execute("DROP TABLE IF EXISTS products;");
```

## Limitações do `Statement` Simples

O `Statement` simples é adequado apenas para comandos estáticos de estrutura
(DDL) onde não há valores variáveis digitados por usuários.

Quando precisamos manipular dados dinâmicos (inserir, atualizar ou buscar
registros informados pelo usuário), utilizar o `Statement` comum concatenando
strings abre brechas críticas de segurança. No próximo capítulo, entenderemos o
perigo do **SQL Injection** e como o **`PreparedStatement`** resolve esse
problema.

---

<a href="01-fundamentos-e-setup-sqlite.md">← Fundamentos de JDBC e Setup com
SQLite</a>

<p align="right"><a href="03-sql-injection-e-prepared-statement.md">Próximo: SQL Injection e PreparedStatement →</a></p>
