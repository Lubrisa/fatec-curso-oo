# 3. SQL Injection e PreparedStatement

No capítulo anterior, aprendemos a utilizar o `Statement` para executar comandos
DDL e estruturar nossas tabelas.

No entanto, quando desenvolvemos sistemas que interagem com usuários (como telas
de login, formulários de cadastro ou APIs), precisamos executar comandos SQL que
recebem dados dinâmicos digitados externamente.

Concatenar textos diretamente em uma consulta SQL é uma das falhas de segurança
mais graves e conhecidas da computação: o **SQL Injection**.

Neste capítulo, entenderemos como esse ataque funciona na prática e como a
interface **`PreparedStatement`** do JDBC nos protege de forma definitiva.

## O Perigo do SQL Injection

O ataque de **SQL Injection** ocorre quando dados fornecidos por um usuário são
concatenados diretamente no texto do comando SQL, permitindo que um invasor
altere a lógica original da consulta.

### Exemplo de Código Vulnerável com Concatenação

Imagine uma verificação simples de login feita com `Statement`:

```java
// ⚠️ CÓDIGO VULNERÁVEL - NUNCA FAÇA ISSO!
String email = request.getEmail();
String password = request.getPassword();

String sql = """
             SELECT *
             FROM users
             WHERE email = '%s' AND password = '%s';
             """.formatted(email, password);

Statement stmt = conn.createStatement();
ResultSet rs = stmt.executeQuery(sql);
```

### O Cenário do Ataque

Se um usuário mal-intencionado digitar no campo de e-mail exatamente o seguinte
texto:

```text
admin@email.com' OR '1'='1
```

A consulta SQL resultante enviada ao banco de dados será:

```sql
SELECT *
FROM users
WHERE email = 'admin@email.com' OR '1'='1' AND password = '...';
```

Como `'1'='1'` é uma condição **sempre verdadeira**, o banco de dados retornará
o registro do usuário `admin` e concederá acesso ao sistema sem que o invasor
saiba a senha correta!

Em casos ainda mais graves, um invasor pode injetar comandos como `'; DROP TABLE
users; --`, destruindo tabelas inteiras da aplicação.

## A Solução Definitiva: `PreparedStatement`

A interface **`PreparedStatement`** (do pacote `java.sql`) foi projetada
especificamente para eliminar o risco de SQL Injection.

Em vez de concatenar valores diretamente no texto do SQL, nós escrevemos a
estrutura do comando utilizando **marcadores de posição** (_placeholders_),
representados pelo caractere **`?`**:

```java
String sql = """
             SELECT *
             FROM users
             WHERE email = ? AND password = ?;
             """;
```

### Como o `PreparedStatement` Garante a Segurança?

1. **Separação entre Código e Dados:** O banco de dados compila previamente a
   estrutura do comando SQL _antes_ de receber os parâmetros.
2. **Tratamento Literal dos Parâmetros:** Qualquer valor passado para os
   marcadores `?` é tratado estritamente como dado literal (texto, número,
   etc.), e **nunca como código executável**. Mesmo que o texto contenha aspas,
   espaços ou comandos como `DROP TABLE`, o banco interpretará tudo apenas como
   uma cadeia de caracteres comum.

## Passagem Tipada de Parâmetros

Para preencher os marcadores `?`, utilizamos métodos específicos do
`PreparedStatement` de acordo com o tipo de dado.

> **Atenção aos Índices:**
>
> No JDBC, os índices dos marcadores `?` são **1-indexed** (o primeiro `?` é o
> índice `1`, o segundo é o índice `2`, e assim por diante).

### Principais Métodos de Parâmetros

| Método                                   | Tipo Java          | Exemplo                                    |
| :--------------------------------------- | :----------------- | :----------------------------------------- |
| **`setString(int index, String value)`** | `String`           | `stmt.setString(1, "ana@email.com");`      |
| **`setLong(int index, long value)`**     | `Long`, `long`     | `stmt.setLong(1, 105L);`                   |
| **`setInt(int index, int value)`**       | `Integer`, `int`   | `stmt.setInt(2, 50);`                      |
| **`setDouble(int index, double value)`** | `Double`, `double` | `stmt.setDouble(3, 199.90);`               |
| **`setNull(int index, int sqlType)`**    | `null`             | `stmt.setNull(4, java.sql.Types.VARCHAR);` |

## Exemplo Prático Seguro

Veja como a consulta de autenticação fica 100% protegida com o
`PreparedStatement`:

```java
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class SafeLoginDemo {
    public static void main(String[] args) {
        String url = "jdbc:sqlite:loja.db";

        String emailInput = "admin@email.com' OR '1'='1"; // Tentativa maliciosa
        String passwordInput = "qualquerCoisa";

        String sql = """
                     SELECT *
                     FROM users
                     WHERE email = ? AND password = ?;
                     """;

        try (Connection conn = DriverManager.getConnection(url);
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            // Preenchendo os parâmetros de forma segura:
            pstmt.setString(1, emailInput);
            pstmt.setString(2, passwordInput);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    System.out.println("Login efetuado com sucesso!");
                } else {
                    System.out.println("Usuário ou senha inválidos.");
                }
            }

        } catch (SQLException e) {
            System.err.println("Erro na consulta: " + e.getMessage());
        }
    }
}
```

Ao executar o código acima, o banco procurará um usuário cujo e-mail seja
**literalmente** `"admin@email.com' OR '1'='1"`, o que não encontrará nenhum
registro e frustrará a tentativa de ataque com total segurança.

## Vantagem Extra: Desempenho e Reuso

Além da segurança, o `PreparedStatement` oferece ganhos de desempenho. Como a
consulta é pré-compilada pelo banco de dados, você pode reutilizar a mesma
instância para executar comandos em lote ou repetições, alterando apenas os
parâmetros:

```java
String sql = "INSERT INTO categories (name) VALUES (?);";

try (Connection conn = DriverManager.getConnection(url);
     PreparedStatement pstmt = conn.prepareStatement(sql)) {

    String[] categories = {"Eletrônicos", "Móveis", "Livros"};

    for (String cat : categories) {
        pstmt.setString(1, cat);
        pstmt.executeUpdate();
    }
    System.out.println("Todas as categorias foram inseridas com alto desempenho!");
}
```

## Regra de Ouro da Persistência em Java

> **Nunca concatene dados dinâmicos em strings SQL.**
>
> Utilize sempre o **`PreparedStatement`** para qualquer instrução que envolva
> parâmetros ou variáveis.

No próximo capítulo, aprenderemos detalhadamente como realizar todas as
**operações de escrita** (`INSERT`, `UPDATE` e `DELETE`) e como recuperar chaves
primárias geradas automaticamente pelo banco.

---

<a href="02-manipulacao-de-tabelas-com-statement.md">← 2. Manipulação de Tabelas
com Statement</a>

<p align="right"><a href="04-operacoes-de-escrita.md">Próximo: Operações de Escrita (INSERT, UPDATE, DELETE) →</a></p>
