import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cadastro.css";

function Cadastro() {
  const [modo, setModo] = useState("login"); // "login" ou "cadastro"
  const navigate = useNavigate();

  // Estados do cadastro
  const [nome, setNome] = useState("");
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");

  // Estados do login
  const [emailLogin, setEmailLogin] = useState("");
  const [senhaLogin, setSenhaLogin] = useState("");

  // Funções de submit (melhoradas para feedback mais claro)
  const handleCadastro = (e) => {
    e.preventDefault();
    console.log("Novo funcionário:", { nome, emailCadastro, senhaCadastro });
    // TODO: Adicionar lógica real de chamada de API aqui
    alert("✅ Cadastro de funcionário realizado! Aguarde a ativação da sua conta.");
    // Após o cadastro, muda para o modo de login
    setModo("login"); 
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login de Funcionário:", { emailLogin, senhaLogin });
    // TODO: Adicionar lógica real de chamada de API e validação
    alert("🔓 Acesso concedido! Redirecionando para o Painel Interno.");
    // Redireciona para o dashboard interno
    navigate("/dashboard"); 
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Lado Esquerdo - Identidade e Contexto */}
        <div className="auth-left">
          {/* Foco na identidade corporativa */}
          <h1>Portal Interno <span className="movitel-orange">Movitel</span></h1>
          <p className="subtitle">Acesso exclusivo para colaboradores.</p>
          <img
            src="src/assets/OIP.webp" // Mantenha o seu caminho de imagem
            alt="Ilustração de acesso corporativo"
          />
        </div>

        {/* Lado Direito - Formulário */}
        <div className="auth-right">
          <div className="toggle-mode">
             {/* Botões para alternar entre Login e Cadastro */}
            <button 
              className={`toggle-button ${modo === "login" ? "active" : ""}`}
              onClick={() => setModo("login")}
              aria-label="Alternar para Formulário de Login"
            >
              Entrar 
            </button>
            <button
              className={`toggle-button ${modo === "cadastro" ? "active" : ""}`}
              onClick={() => setModo("cadastro")}
              aria-label="Alternar para Formulário de Cadastro"
            >
              Novo Acesso
            </button>
          </div>
          
          <h2 className="form-title">{modo === "login" ? "Acesso de Funcionário" : "Solicitar Acesso (1º Registo)"}</h2>
          <hr className="title-separator"/>

          {modo === "login" ? (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="input-group">
                <label htmlFor="login-email">Email Corporativo</label>
                <input
                  id="login-email"
                  type="email"
                  placeholder="nome.sobrenome@movitel.co.mz" // Exemplo de email corporativo
                  value={emailLogin}
                  onChange={(e) => setEmailLogin(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="login-senha">Senha</label>
                <input
                  id="login-senha"
                  type="password"
                  placeholder="Sua senha de rede"
                  value={senhaLogin}
                  onChange={(e) => setSenhaLogin(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Acessar Sistema</button>
            </form>
          ) : (
            <form onSubmit={handleCadastro} className="auth-form">
              <div className="input-group">
                <label htmlFor="cadastro-nome">Nome Completo</label>
                <input
                  id="cadastro-nome"
                  type="text"
                  placeholder="Conforme registo na RH"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="cadastro-email">Email Corporativo</label>
                <input
                  id="cadastro-email"
                  type="email"
                  placeholder="nome.sobrenome@movitel.co.mz"
                  value={emailCadastro}
                  onChange={(e) => setEmailCadastro(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="cadastro-senha">Definir Senha</label>
                <input
                  id="cadastro-senha"
                  type="password"
                  placeholder="Crie uma senha segura"
                  value={senhaCadastro}
                  onChange={(e) => setSenhaCadastro(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-button">Registar e Solicitar Ativação</button>
            </form>
          )}

          <p className="forgot-password">
            {/* Link de suporte corporativo */}
            <a href="#">Problemas no acesso? Contacte o suporte de TI.</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cadastro;