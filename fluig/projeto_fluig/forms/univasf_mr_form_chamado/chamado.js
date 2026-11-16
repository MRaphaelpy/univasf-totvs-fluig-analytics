var FORM_ESTADO = { atividade: 0, modo: "ADD", editaEquip: true };

function adicionarEquipamento() {
    var indice = wdkAddChild("equipamentos");
    if (FORM_ESTADO.atividade != 8) $("#conferido___" + indice).prop("disabled", true);
    atualizarTotalEquipamentos();
}

function removerEquipamento(botao) {
    fnWdkRemoveChild(botao);
    atualizarTotalEquipamentos();
}

function atualizarTotalEquipamentos() {
    var total = $("input[name^='patrimonio___']").length;
    $("#totalEquipamentos").text(total);
}

function formatarPatrimonio(valor) {
    var digitos = String(valor || "").replace(/^SLG-?/i, "").replace(/\D/g, "").substring(0, 5);
    return digitos.length ? "SLG-" + digitos : "";
}
$(document).on("input blur", ".mask-patrimonio", function () {
    var formatado = formatarPatrimonio(this.value);
    if (this.value !== formatado) this.value = formatado;
});

function setSelectedZoomItem(item) {
    if (item.inputId === "laboratorio") {
        $("#codLaboratorio").val(item.CODIGO);
    }
}
function removedZoomItem(item) {
    if (item.inputId === "laboratorio") {
        $("#codLaboratorio").val("");
    }
}

$(document).on("change", "input[name='encaminhamento']", function () {
    $("#gwTriagem").val(this.value);
    $("#grupoPeca").toggle(this.value === "peca");
});
$(document).on("change", "input[name='decisaoCoordenacao']", function () {
    $("#gwCompra").val(this.value);
});

$(document).on("input", "#descricao", function () {
    $("#contDescricao").text(this.value.length);
});

$(function () {
    if (window.FORM_ESTADO_SERVIDOR) FORM_ESTADO = window.FORM_ESTADO_SERVIDOR;
    atualizarTotalEquipamentos();
    $("#contDescricao").text(($("#descricao").val() || "").length);

    if (!FORM_ESTADO.editaEquip || FORM_ESTADO.modo === "VIEW") {
        $("#btnAddEquipamento, .btn-remover").hide();
    }

    var enc = $("input[name='encaminhamento']:checked").val() || $("#gwTriagem").val();
    if (FORM_ESTADO.atividade && enc && enc !== "peca") $("#grupoPeca").hide();

    var indisponivel = $("input[name='integracaoIndisponivel']:checked").val();
    if (indisponivel === "sim" || FORM_ESTADO.integracaoIndisponivel === "sim") $("#avisoManual").show();
});

function beforeSendValidate(numState, nextState) {
    try {
        var anexos = 0;
        if (parent && parent.ECM && parent.ECM.attachmentTable) anexos = parent.ECM.attachmentTable.getData().length;
        $("#qtdAnexos").val(anexos);
    } catch (e) {}
    var enc = $("input[name='encaminhamento']:checked").val();
    if (enc) $("#gwTriagem").val(enc);
    var dec = $("input[name='decisaoCoordenacao']:checked").val();
    if (dec) $("#gwCompra").val(dec);
    return true;
}
