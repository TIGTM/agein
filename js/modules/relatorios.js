// ========== MÓDULO RELATÓRIOS ==========
const RelatoriosModule = {
    render() {
        const clientes = DB.getAll('clientes');
        const visitas = DB.getAll('visitas');
        const checklistsAplicados = DB.getAll('checklistsAplicados');
        const treinamentos = DB.getAll('treinamentos');
        const pops = DB.getAll('pops');
        const fichas = DB.getAll('fichas');

        const visitasRealizadas = visitas.filter(v => v.status === 'realizada').length;
        const visitasAgendadas = visitas.filter(v => v.status === 'agendada').length;
        const conformidadeMedia = checklistsAplicados.length > 0
            ? Math.round(checklistsAplicados.reduce((acc, c) => acc + c.conformidade, 0) / checklistsAplicados.length)
            : 0;

        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Relatórios</h1>
                    <p>Visão consolidada e análises</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-secondary" onclick="Utils.printElement('relatoriosContent')">🖨 Imprimir</button>
                    <button class="btn btn-primary" onclick="RelatoriosModule.exportAll()">⬇ Exportar Dados</button>
                </div>
            </div>

            <div id="relatoriosContent">
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon blue">👥</div>
                        <div class="stat-info"><h3>${clientes.length}</h3><p>Total de Clientes</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon green">✅</div>
                        <div class="stat-info"><h3>${visitasRealizadas}</h3><p>Visitas Realizadas</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon yellow">📅</div>
                        <div class="stat-info"><h3>${visitasAgendadas}</h3><p>Visitas Agendadas</p></div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon purple">📊</div>
                        <div class="stat-info"><h3>${conformidadeMedia}%</h3><p>Conformidade Média</p></div>
                    </div>
                </div>

                <div class="card" style="margin-top:20px;">
                    <div class="card-header">
                        <h3 class="card-title">Relatório de Atividades por Cliente</h3>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Visitas</th>
                                <th>Checklists</th>
                                <th>POPs</th>
                                <th>Fichas</th>
                                <th>Treinamentos</th>
                                <th>Conformidade</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${clientes.filter(c => c.status === 'ativo').map(c => {
                                const vc = visitas.filter(v => v.clienteId === c.id).length;
                                const ca = checklistsAplicados.filter(ca => ca.clienteId === c.id);
                                const pc = pops.filter(p => p.clienteId === c.id).length;
                                const fc = fichas.filter(f => f.clienteId === c.id).length;
                                const tc = treinamentos.filter(t => t.clienteId === c.id).length;
                                const confMed = ca.length > 0 ? Math.round(ca.reduce((a, c) => a + c.conformidade, 0) / ca.length) : 0;
                                return `
                                    <tr>
                                        <td><strong>${c.nome}</strong></td>
                                        <td>${vc}</td>
                                        <td>${ca.length}</td>
                                        <td>${pc}</td>
                                        <td>${fc}</td>
                                        <td>${tc}</td>
                                        <td>
                                            <div style="display:flex;align-items:center;gap:8px;">
                                                <div class="progress" style="width:60px;"><div class="progress-bar" style="width:${confMed}%;"></div></div>
                                                <span>${confMed}%</span>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>

                <div class="dashboard-grid" style="margin-top:20px;">
                    <div class="card">
                        <div class="card-header"><h3 class="card-title">Distribuição por Tipo de Cliente</h3></div>
                        ${this.renderTiposCliente(clientes)}
                    </div>
                    <div class="card">
                        <div class="card-header"><h3 class="card-title">Visitas por Tipo</h3></div>
                        ${this.renderVisitasPorTipo(visitas)}
                    </div>
                </div>
            </div>
        `;
    },

    renderTiposCliente(clientes) {
        const tipos = {};
        clientes.forEach(c => { tipos[c.tipo] = (tipos[c.tipo] || 0) + 1; });
        const total = clientes.length;
        return Object.entries(tipos).map(([tipo, qtd]) => `
            <div style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="font-size:13px;">${tipo}</span>
                    <strong>${qtd} (${Math.round(qtd/total*100)}%)</strong>
                </div>
                <div class="progress"><div class="progress-bar" style="width:${qtd/total*100}%;"></div></div>
            </div>
        `).join('');
    },

    renderVisitasPorTipo(visitas) {
        const tipos = {};
        visitas.forEach(v => { tipos[v.tipo] = (tipos[v.tipo] || 0) + 1; });
        const total = visitas.length || 1;
        return Object.entries(tipos).map(([tipo, qtd]) => `
            <div style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
                    <span style="font-size:13px;">${tipo}</span>
                    <strong>${qtd} (${Math.round(qtd/total*100)}%)</strong>
                </div>
                <div class="progress"><div class="progress-bar" style="width:${qtd/total*100}%;background:linear-gradient(90deg, #2dd55b, #0abab5);"></div></div>
            </div>
        `).join('');
    },

    exportAll() {
        const data = {
            exportadoEm: new Date().toISOString(),
            clientes: DB.getAll('clientes'),
            fornecedores: DB.getAll('fornecedores'),
            equipe: DB.getAll('equipe'),
            checklists: DB.getAll('checklists'),
            checklistsAplicados: DB.getAll('checklistsAplicados'),
            pops: DB.getAll('pops'),
            fichas: DB.getAll('fichas'),
            rotulos: DB.getAll('rotulos'),
            visitas: DB.getAll('visitas'),
            planos: DB.getAll('planos'),
            documentacao: DB.getAll('documentacao'),
            treinamentos: DB.getAll('treinamentos'),
            formularios: DB.getAll('formularios'),
            legislacoes: DB.getAll('legislacoes')
        };
        Utils.exportToJson(data, `agein-backup-${new Date().toISOString().split('T')[0]}.json`);
        Utils.showToast('Dados exportados com sucesso!', 'success');
    }
};
