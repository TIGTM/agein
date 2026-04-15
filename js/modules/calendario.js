// ========== MÓDULO CALENDÁRIO ==========
const CalendarioModule = {
    currentDate: new Date(),

    render() {
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1>Calendário</h1>
                    <p>Organize suas visitas e atividades</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-primary" onclick="CalendarioModule.addEvento()">+ Novo Evento</button>
                </div>
            </div>

            <div class="calendar">
                <div class="calendar-header">
                    <h3>${this.getMonthName()} ${this.currentDate.getFullYear()}</h3>
                    <div class="calendar-nav">
                        <button class="btn btn-sm btn-secondary" onclick="CalendarioModule.previousMonth()">‹</button>
                        <button class="btn btn-sm btn-secondary" onclick="CalendarioModule.goToToday()">Hoje</button>
                        <button class="btn btn-sm btn-secondary" onclick="CalendarioModule.nextMonth()">›</button>
                    </div>
                </div>
                <div class="calendar-grid">
                    <div class="calendar-day-header">Dom</div>
                    <div class="calendar-day-header">Seg</div>
                    <div class="calendar-day-header">Ter</div>
                    <div class="calendar-day-header">Qua</div>
                    <div class="calendar-day-header">Qui</div>
                    <div class="calendar-day-header">Sex</div>
                    <div class="calendar-day-header">Sáb</div>
                    ${this.renderDays()}
                </div>
            </div>

            <div class="card" style="margin-top:20px;">
                <div class="card-header">
                    <h3 class="card-title">Eventos do Mês</h3>
                </div>
                ${this.renderEventosList()}
            </div>
        `;
    },

    getMonthName() {
        const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        return meses[this.currentDate.getMonth()];
    },

    renderDays() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const eventos = DB.getAll('eventos');
        const visitas = DB.getAll('visitas');
        const treinamentos = DB.getAll('treinamentos');

        const allEvents = [
            ...eventos.map(e => ({...e, tipo: e.tipo || 'evento'})),
            ...visitas.map(v => ({data: v.data, titulo: `Visita - ${Utils.getClienteNome(v.clienteId)}`, tipo: 'visita'})),
            ...treinamentos.map(t => ({data: t.data, titulo: `Treinamento - ${t.titulo}`, tipo: 'treinamento'}))
        ];

        let html = '';

        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(year, month, d);
            const dateStr = date.toISOString().split('T')[0];
            const hasEvent = allEvents.some(e => e.data === dateStr);
            const isToday = date.getTime() === today.getTime();
            html += `<div class="calendar-day ${isToday ? 'today' : ''} ${hasEvent ? 'has-event' : ''}" onclick="CalendarioModule.showDayEvents('${dateStr}')">${d}</div>`;
        }

        const remaining = 42 - (firstDay + daysInMonth);
        for (let d = 1; d <= remaining && d <= 14; d++) {
            html += `<div class="calendar-day other-month">${d}</div>`;
        }

        return html;
    },

    renderEventosList() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const visitas = DB.getAll('visitas');
        const treinamentos = DB.getAll('treinamentos');
        const eventos = DB.getAll('eventos');

        const allEvents = [
            ...eventos,
            ...visitas.map(v => ({id: 'v'+v.id, data: v.data, titulo: `Visita - ${Utils.getClienteNome(v.clienteId)}`, tipo: 'visita', hora: v.horario})),
            ...treinamentos.map(t => ({id: 't'+t.id, data: t.data, titulo: `Treinamento - ${t.titulo}`, tipo: 'treinamento'}))
        ].filter(e => {
            const d = new Date(e.data);
            return d.getMonth() === month && d.getFullYear() === year;
        }).sort((a, b) => new Date(a.data) - new Date(b.data));

        if (allEvents.length === 0) return '<p style="text-align:center;color:#9ca3af;padding:20px;">Nenhum evento neste mês</p>';

        const icons = { visita: '📍', treinamento: '🎓', auditoria: '📋', reuniao: '💼', evento: '📅' };

        return `
            <div class="timeline">
                ${allEvents.map(e => `
                    <div class="timeline-item">
                        <div class="timeline-date">${Utils.formatDate(e.data)} ${e.hora || ''}</div>
                        <div class="timeline-title">${icons[e.tipo] || '📅'} ${e.titulo}</div>
                        <div class="timeline-content">Tipo: ${e.tipo}</div>
                    </div>
                `).join('')}
            </div>
        `;
    },

    showDayEvents(dateStr) {
        const visitas = DB.getAll('visitas').filter(v => v.data === dateStr);
        const treinamentos = DB.getAll('treinamentos').filter(t => t.data === dateStr);
        const eventos = DB.getAll('eventos').filter(e => e.data === dateStr);

        if (visitas.length === 0 && treinamentos.length === 0 && eventos.length === 0) {
            this.addEvento(dateStr);
            return;
        }

        Utils.showModal(
            `Eventos em ${Utils.formatDate(dateStr)}`,
            `
            ${visitas.map(v => `
                <div class="item-card" style="margin-bottom:8px;">
                    <strong>📍 Visita - ${Utils.getClienteNome(v.clienteId)}</strong>
                    <br><small>${v.horario} • ${v.tipo} • ${v.objetivo}</small>
                </div>
            `).join('')}
            ${treinamentos.map(t => `
                <div class="item-card" style="margin-bottom:8px;">
                    <strong>🎓 ${t.titulo}</strong>
                    <br><small>Cliente: ${Utils.getClienteNome(t.clienteId)} • ${t.cargaHoraria}h</small>
                </div>
            `).join('')}
            ${eventos.map(e => `
                <div class="item-card" style="margin-bottom:8px;">
                    <strong>📅 ${e.titulo}</strong>
                    <br><small>Tipo: ${e.tipo}</small>
                </div>
            `).join('')}
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Fechar</button>
             <button class="btn btn-primary" onclick="Utils.closeModal(); CalendarioModule.addEvento('${dateStr}')">+ Novo Evento</button>`
        );
    },

    addEvento(data = null) {
        Utils.showModal(
            'Novo Evento',
            `
            <form id="eventoForm" onsubmit="CalendarioModule.saveEvento(event)">
                <div class="form-group"><label>Título *</label><input type="text" name="titulo" required></div>
                <div class="form-row">
                    <div class="form-group"><label>Data *</label><input type="date" name="data" value="${data || new Date().toISOString().split('T')[0]}" required></div>
                    <div class="form-group">
                        <label>Tipo</label>
                        <select name="tipo">
                            <option value="evento">Evento Geral</option>
                            <option value="reuniao">Reunião</option>
                            <option value="auditoria">Auditoria</option>
                            <option value="outro">Outro</option>
                        </select>
                    </div>
                </div>
            </form>
            `,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-primary" onclick="document.getElementById('eventoForm').requestSubmit()">Salvar</button>`
        );
    },

    saveEvento(event) {
        event.preventDefault();
        const f = event.target;
        DB.save('eventos', {
            id: null,
            titulo: f.titulo.value, data: f.data.value, tipo: f.tipo.value
        });
        Utils.closeModal();
        Utils.showToast('Evento criado!', 'success');
        App.renderPage('calendario');
    },

    previousMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        App.renderPage('calendario');
    },

    nextMonth() {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        App.renderPage('calendario');
    },

    goToToday() {
        this.currentDate = new Date();
        App.renderPage('calendario');
    }
};
