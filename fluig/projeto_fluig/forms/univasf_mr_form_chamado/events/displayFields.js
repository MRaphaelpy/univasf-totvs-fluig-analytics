var ATIV = { ABRIR: 5, TRIAGEM: 6, AUTORIZAR: 7, EXECUTAR: 8, AJUSTAR: 9 };

function displayFields(form, customHTML) {
    var atividade = parseInt(getValue("WKNumState"), 10) || 0;
    var modo = String(form.getFormMode());
    var naAbertura = (atividade == 0 || atividade == ATIV.ABRIR);
    var agora = new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm").format(new java.util.Date());
    var tem = function (campo) { var v = form.getValue(campo); return v != null && String(v) != ""; };

    if (modo == "ADD") {
        form.setValue("solicitante", getValue("WKUser"));
        form.setValue("dataAbertura", agora);
    }

    var numProces = parseInt(getValue("WKNumProces"), 10) || 0;
    if (numProces > 0 && !tem("numChamado")) form.setValue("numChamado", String(numProces));

    if (modo != "VIEW") {
        if (atividade == ATIV.TRIAGEM && !tem("tecnicoResponsavel")) preencherTecnicoResponsavel(form);
        if (atividade == ATIV.AUTORIZAR) {
            if (!tem("integracaoIndisponivel")) buscarCotacao(form, agora);
            form.setValue("autorizadorData", getValue("WKUser") + " em " + agora);
        }
    }

    form.setVisibleById("secTriagem", !naAbertura);
    form.setVisibleById("secAutorizacao", atividade == ATIV.AUTORIZAR || tem("decisaoCoordenacao") || tem("integracaoIndisponivel"));
    form.setVisibleById("secAtendimento", atividade == ATIV.EXECUTAR || tem("solucao"));
    form.setVisibleById("secAjuste", atividade == ATIV.AJUSTAR || tem("oQueFoiAjustado"));

    var editaEquip = (modo != "VIEW") && (naAbertura || atividade == ATIV.AJUSTAR);
    customHTML.append("<script>window.FORM_ESTADO_SERVIDOR = {" +
        "atividade: " + atividade + "," +
        "modo: '" + modo + "'," +
        "editaEquip: " + editaEquip + "," +
        "integracaoIndisponivel: '" + (tem("integracaoIndisponivel") ? form.getValue("integracaoIndisponivel") : "") + "'" +
        "};</script>");
}

function preencherTecnicoResponsavel(form) {
    try {
        var codLab = String(form.getValue("codLaboratorio") || "");
        var c = DatasetFactory.createConstraint("CODIGO", codLab, codLab, ConstraintType.MUST);
        var ds = DatasetFactory.getDataset("univasf_mr_ds_laboratorios", null, [c], null);
        var tecnico = (ds != null && ds.rowsCount > 0) ? String(ds.getValue(0, "NOME_TECNICO") || "") : "";
        form.setValue("tecnicoResponsavel", tecnico != "" ? tecnico : "Sem técnico cadastrado (responsável padrão)");
    } catch (e) {
        log.error("[univasf_mr_form_chamado] Falha ao identificar o técnico: " + e);
    }
}

function buscarCotacao(form, agora) {
    var usd = parseFloat(String(form.getValue("valorPecaUsd") || "0").replace(",", "."));
    if (isNaN(usd)) usd = 0;
    try {
        var c = DatasetFactory.createConstraint("MOEDA", "USD", "USD", ConstraintType.MUST);
        var ds = DatasetFactory.getDataset("univasf_mr_ds_cotacao_moeda", null, [c], null);
        if (ds == null || ds.rowsCount == 0) throw "o dataset de cotação não respondeu";
        if (String(ds.getValue(0, "SUCESSO")) != "true") throw String(ds.getValue(0, "MENSAGEM"));
        var cotacao = parseFloat(String(ds.getValue(0, "COTACAO")));
        if (isNaN(cotacao) || cotacao <= 0) throw "cotação inválida";

        form.setValue("cotacaoDolar", cotacao.toFixed(4));
        form.setValue("dataCotacao", String(ds.getValue(0, "DATA")));
        form.setValue("valorReais", (usd * cotacao).toFixed(2));
        form.setValue("integracaoIndisponivel", "nao");
        form.setValue("msgIntegracao", "Cotação obtida automaticamente em " + agora + ".");
    } catch (e) {
        log.error("[univasf_mr_form_chamado] Chamado " + getValue("WKNumProces") + ": serviço de cotação indisponível: " + e);
        form.setValue("cotacaoDolar", "");
        form.setValue("dataCotacao", "");
        form.setValue("valorReais", "");
        form.setValue("integracaoIndisponivel", "sim");
        form.setValue("msgIntegracao", "Falha na integração em " + agora + ": " + e + ". Informe o valor manualmente.");
    }
}
