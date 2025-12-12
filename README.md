# Experimento Controlado: Avaliação de APIs REST vs GraphQL

##  Descrição

Este repositório contém o material desenvolvido para o laboratório de **Medição de Software**, cujo objetivo é realizar um **experimento controlado** para avaliar quantitativamente os benefícios da adoção de uma **API GraphQL** em comparação com uma **API REST**.

O experimento busca responder às seguintes perguntas de pesquisa:

- **RQ1**: Respostas às consultas GraphQL são mais rápidas que respostas às consultas REST?
- **RQ2**: Respostas às consultas GraphQL têm tamanho menor que respostas às consultas REST?

Para isso, foram implementadas APIs REST e GraphQL funcionalmente equivalentes, além de scripts para execução dos *trials*, coleta de métricas e análise estatística dos dados.

---

##  Estrutura do Experimento

O projeto está organizado de forma a permitir **reprodução e replicação** do experimento, contemplando:

- Implementação das APIs REST e GraphQL
- Scripts de execução automática das consultas
- Coleta de métricas de tempo de resposta e tamanho das respostas
- Análise estatística dos dados
- Visualização dos resultados por meio de gráficos

---

## Tecnologias Utilizadas

- Linguagem: JavaScript

- Runtime: Node.js

- Framework REST: Express.js

- Framework GraphQL: Apollo Server

- Análise de Dados: Pandas

- Visualização: Matplotlib e Seaborn

---

## Como Executar o Experimento

Instale as dependências do projeto:
```bash
npm install
```
Inicie as APIs REST e GraphQL:
```bash
node api-rest/index.js
node api-graphql/index.js
```
Execute os scripts de coleta de dados:
```bash
node scripts/run_experiment.js
```

---

## Integrantes do Grupo

- André Almeida Silva

- Davi Aguilar Nunes de Oliveira

---

Relatório

O relatório final do experimento, contendo introdução, metodologia, análise de resultados e discussão, está disponível no arquivo:

relatorio_final.md
