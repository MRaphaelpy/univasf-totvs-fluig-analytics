function createDataset(fields, constraints, sortFields) {
    var ds = DatasetBuilder.newDataset();
    ds.addColumn("SUCESSO");
    ds.addColumn("MOEDA");
    ds.addColumn("COTACAO");
    ds.addColumn("DATA");
    ds.addColumn("MENSAGEM");

    var moeda = "USD";
    if (constraints != null) {
        for (var i = 0; i < constraints.length; i++) {
            if (constraints[i].fieldName == "MOEDA") moeda = String(constraints[i].initialValue);
        }
    }

    try {
        var client = fluigAPI.getAuthorizeClientService();
        var req = {
            companyId: getValue("WKCompany") + "",
            serviceCode: "univasf_mr_cotacao_moeda",
            endpoint: "/json/last/" + moeda + "-BRL",
            method: "get",
            timeoutService: "10"
        };
        var vo = client.invoke(JSON.stringify(req));
        var status = vo.getHttpStatusResult();
        if (status != 200) throw "Serviço respondeu HTTP " + status;

        var json = JSON.parse(vo.getResult());
        var q = json[moeda + "BRL"];
        if (q == null || q.bid == null || isNaN(parseFloat(q.bid))) throw "Resposta inesperada do serviço";

        ds.addRow(["true", moeda, String(q.bid), String(q.create_date), "OK"]);
    } catch (e) {
        log.error("[univasf_mr_ds_cotacao_moeda] Falha na cotação: " + e);
        ds.addRow(["false", moeda, "", "", String(e)]);
    }
    return ds;
}