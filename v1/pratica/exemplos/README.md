# ⚙️ Exemplos Guiados

Este diretório reúne **projetos práticos completos** projetados para apoiar a
parte conceitual do curso.

Diferente de pequenos trechos de código ilustrativos, os projetos aqui presentes
são mais estruturados e acompanham **explicações detalhadas** sobre como cada
componente funciona e como ele se conecta ao embasamento teórico da disciplina.

## 📋 Catálogo de Exemplos

### 🛠️ [`mecanica-dos-objetos/`](./mecanica-dos-objetos/) _(Módulo 03)_

- **Tópico Relacionado:** [03 - Mecânica dos
  Objetos](../teoria/conceitos/03-mecanica-dos-objetos.md)
- **Descrição:** Este exemplo demonstra como a mecânica de objetos funciona
  "debaixo do capô". Desenvolvido em **linguagem C**, o projeto constrói um
  simulador de escalonamento de processos e compara diretamente duas abordagens:
  1. **Abordagem Procedural:** Utilização de estruturas e funções tradicionais
     sem encapsulamento de comportamento.
  2. **Abordagem Orientada a Objetos Simulada:** Implementação de estruturas com
     ponteiros para funções (tabelas de vtable/despacho manual) para simular
     polimorfismo e encapsulamento em C.
- **Objetivo Pedagógico:** Demonstrar que aplicar a Orientação a Objetos é uma
  mudança de paradigma na forma como você modela seu código e resolve problemas,
  e não a simples dependência de um conjunto de palavras-chave ou recursos
  nativos de uma linguagem. Como linguagens diferentes podem implementar a OO de
  maneiras distintas, o projeto evidencia que o fundamental é seguir e sustentar
  os mesmos princípios no design da solução.

## 🔮 Próximos Exemplos (Em Planejamento)

Novos projetos guiados serão adicionados ao catálogo para acompanhar a evolução
dos módulos teóricos:

- 🏗️ **Projeto Evolutivo Contínuo (Módulo 04 em diante):** A proposta de um
  sistema prático que será construído passo a passo ao longo do curso. A cada
  novo módulo estudado, o projeto será expandido e refatorado para incorporar os
  novos conceitos aprendidos.
- 🔄 **Migração de Codebase Legado para OO:** Um estudo de caso baseado em um
  código legado procedural escrito em uma linguagem OO. O exemplo demonstrará
  como a falta da aplicação correta dos pilares da OO torna a implementação de
  novas melhorias propensa a bugs, seguido pela refatoração estruturada do
  código e a inclusão segura das novas funcionalidades.
