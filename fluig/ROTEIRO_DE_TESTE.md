# Roteiro de teste: Central de Chamados

Pré-requisito: serviço `univasf_mr_cotacao_moeda` com o domínio `https://economia.awesomeapi.com.br`.

| # | Regra | Como disparar | Resultado esperado |
|---|---|---|---|
| 1 | Zoom do laboratório | Na abertura, escolher "Laboratório de Informática 1" | Campo preenchido e `codLaboratorio` = LAB01 |
| 2 | Máscara do patrimônio | Incluir equipamento e digitar `12345` | Vira `SLG-12345`, também nas linhas novas |
| 3 | Pai-filho | Incluir 3 linhas, remover a do meio, salvar e reabrir | Ficam 2 linhas com os valores corretos |
| 4 | Sem equipamento | Enviar a abertura sem nenhuma linha | Bloqueia: "Inclua pelo menos um equipamento afetado." |
| 5 | Linha incompleta | Linha com o patrimônio vazio | Bloqueia informando a linha |
| 6 | Urgência alta | Urgência Alta com descrição de menos de 30 caracteres | Bloqueia mostrando o tamanho atual |
| 7 | Várias pendências | Laboratório vazio, urgência alta com descrição curta e sem equipamento | As 3 pendências aparecem numa única mensagem |
| 8 | Dano físico | Tipo "Dano físico" sem anexo; depois anexar | Bloqueia; com o anexo, passa |
| 9 | Rascunho | Salvar (não enviar) um formulário incompleto | Salva sem erro |
| 10 | Campos em leitura | Abrir a Triagem | Os dados da abertura aparecem em leitura e continuam gravados |
| 11 | Justificativa condicional | Triagem "Improcedente" ou "Devolver" sem justificativa; depois "Atender agora" sem justificativa | O primeiro bloqueia; o segundo passa |
| 12 | Gateway da triagem | Triagem "Precisa de peça" | O histórico mostra "Decisão tomada conforme condição 2" e vai para Autorizar compra |
| 13 | Cotação automática | Abrir "Autorizar compra" | Cotação, data e valor em reais (valor em US$ × cotação) preenchidos e em leitura; Integração indisponível = Não |
| 14 | Recusa da compra | "Negar" sem justificativa | Bloqueia; "Autorizar" sem justificativa passa |
| 15 | Serviço fora do ar | Trocar o domínio do serviço por um endereço inválido e abrir "Autorizar compra" | Integração indisponível = Sim, falha registrada, valor em reais liberado; sem valor informado, o envio é bloqueado; com valor, conclui |
| 16 | Endereço sem código | Trocar o domínio do serviço no painel | Nenhum arquivo é alterado; o comportamento muda |
| 17 | Dataset de laboratórios | Painel → Datasets → `univasf_mr_ds_laboratorios`, sem filtro e com filtro CODIGO = LAB02 | Sem filtro: 4 linhas; com filtro: 1 linha |
| 18 | Dataset de cotação | Consultar `univasf_mr_ds_cotacao_moeda` | SUCESSO = true com a cotação; com o domínio inválido, SUCESSO = false sem erro |
| 19 | Plano B do mecanismo | Abrir um chamado no LAB03 (sem técnico) | A triagem vai para o grupo de técnicos / responsável padrão, com aviso no log |
| 20 | Fim do fluxo | Executar atendimento preenchido e enviado | O histórico termina em "Chamado resolvido" |
