# 4. Operações de Escrita (INSERT, UPDATE, DELETE)

No capítulo anterior, aprendemos como o `PreparedStatement` protege nossas
aplicações contra ataques de SQL Injection através da parametrização de valores.

Neste capítulo, vamos aplicar o `PreparedStatement` nas três operações
fundamentais de alteração e escrita de dados no banco de dados: **`INSERT`**,
**`UPDATE`** e **`DELETE`**.

## O Método `executeUpdate()`

Diferente das consultas de leitura, todas as operações de escrita no JDBC são
executadas através do método **`executeUpdate()`**.

O `executeUpdate()` retorna um valor inteiro (`int`) que representa o **número
de linhas afetadas** no banco de dados pela instrução executada:

- No **`INSERT`:** Retorna `1` (ou a quantidade de linhas inseridas).
- No **`UPDATE`:** Retorna a quantidade de registros que foram alterados.
- No **`DELETE`:** Retorna a quantidade de registros que foram removidos.

Se o retorno for `0` em um `UPDATE` ou `DELETE`, significa que nenhum registro
atendeu ao critério da cláusula `WHERE`.

## Executando Comandos de Escrita

A estrutura para executar comandos de escrita parametrizados segue sempre o
mesmo padrão no JDBC:

```java
// 1. INSERINDO um novo registro:
String sqlInsert = "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?);";
try (Connection conn = DriverManager.getConnection(url);
     PreparedStatement pstmt = conn.prepareStatement(sqlInsert)) {

    pstmt.setString(1, "Mouse Gamer RGB");
    pstmt.setDouble(2, 189.90);
    pstmt.setInt(3, 15);

    int rowsAffected = pstmt.executeUpdate();
    System.out.println("Linhas inseridas: " + rowsAffected);
}

// 2. ATUALIZANDO um registro existente:
String sqlUpdate = "UPDATE products SET price = ?, quantity = ? WHERE id = ?;";
try (Connection conn = DriverManager.getConnection(url);
     PreparedStatement pstmt = conn.prepareStatement(sqlUpdate)) {

    pstmt.setDouble(1, 199.90);
    pstmt.setInt(2, 20);
    pstmt.setLong(3, 1L);

    int rowsAffected = pstmt.executeUpdate();
    System.out.println("Linhas atualizadas: " + rowsAffected);
}

// 3. EXCLUINDO um registro:
String sqlDelete = "DELETE FROM products WHERE id = ?;";
try (Connection conn = DriverManager.getConnection(url);
     PreparedStatement pstmt = conn.prepareStatement(sqlDelete)) {

    pstmt.setLong(1, 1L);

    int rowsAffected = pstmt.executeUpdate();
    System.out.println("Linhas excluídas: " + rowsAffected);
}
```

> **Atenção de Segurança com `UPDATE` e `DELETE`:**
>
> Nunca esqueça de incluir a cláusula `WHERE` em comandos `UPDATE` e `DELETE`.
> Executar um `DELETE FROM products;` ou `UPDATE products SET price = 0;` sem a
> restrição do `WHERE` afetará **todos** os registros da tabela de uma só vez!

## Recuperando o ID Gerado Automaticamente

Quando criamos tabelas com chave primária autoincrementada (`INTEGER PRIMARY
KEY`), o SQLite gera o ID sequencial automaticamente.

Em sistemas reais, quase sempre precisamos saber qual foi o **ID gerado** para
atribuir ao objeto Java em memória ou retornar para a interface do usuário.

Para recuperar o ID gerado pelo JDBC:

1. Passamos a flag **`Statement.RETURN_GENERATED_KEYS`** na criação do
   `PreparedStatement`.
2. Chamamos o método **`pstmt.getGeneratedKeys()`** logo após o `executeUpdate()`.

```java
String sql = "INSERT INTO products (name, price, quantity) VALUES (?, ?, ?);";

try (Connection conn = DriverManager.getConnection(url);
     PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

    pstmt.setString(1, "Monitor 24 Polegadas");
    pstmt.setDouble(2, 850.00);
    pstmt.setInt(3, 8);

    pstmt.executeUpdate();

    // Recupera a chave gerada automaticamente pelo banco:
    try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
        if (generatedKeys.next()) {
            long generatedId = generatedKeys.getLong(1);
            System.out.println("Produto cadastrado com o ID: " + generatedId);
        }
    }
}
```

---

<a href="03-sql-injection-e-prepared-statement.md">← SQL Injection e PreparedStatement</a>

<p align="right"><a href="05-operacoes-de-leitura.md">Próximo: Operações de Leitura com ResultSet →</a></p>
