function createDataset(fields, constraints, sortFields) {
    var ds = DatasetBuilder.newDataset();
    ds.addColumn("CODIGO");
    ds.addColumn("NOME");
    ds.addColumn("BLOCO");
    ds.addColumn("MATRICULA_TECNICO");
    ds.addColumn("NOME_TECNICO");

    var laboratorios = [
        ["LAB01", "Laboratório de Informática 1", "Bloco A", "academy.aluno", "Técnico do Bloco A"],
        ["LAB02", "Laboratório de Informática 2", "Bloco B", "academy.aluno", "Técnico do Bloco B"],
        ["LAB03", "Laboratório de Redes",         "Bloco C", "",              ""],
        ["LAB04", "Laboratório de Hardware",      "Bloco C", "academy.aluno", "Técnico do Bloco C"]
    ];
    var colunas = ["CODIGO", "NOME", "BLOCO", "MATRICULA_TECNICO", "NOME_TECNICO"];

    var filtros = [];
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            var c = constraints[i];
            var campo = String(c.fieldName).toUpperCase();
            var idx = colunas.indexOf(campo);
            if (idx < 0) continue;
            var valor = String(c.initialValue == null ? "" : c.initialValue);
            var parcial = (c.likeSearch == true) || valor.indexOf("%") >= 0;
            valor = valor.replace(/%/g, "");
            if (valor == "") continue;
            filtros.push({ idx: idx, valor: valor.toLowerCase(), parcial: parcial });
        }
    }

    for (var l = 0; l < laboratorios.length; l++) {
        var lab = laboratorios[l];
        var atende = true;
        for (var f = 0; f < filtros.length; f++) {
            var conteudo = String(lab[filtros[f].idx]).toLowerCase();
            if (filtros[f].parcial ? conteudo.indexOf(filtros[f].valor) < 0 : conteudo != filtros[f].valor) {
                atende = false;
                break;
            }
        }
        if (atende) ds.addRow(lab);
    }
    return ds;
}
