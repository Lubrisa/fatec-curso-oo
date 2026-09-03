# 2. Classes e Interfaces Genéricas

No capítulo anterior, vimos como consumir tipos genéricos fornecidos pelo Java
(`List<String>`, `Map<K, V>`). Agora, vamos dar o próximo passo: **como criar
nossas próprias classes e interfaces genéricas**.

O objetivo de criar componentes genéricos é escrever uma estrutura ou contrato
uma única vez e permitir que ele funcione com qualquer tipo de dado, mantendo
100% da segurança de tipos do compilador.

## Criando uma Classe Genérica

Para tornar uma classe genérica, adicionamos um ou mais parâmetros de tipo entre
colchetes angulares (`<T>`) logo após o nome da classe na declaração:

```java
public class Box<T> {
    private T content; // o campo é do tipo T

    public Box(T content) {
        this.content = content;
    }

    public T getContent() {
        return this.content;
    }

    public void setContent(T content) {
        this.content = content;
    }
}
```

O identificador `T` funciona como uma **variável de tipo**: quando a classe for
instanciada, o compilador substituirá mentalmente cada ocorrência de `T` pelo
tipo concreto fornecido.

### Instanciando a classe genérica

```java
// Box que armazena exclusivamente BankAccount
Box<BankAccount> accountBox = new Box<>(new BankAccount("Ana", "001", 1000.0));
BankAccount account = accountBox.getContent(); // Não precisa de cast!

// A mesma classe Box reutilizada para guardar String
Box<String> stringBox = new Box<>("Mensagem segura");
String text = stringBox.getContent();
```

## Caso de Uso Real: Objeto de Resultado (`Result<T>`)

No desenvolvimento de software profissional (e na construção de APIs e regras de
negócio), é muito comum criar classes que encapsulam o resultado de uma
operação, indicando se ela teve sucesso (carregando o dado de retorno) ou se
falhou (carregando uma mensagem de erro).

Com Generics, criamos uma única classe `Result<T>` que atende a qualquer
operação do sistema:

```java
public class Result<T> {
    private final T data;
    private final boolean success;
    private final String errorMessage;

    private Result(T data, boolean success, String errorMessage) {
        this.data = data;
        this.success = success;
        this.errorMessage = errorMessage;
    }

    // Fábrica estática para sucesso
    public static <T> Result<T> ok(T data) {
        return new Result<>(data, true, null);
    }

    // Fábrica estática para falha
    public static <T> Result<T> error(String message) {
        return new Result<>(null, false, message);
    }

    public boolean isSuccess() {
        return this.success;
    }

    public T getData() {
        if (!success) {
            throw new IllegalStateException("Não é possível obter dados de uma operação que falhou: " + errorMessage);
        }
        return this.data;
    }

    public String getErrorMessage() {
        return this.errorMessage;
    }
}
```

### Utilizando o `Result<T>` na prática

Veja como diferentes serviços podem reutilizar a mesma estrutura para tipos
completamente distintos:

```java
// 1. Operação bancária retornando um BankAccount
Result<BankAccount> accountOpeningResult = BankService.openAccount("Carlos", 500.0);

if (accountOpeningResult.isSuccess()) {
    BankAccount account = accountOpeningResult.getData(); // Tipo estrito garantido
    System.out.println("Conta aberta com saldo: " + account.getBalance());
} else {
    System.out.println("Erro ao abrir conta: " + accountOpeningResult.getErrorMessage());
}

// 2. Operação de autenticação retornando um token String
Result<String> loginResult = AuthService.login("carlos@email.com", "senha123");

if (loginResult.isSuccess()) {
    String token = loginResult.getData();
    System.out.println("Token gerado: " + token);
}
```

> **Lembrando do Módulo de Construtores:**
>
> No [Módulo 02, Capítulo 04 (Construtores)](../../02-oo/04-construtores.md),
> discutimos métodos de fábrica estáticos e como retornar objetos de resultado
> para expressar sucesso ou falha sem disparar exceções pesadas.
>
> Percebe que é exatamente **aqui** que os Generics mostram seu poder? Em vez de
> criar classes separadas como `AccountResult`, `UserResult` e `TokenResult`
> para cada entidade do sistema, criamos uma única classe `Result<T>` genérica e
> reutilizável por toda a aplicação!

## Múltiplos Parâmetros de Tipo

Uma classe pode declarar múltiplos tipos genéricos separados por vírgula dentro
de `< >`.

O exemplo clássico é um par chave-valor (`Pair<K, V>`) ou uma tupla:

```java
public class Pair<K, V> {

    private final K key;
    private final V value;

    public Pair(K key, V value) {
        this.key = key;
        this.value = value;
    }

    public K getKey() { return this.key; }
    public V getValue() { return this.value; }
}
```

```java
Pair<String, Double> item = new Pair<>("Notebook", 4500.0);
String productName = item.getKey();
Double price = item.getValue();
```

## Criando Interfaces Genéricas

Assim como as classes, as **interfaces** podem declarar parâmetros de tipo. Isso
é amplamente utilizado para definir **contratos padronizados** para operações
recorrentes da aplicação.

O exemplo mais consagrado no ecossistema Java é o padrão **Repository**
(contrato de acesso a dados e persistência):

```java
import java.util.List;

public interface Repository<T> {
    void save(T entity);

    T findById(String id);

    List<T> findAll();

    void delete(T entity);
}
```

Essa interface define que qualquer repositório do sistema sabe salvar, buscar e
deletar itens, sem fixar previamente se o item é uma conta, um cliente ou um
pedido.

## Implementando Interfaces Genéricas

Ao implementar uma interface genérica com `implements`, existem dois caminhos
possíveis:

### 1. Fixando um Tipo Concreto

A classe implementadora decide exatamente com qual tipo vai trabalhar. O tipo
genérico `T` é substituído pela classe real (`BankAccount`):

```java
import java.util.ArrayList;
import java.util.List;

public class BankAccountRepository implements Repository<BankAccount> {
    @Override
    public void save(BankAccount entity) {
        // Salva a conta no banco de dados
    }

    @Override
    public BankAccount findById(String id) {
        // Busca e retorna uma BankAccount concreta
        return new BankAccount("Titular", id, 0.0);
    }

    @Override
    public List<BankAccount> findAll() {
        return new ArrayList<>();
    }

    @Override
    public void delete(BankAccount entity) {
        // Remove a conta
    }
}
```

Quem utiliza `BankAccountRepository` não precisa lidar com `<T>`: os métodos já
recebem e retornam `BankAccount` diretamente.

### 2. Mantendo a Classe Implementadora Genérica

A classe implementadora continua genérica e repassa o tipo `T` para a interface.
É o caso de implementações utilitárias ou em memória:

```java
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class InMemoryRepository<T> implements Repository<T> {
    private final Map<String, T> database = new HashMap<>();

    @Override
    public void save(T entity) {
        // Lógica genérica de salvamento
    }

    @Override
    public T findById(String id) {
        return database.get(id);
    }

    @Override
    public List<T> findAll() {
        return new ArrayList<>(database.values());
    }

    @Override
    public void delete(T entity) {
        // Lógica genérica de remoção
    }
}
```

Ao instanciar, combinamos o polimorfismo via interface que aprendemos no [Módulo
02 (Abstração)](../../02-oo/05-abstracao.md):

```java
Repository<BankAccount> accountRepo = new InMemoryRepository<>();
Repository<String> stringRepo = new InMemoryRepository<>();
```

## Cuidados Importantes com Generics em Classes

Ao projetar classes genéricas em Java, existem duas regras essenciais impostas
pela linguagem:

### 1. Membros estáticos não podem usar o `T` da classe

O parâmetro de tipo `T` está vinculado à **instância** do objeto (criada via
`new`). Como os membros estáticos pertencem à classe como um todo e existem
antes de qualquer instância ser criada, eles não conhecem o `T`:

```java
public class Box<T> {
    private T content;                 // ✅ Válido: campo de instância

    private static T defaultContent;   // ❌ ERRO DE COMPILAÇÃO!
}
```

> **E os métodos estáticos como `Result.ok(T data)`?**
>
> Por pertencerem à classe e não à instância, métodos estáticos não conseguem
> reaproveitar o `<T>` declarado no cabeçalho da classe. Se você reparou naquele
> `<T>` antes do tipo de retorno lá no `Result.ok(...)`, não se preocupe: no
> próximo capítulo vamos entender exatamente como e por que declaramos tipos
> genéricos diretamente em métodos!

### 2. Não é possível instanciar o tipo genérico diretamente (`new T()`)

O Java não permite escrever `T item = new T();` dentro de uma classe genérica.
Como o compilador não sabe qual classe concreta substituirá `T` em tempo de
execução (nem se ela possui um construtor público sem argumentos), essa
instrução é proibida.

Se precisar criar uma instância, o objeto deve ser passado de fora (via
construtor ou parâmetro de método).

---

<a href="01-fundamentos.md">← 1. Fundamentos de Generics</a>

<p align="right"><a href="03-metodos-genericos.md">Próximo: Métodos Genéricos →</a></p>
