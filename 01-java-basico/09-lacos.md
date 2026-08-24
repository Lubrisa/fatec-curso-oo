# 9. Laços

Laços executam um bloco de código repetidamente enquanto uma condição for
verdadeira. Java tem três estruturas de repetição, cada uma com um caso de uso
natural.

## `while`

Verifica a condição antes de cada iteração. Se a condição for falsa desde o
início, o bloco não executa nenhuma vez.

```java
int attempts = 0;

while (attempts < 3) {
    System.out.println("Tentativa " + (attempts + 1));
    attempts++;
}
```

Use `while` quando o número de iterações não é conhecido antecipadamente e
depende de uma condição que muda durante a execução.

## `do-while`

Executa o bloco primeiro e só então verifica a condição. Garante que o corpo do
laço execute pelo menos uma vez.

```java
double amount;

do {
    amount = readInput();  // lê o valor do usuário
} while (amount <= 0);    // repete enquanto o valor for inválido
```

`do-while` é útil em situações em que o bloco precisa executar ao menos uma vez
antes de poder avaliar a condição — como validar entradas do usuário.

## `for`

Estrutura com três partes separadas por ponto e vírgula: inicialização, condição
e atualização. É a escolha natural quando o número de iterações é conhecido.

```java
for (int i = 0; i < 5; i++) {
    System.out.println("Iteração " + i);
}
```

As três partes são opcionais — mas os ponto e vírgula não:

```java
int i = 0;
for (; i < 5; ) {  // inicialização e atualização fora do for
    System.out.println(i);
    i++;
}
```

## `for-each`

Forma simplificada para percorrer arrays e coleções. Não expõe o índice — apenas
o elemento atual:

```java
String[] cities = {"São Paulo", "Rio de Janeiro", "Belo Horizonte"};

for (String city : cities) {
    System.out.println(city);
}
```

Prefira `for-each` sempre que não precisar do índice. O código fica mais limpo e
elimina uma classe de erros comuns com índices fora dos limites.

## `break` e `continue`

`break` interrompe o laço imediatamente, saindo do bloco de repetição:

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) break;  // para no 5, não chega ao 6
    System.out.println(i);  // imprime 0, 1, 2, 3, 4
}
```

`continue` pula o restante da iteração atual e vai direto para a próxima
verificação da condição:

```java
for (int i = 0; i < 10; i++) {
    if (i % 2 == 0) continue;  // pula os pares
    System.out.println(i);      // imprime 1, 3, 5, 7, 9
}
```

Ambos funcionam em qualquer tipo de laço (`while`, `do-while`, `for`).

> **Laços aninhados:** `break` e `continue` afetam apenas o laço mais interno.
> Para sair de vários laços de uma vez, Java suporta `break` com rótulo — um
> recurso raro, mas que existe. Se você se encontrar precisando dele com
> frequência, pode ser um sinal de que o código está complexo demais e merece
> ser decomposto em métodos.

---

<a href="08-condicionais.md">← Condicionais</a>

<p align="right"><a href="10-funcoes.md">Próximo: Funções →</a></p>
