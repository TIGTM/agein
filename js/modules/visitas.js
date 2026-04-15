// ========== MÓDULO VISITAS ==========
const VisitasModule = {
    render() {
        const visitas = DB.getAll('visitas').sort((a, b) => new Date(b.data) - new Date(a.data));
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Visitas Técnicas</h1>
                    <p>Agende e gerencie visitas aos clientes</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="VisitasModule.showForm()">+ Nova Visita</button>
                </div>
            </div>

            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Horário</th>
                            <th>Cliente</th>
                            <th>Consultor</th>
                            <th>Tipo</th>
                            <th>Objetivo</th>
                            <th>Status</th>
                            <th style="width:120px;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${visitas.map(v => `
                            <tr>
                                <td>${Utils.formatDate(v.data)}</td>
                                <td>${v.horario}</td>
                                <td><strong>${Utils.getClienteNome(v.clienteId)}</strong></td>
                                <td>${v.consultor}</td>
                                <td>${v.tipo}</td>
                                <td>${v.objetivo}</td>
                                <td>${Utils.statusBadge(v.status)}</td>
                                <td>
                                    <button class="btn-icon" onclick="VisitasModule.view(${v.id})" title="Ver">👁</button>
                                    <button class="btn-icon" onclick="VisitasModule.showForm(${v.id})" title="Editar">✎</button>
                                    <button class="btn-icon" onclick="VisitasModule.remove(${v.id})" title="Excluir">🗑</button>
                                </td>
                            </tr>
                        `).join('') || '<tr><td colspan="8" style="text-align:center;padding:40px;color:#9ca3af;">Nenhuma visita</td></tr>'}
                    </tbody>
                </table>
            </div>
        `;
    },

    showForm(id = null) {
        const v = id ? DB.getById('visitas', id) : { clienteId: '', consultor: '', data: new Date().toISOString().split('T')[0], horario: '09:00', tipo: 'Consultoria', objetivo: '', status: 'agendada', observacoes: '' };
        const clientes = DB.getAll('clientes').filter(c => c.status === 'ativo');
        const equipe = DB.getAll('equipe').filter(e => e.status === 'ativo');

        Utils.showModal(
            id ? 'Editar Visita' : 'Nova Visita',
            `
            <form id="visitaForm" onsubmit="VisitasModule.save(event, ${id})">
                <div class="form-row">
                    <div class="form-group">
                        <label>Cliente *</label>
                        <select name="clienteId" required>
                            <option value="">Selecione</option>
                            ${clientes.map(c => `<option value="${c.id}" ${c.id === v.clienteId ? 'selected' : ''}>${c.nome}</option>`).join('')}
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Consultor *</label>
                        <select name="consultor" required>
                            ${equipe.map(e => `<option ${e.nome === v.consultor ? 'selected' : ''}>${e.nome}</option>`).join('')}
                        </select>
                    </div>
                </div>
                <div class="form-row three">
                    <div class="form-group"><label>Data *</label><input type="date" name="data" value="${v.data}" required></div>
                    <div class="form-group"><label>Horário</label><input type="time" name="horario" value="${v.horario}"></div>
                    <div class="form-group">
                        <label>Tipo</label>
                        <select name="tipo">
                            <option ${v.tipo==='Consultoria'?'selected':''}>Consultoria</option>
                            <option ${v.tipo==='Auditoria'?'selected':''}>Auditoria</option>
                            <option ${v.tipo==='Implementação'?'selected':''}>Implementação</option>
                            <option ${v.tipo==='Treinamento'?'selected':''}>Treinamento</option>
                            <option ${v.tipo==='Acompanhamento'?'selected':''}>Acompanhamento</option>
                        </select>
                    </div>
                </div>
                <div class="form-group"><label>Objetivo *</label><input type="text" name="objetivo" value="${v.objetivo}" required></div>
                <div class="form-group">
                    <label>Status</label>
                    <select name="status">
                        <option value="agendada" ${v.status==='agendada'?'selected':''}>Agendada</option>
                        <option value="realizada" ${v.status==='realizada'?'selected':''}>Realizada</option>
                        <option value="cancelada" ${v.status==='cancelada'?'selected':''}>Cancelada</option>
                    </select>
                </div>
                <div class="form-group"><label>Observações</label><textarea name="observacoes" rows="3">${v.observacoes}</textarea></div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('visitaForm').requestSubmit()">Salvar</button>`
        );
    },

    save(event, id) {
        event.preventDefault();
        const f = event.target;
        DB.save('visitas', {
            id: id || null,
            clienteId: parseInt(f.clienteId.value), consultor: f.consultor.value,
            data: f.data.value, horario: f.horario.value, tipo: f.tipo.value,
            objetivo: f.objetivo.value, status: f.status.value, observacoes: f.observacoes.value
        });
        Utils.closeModal();
        Utils.showToast('Visita salva!', 'success');
        App.renderPage('visitas');
    },

    view(id) {
        const v = DB.getById('visitas', id);
        Utils.showModal(
            'Detalhes da Visita',
            `
            <div class="form-row">
                <div><strong>Cliente:</strong><br>${Utils.getClienteNome(v.clienteId)}</div>
                <div><strong>Data:</strong><br>${Utils.formatDate(v.data)} às ${v.horario}</div>
            </div>
            <br>
            <div class="form-row">
                <div><strong>Consultor:</strong><br>${v.consultor}</div>
                <div><strong>Tipo:</strong><br>${v.tipo}</div>
            </div>
            <br>
            <div><strong>Objetivo:</strong><br>${v.objetivo}</div>
            <br>
            <div><strong>Status:</strong> ${Utils.statusBadge(v.status)}</div>
            <br>
            ${v.observacoes ? `<div><strong>Observações:</strong><br>${v.observacoes}</div>` : ''}
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
             <button class="btn btn-primary" onclick="Utils.closeModal(); VisitasModule.showForm(${id})">Editar</button>`
        );
    },

    remove(id) {
        Utils.confirm('Excluir visita?', () => {
            DB.delete('visitas', id);
            Utils.showToast('Excluída!', 'success');
            App.renderPage('visitas');
        });
    }
};
