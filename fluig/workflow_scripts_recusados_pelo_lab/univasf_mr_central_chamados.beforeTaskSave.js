var ATIV = { ABRIR: 5, TRIAGEM: 6, AUTORIZAR: 7, EXECUTAR: 8, AJUSTAR: 9 };

function beforeTaskSave(colleagueId, nextSequenceId, userList) {
    if (String(getValue("WKCompletTask")) != "true") return;

    var atividade = parseInt(getValue("WKNumState"), 10) || 0;
    var naAbertura = (atividade == 0 || atividade == ATIV.ABRIR);
    var erros = [];

    var valor = function (campo) {
        var v = hAPI.getCardValue(campo);
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

        var linhas = linhasEquipamentos();
        if (linhas.length == 0) {
            erros.push("Inclua pelo menos um equipamento afetado.");
        }
        for (var i = 0; i < linhas.length; i++) {
            var n = linhas[i];
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

        if (valor("tipoProblema") == "dano_fisico" && hAPI.listAttachments().size() == 0) {
            erros.push("Chamado de dano físico exige pelo menos um anexo (foto do problema).");
        }
        if (atividade == ATIV.AJUSTAR && valor("oQueFoiAjustado") == "") {
            erros.push("Descreva o que foi ajustado.");
        }
    }

    if (atividade == ATIV.TRIAGEM) {
        var enc = valor("encaminhamento");
        if (enc == "") erros.push("Escolha o encaminhamento da triagem.");
        if ((enc == "improcedente" || enc == "devolver") && valor("justificativaTriagem") == "") {
            erros.push("Justifique a triagem (obrigatório para improcedente e devolução).");
        }
        if (enc == "peca") {
            if (valor("pecaNecessaria") == "") erros.push("Informe a peça necessária.");
            if (numero("valorPecaUsd") <= 0) erros.push("Informe o valor da peça em dólar.");
        }
        hAPI.setCardValue("gwTriagem", enc);
    }

    if (atividade == ATIV.AUTORIZAR) {
        var decisao = valor("decisaoCoordenacao");
        if (decisao == "") erros.push("Escolha autorizar ou negar a compra.");
        if (decisao == "negar" && valor("justificativaDecisao") == "") {
            erros.push("Justifique a recusa da compra.");
        }
        if (valor("integracaoIndisponivel") == "sim" && numero("valorReais") <= 0) {
            erros.push("A cotação não pôde ser obtida: informe o valor em reais manualmente.");
        }
        hAPI.setCardValue("gwCompra", decisao);
        hAPI.setCardValue("autorizadorData", getValue("WKUser") + " em " +
            new java.text.SimpleDateFormat("dd/MM/yyyy HH:mm").format(new java.util.Date()));
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

function linhasEquipamentos() {
    var indices = [];
    var dados = hAPI.getCardData(getValue("WKNumProces"));
    var chaves = dados.keySet().iterator();
    while (chaves.hasNext()) {
        var chave = String(chaves.next());
        var m = chave.match(/^patrimonio___(\d+)$/);
        if (m) indices.push(parseInt(m[1], 10));
    }
    indices.sort(function (a, b) { return a - b; });
    return indices;
}
