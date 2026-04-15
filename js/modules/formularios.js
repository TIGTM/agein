// ========== MÓDULO FORMULÁRIOS (Planilhas de controle) ==========
const FormulariosModule = {
    render() {
        const formularios = DB.getAll('formularios');
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Formulários e Planilhas</h1>
                    <p>Controle de temperatura, limpeza, recebimento e mais</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="FormulariosModule.showForm()">+ Novo Registro</button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">🌡️</div>
                    <div class="stat-info">
                        <h3>${formularios.filter(f => f.tipo === 'Controle de Temperatura').length}</h3>
                        <p>Registros de Temperatura</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">🧽</div>
                    <div class="stat-info">
                        <h3>${formularios.filter(f => f.tipo === 'Controle de Limpeza').length}</h3>
                        <p>Registros de Limpeza</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">📦</div>
                    <div class="stat-info">
                        <h3>${formularios.filter(f => f.tipo === 'Controle de Recebimento').length}</h3>
                        <p>Registros de Recebimento</p>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Registros</th>
                            <th style="width:150px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${formularios.map(f => `
                            <tr>
                                <td>${Utils.formatDate(f.data)}</td>
                                <td><strong>${Utils.getClienteNome(f.clienteId)}</strong></td>
                                <td>${f.tipo}</td>
                                <td>${f.registros.length} registro(s)</td>
                                <td>
                                    <button class="btn-icon" onclick="FormulariosModule.view(${f.id})" title="Ver">👁</button>
                                    <button class="btn-icon" onclick="FormulariosModule.remove(${f.id})" title="Excluir">🗑</button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="5" style="text-align:center;padding:40px;color:#9ca3af;">Sem registros</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    showForm() {
        const clientes = DB.getAll('clientes');
        Utils.showModal(
            'Novo Registro',
            `
            <form id="formForm" onsubmit="FormulariosModule.save(event)">
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select name="clienteId" required>
                            <option value="">Selecione</option>
                            ${clientes.map(c => `<option value="${c.id}">${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group"><label>Data</label><input type="date" name="data" value="${new Date().toISOString().split('T')[0]}" required></div>
                </div>
                <div class="form-group">
                    <label>Tipo de Formulário *</label>
                    <select name="tipo" required>
                        <option>Controle de Temperatura</option>
                        <option>Controle de Limpeza</option>
                        <option>Controle de Recebimento</option>
                        <option>Controle de Validade</option>
                        <option>Registro de Não Conformidade</option>
                        <option>Registro de Manutenção</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Observações / Detalhes</label>
                    <textarea name="detalhes" rows="4" placeholder="Descreva os detalhes do registro..."></textarea>
                </div>
                <div class="info-box">💡 Este registro fica arquivado para auditorias e fiscalizações.</div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('formForm').requestSubmit()">Salvar</button>`
        );
    },

    save(event) {
        event.preventDefault();
        const f = event.target;
        DB.save('formularios', {
            id: null,
            clienteId: parseInt(f.clienteId.value),
            data: f.data.value,
            tipo: f.tipo.value,
            registros: [{detalhes: f.detalhes.value, hora: new Date().toTimeString().substring(0,5)}]
        });
        Utils.closeModal();
        Utils.showToast('Registro salvo!', 'success');
        App.renderPage('formularios');
    },

    view(id) {
        const f = DB.getById('formularios', id);
        Utils.showModal(
            f.tipo,
            `
            <p><strong>Cliente:</strong> ${Utils.getClienteNome(f.clienteId)}</p>
            <p><strong>Data:</strong> ${Utils.formatDate(f.data)}</p>
            <br>
            <h3 style="color:#0054e9;">Registros</h3>
            ${f.registros.map(r => `
                <div class="card" style="margin-bottom:8px;">
                    ${Object.entries(r).map(([k, v]) => `<div><strong>${k}:</strong> ${v}</div>`).join('')}
                </div>
            `).join('')}
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>`
        );
    },

    remove(id) {
        Utils.confirm('Excluir registro?', () => {
            DB.delete('formularios', id);
            Utils.showToast('Excluído!', 'success');
            App.renderPage('formularios');
        });
    }
};
