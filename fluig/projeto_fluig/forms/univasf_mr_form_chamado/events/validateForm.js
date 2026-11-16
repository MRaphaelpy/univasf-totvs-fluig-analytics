var ATIV = { ABRIR: 5, TRIAGEM: 6, AUTORIZAR: 7, EXECUTAR: 8, AJUSTAR: 9 };

function validateForm(form) {
    if (String(getValue("WKCompletTask")) != "true") return;

    var atividade = parseInt(getValue("WKNumState"), 10) || 0;
    var naAbertura = (atividade == 0 || atividade == ATIV.ABRIR);
    var erros = [];

    var valor = function (campo) {
        var v = form.getValue(campo);
        return v == null ? "" : String(v).trim();
    };
    var numero = function (campo) {
        var n = parseFloat(valor(campo).replace(",", "."));
        return isNaN(n) ? 0 : n;
    };

    if (naAbertura || atividade == ATIV.AJUSTAR) {
        if (valor("codLaboratorio") == "") erros.push("Escolha o laboratório.");
        if (valor("tipoProblema") == "") erros.push("Informe o tipo de problema.");
        if (valor("urgencia") == "") erros.push("Informe a urgência.");
        if (valor("descricao") == "") {
            erros.push("Descreva o problema.");
        } else if (valor("urgencia") == "alta" && valor("descricao").length < 30) {
            erros.push("Urgência alta exige descrição com no mínimo 30 caracteres (atual: " + valor("descricao").length + ").");
        }

        var indices = form.getChildrenIndexes("equipamentos");
        if (indices.length == 0) erros.push("Inclua pelo menos um equipamento afetado.");
        for (var i = 0; i < indices.length; i++) {
            var n = indices[i];
            var pos = i + 1;
            var patrimonio = valor("patrimonio___" + n);
            if (patrimonio == "") {
                erros.push("Equipamento da linha " + pos + ": informe o patrimônio.");
            } else if (!/^SLG-\d{5}$/.test(patrimonio)) {
                erros.push("Equipamento da linha " + pos + ": patrimônio deve seguir o formato SLG-00000.");
            }
            if (valor("tipoEquipamento___" + n) == "") erros.push("Equipamento da linha " + pos + ": informe o tipo.");
            if (valor("problemaEquipamento___" + n) == "") erros.push("Equipamento da linha " + pos + ": informe o problema apresentado.");
        }

        if (valor("tipoProblema") == "dano_fisico" && contarAnexos(form) == 0) {
            erros.push("Chamado de dano físico exige pelo menos um anexo (foto do problema).");
        }
        if (atividade == ATIV.AJUSTAR && valor("oQueFoiAjustado") == "") {
            erros.push("Descreva o que foi ajustado.");
        }
    }

    if (atividade == ATIV.TRIAGEM) {
        var enc = valor("encaminhamento");
        if (enc == "") erros.push("Escolha o encaminhamento da triagem.");
        if (enc != "" && valor("gwTriagem") != enc) erros.push("Recarregue a página e escolha o encaminhamento novamente.");
        if ((enc == "improcedente" || enc == "devolver") && valor("justificativaTriagem") == "") {
            erros.push("Justifique a triagem (obrigatório para improcedente e devolução).");
        }
        if (enc == "peca") {
            if (valor("pecaNecessaria") == "") erros.push("Informe a peça necessária.");
            if (numero("valorPecaUsd") <= 0) erros.push("Informe o valor da peça em dólar.");
        }
    }

    if (atividade == ATIV.AUTORIZAR) {
        var decisao = valor("decisaoCoordenacao");
        if (decisao == "") erros.push("Escolha autorizar ou negar a compra.");
        if (decisao != "" && valor("gwCompra") != decisao) erros.push("Recarregue a página e escolha a decisão novamente.");
        if (decisao == "negar" && valor("justificativaDecisao") == "") {
            erros.push("Justifique a recusa da compra.");
        }
        if (valor("integracaoIndisponivel") == "nao") {
            var esperado = Math.round(numero("valorPecaUsd") * numero("cotacaoDolar") * 100) / 100;
            if (Math.abs(numero("valorReais") - esperado) > 0.01) {
                erros.push("O valor em reais não confere com a cotação usada (esperado: " + esperado.toFixed(2) + ").");
            }
        } else if (numero("valorReais") <= 0) {
            erros.push("A cotação não pôde ser obtida: informe o valor em reais manualmente.");
        }
    }

    if (atividade == ATIV.EXECUTAR) {
        if (valor("solucao") == "") erros.push("Descreva a solução aplicada.");
        if (valor("dataAtendimento") == "") erros.push("Informe a data do atendimento.");
        if (numero("tempoGasto") <= 0) erros.push("Informe o tempo gasto em horas.");
    }

    if (erros.length > 0) {
        var msg = "Não foi possível enviar. Corrija os itens abaixo:";
        for (var e = 0; e < erros.length; e++) msg += "\n" + (e + 1) + ". " + erros[e];
        throw msg;
    }
}

function contarAnexos(form) {
    var total = parseInt(String(form.getValue("qtdAnexos") || "0"), 10) || 0;
    var numProces = parseInt(getValue("WKNumProces"), 10) || 0;
    if (numProces > 0) {
        try {
            var c = DatasetFactory.createConstraint("processAttachmentPK.processInstanceId", String(numProces), String(numProces), ConstraintType.MUST);
            var ds = DatasetFactory.getDataset("processAttachment", null, [c], null);
            if (ds != null && ds.rowsCount > total) total = ds.rowsCount;
        } catch (e) {
            log.warn("[univasf_mr_form_chamado] Não foi possível consultar os anexos: " + e);
        }
    }
    return total;
}
