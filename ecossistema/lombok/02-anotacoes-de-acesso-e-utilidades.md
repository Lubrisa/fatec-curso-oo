# 2. Anotações de Acesso e Utilidades

No capítulo anterior, configuramos o Lombok no Maven e habilitamos o
processamento de anotações na IDE.

Agora, vamos aprender a utilizar as anotações fundamentais do Lombok para gerar
métodos de leitura (_getters_), escrita (_setters_), representação textual
(`toString`) e comparação de objetos (`equals` e `hashCode`), mantendo o código
limpo e protegido.

## Métodos de Leitura e Escrita (`@Getter` e `@Setter`)

As anotações **`@Getter`** e **`@Setter`** instruem o Lombok a criar os métodos
padrão de acesso aos campos da classe (como `getName()` e `setName(String
name)`).

### Uso no Topo da Classe

Quando colocadas sobre a classe, o Lombok gera métodos de leitura e escrita para
**todos os campos não estáticos**:

```java
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Client {
    private Long id;
    private String name;
    private String email;
}
```

Ao compilar esse arquivo, o Lombok cria automaticamente:

- `getId()`, `setId(Long id)`
- `getName()`, `setName(String name)`
- `getEmail()`, `setEmail(String email)`

### Uso em Campos Específicos e Controle de Acesso

Nem todo atributo de uma classe deve ser alterado livremente. Para proteger o
encapsulamento, você pode colocar o `@Getter` ou `@Setter` diretamente sobre os
campos que desejar:

```java
import lombok.AccessLevel;
import lombok.Getter;
import lombok.Setter;

public class BankAccount {
    @Getter
    private final String accountNumber; // Apenas getter (campo imutável)

    @Getter
    @Setter
    private String owner; // Getter e Setter públicos

    @Getter
    @Setter(AccessLevel.PROTECTED)
    private double balance; // Setter visível apenas para subclasses e o próprio pacote
}
```

#### Opções de `AccessLevel`

Com o parâmetro `AccessLevel`, você define a visibilidade exata do método
gerado:

- `AccessLevel.PUBLIC` (padrão)
- `AccessLevel.PROTECTED`
- `AccessLevel.PACKAGE` (sem modificador / package-private)
- `AccessLevel.PRIVATE`
- `AccessLevel.NONE` (bloqueia expressamente a geração do método para aquele
  campo, usado para deixar clara a intenção de que o campo nunca deve ser
  acessado externamente, nem mesmo por subclasses)

### Boas Práticas: Evite Expor Setters Indiscriminadamente

Nas melhores práticas de engenharia de software e Orientação a Objetos, a regra
de ouro é: **evite ao máximo permitir que partes externas do programa alterem o
estado interno do seu objeto livremente**.

Quando colocamos `@Setter` no topo da classe, transformamos todos os atributos
em campos mutáveis sem qualquer proteção, enfraquecendo o **encapsulamento**.

Em vez de usar `@Setter` automaticamente:

1. **Prefira métodos de domínio expressivos:** Em vez de expor um
   `setBalance(double)` que permite atribuir qualquer número, crie métodos com
   significado real no sistema, como `deposit(double amount)` e `withdraw(double amount)`.
2. **Escreva o setter manualmente quando estritamente necessário:** Se um campo
   realmente precisar de alteração externa via setter, prefira escrevê-lo na mão
   com as devidas validações. O Lombok é inteligente: se você declarar o método
   manualmente, ele **não gerará outro por cima**.
3. **Use `@Setter` pontualmente:** Caso precise de um setter simples, coloque a
   anotação apenas sobre o atributo específico que necessita de alteração, e não
   na classe inteira.

## Representação Textual (`@ToString`)

O método `toString()` padrão herdado da classe `Object` imprime apenas o nome da
classe seguido do endereço hexadecimal de memória (ex: `Client@6d06d69c`), o que
não ajuda na depuração ou nos logs da aplicação.

Com a anotação **`@ToString`**, o Lombok gera um método `toString()` legível que
exibe o nome da classe e o valor de cada atributo:

```java
import lombok.ToString;

@ToString
public class Product {
    private Long id;
    private String name;
    private double price;

    public Product(Long id, String name, double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }
}
```

```java
Product prod = new Product(1L, "Teclado Mecânico", 350.0);

// Ao imprimir:
System.out.println(prod);
// Saída: Product(id=1, name=Teclado Mecânico, price=350.0)
```

### O Perigo de Dados Sensíveis nos Logs (`@ToString.Exclude`)

Em sistemas reais, alguns atributos **nunca devem aparecer em logs** por motivos
de segurança e privacidade (como senhas, números de cartão de crédito ou tokens
de autenticação).

Para impedir que um campo confidencial seja impresso no `toString()`, usamos a
anotação **`@ToString.Exclude`**:

```java
import lombok.ToString;

@ToString
public class User {
    private final Long id;
    private String username;
    private String email;

    @ToString.Exclude
    private String password; // 🔒 Nunca será impresso no toString()!

    public User(Long id, String username, String email, String password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
```

```java
User user = new User(10L, "luigi", "luigi@email.com", "senhaUltraSecreta123");

System.out.println(user);
// Saída: User(id=10, username=luigi, email=luigi@email.com)
// Observe que a senha foi omitida com segurança!
```

## Comparação e Estruturas de Dados (`@EqualsAndHashCode`)

Para que dois objetos possam ser comparados corretamente pelo conteúdo (através
de `.equals()`) ou armazenados em coleções como `HashSet` ou chaves de
`HashMap`, precisamos implementar os métodos `equals()` e `hashCode()`.

A anotação **`@EqualsAndHashCode`** gera ambos os métodos utilizando todos os
campos não estáticos da classe:

```java
import lombok.EqualsAndHashCode;

@EqualsAndHashCode
public class Client {
    private Long id;
    private String name;
    private String email;

    public Client(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
```

```java
Client c1 = new Client(1L, "Ana", "ana@email.com");
Client c2 = new Client(1L, "Ana", "ana@email.com");

// Compara o conteúdo dos atributos (retorna true):
System.out.println(c1.equals(c2)); // true

// Em coleções que usam tabela hash, duplicatas são eliminadas automaticamente:
Set<Client> clients = new HashSet<>();
clients.add(c1);
clients.add(c2);

System.out.println(clients.size()); // 1 (apenas um cliente armazenado)
```

### Comparando Apenas por Campos Identificadores

Em muitas regras de negócio, dois clientes são considerados iguais se possuírem
o mesmo **`id`** ou o mesmo **`cpf`**, independentemente de terem mudado o
telefone ou o e-mail.

Podemos instruir o Lombok a usar apenas atributos específicos para o `equals` e
`hashCode`:

```java
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Client {
    @EqualsAndHashCode.Include
    private Long id; // Apenas o 'id' será usado para comparar se dois clientes são iguais

    private String name;
    private String email;

    public Client(Long id, String name, String email) {
        this.id = id;
        this.name = name;
        this.email = email;
    }
}
```

```java
Client c1 = new Client(1L, "Carlos Silva", "carlos.antigo@email.com");
Client c2 = new Client(1L, "Carlos Silva", "carlos.novo@email.com");

// Mesmo com e-mails diferentes, são considerados o mesmo cliente pois possuem o mesmo id:
System.out.println(c1.equals(c2)); // true
```

## Comparativo: Antes vs Depois do Lombok

Veja a transformação da nossa classe `User`, mantendo os princípios de
encapsulamento (identificador imutável, validações na criação e métodos de
domínio no lugar de getters e setters ingênuos):

### Antes do Lombok (~60 linhas manuais)

```java
public class User {
    private final Long id;
    private String username;
    private String email;
    private String password;

    public User(Long id, String username, String email, String password) {
        if (id == null) {
            throw new IllegalArgumentException("O id não pode ser nulo");
        }
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("O username não pode ser vazio");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("O email não pode ser vazio");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("A senha não pode ser vazia");
        }
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public Long getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public boolean matchesCredentials(String email, String rawPassword) {
        return this.email.equals(email) && this.password.equals(rawPassword);
    }

    @Override
    public String toString() {
        return "User(id=%d, username='%s', email='%s')".formatted(id, username, email);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User user)) return false;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

### Depois do Lombok (~25 linhas elegantes e expressivas)

```java
import java.util.Objects;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {
    @Getter
    @EqualsAndHashCode.Include
    private final Long id;

    @Getter
    private String username;

    private String email;

    @ToString.Exclude
    private String password;

    public User(Long id, String username, String email, String password) {
        if (id == null) {
            throw new IllegalArgumentException("O id não pode ser nulo");
        }
        if (username == null || username.isBlank()) {
            throw new IllegalArgumentException("O username não pode ser vazio");
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException("O email não pode ser vazio");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("A senha não pode ser vazia");
        }
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    public boolean matchesCredentials(String email, String rawPassword) {
        return this.email.equals(email) && this.password.equals(rawPassword);
    }
}
```

---

<a href="01-fundamentos-e-setup.md">← Fundamentos e Setup do Lombok</a>

<p align="right"><a href="03-construtores-automaticos.md">Próximo: Construtores Automáticos →</a></p>
