# 11. Escopo

## O Que É Escopo

Escopo é a região do código onde uma variável existe e pode ser acessada. Fora
do seu escopo, a variável simplesmente não existe — tentar usá-la é um erro de
compilação.

Em Java, o escopo é delimitado por chaves `{}`. Uma variável declarada dentro de
um bloco pertence àquele bloco e a todos os blocos aninhados dentro dele.

## Escopo de Bloco

```java
void process() {
    int x = 10;           // x existe a partir daqui

    if (x > 5) {
        int y = 20;       // y existe apenas dentro deste if
        System.out.println(x + y);  // válido: x e y estão no escopo
    }

    System.out.println(x);  // válido: x ainda existe
    System.out.println(y);  // erro de compilação: y não existe aqui
}
```

A variável `y` morre quando o bloco do `if` se fecha. `x`, declarada no escopo
do método, continua existindo até o final do método.

## Escopo em Laços

A variável de controle declarada no `for` existe apenas dentro do laço:

```java
for (int i = 0; i < 5; i++) {
    System.out.println(i);  // válido
}

System.out.println(i);  // erro de compilação: i não existe fora do for
```

O mesmo vale para o `for-each` — a variável de iteração existe apenas dentro do
laço:

```java
String[] cities = {"São Paulo", "Rio de Janeiro"};

for (String city : cities) {
    System.out.println(city);  // válido
}

System.out.println(city);  // erro de compilação: city não existe aqui
```

Isso é uma vantagem: as variáveis de controle não vazam para o escopo externo,
evitando uso acidental depois do laço.

## Sombreamento (Shadowing)

Uma vez que você declara uma variável, não pode redeclará-la no mesmo escopo nem
em um escopo mais interno dentro do mesmo método:

```java
void process() {
    int value = 10;

    if (true) {
        int value = 20;  // erro de compilação: value já foi declarada no escopo externo
    }
}
```

A exceção são os campos da classe — tanto de instância quanto estáticos. Uma
variável local pode ter o mesmo nome que um campo, e nesse caso **a local
sombreia o campo** dentro daquele bloco:

```java
public class BankAccount {
    private double balance = 1000.0;          // campo de instância
    private static int totalAccounts = 0;     // campo estático

    void setBalance(double balance) {         // 'balance' local sombreia o campo de instância
        this.balance = balance;               // 'this.balance' acessa o campo; 'balance' é o parâmetro
    }

    static void setTotal(int totalAccounts) { // 'totalAccounts' local sombreia o campo estático
        BankAccount.totalAccounts = totalAccounts;  // nome da classe desambigua o campo estático
    }
}
```

`this` dá acesso ao campo de instância quando ele está sombreado. Para campos
estáticos, usa-se o nome da classe (`BankAccount.totalAccounts`) pelo mesmo
motivo.

## Por Que Escopo Importa

Manter variáveis no menor escopo possível é uma boa prática: reduz o tempo de
vida do dado, torna o código mais fácil de entender (quem lê sabe exatamente
onde a variável é relevante) e evita uso acidental em partes do código onde ela
não deveria existir.

<details>
<summary>Escopo e ciclo de vida da memória</summary>

Escopo e ciclo de vida da memória são conceitos relacionados, mas não são a
mesma coisa. O escopo diz onde você pode usar uma variável; o ciclo de vida diz
até quando a memória que ela ocupa existe de fato.

**Tipos primitivos** ficam no stack frame do método. Mesmo que uma variável
primitiva seja declarada dentro de um bloco (`if`, `for`, etc.), a memória que
ela ocupa só é liberada quando o método retorna — não quando o bloco termina.
Fora do bloco você simplesmente não pode mais acessá-la pelo nome, mas a posição
no stack ainda existe até o frame ser descartado.

**Tipos por referência** têm dois pedaços de memória envolvidos: a variável em
si (que guarda o endereço) fica no stack, e o objeto fica no heap. Quando a
variável sai do escopo, o ponteiro no stack desaparece junto com o frame — mas o
objeto no heap continua existindo enquanto houver qualquer outra referência
apontando para ele. Só quando nenhuma referência alcança mais o objeto é que o
_garbage collector_ pode liberá-lo.

```java
void process() {
    BankAccount account;

    if (true) {
        account = new BankAccount(1000.0);  // objeto criado no heap
        BankAccount alias = account;        // alias: segunda referência ao mesmo objeto
    }
    // alias saiu do escopo — mas account ainda aponta para o objeto
    // o objeto no heap continua vivo enquanto account existir

    account.deposit(200.0);  // ainda válido
}
// quando process() retorna, account sai do escopo → objeto no heap fica sem referência → GC pode coletar
```

</details>

---

<a href="10-funcoes.md">← Funções</a>

<p align="right"><a href="12-excecoes.md">Próximo: Exceções →</a></p>
