# Central de Chamados do Laboratório: observações da entrega

Ambiente: lab.fluig.com (ambiente de estudo do Fluig Academy, TOTVS Fluig Voyager 2.0), usuário compartilhado `academy.aluno`.
Todos os artefatos usam o prefixo `univasf_mr_`, porque o ambiente é compartilhado com outros alunos.

## Artefatos publicados

| Tipo | Código | Atividade |
|---|---|---|
| Processo | `univasf_mr_central_chamados` | 1 |
| Formulário (id 650) | `univasf_mr_form_chamado` | 2 e 3 |
| Dataset | `univasf_mr_ds_laboratorios` | 4 |
| Mecanismo de atribuição | `univasf_mr_mec_tecnico` | 4 |
| Serviço REST (painel de controle) | `univasf_mr_cotacao_moeda`, domínio `https://economia.awesomeapi.com.br` | 5 |
| Dataset | `univasf_mr_ds_cotacao_moeda` | 5 |
| Grupos | `univasf_mr_tecnicos`, `univasf_mr_coordenacao` | 1 |

## O que ficou pronto

**Atividade 1, processo**
- Pronto: três raias (Solicitante, Técnico de laboratório, Coordenação).
- Pronto: início "Abrir chamado" e quatro tarefas (Triagem, Autorizar compra, Executar atendimento, Ajustar chamado).
- Pronto: dois gateways exclusivos que leem campos ocultos do formulário (`gwTriagem`, `gwCompra`).
- Pronto: dois fins nomeados ("Chamado resolvido" e "Chamado cancelado").
- Pronto: Executar atendimento e Autorizar compra atribuídos por grupo; Triagem atribuída pelo mecanismo customizado; Ajustar chamado volta para quem abriu.
- Testado: a solicitação 35 foi do início ao fim, e o histórico mostra os gateways decidindo sozinhos ("Decisão tomada conforme condição").

**Atividade 2, formulário**
- Pronto: o formulário segue o fluig Style Guide e é dividido em seções por etapa, com mais de 16 campos (texto, texto longo, data, número, seleção e sim/não).
- Pronto: a pesquisa (zoom) de laboratório usa o dataset próprio; o código vai para o campo oculto `codLaboratorio`.
- Pronto: a tabela pai-filho de equipamentos permite incluir e remover linhas e mostra o total de itens.
- Pronto: a máscara `SLG-00000` é aplicada por delegação, então funciona também nas linhas novas.
- Pronto: o CSS é responsivo; abaixo de 600 px a tabela vira cartões.

**Atividade 3, regras**
- Pronto: `enableFields` controla, para cada etapa, quais campos ficam editáveis. Campos de etapas anteriores aparecem em leitura e mantêm o valor gravado. A coluna "Conferido?" só abre no atendimento.
- Pronto: `displayFields` mostra só as seções da etapa atual.
- Pronto: `validateForm` roda no servidor e só valida no envio, o que mantém o rascunho liberado. Ele confere:
  - equipamento obrigatório e linha incompleta, informando qual linha;
  - formato do patrimônio;
  - justificativa só no caminho da recusa;
  - descrição com 30 caracteres quando a urgência for alta;
  - anexo quando o tipo for dano físico.
  Todas as pendências aparecem numa única mensagem.
- Testado: tentar enviar a triagem sem encaminhamento foi barrado pelo servidor (print 12).

**Atividade 4, dataset e mecanismo**
- Pronto: o dataset de laboratórios tem código, nome, bloco e técnico. Os filtros são aplicados dentro do próprio dataset, aceitando busca exata e parcial, e ele também funciona sem filtro.
- Pronto: o mecanismo devolve o técnico do laboratório escolhido. O plano B, com registro no log, usa os integrantes do grupo de técnicos e, se o grupo estiver vazio, o responsável padrão. A lista nunca volta vazia. O LAB03 está cadastrado sem técnico para demonstrar esse plano B.

**Atividade 5, integração REST**
- Pronto: o endereço do serviço fica só no painel de controle. O dataset usa `serviceCode` e não tem nenhuma URL no código.
- Pronto: a chamada tem timeout de 10 s (`timeoutService`).
- Pronto: em caso de falha, ou de resposta inesperada, o dataset devolve `SUCESSO=false` sem lançar exceção.
- Testado: com o serviço no ar, a Coordenação recebeu a cotação 5,7895, a data e o valor em reais 694,74 (120 × 5,7895), em leitura (print 09).
- Testado: com o domínio trocado para um endereço inválido, sem mexer no código, o processo continuou. "Integração indisponível = Sim" foi marcado, a falha ficou registrada e o valor em reais foi liberado para digitação manual (prints 03 e 13).

## Desvio e motivo: scripts de evento do processo

O plano original era fazer a cotação no evento de processo `beforeStateEntry` e as validações no `beforeTaskSave`.
**O servidor do lab recusa qualquer processo que tenha script de evento de processo.**
Testamos com um único script de três linhas (`afterProcessCreate`), sem acentos e sem aspas duplas.
O log do Fluig Studio registra:

```
calling workflowEngineService.importProcess(... "univasf_mr_central_chamados" ...)
java.lang.RuntimeException: Erro durante a leitura do XML do processo para importação.
```

O mesmo processo, sem os scripts, foi aceito e publicado. Por isso a lógica foi para os eventos do formulário, que rodam no servidor:
- **Cotação:** é buscada no `displayFields` quando a Coordenação abre a tarefa "Autorizar compra", e não na transição de entrada.
- **Validações:** passaram para o `validateForm`. O anexo é conferido pelo dataset interno `processAttachment` e pela contagem de anexos enviada no envio.
- **Nº do chamado, técnico responsável e autorizador/data:** são preenchidos no `displayFields`.
- **Proteção do valor:** o `validateForm` recalcula o valor em reais com a cotação gravada e recusa o envio se alguém alterar o número pelo navegador.

Os scripts de processo originais estão em `workflow_scripts_recusados_pelo_lab/`, para consulta.

## O que não foi testado

- **Caminhos não percorridos:** "Devolver → Ajustar chamado → Triagem", "Improcedente" e "Negar". Estão desenhados e com condições, mas não foram executados.
- **Atribuição por laboratório:** a triagem caindo para técnicos diferentes em laboratórios diferentes. O ambiente só tem um usuário (`academy.aluno`), então todos os laboratórios apontam para ele.
- **Plano B do mecanismo:** cadastrado no LAB03, mas não foi aberto um chamado nele.
- **Tela de 390 px:** o formulário não foi aberto nessa largura.
- **Anexo de dano físico na abertura:** como o processo ainda não existe nesse momento, a conferência usa a contagem de anexos enviada pela tela. Nas etapas seguintes ela é feita pelo dataset `processAttachment`.
