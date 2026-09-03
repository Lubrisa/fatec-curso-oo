# 2. Anotações de Acesso e Utilidades

No capítulo anterior, configuramos o Lombok no Maven e habilitamos o
processamento de anotações na IDE.

Agora, vamos aprender a utilizar as anotações fundamentais do Lombok para gerar
métodos de leitura (_getters_), escrita (_setters_), representação textual
(`toString`) e comparação de objetos (`equals` e `hashCode`), mantendo o código
limpo e protegido.

## 1. Métodos de Leitura e Escrita (`@Getter` e `@Setter`)

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

## 2. Representação Textual (`@ToString`)

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
}
```

```java
Product prod = new Product();

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
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class User {
    private Long id;
    private String username;
    private String email;

    @ToString.Exclude
    private String password; // 🔒 Nunca será impresso no toString()!
}
```

```java
User user = new User();
user.setId(10L);
user.setUsername("luigi");
user.setPassword("senhaUltraSecreta123");

System.out.println(user);
// Saída: User(id=10, username=luigi, email=null)
// Observe que a senha foi omitida com segurança!
```

## 3. Comparação e Estruturas de Dados (`@EqualsAndHashCode`)

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
}
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
}
```

## 4. Comparativo: Antes vs Depois do Lombok

Veja a transformação da nossa classe `User`:

### Antes do Lombok (~75 linhas manuais)

```java
public class User {
    private Long id;
    private String username;
    private String email;
    private String password;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    @Override
    public String toString() {
        return "User{" + "id=" + id + ", username='" + username + '\'' + ", email='" + email + '\'' + '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
```

### Depois do Lombok (~15 linhas elegantes e legíveis)

```java
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {
    @EqualsAndHashCode.Include
    private Long id;

    private String username;
    private String email;

    @ToString.Exclude
    private String password;
}
```

---

<a href="01-fundamentos-e-setup.md">← 1. Fundamentos e Setup do Lombok</a>

<p align="right"><a href="03-construtores-automaticos.md">Próximo: Construtores Automáticos →</a></p>
