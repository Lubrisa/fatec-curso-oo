# 4. Operações de Escrita (INSERT, UPDATE, DELETE)

No capítulo anterior, aprendemos como o `PreparedStatement` protege nossas
aplicações contra ataques de SQL Injection através da parametrização de valores.

Neste capítulo, vamos aplicar o `PreparedStatement` para realizar as três
operações fundamentais de alteração e escrita de dados no banco de dados:

- **`INSERT`:** Inserir novos registros.
- **`UPDATE`:** Atualizar registros existentes.
- **`DELETE`:** Remover registros.

## O Método `executeUpdate()`

Diferente das consultas de leitura, todas as operações de escrita no JDBC são
executadas através do método **`executeUpdate()`**.

### O que o `executeUpdate()` Retorna?

O `executeUpdate()` retorna um valor inteiro (`int`) que representa o **número
de linhas afetadas** no banco de dados pela instrução executada:

- No **`INSERT`:** Retorna `1` (ou a quantidade de linhas inseridas).
- No **`UPDATE`:** Retorna a quantidade de registros que atenderam à condição e
  foram alterados.
- No **`DELETE`:** Retorna a quantidade de registros que foram removidos.

Se o retorno for `0` em um `UPDATE` ou `DELETE`, significa que nenhum registro
atendeu ao critério da cláusula `WHERE`.

## Inserindo Dados (`INSERT INTO`)

Para inserir um novo registro na tabela, montamos o comando com marcadores `?` e
preenchemos os valores de forma tipada:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class InsertDemo {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:loja.db";

        String sql = """
                     INSERT INTO products (name, price, quantity)
                     VALUES (?, ?, ?);
                     """;

        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, "Mouse Gamer RGB");
            pstmt.setDouble(2, 189.90);
            pstmt.setInt(3, 15);

            int rowsAffected = pstmt.executeUpdate();
            System.out.println("Linhas inseridas: " + rowsAffected);

        } catch (SQLException e) {
            System.err.println("Erro ao inserir produto: " + e.getMessage());
        }
    }
}
```

## Recuperando o ID Gerado Automaticamente

Quando criamos tabelas com chave primária autoincrementada (`INTEGER PRIMARY
KEY`), o SQLite gera o ID sequencial automaticamente.

Em sistemas reais, quase sempre precisamos saber qual foi o **ID gerado** para
atribuir ao objeto Java em memória ou retornar para a interface do usuário.

Para recuperar o ID gerado:

1. Passamos a flag `Statement.RETURN_GENERATED_KEYS` na criação do
   `PreparedStatement`.
2. Chamamos o método `pstmt.getGeneratedKeys()` após o `executeUpdate()`.

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class InsertWithGeneratedKeyDemo {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:loja.db";

        String sql = """
                     INSERT INTO products (name, price, quantity)
                     VALUES (?, ?, ?);
                     """;

        // 1. Solicitamos o retorno das chaves geradas:
        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setString(1, "Monitor 24 Polegadas");
            pstmt.setDouble(2, 850.00);
            pstmt.setInt(3, 8);

            pstmt.executeUpdate();

            // 2. Recuperamos o ID gerado a partir do cursor:
            try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    long generatedId = generatedKeys.getLong(1);
                    System.out.println("Produto cadastrado com o ID: " + generatedId);
                }
            }

        } catch (SQLException e) {
            System.err.println("Erro na inserção: " + e.getMessage());
        }
    }
}
```

## Atualizando Registros (`UPDATE`)

Para atualizar os dados de um registro existente, combinamos o comando `UPDATE`
com a cláusula `WHERE`:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class UpdateDemo {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:loja.db";

        String sql = """
                     UPDATE products
                     SET price = ?, quantity = ?
                     WHERE id = ?;
                     """;

        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            // Novos valores:
            pstmt.setDouble(1, 199.90); // Novo preço
            pstmt.setInt(2, 20);        // Nova quantidade
            pstmt.setLong(3, 1L);       // ID do produto que será atualizado

            int rowsAffected = pstmt.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("Produto atualizado com sucesso!");
            } else {
                System.out.println("Nenhum produto encontrado com o ID informado.");
            }

        } catch (SQLException e) {
            System.err.println("Erro ao atualizar produto: " + e.getMessage());
        }
    }
}
```

---

## Excluindo Registros (`DELETE`)

A exclusão é realizada com o comando `DELETE`:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class DeleteDemo {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:loja.db";

        String sql = """
                     DELETE FROM products
                     WHERE id = ?;
                     """;

        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, 1L); // ID do produto a ser excluído

            int rowsAffected = pstmt.executeUpdate();

            if (rowsAffected > 0) {
                System.out.println("Produto removido com sucesso!");
            } else {
                System.out.println("Nenhum produto encontrado para remoção.");
            }

        } catch (SQLException e) {
            System.err.println("Erro ao excluir produto: " + e.getMessage());
        }
    }
}
```

> **Atenção Vital com o `UPDATE` e o `DELETE`:**
>
> Nunca esqueça de incluir a cláusula `WHERE` em comandos `UPDATE` e `DELETE`.
> Executar um `DELETE FROM products;` sem `WHERE` apagará **todos** os registros
> da tabela instantaneamente!

No próximo capítulo, aprenderemos como realizar **operações de leitura**
(`SELECT`) e como percorrer os resultados utilizando o cursor `ResultSet`.

---

<a href="03-sql-injection-e-prepared-statement.md">← SQL Injection e PreparedStatement</a>

<p align="right"><a href="05-operacoes-de-leitura.md">Próximo: Operações de Leitura com ResultSet →</a></p>
