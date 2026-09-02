# 2. Manipulação de Tabelas com Statement

No capítulo anterior, aprendemos a estabelecer uma conexão segura com o SQLite
utilizando o JDBC e o _try-with-resources_.

Antes de começarmos a salvar ou consultar dados da nossa aplicação, precisamos
definir a estrutura do banco de dados (as tabelas e suas colunas).

Neste capítulo, aprenderemos a utilizar comandos **DDL** (_Data Definition
Language_) para criar, alterar e excluir tabelas através do objeto
**`Statement`**.

## 1. O que é o `Statement`?

A interface **`Statement`** (do pacote `java.sql`) representa o canal pelo qual
enviamos instruções SQL estáticas e diretas para o banco de dados.

Para obter um `Statement`, utilizamos o método `createStatement()` a partir de
uma conexão ativa:

```java
try (Connection conn = DriverManager.getConnection(url);
     Statement stmt = conn.createStatement()) {

    // Execução de comandos SQL

}
```

> **Fechamento Automático:**
>
> Assim como a `Connection`, o `Statement` também implementa `AutoCloseable` e
> deve ser declarado dentro do _try-with-resources_ para ser liberado
> automaticamente após o uso.

## 2. Tipos de Dados no SQLite vs Java

Ao criar tabelas no SQLite, utilizamos tipos de dados compatíveis com as classes
e primitivos do Java:

| Tipo SQLite   | Equivalente em Java                  | Descrição                                                                                            |
| :------------ | :----------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **`INTEGER`** | `Long`, `long`, `Integer`, `int`     | Inteiros de até **64 bits** no SQLite. Para `INTEGER PRIMARY KEY`, normalmente usa-se `Long`/`long`. |
| **`TEXT`**    | `String`                             | Texto. Datas/horários podem ser armazenados como TEXT, por exemplo em ISO 8601.                      |
| **`REAL`**    | `Double`, `double`, `Float`, `float` | Ponto flutuante IEEE 754 de 64 bits no SQLite. `Double` é o mapeamento mais natural.                 |
| **`INTEGER`** | `Boolean`\*                          | Convenção comum: `0 = false`, `1 = true`. SQLite não possui um tipo booleano nativo.                 |
| **`BLOB`**    | `byte[]`                             | Dados binários brutos (imagens, arquivos compactados).                                               |

## 3. Criando Tabelas (`CREATE TABLE IF NOT EXISTS`)

Para executar instruções DDL (como criar ou modificar tabelas), utilizamos o
método **`execute(sql)`** do `Statement`:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;

public class CreateTableDemo {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:loja.db";

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
            System.out.println("Tabela 'products' criada ou verificada com sucesso!");

        } catch (SQLException e) {
            System.err.println("Erro ao criar a tabela: " + e.getMessage());
        }
    }
}
```

> **Por que usar `IF NOT EXISTS`?**
>
> Se tentarmos criar uma tabela que já existe sem essa cláusula, o banco lançará
> um erro de `SQLException: table products already exists`. A cláusula `IF NOT EXISTS`
> garante que a instrução seja idempotente (ou seja, pode ser executada
> toda vez que o programa iniciar sem quebrar a aplicação).

## 4. Alterando a Estrutura de Tabelas (`ALTER TABLE`)

Se o modelo de dados da aplicação evoluir e precisarmos adicionar uma nova
coluna a uma tabela já existente no banco de dados, utilizamos o comando
**`ALTER TABLE`**:

```java
String sql = "ALTER TABLE products ADD COLUMN category TEXT;";

try (Connection conn = DriverManager.getConnection(url);
     Statement stmt = conn.createStatement()) {

    stmt.execute(sql);
    System.out.println("Coluna 'category' adicionada com sucesso!");

} catch (SQLException e) {
    System.err.println("Erro ao alterar a tabela: " + e.getMessage());
}
```

## 5. Excluindo Tabelas (`DROP TABLE IF EXISTS`)

Em rotinas de testes automatizados ou reinicialização de ambientes de
desenvolvimento, pode ser necessário apagar completamente uma tabela e seus
dados:

```java
String sql = "DROP TABLE IF EXISTS products;";

try (Connection conn = DriverManager.getConnection(url);
     Statement stmt = conn.createStatement()) {

    stmt.execute(sql);
    System.out.println("Tabela 'products' excluída com sucesso!");

} catch (SQLException e) {
    System.err.println("Erro ao excluir a tabela: " + e.getMessage());
}
```

## Resumo dos Métodos do `Statement` para DDL

- **`statement.execute(sql)`:** Método geral para executar instruções de
  definição de dados (DDL) como `CREATE TABLE`, `ALTER TABLE` e `DROP TABLE`.
- **`IF NOT EXISTS` / `IF EXISTS`:** Salvaguardas essenciais para que scripts de
  inicialização e limpeza rodem de forma previsível e segura.

No próximo capítulo, aprenderemos por que **nunca** devemos usar o `Statement`
para comandos dinâmicos com dados digitados por usuários e como o
**`PreparedStatement`** nos protege contra o perigoso ataque de **SQL
Injection**.

<a href="01-fundamentos-e-setup-sqlite.md">← 1. Fundamentos de JDBC e Setup com
SQLite</a>

<p align="right"><a href="03-sql-injection-e-prepared-statement.md">Próximo: SQL Injection e PreparedStatement →</a></p>
