// ========== UTILITÁRIOS ==========
const Utils = {
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d)) return date;
        return d.toLocaleDateString('pt-BR');
    },

    formatDateTime(date) {
        if (!date) return '';
        const d = new Date(date);
        if (isNaN(d)) return date;
        return d.toLocaleString('pt-BR');
    },

    formatCNPJ(cnpj) {
        if (!cnpj) return '';
        return cnpj.replace(/\D/g, '').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    },

    formatPhone(phone) {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        return phone;
    },

    formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
    },

    daysBetween(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    },

    getClienteNome(id) {
        const cliente = DB.getById('clientes', id);
        return cliente ? cliente.nome : 'N/A';
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const icons = { info: 'ℹ', success: '✓', error: '✕', warning: '⚠' };
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<span style="font-size:18px">${icons[type]}</span><div>${message}</div>`;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    showModal(title, content, footer = '', size = '') {
        const container = document.getElementById('modalContainer');
        container.innerHTML = `
            <div class="modal-overlay" onclick="if(event.target === this) Utils.closeModal()">
                <div class="modal ${size}">
                    <div class="modal-header">
                        <h2>${title}</h2>
                        <button class="modal-close" onclick="Utils.closeModal()">×</button>
                    </div>
                    <div class="modal-body">${content}</div>
                    ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
                </div>
            </div>
        `;
    },

    closeModal() {
        document.getElementById('modalContainer').innerHTML = '';
    },

    confirm(message, onConfirm) {
        this.showModal('Confirmação',
            `<p>${message}</p>`,
            `<button class="btn btn-secondary" onclick="Utils.closeModal()">Cancelar</button>
             <button class="btn btn-danger" onclick="Utils.closeModal(); (${onConfirm.toString()})()">Confirmar</button>`,
            'small'
        );
    },

    generateId() {
        return Date.now() + Math.floor(Math.random() * 1000);
    },

    exportToJson(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    printElement(elementId) {
        const content = document.getElementById(elementId).innerHTML;
        const printWindow = window.open('', '', 'height=600,width=800');
        printWindow.document.write('<html><head><title>Impressão</title>');
        printWindow.document.write('<style>body{font-family:Arial,sans-serif;padding:20px;} h1,h2{color:#0054e9;} table{width:100%;border-collapse:collapse;} th,td{padding:8px;border:1px solid #ccc;text-align:left;}</style>');
        printWindow.document.write('</head><body>');
        printWindow.document.write(content);
        printWindow.document.write('</body></html>');
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 250);
    },

    statusBadge(status) {
        const map = {
            'ativo': { class: 'status-active', label: 'Ativo' },
            'inativo': { class: 'status-draft', label: 'Inativo' },
            'pendente': { class: 'status-pending', label: 'Pendente' },
            'em_andamento': { class: 'status-pending', label: 'Em Andamento' },
            'concluido': { class: 'status-completed', label: 'Concluído' },
            'agendada': { class: 'status-pending', label: 'Agendada' },
            'agendado': { class: 'status-pending', label: 'Agendado' },
            'realizada': { class: 'status-completed', label: 'Realizada' },
            'realizado': { class: 'status-completed', label: 'Realizado' },
            'valido': { class: 'status-active', label: 'Válido' },
            'vencido': { class: 'status-expired', label: 'Vencido' },
            'proximo_vencimento': { class: 'status-pending', label: 'Próx. Vencimento' }
        };
        const s = map[status] || { class: 'status-draft', label: status };
        return `<span class="status-badge ${s.class}">${s.label}</span>`;
    }
};
