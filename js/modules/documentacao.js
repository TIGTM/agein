// ========== MÓDULO DOCUMENTAÇÃO ==========
const DocumentacaoModule = {
    render() {
        const docs = DB.getAll('documentacao');
        // Calcular status baseado na data de vencimento
        const hoje = new Date();
        docs.forEach(d => {
            const vcto = new Date(d.vencimento);
            const dias = Math.ceil((vcto - hoje) / (1000 * 60 * 60 * 24));
            if (dias < 0) d.statusCalc = 'vencido';
            else if (dias <= 30) d.statusCalc = 'proximo_vencimento';
            else d.statusCalc = 'valido';
        });

        const vencendo = docs.filter(d => d.statusCalc === 'proximo_vencimento' || d.statusCalc === 'vencido').length;

        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Documentação</h1>
                    <p>Gerencie documentos e alvarás dos clientes</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="DocumentacaoModule.showForm()">+ Novo Documento</button>
                </div>
            </div>

            ${vencendo > 0 ? `
                <div class="info-box warning">
                    <strong>⚠️ Atenção:</strong> ${vencendo} documento(s) vencido(s) ou próximo(s) do vencimento!
                </div>
            ` : ''}

            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Documento</th>
                            <th>Tipo</th>
                            <th>Número</th>
                            <th>Emissão</th>
                            <th>Vencimento</th>
                            <th>Status</th>
                            <th style="width:120px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${docs.map(d => `
                            <tr>
                                <td><strong>${Utils.getClienteNome(d.clienteId)}</strong></td>
                                <td>${d.nome}</td>
                                <td>${d.tipo}</td>
                                <td>${d.numero}</td>
                                <td>${Utils.formatDate(d.emissao)}</td>
                                <td>${Utils.formatDate(d.vencimento)}</td>
                                <td>${Utils.statusBadge(d.statusCalc || d.status)}</td>
                                <td>
                                    <button class="btn-icon" onclick="DocumentacaoModule.showForm(${d.id})" title="Editar">✎</button>
                                    <button class="btn-icon" onclick="DocumentacaoModule.remove(${d.id})" title="Excluir">🗑</button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="8" style="text-align:center;padding:40px;color:#9ca3af;">Sem documentos</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    showForm(id = null) {
        const d = id ? DB.getById('documentacao', id) : { clienteId: '', nome: '', tipo: 'Licença', numero: '', emissao: new Date().toISOString().split('T')[0], vencimento: '', status: 'valido' };
        const clientes = DB.getAll('clientes');

        Utils.showModal(
            id ? 'Editar Documento' : 'Novo Documento',
            `
            <form id="docForm" onsubmit="DocumentacaoModule.save(event, ${id})">
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select name="clienteId" required>
                            <option value="">Selecione</option>
                            ${clientes.map(c => `<option value="${c.id}" ${c.id === d.clienteId ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Tipo</label>
                        <select name="tipo">
                            <option ${d.tipo==='Licença'?'selected':''}>Licença</option>
                            <option ${d.tipo==='Alvará'?'selected':''}>Alvará</option>
                            <option ${d.tipo==='Registro'?'selected':''}>Registro</option>
                            <option ${d.tipo==='Certificado'?'selected':''}>Certificado</option>
                            <option ${d.tipo==='Atestado'?'selected':''}>Atestado</option>
                            <option ${d.tipo==='Contrato'?'selected':''}>Contrato</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Nome do Documento *</label><input type="text" name="nome" value="${d.nome}" required></div>
                    <div class="form-group"><label>Número</label><input type="text" name="numero" value="${d.numero}"></div>
                </div>
                <div class="form-row">
                    <div class="form-group"><label>Emissão</label><input type="date" name="emissao" value="${d.emissao}"></div>
                    <div class="form-group"><label>Vencimento *</label><input type="date" name="vencimento" value="${d.vencimento}" required></div>
                </div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('docForm').requestSubmit()">Salvar</button>`
        );
    },

    save(event, id) {
        event.preventDefault();
        const f = event.target;
        DB.save('documentacao', {
            id: id || null,
            clienteId: parseInt(f.clienteId.value), nome: f.nome.value, tipo: f.tipo.value,
            numero: f.numero.value, emissao: f.emissao.value, vencimento: f.vencimento.value,
            status: 'valido'
        });
        Utils.closeModal();
        Utils.showToast('Documento salvo!', 'success');
        App.renderPage('documentacao');
    },

    remove(id) {
        Utils.confirm('Excluir documento?', () => {
            DB.delete('documentacao', id);
            Utils.showToast('Excluído!', 'success');
            App.renderPage('documentacao');
        });
    }
};
