# 1. Fundamentos de Generics

Nos capítulos sobre estruturas de dados do Módulo 01
([Listas](../../01-java-basico/14-listas.md),
[Conjuntos](../../01-java-basico/15-conjuntos.md),
[Mapas](../../01-java-basico/16-mapas.md) e [Filas e
Pilhas](../../01-java-basico/17-filas-e-pilhas.md)), você utilizou coleções como
`List<String>`, `Map<String, BankAccount>` e `Deque<Order>`. Naquele momento,
combinamos que a notação dentro dos sinais de menor e maior (`< >`) ficaria como
um "assunto para outro momento".

Esse momento chegou. Essa sintaxe representa o uso de **Generics** (ou _Tipos
Genéricos_). Neste capítulo, vamos entender por que esse recurso existe, qual
problema ele resolveu na história do Java e como consumi-lo com total segurança
no dia a dia.

## O Mundo Sem Generics: O Perigo do `Object`

Nas primeiras versões do Java (do Java 1.0 ao Java 1.4), Generics não existiam.
Para que uma coleção como `ArrayList` pudesse guardar qualquer tipo de dado, ela
era projetada para armazenar o tipo mais genérico de todos: `Object`.

Na prática, isso trazia dois grandes problemas:

### 1. A Necessidade de Conversão Manual (_Cast_)

Como a lista só sabia devolver `Object`, o desenvolvedor era obrigado a
converter manualmente o valor de volta para o tipo original sempre que ia
utilizá-lo:

```java
// Estilo antigo (Java 1.4):
ArrayList names = new ArrayList();
names.add("Ana");

// Erro se tentar atribuir direto — Object não cabe em String:
// String first = names.get(0); // ❌ Erro de compilação!

// Necessário fazer cast explícito:
String first = (String) names.get(0); // ✅ Funciona, mas é verboso
```

### 2. A Falta de Segurança de Tipos (_Type Safety_)

Como a lista aceitava qualquer `Object`, nada impedia que dados de tipos
incompatíveis fossem inseridos por engano na mesma coleção:

```java
ArrayList names = new ArrayList();
names.add("Ana");
names.add("Bruno");
names.add(42); // Inseriu um número por engano — o compilador aceitou sem avisar!

// Mais tarde, ao processar os dados:
for (int i = 0; i < names.size(); i++) {
    // Na terceira iteração (quando encontrar o 42):
    // 💥 ClassCastException em tempo de execução! O sistema quebra em produção.
    String name = (String) names.get(i);
    System.out.println(name.toUpperCase());
}
```

O compilador ficava completamente "cego" para o conteúdo da lista. O erro só se
manifestava quando o programa já estava rodando na mão do usuário final.

## A Solução: Tipagem Paramétrica

Com o lançamento do Java 5, surgiram os **Generics**. A ideia central é simples:
**parametrizar o tipo de dado** que uma classe, interface ou método irá
manipular.

Em vez de dizer apenas _"esta é uma lista"_, você diz ao compilador _"esta é uma
lista exclusiva de Strings"_:

```java
// Com Generics (Java moderno):
List<String> names = new ArrayList<String>();
names.add("Ana");
names.add("Bruno");

// O compilador agora protege a lista:
// names.add(42); // ❌ ERRO DE COMPILAÇÃO IMEDIATO!
```

Com Generics:

1. **Fim dos casts manuais:** o compilador sabe que `names.get(0)` devolve
   `String`, permitindo atribuição direta.
2. **Erros capturados na compilação:** qualquer tentativa de inserir um tipo
   incorreto é barrada na hora pela IDE, antes mesmo do código rodar.

> **Regra de Ouro:**
>
> O papel principal dos Generics é **transformar erros de tempo de execução
> (_runtime errors_) em erros de tempo de compilação (_compile-time errors_)**.

## O Operador Diamante (`<>`)

No Java 5 e 6, era necessário repetir o tipo genérico nos dois lados da
declaração:

```java
List<BankAccount> accounts = new ArrayList<BankAccount>(); // Repetição desnecessária
```

A partir do Java 7, o compilador passou a deduzir o tipo do lado direito
automaticamente através do **Operador Diamante** (`<>`):

```java
List<BankAccount> accounts = new ArrayList<>(); // Diamante vazio: tipo inferido
Map<String, BankAccount> map = new HashMap<>();
```

Você também pode combinar com a inferência de tipo de variável local (`var`),
mas mantenha a tipagem clara:

```java
// O tipo fica evidente na instanciação:
var accounts = new ArrayList<BankAccount>();
```

## Generics e Tipos Primitivos: A Regra dos Wrappers

Uma restrição fundamental do Java é que **parâmetros de tipo genérico só aceitam
[tipos por referência](../../01-java-basico/03-tipos-por-referencia.md)**
(classes e interfaces que herdam de `Object`).

Você **não pode** usar tipos primitivos diretamente dentro de `< >`:

```java
List<int> numbers = new ArrayList<>();     // ❌ ERRO DE COMPILAÇÃO!
Map<double, String> rates = new HashMap<>(); // ❌ ERRO DE COMPILAÇÃO!
```

### A Solução: Classes Wrapper e Autoboxing

Para cada tipo primitivo, o Java fornece uma **Classe Wrapper** correspondente
no pacote `java.lang`:

| Tipo Primitivo | Classe Wrapper (Referência) |
| :------------- | :-------------------------- |
| `int`          | `Integer`                   |
| `double`       | `Double`                    |
| `boolean`      | `Boolean`                   |
| `char`         | `Character`                 |
| `long`         | `Long`                      |
| `float`        | `Float`                     |
| `byte`         | `Byte`                      |
| `short`        | `Short`                     |

Graças ao mecanismo de **Autoboxing / Unboxing** que vimos no [Capítulo 7 do
Módulo 01 (Conversões de
Tipo)](../../01-java-basico/07-conversoes-de-tipo.md#autoboxing-e-unboxing), a
conversão entre o primitivo e o objeto wrapper ocorre de forma transparente:

```java
List<Integer> numbers = new ArrayList<>();

// Autoboxing: int (primitivo 10) é empacotado automaticamente como Integer (objeto)
numbers.add(10);
numbers.add(20);

// Unboxing: Integer é desempacotado automaticamente para int
int first = numbers.get(0);
```

## Convenções de Nomenclatura para Parâmetros de Tipo

Ao declarar tipos genéricos, a convenção padrão do Java adota **letras
maiúsculas únicas e mnemônicas**:

- **`T`** (_Type_): Usado para representar um tipo genérico geral.
- **`E`** (_Element_): Usado em coleções e estruturas de dados (`List<E>`,
  `Set<E>`, `Queue<E>`).
- **`K`** (_Key_) e **`V`** (_Value_): Usados para representar chave e valor em
  mapas (`Map<K, V>`).
- **`R`** (_Return_ / _Result_): Usado para representar o tipo de retorno de uma
  operação ou função.
- **`N`** (_Number_): Usado quando o tipo esperado é expressamente numérico.
- **`S`, `U`, `V`**: Usados como tipos adicionais quando mais de um parâmetro
  genérico é necessário (`<T, U>`).

---

<p align="right"><a href="02-classes-e-interfaces-genericas.md">Próximo: Classes e Interfaces Genéricas →</a></p>
