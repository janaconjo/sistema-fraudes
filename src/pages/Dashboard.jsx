import React, { useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from "recharts";



const COLOR_PRIMARY_MOVITEL = "#FF6600"; 
const COLOR_LIGHT_MOVITEL = "#FF9966"
const COLOR_DARK_TEXT = "#333339"; 
const COLOR_BACKGROUND = "#F5F5F5"; 


const COLOR_SECONDARY_LINE = "#1976d2"; 
const COLOR_DANGER = "#c62828"; 
const COLOR_SUCCESS = "#2e7d32"; 
const COLOR_WARNING = "#ff9800"; 

const cardShadow = "0 6px 18px rgba(20,20,50,0.1)";



function gerarTransacoesSimuladas(n = 180) {
  const tipos = ["Smishing - link curto", "Smishing - link direto", "SMS phishing (enviar valor)", "Legítima"];

  const now = new Date(2025, 8, 28);
  const transacoes = [];

  for (let i = 1; i <= n; i++) {
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
  
    const risco = tipo === "Legítima" ? Math.floor(Math.random() * 15) : Math.floor(Math.random() * 40) + 60;
    const status = risco >= 75 ? "Suspeita" : risco >= 50 ? "Avisar" : "Seguro";
    const daysBack = Math.floor(Math.random() * 14);
    const hora = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysBack,
      Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));

    transacoes.push({
      id: i,
      remetente: Math.random() > 0.7 ? "Shortcode 12345" : `+2588${Math.floor(10000000 + Math.random() * 89999999)}`,
      conteudo: gerarConteudoPorTipo(tipo),
      tipoFraude: tipo,
      risco,
      status,
      valor: Math.floor(Math.random() * 20000),
      hora: hora.toISOString()
    });
  }
  return transacoes;
}

function gerarConteudoPorTipo(tipo) {
  switch (tipo) {
    case "Smishing - link curto":
      return "Parabéns! Recebeste 5000 MTS. Acede: bit.ly/abc123";
    case "Smishing - link direto":
      return "Recebeste prémio. Levanta aqui: http://promo-movitel.xyz/levantar";
    case "SMS phishing (enviar valor)":
      return "Envia 2000 MTS para +25881234567 para confirmar o teu prémio";
    default:
      return "Campanha SMS Movitel: descontos este fim-de-semana. Mais info na app.";
  }
}

function extrairURLs(texto) {
  const regex = /https?:\/\/[^\s"]+|bit\.ly\/[^\s"]+|tinyurl\.com\/[^\s"]+/ig;
  const achados = texto.match(regex);
  if (!achados) return [];
  return achados.map(u => (u.startsWith("http") ? u : `https://${u}`));
}

function reputacaoDominio(url) {
  if (!url) return { score: 50, label: "Desconhecido" };
  const lower = url.toLowerCase();

  if (lower.includes("bit.ly") || lower.includes("tinyurl") || lower.includes("goo.gl")) {
    return { score: 15, label: "Baixa (encurtador)" };
  }
  if (lower.includes("promo-") || lower.includes("promo") || lower.includes("xyz") || lower.includes("offer")) {
    return { score: 20, label: "Suspeita" };
  }
  if (lower.includes("movitel")) {
    return { score: 90, label: "Boa (domínio oficial)" };
  }
  return { score: 55, label: "Indeterminada" };
}



function CardCor({ background = "#fff", title, children }) {
  return (
    <div style={{ background, padding: 16, borderRadius: 10, boxShadow: cardShadow, border: "1px solid #eee" }}>
      <div style={{ color: "#666", marginBottom: 8, fontWeight: 500 }}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

function RiskPill({ risco = 0 }) {
  const color = risco >= 75 ? COLOR_DANGER : risco >= 50 ? COLOR_WARNING : COLOR_SUCCESS;
  const bgColor = risco >= 75 ? "#fbeaea" : risco >= 50 ? "#fff3e0" : "#e8f5e9";
  return (
    <div style={{
      display: "inline-block",
      padding: "6px 10px",
      borderRadius: 999,
      background: bgColor,
      border: `1px solid ${color}`,
      color,
      fontWeight: 600,
      minWidth: 60,
      textAlign: "center",
      fontSize: 13,
    }}>
      {risco}%
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.6)", zIndex: 9999, padding: 20
    }}>
      <div style={{ width: "900px", maxWidth: "100%", maxHeight: "90vh", overflow: "auto", background: "white", borderRadius: 12, padding: 30, boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: COLOR_DARK_TEXT, position: "absolute", top: 15, right: 15 }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}



const btnStyle = {
  background: COLOR_PRIMARY_MOVITEL, 
  color: "white", 
  border: "none", 
  padding: "10px 16px", 
  borderRadius: 8, 
  cursor: "pointer",
  fontWeight: 600,
  transition: "background 0.3s, transform 0.1s"
};

const searchStyle = {
  padding: "10px 14px", 
  borderRadius: 8, 
  border: "1px solid #ccc", 
  minWidth: 320,
  fontSize: 14
};

const selectStyle = {
  padding: "10px 14px", 
  borderRadius: 8, 
  border: "1px solid #ccc",
  fontSize: 14
};

const thStyle = { textAlign: "left", padding: "14px 16px", fontSize: 13, color: "#666", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "12px 16px", fontSize: 14, color: COLOR_DARK_TEXT, verticalAlign: "middle" };

const actionBtn = { 
  background: COLOR_PRIMARY_MOVITEL, 
  color: "#fff", 
  border: "none", 
  padding: "8px 10px", 
  borderRadius: 6, 
  cursor: "pointer", 
  fontSize: 12, 
  fontWeight: 500,
  transition: "background 0.2s"
};

const modalActionBtn = { 
  background: COLOR_PRIMARY_MOVITEL, 
  color: "#fff", 
  border: "none", 
  padding: "10px 14px", 
  borderRadius: 6, 
  cursor: "pointer", 
  fontSize: 14, 
  fontWeight: 600,
  transition: "background 0.2s",
};



function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { label: "Dashboard", icon: "🏠", active: true },
    { label: "Análise ", icon: "📈" },
    { label: "Regras ", icon: "🛡️" },
    { label: "Gestão de Remetentes", icon: "👤" },
    { label: "Relatórios", icon: "📄" },
    { label: "Configurações", icon: "⚙️" },
  ];

  const sidebarStyle = {
   
    width: isOpen ? 260 : 70, 
    minHeight: "100vh",
 
    background: "linear-gradient(180deg, #1f2937 0%, #111827 100%)", 
    color: "#fff",
    padding: "20px 0",
    transition: "width 0.3s cubic-bezier(0.2, 0, 0, 1)", 
    boxShadow: "4px 0 15px rgba(0,0,0,0.3)",
    position: "sticky",
    top: 0,
    zIndex: 100,
    overflowX: "hidden",
  };

  const itemStyle = (isActive) => ({
    padding: "12px 15px",
    margin: isOpen ? "8px 15px" : "8px 10px", 
    borderRadius: 8,
    cursor: "pointer",
   
    background: isActive 
        ? `linear-gradient(90deg, ${COLOR_PRIMARY_MOVITEL} 5%, ${COLOR_LIGHT_MOVITEL} 100%)` 
        : 'transparent',
    color: isActive ? 'white' : '#9ca3af', 
    fontWeight: 500,
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
    justifyContent: isOpen ? 'flex-start' : 'center',
    fontSize: 15,
    overflow: 'hidden',
  });
  
  const hoverStyle = (isActive) => isActive 
    ? { filter: 'brightness(1.1)' } 
    : { background: '#1f2937', color: 'white' };

  return (
    <div style={sidebarStyle}>

      <div style={{ 
        display: 'flex', 
        justifyContent: isOpen ? 'space-between' : 'center', 
        alignItems: 'center',
        margin: isOpen ? "0 20px 30px" : "0", 
        paddingBottom: 15,
        borderBottom: '1px solid #374151', 
      }}>
        <h2 style={{ 
          margin: 0,
          fontSize: 22, 
          color: COLOR_PRIMARY_MOVITEL, 
          fontWeight: 800,
          opacity: isOpen ? 1 : 0,
          transition: 'opacity 0.2s',
          overflow: 'hidden',
          maxWidth: isOpen ? '100%' : '0',
          whiteSpace: 'nowrap',
        }}>
          Movitel 
        </h2>
       
        <button onClick={onClose} style={{ 
          background: 'none',
          border: '1px solid #4b5563',
          color: '#d1d5db',
          fontSize: 14,
          padding: '6px 10px',
          borderRadius: 6,
          cursor: 'pointer',
          transition: 'all 0.2s',
        }} title={isOpen ? "Minimizar Menu" : "Maximizar Menu"}>
          {isOpen ? '◀' : '▶'}
        </button>
      </div>

      {/* Itens do Menu */}
      <div style={{ marginTop: 20 }}>
        {menuItems.map(item => (
          <div 
            key={item.label} 
            style={itemStyle(item.active)} 
            onMouseOver={(e) => Object.assign(e.currentTarget.style, hoverStyle(item.active))}
            onMouseOut={(e) => Object.assign(e.currentTarget.style, itemStyle(item.active))}
          >
            <span style={{ fontSize: 20 }}>{item.icon}</span>
            <span style={{ 
                opacity: isOpen ? 1 : 0,
                transition: 'opacity 0.2s',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                maxWidth: isOpen ? '200px' : '0'
            }}>
                {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}



function Dashboard() {
  const [transacoes, setTransacoes] = useState(() => gerarTransacoesSimuladas(180));
  const [query, setQuery] = useState("");
  const [filtroRisco, setFiltroRisco] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

 
  const kpis = useMemo(() => {
    const total = transacoes.length;
    const suspeitas = transacoes.filter(t => t.status === "Suspeita").length;
    const avisos = transacoes.filter(t => t.status === "Avisar").length;
    const seguros = transacoes.filter(t => t.status === "Seguro").length;
    return { total, suspeitas, avisos, seguros };
  }, [transacoes]);


  const dadosPorDia = useMemo(() => {
    const map = {};
    transacoes.forEach(t => {
      const dia = new Date(t.hora).toISOString().slice(0, 10);
      if (!map[dia]) map[dia] = { dia, total: 0, suspeitas: 0 };
      map[dia].total++;
      if (t.status === "Suspeita") map[dia].suspeitas++;
    });
    return Object.values(map).sort((a, b) => a.dia.localeCompare(b.dia));
  }, [transacoes]);


  const dadosPorTipo = useMemo(() => {
    const map = {};
    transacoes.forEach(t => {
      const tipo = t.tipoFraude;
      if (!map[tipo]) map[tipo] = { tipo, count: 0 };
      map[tipo].count++;
    });
    return Object.values(map);
  }, [transacoes]);

  // Filtragem e Pesquisa da Tabela
  const transacoesVisiveis = useMemo(() => {
    return transacoes.filter(t => {
      const q = query.toLowerCase().trim();
      const matchQuery = q === "" ||
        t.conteudo.toLowerCase().includes(q) ||
        t.remetente.toLowerCase().includes(q) ||
        String(t.id) === q;
      if (!matchQuery) return false;
      
      if (filtroRisco === "alto" && t.risco < 75) return false;
      if (filtroRisco === "medio" && (t.risco < 50 || t.risco >= 75)) return false;
      if (filtroRisco === "baixo" && t.risco >= 50) return false;
      
      if (filtroTipo !== "todos" && t.tipoFraude !== filtroTipo) return false;
      return true;
    });
  }, [transacoes, query, filtroRisco, filtroTipo]);

  function marcarInvestigado(id) {
    setTransacoes(prev => prev.map(t => t.id === id ? { ...t, status: "Investigado" } : t));
    if (modalItem && modalItem.id === id) setModalItem({ ...modalItem, status: "Investigado" });
  }

  function marcarSeguro(id) {
    setTransacoes(prev => prev.map(t => t.id === id ? { ...t, status: "Seguro", risco: 10 } : t));
    if (modalItem && modalItem.id === id) setModalItem({ ...modalItem, status: "Seguro", risco: 10 });
  }

  function bloquear(id) {
    setTransacoes(prev => prev.map(t => t.id === id ? { ...t, status: "Bloqueado", risco: 100 } : t));
    if (modalItem && modalItem.id === id) setModalItem({ ...modalItem, status: "Bloqueado", risco: 100 });
  }

  function notificarUtilizador(id) {
  
    console.log(`✅ Utilizador da transação ID ${id} notificado!`);

  }

  function exportCSV() {
    const header = ["id,remetente,tipo,risco,status,valor,hora,conteudo"].join(",");
    const rows = transacoesVisiveis.map(t =>
      `${t.id},"${t.remetente}","${t.tipoFraude}",${t.risco},"${t.status}",${t.valor},"${t.hora}","${t.conteudo.replace(/"/g, '""')}"`
    );
    const csv = [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `movitel_transacoes_fraude_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function abrirModal(item) {
    const urls = extrairURLs(item.conteudo);
    const reclamacoes = urls.map(u => ({ url: u, reputacao: reputacaoDominio(u) }));
    setModalItem({ ...item, urls: reclamacoes });
    setModalOpen(true);
  }


  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Inter, Arial, sans-serif", background: COLOR_BACKGROUND, color: COLOR_DARK_TEXT }}>
      

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(!isSidebarOpen)} />
      
      
      <main style={{ flexGrow: 1, padding: 30, transition: "padding-left 0.3s" }}> 

        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, color: COLOR_PRIMARY_MOVITEL, fontSize: 28, fontWeight: 800 }}>
              Movitel <span style={{ color: COLOR_DARK_TEXT }}>| Detecção de Fraude </span>
            </h1>
            <p style={{ marginTop: 4, color: "#666" }}>Painel Operacional — Segurança de Transacções</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <button onClick={exportCSV} style={btnStyle}>Exportar Dados (CSV)</button>
          </div>
        </header>

  
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginTop: 20 }}>
       
          <CardCor background="#fff7f0" title="Transacções (total)">
            <strong style={{ fontSize: 28, color: COLOR_DARK_TEXT }}>{kpis.total.toLocaleString()}</strong>
          </CardCor>
          <CardCor background="#fef7f7" title="Suspeitas (Alto Risco)">
            <strong style={{ fontSize: 28, color: COLOR_DANGER }}>{kpis.suspeitas.toLocaleString()}</strong>
          </CardCor>
          <CardCor background="#fffde7" title="Avisos (Médio Risco)">
            <strong style={{ fontSize: 28, color: COLOR_WARNING }}>{kpis.avisos.toLocaleString()}</strong>
          </CardCor>
          <CardCor background="#f0fff6" title="Seguras (Baixo Risco)">
            <strong style={{ fontSize: 28, color: COLOR_SUCCESS }}>{kpis.seguros.toLocaleString()}</strong>
          </CardCor>
        </section>

        {/* graficos */}
        <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginTop: 30, alignItems: "stretch" }}>
        
          <div style={{ background: "white", padding: 20, borderRadius: 12, boxShadow: cardShadow }}>
            <h3 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: 10 }}>Evolução Diária de Fraude</h3>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dadosPorDia} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="dia" stroke="#999" style={{ fontSize: 12 }} />
                  <YAxis stroke="#999" style={{ fontSize: 12 }} />
                  <Tooltip labelStyle={{ fontWeight: 600 }} formatter={(value, name) => [value, name]} />
                  <Legend iconType="circle" />
              
                  <Line type="monotone" dataKey="total" stroke={COLOR_SECONDARY_LINE} name="Total Transacções" strokeWidth={2} />
                 
                  <Line type="monotone" dataKey="suspeitas" stroke={COLOR_DANGER} name="Casos Suspeitos" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* graficos tipos de ocorrencia */}
          <div style={{ background: "white", padding: 20, borderRadius: 12, boxShadow: cardShadow }}>
            <h3 style={{ marginTop: 0, borderBottom: "1px solid #eee", paddingBottom: 10 }}>Distribuição por Tipo de Fraude</h3>
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dadosPorTipo} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" horizontal={false} />
                  <XAxis type="number" stroke="#999" style={{ fontSize: 12 }} />
                  <YAxis dataKey="tipo" type="category" stroke="#999" style={{ fontSize: 12 }} width={120} />
                  <Tooltip labelStyle={{ fontWeight: 600 }} formatter={(value, name) => [value, name]} />
                
                  <Bar dataKey="count" fill={COLOR_PRIMARY_MOVITEL} name="Ocorrências" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* tabela */}
        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: COLOR_DARK_TEXT, fontSize: 22, borderBottom: "2px solid #ddd", paddingBottom: 10 }}>Registo de Transacções</h2>
          
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 15 }}>
            <input placeholder="🔍 Pesquisar (id, remetente, texto)..." value={query} onChange={e => setQuery(e.target.value)} style={searchStyle} />
            
            <select value={filtroRisco} onChange={e => setFiltroRisco(e.target.value)} style={selectStyle}>
              <option value="todos">Todos riscos</option>
             
              <option value="alto">Alto ({'>'}=75%)</option> 
              <option value="medio">Médio (50-74%)</option>
              <option value="baixo">Baixo {'<'}=50%)</option>
            </select>
            
            <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} style={selectStyle}>
              <option value="todos">Todos tipos</option>
              <option>Smishing - link curto</option>
              <option>Smishing - link direto</option>
              <option>SMS phishing (enviar valor)</option>
              <option>Legítima</option>
            </select>
            
            <div style={{ marginLeft: "auto", color: "#666", fontWeight: 500 }}>
              Resultado: <strong>{transacoesVisiveis.length}</strong> de <strong>{transacoes.length}</strong>
            </div>
          </div>

          {/* Tabela */}
          <div style={{ background: "white", borderRadius: 12, overflowX: "auto", boxShadow: cardShadow }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0, minWidth: 1000 }}>
              <thead style={{ background: "#f9f9f9" }}>
                <tr>
                  <th style={{ ...thStyle, borderTopLeftRadius: 12 }}>ID</th>
                  <th style={thStyle}>Remetente</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Risco</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Hora</th>
                  <th style={{ ...thStyle, borderTopRightRadius: 12 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {transacoesVisiveis.map(t => (
                  <tr 
                    key={t.id} 
                    style={{ borderBottom: "1px solid #f0f0f0", transition: "background 0.1s" }} 
                    onClick={() => abrirModal(t)}
                    onMouseOver={(e) => e.currentTarget.style.background = '#fcfcfc'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <td style={tdStyle}>{t.id}</td>
                    <td style={tdStyle}>{t.remetente}</td>
                    <td style={tdStyle}>{t.tipoFraude}</td>
                    <td style={tdStyle}><RiskPill risco={t.risco} /></td>
                    <td style={tdStyle}>{t.status}</td>
                    <td style={tdStyle}>{new Date(t.hora).toLocaleString()}</td>
                    <td style={tdStyle}>
                      <button onClick={(e) => { e.stopPropagation(); bloquear(t.id); }} style={{ ...actionBtn, background: COLOR_DANGER }}>Bloquear</button>
                      <button onClick={(e) => { e.stopPropagation(); marcarSeguro(t.id); }} style={{ ...actionBtn, marginLeft: 8, background: COLOR_SUCCESS }}>Seguro</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ marginTop: 25, color: "#101010ff", textAlign: "center", borderTop: "1px solid #eee", paddingTop: 15 }}>
          <small>© 2025 Movitel. Todos os direitos reservados.</small>
        </footer>

        {/* MODAL DE DETALHES */}
        {modalOpen && modalItem && (
          <Modal onClose={() => setModalOpen(false)}>
            <div style={{ position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <h2 style={{ marginTop: 0, color: COLOR_PRIMARY_MOVITEL }}>Detalhes da Transacção #{modalItem.id}</h2>
                  <div style={{ color: "#666", marginBottom: 8 }}>Remetente: <strong>{modalItem.remetente}</strong></div>
                  <div style={{ color: "#666", marginBottom: 8 }}>Tipo: {modalItem.tipoFraude} — Risco: <RiskPill risco={modalItem.risco} /></div>
                  <div style={{ color: "#666", marginBottom: 8 }}>Status: <strong style={{ color: modalItem.status === "Suspeita" ? COLOR_DANGER : modalItem.status === "Seguro" ? COLOR_SUCCESS : COLOR_DARK_TEXT }}>{modalItem.status}</strong></div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <button onClick={() => bloquear(modalItem.id)} style={{ ...modalActionBtn, background: COLOR_DANGER }}>Bloquear</button>
                  <button onClick={() => marcarSeguro(modalItem.id)} style={{ ...modalActionBtn, marginLeft: 8, background: COLOR_SUCCESS }}>Marcar Seguro</button>
                  <button onClick={() => notificarUtilizador(modalItem.id)} style={{ ...modalActionBtn, marginLeft: 8, background: COLOR_SECONDARY_LINE }}>Notificar Utilizador</button>
                </div>
              </div>

              <hr style={{ margin: "15px 0", borderColor: "#f0f0f0" }} />

              <div>
                <h4 style={{ color: COLOR_DARK_TEXT, marginBottom: 10 }}>Conteúdo SMS Analisado</h4>
                <div style={{ background: "#fafafa", padding: 15, borderRadius: 8, whiteSpace: "pre-wrap", borderLeft: `4px solid ${COLOR_PRIMARY_MOVITEL}` }}>{modalItem.conteudo}</div>
              </div>

              <div style={{ marginTop: 20 }}>
                <h4 style={{ color: COLOR_DARK_TEXT, marginBottom: 10 }}>Análise de Links e Reputação</h4>
                {modalItem.urls && modalItem.urls.length > 0 ? (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {modalItem.urls.map((u, idx) => (
                      <li key={idx} style={{ marginBottom: 10, padding: 10, background: "#fff", borderRadius: 6, border: "1px solid #eee" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <a href={u.url} target="_blank" rel="noreferrer" style={{ color: COLOR_PRIMARY_MOVITEL, textDecoration: "none", fontWeight: 600 }}>{u.url}</a>
                          <span style={{ padding: "4px 10px", borderRadius: 999, background: u.reputacao.score < 50 ? "#fef7f7" : "#e8f5e9", border: `1px solid ${u.reputacao.score < 50 ? COLOR_DANGER : COLOR_SUCCESS}` }}>
                            Reputação: <strong style={{ marginLeft: 6, color: u.reputacao.score < 50 ? COLOR_DANGER : COLOR_SUCCESS }}>{u.reputacao.label}</strong> ({u.reputacao.score}%)
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : <div style={{ color: "#999", padding: 10, border: "1px dashed #ddd", borderRadius: 6 }}>Nenhuma URL potencialmente maliciosa encontrada.</div>}
              </div>

              <div style={{ marginTop: 20, color: "#999", fontSize: 13, borderTop: "1px solid #eee", paddingTop: 10 }}>
                <small>Utiliza os botões de ação para alterar o estado da transacção e proteger o utilizador.</small>
              </div>
            </div>
          </Modal>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
