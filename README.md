# UNIVASF · Desafios TOTVS Fluig & Analytics

Repositório das entregas da **Atividade 5** das duas trilhas da disciplina *Optativa XII – Computação Aplicada à Análise de Informações* (Ciência da Computação, UNIVASF Campus Salgueiro), em parceria com a Mountain, parceira TOTVS.

## `analytics/`: RH Folha de Pagamento (TOTVS Analytics / GoodData)

Painel de folha de pagamento construído a partir de dados fictícios do TOTVS RM. O painel mostra o mês selecionado e compara cada indicador com o mês anterior e com o mesmo mês do ano anterior.

- **Modelo em estrela:** fato `RH FolhaPagamento` ligado a 9 dimensões e à data `Dtbase`, criado no LDM Modeler web.
- **20 métricas MAQL:**
  - 4 principais: `# Funcionários pagos`, `$ Proventos`, `$ Descontos` e `$ Líquido`;
  - 16 comparativas, com `FOR PREVIOUS` e variação percentual com formato condicional ▲▼.
- **Relatórios e dashboard:** 21 relatórios e o dashboard "01. Recursos Humanos → Folha de Pagamento", com 5 filtros e o gráfico do valor líquido mês a mês.
- **Validação:** os valores foram conferidos contra o CSV de origem, sem filtro e com Filial = Matriz.

Arquivos: `Atividade5_Analytics_Folha_de_Pagamento.docx` (documento de entrega), `METRICAS_PRONTAS.md`, `validacao_mensal_folha.csv` e `prints/`.

## `fluig/`: Central de Chamados do Laboratório (TOTVS Fluig)

Processo completo de chamados com integração REST de cotação de moeda.

- **Processo (Atividade 1):** 3 raias, 2 gateways que decidem lendo o formulário e 2 fins nomeados.
- **Formulário (Atividade 2):** fluig Style Guide, pesquisa (zoom), tabela pai-filho e máscara `SLG-00000`.
- **Regras (Atividade 3):** cada campo é editável só na sua etapa, e a validação roda no servidor e lista todas as pendências numa única mensagem.
- **Dataset e mecanismo (Atividade 4):** dataset de laboratórios com filtro, e mecanismo de atribuição com plano B.
- **Integração REST (Atividade 5):** o serviço é cadastrado no painel de controle e o código não tem URL nenhuma. A chamada tem timeout. Quando o serviço cai, o processo continua e o valor em reais é informado manualmente.

Arquivos: `projeto_fluig/` (estrutura do projeto Fluig Studio), `OBSERVACOES.md` (o que ficou pronto e os desvios), `ROTEIRO_DE_TESTE.md` e `prints/`.
