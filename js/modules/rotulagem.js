// ========== MÓDULO ROTULAGEM ==========
const RotulagemModule = {
    render() {
        const rotulos = DB.getAll('rotulos');
        const fichas = DB.getAll('fichas');
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Rotulagem Nutricional</h1>
                    <p>Elabore rótulos conforme RDC 429/2020 ANVISA</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="RotulagemModule.showForm()">+ Novo Rótulo</button>
                </div>
            </div>

            <div class="info-box">
                <strong>ℹ️ Regulamentação:</strong> Os rótulos gerados seguem a RDC nº 429/2020 ANVISA sobre Rotulagem Nutricional e IN nº 75/2020 sobre requisitos técnicos.
            </div>

            <div class="cards-grid">
                ${rotulos.map(r => `
                    <div class="item-card">
                        <div class="item-card-header">
                            <div>
                                <div class="item-card-title">${r.produto}</div>
                                <div class="item-card-subtitle">${Utils.getClienteNome(r.clienteId)}</div>
                            </div>
                            <span style="font-size:24px;">🏷️</span>
                        </div>
                        <div class="item-card-body">
                            <div><strong>Porção:</strong> ${r.porcaoG}g (${r.porcaoCaseira})</div>
                            <div><strong>Validade:</strong> ${r.validade}</div>
                        </div>
                        <div class="item-card-footer">
                            <small>${Utils.formatDate(r.criadoEm)}</small>
                            <div>
                                <button class="btn-icon" onclick="RotulagemModule.preview(${r.id})" title="Visualizar">👁</button>
                                <button class="btn-icon" onclick="RotulagemModule.showForm(${r.id})" title="Editar">✎</button>
                                <button class="btn-icon" onclick="RotulagemModule.remove(${r.id})" title="Excluir">🗑</button>
                            </div>
                        </div>
                    </div>
                `).join('') || '<div class="empty-state"><div class="empty-state-icon">🏷️</div><h3>Nenhum rótulo cadastrado</h3><p>Clique em "Novo Rótulo" para começar</p></div>'}
            </div>
        `;
    },

    showForm(id = null) {
        const r = id ? DB.getById('rotulos', id) : {
            produto: '', clienteId: '', fichaId: '', porcaoG: 100, porcaoCaseira: '1 unidade',
            valorCalorico: 0, carboidratos: 0, acucaresTotais: 0, acucaresAdicionados: 0,
            proteinas: 0, gordurasTotais: 0, gordurasSaturadas: 0, gordurasTrans: 0,
            fibras: 0, sodio: 0, validade: '12 meses', ingredientes: '', alergicos: '',
            lote: '', fabricacao: new Date().toISOString().split('T')[0],
            altoAcucar: false, altoSodio: false, altoGorduraSaturada: false
        };
        const clientes = DB.getAll('clientes');
        const fichas = DB.getAll('fichas');

        Utils.showModal(
            id ? 'Editar Rótulo' : 'Novo Rótulo',
            `
            <form id="rotuloForm" onsubmit="RotulagemModule.save(event, ${id})">
                <div class="form-row">
                    <div class="form-group"><label>Nome do Produto *</label><input type="text" name="produto" value="${r.produto}" required></div>
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select name="clienteId" required>
                            <option value="">Selecione</option>
                            ${clientes.map(c => `<option value="${c.id}" ${c.id === r.clienteId ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Porção (g ou ml)</label><input type="number" name="porcaoG" value="${r.porcaoG}" step="0.1"></div>
                    <div class="form-group"><label>Medida Caseira</label><input type="text" name="porcaoCaseira" value="${r.porcaoCaseira}"></div>
                </div>

                <h3 style="margin-top:20px;margin-bottom:12px;color:#0054e9;">Informação Nutricional</h3>
                <div class="form-row three">
                    <div class="form-group"><label>Valor Energético (kcal)</label><input type="number" name="valorCalorico" value="${r.valorCalorico}" step="0.1"></div>
                    <div class="form-group"><label>Carboidratos (g)</label><input type="number" name="carboidratos" value="${r.carboidratos}" step="0.1"></div>
                    <div class="form-group"><label>Açúcares Totais (g)</label><input type="number" name="acucaresTotais" value="${r.acucaresTotais}" step="0.1"></div>
                </div>
                <div class="form-row three">
                    <div class="form-group"><label>Açúcares Adicionados (g)</label><input type="number" name="acucaresAdicionados" value="${r.acucaresAdicionados}" step="0.1"></div>
                    <div class="form-group"><label>Proteínas (g)</label><input type="number" name="proteinas" value="${r.proteinas}" step="0.1"></div>
                    <div class="form-group"><label>Gorduras Totais (g)</label><input type="number" name="gordurasTotais" value="${r.gordurasTotais}" step="0.1"></div>
                </div>
                <div class="form-row three">
                    <div class="form-group"><label>Gorduras Saturadas (g)</label><input type="number" name="gordurasSaturadas" value="${r.gordurasSaturadas}" step="0.1"></div>
                    <div class="form-group"><label>Gorduras Trans (g)</label><input type="number" name="gordurasTrans" value="${r.gordurasTrans}" step="0.1"></div>
                    <div class="form-group"><label>Fibras (g)</label><input type="number" name="fibras" value="${r.fibras}" step="0.1"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Sódio (mg)</label><input type="number" name="sodio" value="${r.sodio}" step="0.1"></div>
                    <div class="form-group"><label>Validade</label><input type="text" name="validade" value="${r.validade}"></div>
                </div>

                <h3 style="margin-top:20px;margin-bottom:12px;color:#0054e9;">Informações Adicionais</h3>
                <div class="form-group"><label>Ingredientes (em ordem decrescente)</label><textarea name="ingredientes" rows="2">${r.ingredientes}</textarea></div>
                <div class="form-group"><label>Alérgicos (Contém: ...)</label><input type="text" name="alergicos" value="${r.alergicos}" placeholder="Ex: CONTÉM GLÚTEN, LEITE"></div>
                <div class="form-row">
                    <div class="form-group"><label>Lote</label><input type="text" name="lote" value="${r.lote}"></div>
                    <div class="form-group"><label>Fabricação</label><input type="date" name="fabricacao" value="${r.fabricacao}"></div>
                </div>

                <h3 style="margin-top:20px;margin-bottom:12px;color:#0054e9;">Advertências (Rotulagem Frontal)</h3>
                <div class="checkbox-list">
                    <div class="checkbox-item">
                        <input type="checkbox" name="altoAcucar" id="altoAcucar" ${r.altoAcucar ? 'checked' : ''}>
                        <label for="altoAcucar">⚠️ Alto em Açúcares Adicionados</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="altoSodio" id="altoSodio" ${r.altoSodio ? 'checked' : ''}>
                        <label for="altoSodio">⚠️ Alto em Sódio</label>
                    </div>
                    <div class="checkbox-item">
                        <input type="checkbox" name="altoGorduraSaturada" id="altoGorduraSaturada" ${r.altoGorduraSaturada ? 'checked' : ''}>
                        <label for="altoGorduraSaturada">⚠️ Alto em Gorduras Saturadas</label>
                    </div>
                </div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('rotuloForm').requestSubmit()">Salvar Rótulo</button>`,
            'large'
        );
    },

    save(event, id) {
        event.preventDefault();
        const f = event.target;
        DB.save('rotulos', {
            id: id || null,
            produto: f.produto.value,
            clienteId: parseInt(f.clienteId.value),
            porcaoG: parseFloat(f.porcaoG.value) || 0,
            porcaoCaseira: f.porcaoCaseira.value,
            valorCalorico: parseFloat(f.valorCalorico.value) || 0,
            carboidratos: parseFloat(f.carboidratos.value) || 0,
            acucaresTotais: parseFloat(f.acucaresTotais.value) || 0,
            acucaresAdicionados: parseFloat(f.acucaresAdicionados.value) || 0,
            proteinas: parseFloat(f.proteinas.value) || 0,
            gordurasTotais: parseFloat(f.gordurasTotais.value) || 0,
            gordurasSaturadas: parseFloat(f.gordurasSaturadas.value) || 0,
            gordurasTrans: parseFloat(f.gordurasTrans.value) || 0,
            fibras: parseFloat(f.fibras.value) || 0,
            sodio: parseFloat(f.sodio.value) || 0,
            validade: f.validade.value, ingredientes: f.ingredientes.value, alergicos: f.alergicos.value,
            lote: f.lote.value, fabricacao: f.fabricacao.value,
            altoAcucar: f.altoAcucar.checked, altoSodio: f.altoSodio.checked,
            altoGorduraSaturada: f.altoGorduraSaturada.checked,
            criadoEm: id ? DB.getById('rotulos', id).criadoEm : new Date().toISOString().split('T')[0]
        });
        Utils.closeModal();
        Utils.showToast('Rótulo salvo!', 'success');
        App.renderPage('rotulagem');
    },

    preview(id) {
        const r = DB.getById('rotulos', id);
        const vd = { energia: 2000, carb: 300, prot: 50, gord: 55, sat: 22, fibras: 25, sodio: 2000 };
        const pct = (val, ref) => ((val / ref) * 100).toFixed(0);

        Utils.showModal(
            'Prévia do Rótulo',
            `
            <div id="rotuloPreview" class="rotulo-preview">
                <h3>INFORMAÇÃO NUTRICIONAL</h3>
                <p class="porcao-info">Porção de ${r.porcaoG}g (${r.porcaoCaseira})</p>
                <table>
                    <thead>
                        <tr><th></th><th>Por porção</th><th>%VD*</th></tr>
                    </thead>
                    <tbody>
                        <tr><td><strong>Valor energético</strong></td><td>${r.valorCalorico} kcal</td><td>${pct(r.valorCalorico, vd.energia)}%</td></tr>
                        <tr><td><strong>Carboidratos</strong></td><td>${r.carboidratos} g</td><td>${pct(r.carboidratos, vd.carb)}%</td></tr>
                        <tr><td style="padding-left:12px;">Açúcares totais</td><td>${r.acucaresTotais} g</td><td>-</td></tr>
                        <tr><td style="padding-left:12px;">Açúcares adicionados</td><td>${r.acucaresAdicionados} g</td><td>-</td></tr>
                        <tr><td><strong>Proteínas</strong></td><td>${r.proteinas} g</td><td>${pct(r.proteinas, vd.prot)}%</td></tr>
                        <tr><td><strong>Gorduras totais</strong></td><td>${r.gordurasTotais} g</td><td>${pct(r.gordurasTotais, vd.gord)}%</td></tr>
                        <tr><td style="padding-left:12px;">Saturadas</td><td>${r.gordurasSaturadas} g</td><td>${pct(r.gordurasSaturadas, vd.sat)}%</td></tr>
                        <tr><td style="padding-left:12px;">Trans</td><td>${r.gordurasTrans} g</td><td>-</td></tr>
                        <tr><td><strong>Fibra alimentar</strong></td><td>${r.fibras} g</td><td>${pct(r.fibras, vd.fibras)}%</td></tr>
                        <tr><td><strong>Sódio</strong></td><td>${r.sodio} mg</td><td>${pct(r.sodio, vd.sodio)}%</td></tr>
                    </tbody>
                </table>
                <p style="font-size:9px;margin-top:8px;">*Percentual de Valores Diários fornecidos pela porção.</p>
            </div>

            ${r.altoAcucar || r.altoSodio || r.altoGorduraSaturada ? `
                <div style="margin-top:16px;text-align:center;">
                    <strong style="color:#c5000f;">ADVERTÊNCIAS FRONTAIS:</strong>
                    <div style="display:flex;gap:8px;justify-content:center;margin-top:8px;flex-wrap:wrap;">
                        ${r.altoAcucar ? '<div style="background:#000;color:white;padding:8px 12px;border-radius:4px;font-weight:700;font-size:11px;">⚠ ALTO EM AÇÚCARES ADICIONADOS</div>' : ''}
                        ${r.altoSodio ? '<div style="background:#000;color:white;padding:8px 12px;border-radius:4px;font-weight:700;font-size:11px;">⚠ ALTO EM SÓDIO</div>' : ''}
                        ${r.altoGorduraSaturada ? '<div style="background:#000;color:white;padding:8px 12px;border-radius:4px;font-weight:700;font-size:11px;">⚠ ALTO EM GORDURA SATURADA</div>' : ''}
                    </div>
                </div>
            ` : ''}

            <div style="margin-top:20px;padding:16px;background:#f9fafb;border-radius:8px;font-size:12px;">
                ${r.ingredientes ? `<p><strong>INGREDIENTES:</strong> ${r.ingredientes}</p>` : ''}
                ${r.alergicos ? `<p style="margin-top:8px;"><strong>${r.alergicos.toUpperCase()}</strong></p>` : ''}
                ${r.lote ? `<p style="margin-top:8px;">Lote: ${r.lote}</p>` : ''}
                <p>Fabricação: ${Utils.formatDate(r.fabricacao)}</p>
                <p>Validade: ${r.validade}</p>
            </div>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
             <button class="btn btn-primary" onclick="Utils.printElement('rotuloPreview')">🖨 Imprimir Rótulo</button>`,
            'large'
        );
    },

    remove(id) {
        Utils.confirm('Excluir rótulo?', () => {
            DB.delete('rotulos', id);
            Utils.showToast('Excluído!', 'success');
            App.renderPage('rotulagem');
        });
    }
};
