// ========== MÓDULO DASHBOARD ==========
const DashboardModule = {
    render() {
        const clientes = DB.getAll('clientes');
        const visitas = DB.getAll('visitas');
        const pops = DB.getAll('pops');
        const fichas = DB.getAll('fichas');
        const checklistsAplicados = DB.getAll('checklistsAplicados');
        const docs = DB.getAll('documentacao');
        const planos = DB.getAll('planos');

        const clientesAtivos = clientes.filter(c => c.status === 'ativo').length;
        const visitasAgendadas = visitas.filter(v => v.status === 'agendada').length;
        const docsVencendo = docs.filter(d => d.status === 'proximo_vencimento' || d.status === 'vencido').length;
        const planosAbertos = planos.filter(p => p.status === 'em_andamento').length;

        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Dashboard</h1>
                    <p>Visão geral da sua consultoria</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-secondary" onclick="Utils.showToast('Relatório gerado!', 'success')">📊 Exportar</button>
                    <button class="btn btn-primary" onclick="App.navigateTo('visitas')">📍 Nova Visita</button>
                </div>
            </div>

            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon blue">👥</div>
                    <div class="stat-info">
                        <h3>${clientesAtivos}</h3>
                        <p>Clientes Ativos</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon green">📍</div>
                    <div class="stat-info">
                        <h3>${visitasAgendadas}</h3>
                        <p>Visitas Agendadas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon purple">📋</div>
                    <div class="stat-info">
                        <h3>${pops.length}</h3>
                        <p>POPs Cadastrados</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon orange">🍽️</div>
                    <div class="stat-info">
                        <h3>${fichas.length}</h3>
                        <p>Fichas Técnicas</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon yellow">⚠️</div>
                    <div class="stat-info">
                        <h3>${docsVencendo}</h3>
                        <p>Docs. Vencendo</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon red">🎯</div>
                    <div class="stat-info">
                        <h3>${planosAbertos}</h3>
                        <p>Planos em Aberto</p>
                    </div>
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-chart">
                    <div class="card-header">
                        <h3 class="card-title">Conformidade por Cliente</h3>
                        <small style="color:#6b7280;">Últimas auditorias</small>
                    </div>
                    <div class="chart-bar">
                        ${this.renderChart(checklistsAplicados, clientes)}
                    </div>
                </div>
                <div class="recent-activity">
                    <div class="card-header">
                        <h3 class="card-title">Atividades Recentes</h3>
                    </div>
                    <div>
                        ${this.renderActivities(visitas, clientes)}
                    </div>
                </div>
            </div>

            <div style="margin-top: 24px;">
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Próximas Visitas</h3>
                        <button class="btn btn-sm btn-secondary" onclick="App.navigateTo('visitas')">Ver Todas</button>
                    </div>
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Horário</th>
                                <th>Tipo</th>
                                <th>Consultor</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${visitas.filter(v => v.status === 'agendada').slice(0, 5).map(v => `
                                <tr>
                                    <td><strong>${Utils.getClienteNome(v.clienteId)}</strong></td>
                                    <td>${Utils.formatDate(v.data)}</td>
                                    <td>${v.horario}</td>
                                    <td>${v.tipo}</td>
                                    <td>${v.consultor}</td>
                                    <td>${Utils.statusBadge(v.status)}</td>
                                </tr>
                            `).join('') || '<tr><td colspan="6" style="text-align:center;color:#9ca3af;">Nenhuma visita agendada</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    renderChart(checklists, clientes) {
        const dataByCliente = {};
        checklists.forEach(c => {
            if (!dataByCliente[c.clienteId]) dataByCliente[c.clienteId] = [];
            dataByCliente[c.clienteId].push(c.conformidade);
        });
        const data = Object.keys(dataByCliente).slice(0, 6).map(cid => {
            const values = dataByCliente[cid];
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            const cliente = clientes.find(c => c.id === parseInt(cid));
            return { nome: cliente ? cliente.nome.split(' ')[0] : 'N/A', valor: Math.round(avg) };
        });
        if (data.length === 0) return '<div style="width:100%;text-align:center;color:#9ca3af;padding:40px;">Sem dados</div>';
        const max = Math.max(...data.map(d => d.valor), 100);
        return data.map(d => `
            <div class="chart-column">
                <div class="chart-value">${d.valor}%</div>
                <div class="chart-column-bar" style="height:${(d.valor / max) * 100}%"></div>
                <div class="chart-column-label">${d.nome}</div>
            </div>
        `).join('');
    },

    renderActivities(visitas, clientes) {
        const sorted = [...visitas].sort((a, b) => new Date(b.data) - new Date(a.data)).slice(0, 5);
        if (sorted.length === 0) return '<div style="text-align:center;color:#9ca3af;padding:20px;">Sem atividades</div>';
        return sorted.map(v => `
            <div class="activity-item">
                <div class="activity-dot"></div>
                <div class="activity-content">
                    <strong>${v.tipo} - ${Utils.getClienteNome(v.clienteId)}</strong>
                    <small>${Utils.formatDate(v.data)} às ${v.horario} • ${v.consultor}</small>
                </div>
            </div>
        `).join('');
    }
};
