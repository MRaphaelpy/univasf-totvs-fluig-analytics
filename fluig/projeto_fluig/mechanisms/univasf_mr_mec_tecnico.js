function resolve(process, colleague) {
    var GRUPO_TECNICOS = "univasf_mr_tecnicos";
    var RESPONSAVEL_PADRAO = "academy.aluno";

    var usuarios = new java.util.ArrayList();
    var codLab = "";
    try {
        codLab = String(hAPI.getCardValue("codLaboratorio") || "");
        if (codLab != "") {
            var c = DatasetFactory.createConstraint("CODIGO", codLab, codLab, ConstraintType.MUST);
            var ds = DatasetFactory.getDataset("univasf_mr_ds_laboratorios", null, [c], null);
            if (ds != null && ds.rowsCount > 0) {
                var tecnico = String(ds.getValue(0, "MATRICULA_TECNICO") || "");
                if (tecnico != "") usuarios.add(tecnico);
            }
        }
    } catch (e) {
        log.error("[univasf_mr_mec_tecnico] Erro ao consultar laboratório " + codLab + ": " + e);
    }

    if (usuarios.isEmpty()) {
        log.warn("[univasf_mr_mec_tecnico] Laboratório " + codLab +
                 " sem técnico cadastrado. Usando plano B (grupo " + GRUPO_TECNICOS + ").");
        try {
            var cg = DatasetFactory.createConstraint("colleagueGroupPK.groupId", GRUPO_TECNICOS, GRUPO_TECNICOS, ConstraintType.MUST);
            var membros = DatasetFactory.getDataset("colleagueGroup", null, [cg], null);
            for (var i = 0; membros != null && i < membros.rowsCount; i++) {
                usuarios.add(String(membros.getValue(i, "colleagueGroupPK.colleagueId")));
            }
        } catch (e2) {
            log.error("[univasf_mr_mec_tecnico] Erro ao ler o grupo " + GRUPO_TECNICOS + ": " + e2);
        }
    }

    if (usuarios.isEmpty()) {
        log.warn("[univasf_mr_mec_tecnico] Grupo vazio. Atribuindo ao responsável padrão " + RESPONSAVEL_PADRAO + ".");
        usuarios.add(RESPONSAVEL_PADRAO);
    }
    return usuarios;
}
