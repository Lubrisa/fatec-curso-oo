# 1. Fundamentos de JSON e Setup do Jackson

No desenvolvimento de software contemporâneo, aplicações raramente funcionam de
forma isolada. Sistemas distribuídos, aplicativos mobile, páginas web e
microsserviços precisam trocar dados constantemente através da rede.

Para que duas aplicações escritas em linguagens diferentes (como um backend em
Java e um frontend em JavaScript ou aplicativo em Flutter) consigam se comunicar
sem ruídos, precisamos de um formato de intercâmbio de dados universal.

Esse formato é o **JSON** (_JavaScript Object Notation_).

## O que é JSON?

O **JSON** é um padrão aberto de texto estruturado, leve e de fácil leitura
tanto para seres humanos quanto para computadores. Embora tenha se originado na
linguagem JavaScript, ele é completamente independente de linguagem e suportado
por praticamente qualquer tecnologia moderna.

### Estrutura Fundamental do JSON

Um documento JSON é construído a partir de duas estruturas básicas:

1. **Objetos (`{ }`):** Coleções de pares `chave : valor`. As chaves são sempre
   textos delimitados por aspas duplas (`"`).
2. **Arrays / Listas (`[ ]`):** Sequências ordenadas de valores separados por
   vírgula.

### Tipos de Dados Suportados

Dentro de um JSON, os valores podem ser:

- **Texto (_String_):** `"Java 21"`, `"contato@fatec.sp.gov.br"` (sempre com
  aspas duplas).
- **Número (_Number_):** `42`, `19.90`, `-5` (inteiros ou decimais com ponto).
- **Booleano (_Boolean_):** `true` ou `false`.
- **Nulo (_Null_):** `null`.
- **Objetos Aninhados:** `{ ... }`.
- **Arrays:** `[ ... ]`.

### Exemplo de um Documento JSON

```json
{
  "id": 101,
  "nome": "Ana Maria Silva",
  "ativo": true,
  "saldo": 1540.5,
  "endereco": {
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01000-000"
  },
  "telefones": ["11 98888-7777", "11 3333-2222"]
}
```

## O que é o Project Jackson?

Em Java, manipular strings puras de JSON na mão (concatenando textos ou buscando
substrings) seria extremamente trabalhoso, frágil e sujeito a erros de sintaxe e
segurança.

O **Jackson** é a biblioteca de referência e o padrão da indústria no
ecossistema Java para trabalhar com JSON. É um projeto de altíssimo desempenho,
maduro e amplamente testado, sendo o mecanismo padrão utilizado internamente por
grandes frameworks como o **Spring Boot**.

### Principais Módulos do Jackson

O Jackson é dividido em três camadas modulares:

1. **`jackson-core`:** O núcleo de baixo nível responsável por ler (_parse_) e
   escrever os tokens do JSON.
2. **`jackson-annotations`:** As anotações que utilizamos no código Java para
   personalizar como os dados são convertidos.
3. **`jackson-databind`:** A camada de alto nível que conecta o Java ao JSON,
   convertendo automaticamente dados JSON em objetos Java e vice-versa.

Ao declarar o `jackson-databind` no Maven, ele traz automaticamente os outros
dois módulos como dependências transitivas.

## Configurando o Jackson no `pom.xml`

Para utilizar o Jackson em um projeto gerenciado pelo Maven, basta adicionar a
dependência **`jackson-databind`** no seu arquivo `pom.xml`:

```xml
<dependencies>
    <!-- Jackson Databind: Processamento e Mapeamento de JSON -->
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
        <version>2.18.3</version>
    </dependency>
</dependencies>
```

> **Dica de Organização com Maven Properties:**
>
> Se o seu projeto utilizar múltiplos módulos ou dependências auxiliares do
> Jackson no futuro, você pode declarar a versão em uma propriedade dentro do
> bloco `<properties>` para manter tudo centralizado:
>
> ```xml
> <!-- As propriedades declaradas no bloco <properties> são como variáveis que podem ser utilizadas em todo o documento. -->
> <properties>
>     <jackson.version>2.18.3</jackson.version>
> </properties>
>
> <dependencies>
>     <dependency>
>         <groupId>com.fasterxml.jackson.core</groupId>
>         <artifactId>jackson-databind</artifactId>
>         <version>${jackson.version}</version>
>     </dependency>
> </dependencies>
> ```

Após salvar o `pom.xml` e deixar a IDE sincronizar as dependências, o Jackson
estará pronto para uso no projeto.

No próximo capítulo, aprenderemos a utilizar o `ObjectMapper` para serializar
(transformar objetos Java em JSON) e desserializar (transformar JSON em objetos
Java).

---

<p align="right"><a href="02-object-mapper-e-operacoes-basicas.md">Próximo: ObjectMapper e Operações Básicas →</a></p>
