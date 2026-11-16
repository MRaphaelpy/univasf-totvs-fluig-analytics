var ATIV = { ABRIR: 5, TRIAGEM: 6, AUTORIZAR: 7, EXECUTAR: 8, AJUSTAR: 9 };

function beforeStateEntry(sequenceId) {
    if (sequenceId == ATIV.TRIAGEM) preencherTecnicoResponsavel();
    if (sequenceId == ATIV.AUTORIZAR) buscarCotacao();
}

function preencherTecnicoResponsavel() {
    try {
        var codLab = String(hAPI.getCardValue("codLaboratorio") || "");
        var c = DatasetFactory.createConstraint("CODIGO", codLab, codLab, ConstraintType.MUST);
        var ds = DatasetFactory.getDataset("univasf_mr_ds_laboratorios", null, [c], null);
        var tecnico = (ds != null && ds.rowsCount > 0) ? String(ds.getValue(0, "NOME_TECNICO") || "") : "";
        hAPI.setCardValue("tecnicoResponsavel", tecnico != "" ? tecnico : "Sem técnico cadastrado (responsável padrão)");
    } catch (e) {
        log.error("[univasf_mr_central_chamados] Falha ao identificar o técnico: " + e);
    }
}

function buscarCotacao() {
    var agora = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm").format(new java.util.Date());
    var usd = parseFloat(String(hAPI.getCardValue("valorPecaUsd") || "0").replace(",", "."));
    if (isNaN(usd)) usd = 0;

    try {
        var c = DatasetFactory.createConstraint("MOEDA", "USD", "USD", ConstraintType.MUST);
        var ds = DatasetFactory.getDataset("univasf_mr_ds_cotacao_moeda", null, [c], null);
        if (ds == null || ds.rowsCount == 0) throw "o dataset de cotação não respondeu";
        if (String(ds.getValue(0, "SUCESSO")) != "true") throw String(ds.getValue(0, "MENSAGEM"));

        var cotacao = parseFloat(String(ds.getValue(0, "COTACAO")));
        if (isNaN(cotacao) || cotacao <= 0) throw "cotação inválida";

        hAPI.setCardValue("cotacaoDolar", cotacao.toFixed(4));
        hAPI.setCardValue("dataCotacao", String(ds.getValue(0, "DATA")));
        hAPI.setCardValue("valorReais", (usd * cotacao).toFixed(2));
        hAPI.setCardValue("integracaoIndisponivel", "nao");
        hAPI.setCardValue("msgIntegracao", "Cotação obtida automaticamente em " + agora + ".");
    } catch (e) {
        log.error("[univasf_mr_central_chamados] Chamado " + getValue("WKNumProces") +
                  ": serviço de cotação indisponível: " + e);
        hAPI.setCardValue("cotacaoDolar", "");
        hAPI.setCardValue("dataCotacao", "");
        hAPI.setCardValue("valorReais", "");
        hAPI.setCardValue("integracaoIndisponivel", "sim");
        hAPI.setCardValue("msgIntegracao", "Falha na integração em " + agora + ": " + e + ". Informe o valor manualmente.");
    }
}
