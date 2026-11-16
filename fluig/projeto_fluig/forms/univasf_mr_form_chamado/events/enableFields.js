var ATIV = { ABRIR: 5, TRIAGEM: 6, AUTORIZAR: 7, EXECUTAR: 8, AJUSTAR: 9 };

function enableFields(form) {
    var atividade = parseInt(getValue("WKNumState"), 10) || 0;
    var naAbertura = (atividade == 0 || atividade == ATIV.ABRIR);

    var regras = {
        laboratorio:          [ATIV.ABRIR, ATIV.AJUSTAR],
        tipoProblema:         [ATIV.ABRIR, ATIV.AJUSTAR],
        urgencia:             [ATIV.ABRIR, ATIV.AJUSTAR],
        descricao:            [ATIV.ABRIR, ATIV.AJUSTAR],
        encaminhamento:       [ATIV.TRIAGEM],
        justificativaTriagem: [ATIV.TRIAGEM],
        pecaNecessaria:       [ATIV.TRIAGEM],
        valorPecaUsd:         [ATIV.TRIAGEM],
        decisaoCoordenacao:   [ATIV.AUTORIZAR],
        justificativaDecisao: [ATIV.AUTORIZAR],
        solucao:              [ATIV.EXECUTAR],
        dataAtendimento:      [ATIV.EXECUTAR],
        tempoGasto:           [ATIV.EXECUTAR],
        oQueFoiAjustado:      [ATIV.AJUSTAR]
    };
    var sempreLeitura = ["numChamado", "dataAbertura", "solicitante", "tecnicoResponsavel",
                         "cotacaoDolar", "dataCotacao", "integracaoIndisponivel", "msgIntegracao",
                         "autorizadorData"];

    var pode = function (etapas) {
        for (var i = 0; i < etapas.length; i++) {
            if (atividade == etapas[i] || (naAbertura && etapas[i] == ATIV.ABRIR)) return true;
        }
        return false;
    };

    for (var campo in regras) form.setEnabled(campo, pode(regras[campo]));
    for (var j = 0; j < sempreLeitura.length; j++) form.setEnabled(sempreLeitura[j], false);

    var falhou = String(form.getValue("integracaoIndisponivel") || "") != "nao";
    form.setEnabled("valorReais", atividade == ATIV.AUTORIZAR && falhou);

    var editaItens = pode([ATIV.ABRIR, ATIV.AJUSTAR]);
    var editaConferido = (atividade == ATIV.EXECUTAR);
    var indices = form.getChildrenIndexes("equipamentos");
    for (var k = 0; k < indices.length; k++) {
        var n = indices[k];
        form.setEnabled("patrimonio___" + n, editaItens);
        form.setEnabled("tipoEquipamento___" + n, editaItens);
        form.setEnabled("problemaEquipamento___" + n, editaItens);
        form.setEnabled("conferido___" + n, editaConferido);
    }
}
