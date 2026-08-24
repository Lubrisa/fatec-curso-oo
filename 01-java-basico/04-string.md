# 4. String

## Uma Classe Especial

`String` é um tipo por referência — como qualquer outro tipo definido por uma
classe. Mas ela tem um tratamento especial no Java que a faz parecer primitiva à
primeira vista: você pode criá-la com aspas, sem `new`.

```java
String name = "Luigi";  // forma literal — mais comum e preferida
```

Por baixo dos panos, `name` aponta para um objeto `String` no heap, exatamente
como `BankAccount account` apontaria para um objeto `BankAccount`.

## Imutabilidade

Objetos `String` são **imutáveis**: uma vez criados, seu conteúdo não pode ser
alterado. Toda operação que parece modificar uma string — trocar letras,
concatenar, substituir — na verdade cria um novo objeto.

```java
String s = "hello";
s.toUpperCase();    // cria um novo String "HELLO" — e o descarta!
System.out.println(s); // ainda imprime "hello"

s = s.toUpperCase();   // agora s aponta para o novo objeto "HELLO"
System.out.println(s); // "HELLO"
```

Imutabilidade tem consequências práticas: `String` é segura para compartilhar
entre partes do código sem risco de uma parte alterar o valor que outra está
usando. A contrapartida é a pressão na memória — cada operação gera um novo
objeto, e os intermediários que ninguém mais referencia ficam aguardando o
_garbage collector_. Para situações em que você precisa construir ou transformar
uma string em várias etapas, existem classes utilitárias que modificam um buffer
interno em vez de criar objetos a cada passo — falaremos delas mais à frente.

## Métodos Mais Usados

```java
String text = "  Olá, Java!  ";

text.length();            // 14 — inclui os espaços
text.trim();              // "Olá, Java!" — remove espaços nas extremidades
text.toUpperCase();       // "  OLÁ, JAVA!  "
text.toLowerCase();       // "  olá, java!  "

text.contains("Java");    // true
text.startsWith("  Olá"); // true
text.endsWith("!  ");     // true

text.indexOf("Java");     // 6 — posição da primeira ocorrência (após trim seria diferente)
text.replace("Java", "Mundo"); // "  Olá, Mundo!  "

text.substring(2, 6);    // "Olá," — da posição 2 (inclusiva) até 6 (exclusiva)
text.charAt(2);           // 'O' — o caractere na posição 2
```

Strings também podem ser divididas e unidas:

```java
String csv = "São Paulo,Rio de Janeiro,Belo Horizonte";
String[] cities = csv.split(",");  // ["São Paulo", "Rio de Janeiro", "Belo Horizonte"]

String joined = String.join(" | ", cities); // "São Paulo | Rio de Janeiro | Belo Horizonte"
```

## Comparação: `equals` vs `==`

Aqui mora um dos erros mais comuns em Java. O operador `==` compara
_referências_ — ou seja, verifica se as duas variáveis apontam para o mesmo
objeto no heap. Para comparar o _conteúdo_ de duas strings, use `equals`:

```java
String a = new String("hello");
String b = new String("hello");

System.out.println(a == b);      // false — objetos diferentes no heap
System.out.println(a.equals(b)); // true — conteúdo idêntico
```

Na prática, use sempre `equals` para comparar strings — e `equalsIgnoreCase`
quando a capitalização não importa:

```java
"Java".equalsIgnoreCase("JAVA"); // true
```

> **Curiosidade:** o Java mantém uma área de memória dedicada a strings que são
> constantes no código — aquelas que você escreve entre aspas diretamente no
> fonte. Quando a mesma sequência de caracteres aparece mais de uma vez, o Java
> pode apontar os dois literais para o mesmo objeto nessa área, já que strings
> são imutáveis e compartilhá-las não traz nenhum risco. É por isso que `==` às
> vezes funciona ao comparar literais: as duas variáveis podem acabar apontando
> para o mesmo objeto. Mas isso é um detalhe de implementação — não conte com
> esse comportamento. Use sempre `equals`.

## Concatenação e Formatação

O operador `+` concatena strings — mas como strings são imutáveis, cada `+` cria
um novo objeto:

```java
String greeting = "Olá, " + "Java" + "!"; // "Olá, Java!"
```

Para inserir valores em uma string formatada, use `String.format` (ou o método
de instância `formatted`, introduzido no Java 15) é mais legível que
concatenação:

```java
String name = "Luigi";
int age = 30;

String msg = String.format("Nome: %s, Idade: %d", name, age);
// ou, equivalentemente:
String msg2 = "Nome: %s, Idade: %d".formatted(name, age);
```

Os especificadores mais comuns: `%s` para qualquer objeto (chama `toString`),
`%d` para inteiros, `%f` para ponto flutuante, `%.nf` para ponto flutuante com
$n$ casas decimais.

## Text Blocks

Literais de string normais não aceitam quebra de linha diretamente. Para
representar texto multilinha, a alternativa era usar `\n` e concatenação:

```java
String json = "{\n" +
              "    \"name\": \"Luigi\",\n" +
              "    \"age\": 30\n" +
              "}";
```

A partir do Java 15, a sintaxe de **text block** resolve isso:

```java
String json = """
        {
            "name": "Luigi",
            "age": 30
        }
        """;
```

Para determinar quais espaços são parte do conteúdo e quais são só identação do
código-fonte, o Java usa a posição do `"""` de fechamento como referência. No
exemplo acima, o `"""` está recuado 8 espaços — então o Java remove 8 espaços do
início de cada linha. A string resultante é:

```text
{
    "name": "Luigi",
    "age": 30
}
```

Se o `"""` de fechamento estiver em outra posição, o resultado muda. Com o `"""`
na coluna zero, nenhum espaço é removido:

```java
String json = """
        {
            "name": "Luigi",
            "age": 30
        }
""";  // ← sem recuo
```

Resultado:

```text
        {
            "name": "Luigi",
            "age": 30
        }
```

A convenção mais comum é alinhar o `"""` de fechamento com o conteúdo do bloco,
como no primeiro exemplo.

## `StringBuilder` e `StringJoiner` para Construção Dinâmica

Se você precisa montar uma string em um loop ou com muitas concatenações,
`StringBuilder` é mais eficiente que `+` repetido — ele modifica internamente um
buffer em vez de criar um novo objeto a cada operação:

```java
StringBuilder sb = new StringBuilder();
for (String city : cities) {
    sb.append(city).append(", ");
}
String result = sb.toString(); // converte o buffer final para String
```

Para poucos valores fixos, `+` está bem. Para laços ou construção dinâmica de
textos longos, prefira `StringBuilder`.

Quando o objetivo é juntar elementos com um separador — e opcionalmente um
prefixo e um sufixo — `StringJoiner` expressa melhor a intenção:

```java
StringJoiner sj = new StringJoiner(", ", "[", "]");
for (String city : cities) {
    sj.add(city);
}
String result = sj.toString(); // "[São Paulo, Rio de Janeiro, Belo Horizonte]"
```

`StringJoiner` também cuida de não adicionar o separador após o último elemento
— algo que `StringBuilder` exigiria que você tratasse manualmente.

## `null` vs String Vazia

`null` e `""` são coisas diferentes: `null` significa que a variável não aponta
para nenhum objeto; `""` é um objeto `String` com zero caracteres.

```java
String a = null;
String b = "";

a == null;        // true
b == null;        // false
b.isEmpty();      // true — método que verifica se length() == 0
b.isBlank();      // true — similar, mas ignora espaços em branco no começo e fim
```

Chamar qualquer método em `null` lança `NullPointerException`. Quando a
distinção importa — "não informado" vs "informado mas vazio" — documente
explicitamente a convenção que o seu código segue.

---

<a href="03-tipos-por-referencia.md">← Tipos por Referência</a>

<p align="right"><a href="05-variaveis.md">Próximo: Variáveis →</a></p>
