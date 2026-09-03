# 3. Construtores Automáticos

No capítulo anterior, vimos como o Lombok elimina o código repetitivo de métodos
de acesso, impressão e comparação.

Neste capítulo, vamos aprender a automatizar a criação de **construtores** com
diferentes finalidades e a aplicar boas práticas de encapsulamento para garantir
que nossos objetos sejam sempre instanciados em um estado válido.

## As Anotações de Construtor

Escrever construtores manualmente pode ser tedioso, especialmente quando uma
classe precisa de múltiplos construtores (um protegido para frameworks e outro
completo para inicialização pela aplicação).

O Lombok disponibiliza três anotações complementares para gerenciar
construtores:

### 1. Construtor Vazio (`@NoArgsConstructor`)

Gera um construtor sem nenhum parâmetro:

```java
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Client {
    private Long id;
    private String name;
}
```

O Lombok gera nos bastidores:

```java
protected Client() {
}
```

> **Por que o construtor vazio existe e por que torná-lo `PROTECTED`?**
>
> Muitas bibliotecas (como o Jackson para leitura de JSON e o Hibernate para
> bancos de dados) exigem obrigatoriamente um construtor sem argumentos para
> conseguir instanciar objetos e preencher seus dados automaticamente por
> reflexão.
>
> Ao definir `access = AccessLevel.PROTECTED`, nós **satisfazemos a exigência
> dos frameworks** e, ao mesmo tempo, **protegemos nossa aplicação**, impedindo
> que outras partes do código criem instâncias vazias em estado incompleto ou
> inválido (`new Client()`).

### 2. Construtor Completo (`@AllArgsConstructor`)

Gera um construtor que recebe **todos os atributos** da classe na ordem exata em
que foram declarados:

```java
import lombok.AllArgsConstructor;

@AllArgsConstructor
public class Client {
    private Long id;
    private String name;
    private String email;
}
```

O Lombok gera nos bastidores:

```java
public Client(Long id, String name, String email) {
    this.id = id;
    this.name = name;
    this.email = email;
}
```

### 3. Construtor para Campos Obrigatórios (`@RequiredArgsConstructor`)

Gera um construtor que recebe apenas os campos que **obrigatoriamente precisam
de um valor inicial**:

- Campos marcados como `final` (que não podem ficar sem valor).
- Campos anotados com `@NonNull` do Lombok (que realizam verificação automática
  contra `null`).

```java
import lombok.NonNull;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class BankAccount {
    private final String accountNumber; // Obrigatório por ser final

    @NonNull
    private String owner; // Obrigatório por ser @NonNull

    private double balance; // Opcional (não entra no construtor)
}
```

O Lombok gera nos bastidores:

```java
public BankAccount(String accountNumber, String owner) {
    if (owner == null) {
        throw new NullPointerException("owner is marked non-null but is null");
    }
    this.accountNumber = accountNumber;
    this.owner = owner;
}
```

### Combinando Construtores com Segurança

Em classes que interagem com frameworks, é muito comum combinarmos
`@NoArgsConstructor(access = AccessLevel.PROTECTED)` e `@AllArgsConstructor` na
mesma classe:

```java
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED) // Frameworks usam nos bastidores
@AllArgsConstructor // Código da aplicação usa para criar objetos válidos
public class Product {
    private Long id;
    private String name;
    private double price;
}
```

```java
// O código da aplicação é obrigado a fornecer todos os dados válidos:
Product prod = new Product(1L, "Teclado", 250.0);

// Product vazio é bloqueado para código externo:
// Product invalid = new Product(); // ❌ Erro de compilação fora do pacote/herança!
```

### Validações na Criação e Métodos de Fábrica Estáticos

Os construtores gerados pelo Lombok apenas realizam atribuições diretas aos
campos. Se a sua classe precisa **validar regras de negócio no momento da
criação** (por exemplo: garantir que um preço não seja negativo ou que o saldo
respeite um limite mínimo):

1. **Escreva o construtor manualmente:** O Lombok respeita construtores manuais.
   Se você declarar um construtor explícito com validações, ele não tentará
   sobrescrevê-lo.
2. **Construtor Privado do Lombok + Método de Fábrica Estático Manual:** Podemos
   instruir o Lombok a gerar o construtor com visibilidade **privada** (`access = AccessLevel.PRIVATE`)
   para impedir que objetos sejam criados sem controle. Em seguida, escrevemos
   um **método de fábrica estático manual** com as validações necessárias:

```java
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor(access = AccessLevel.PRIVATE) // 🔒 Construtor privado gerado pelo Lombok
public class Money {

    private final double amount;
    private final String currency;

    // Método de fábrica estático escrito manualmente com validações:
    public static Money of(double amount, String currency) {
        if (amount < 0) {
            throw new IllegalArgumentException("O valor monetário não pode ser negativo: " + amount);
        }
        if (currency == null || currency.isBlank()) {
            throw new IllegalArgumentException("A moeda deve ser informada");
        }
        return new Money(amount, currency.toUpperCase());
    }
}
```

Dessa forma, o código cliente é forçado a passar pelas validações de negócio:

```java
Money price = Money.of(150.0, "BRL"); // ✅ Válido

Money invalid = Money.of(-50.0, "BRL"); // 💥 Lança IllegalArgumentException!
```

---

<a href="02-anotacoes-de-acesso-e-utilidades.md">← Anotações de Acesso e Utilidades</a>

<p align="right"><a href="04-anotacoes-agregadoras-data-e-value.md">Próximo: Anotações Agregadoras: @Data e @Value →</a></p>
