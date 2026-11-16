# Métricas MAQL: RH Folha de Pagamento

Pasta: **Atividade 5 - Folha de Pagamento** (Manage → Metrics).

| Objeto | Origem |
|---|---|
| `Valor Provpag`, `Valor Descpag`, `Valor Liqpag` | Fatos de RH FolhaPagamento |
| `Provdescbase` | Atributo de RH FolhaPagamento (P, D, B) |
| `Pkchapa` | Atributo-chave de RH Funcionario |
| `Records of RH FolhaPagamento` | Atributo de registros do fato |
| `Month/Year (Dtbase)` | Mês/Ano da data Dtbase |

## Métricas principais

| Métrica | MAQL | Formato |
|---|---|---|
| # Funcionários pagos | `SELECT COUNT(Pkchapa, Records of RH FolhaPagamento)` | `#,##0` |
| $ Proventos | `SELECT SUM(Valor Provpag) WHERE Provdescbase = P` | `$#,##0.00` |
| $ Descontos | `SELECT SUM(Valor Descpag) WHERE Provdescbase = D` | `$#,##0.00` |
| $ Líquido | `SELECT SUM(Valor Liqpag) WHERE Provdescbase = B` | `$#,##0.00` |

## Métricas comparativas

Para cada indicador X acima:

| Métrica | MAQL | Formato |
|---|---|---|
| X do mês anterior | `SELECT X FOR PREVIOUS(Month/Year (Dtbase))` | mesmo de X |
| X do mês anterior [% Var] | `SELECT (X - X do mês anterior) / X do mês anterior` | condicional |
| X do ano anterior | `SELECT X FOR PREVIOUS(Month/Year (Dtbase), 12)` | mesmo de X |
| X do ano anterior [% Var] | `SELECT (X - X do ano anterior) / X do ano anterior` | condicional |

## Formato condicional das variações

```
[=null]--;[>0.05][color=198762]▲#,##0.00%;[>0][color=F0CA38]▲#,##0.00%;[=0][color=F0CA38]◄#,##0.00%;[>=-0.05][color=F0CA38]▼#,##0.00%;[<-0.05][color=D3362C]▼#,##0.00%
```

## Valores de referência (set/2026, sem filtros)

| Indicador | Set/2026 | Mês ant. | % mês | Ano ant. | % ano |
|---|---|---|---|---|---|
| # Funcionários pagos | 298 | 297 | 0,34% | 295 | 1,02% |
| $ Proventos | 1.272.898,52 | 1.242.671,12 | 2,43% | 1.234.259,61 | 3,13% |
| $ Descontos | 162.749,17 | 156.914,78 | 3,72% | 155.403,19 | 4,73% |
| $ Líquido | 1.110.149,35 | 1.085.756,34 | 2,25% | 1.078.856,42 | 2,90% |
