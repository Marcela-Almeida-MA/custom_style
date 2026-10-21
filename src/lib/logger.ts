type Nivel = "info" | "warn" | "error";

/** Registra uma linha JSON com nível, mensagem e contexto opcional. */
function registrar(nivel: Nivel, mensagem: string, contexto?: Record<string, unknown>) {
  const linha = {
    nivel,
    mensagem,
    timestamp: new Date().toISOString(),
    ...contexto,
  };

  // eslint-disable-next-line no-console
  const metodo = nivel === "error" ? console.error : nivel === "warn" ? console.warn : console.log;
  metodo(JSON.stringify(linha));
}

export const logger = {
  info: (mensagem: string, contexto?: Record<string, unknown>) => registrar("info", mensagem, contexto),
  warn: (mensagem: string, contexto?: Record<string, unknown>) => registrar("warn", mensagem, contexto),
  error: (mensagem: string, contexto?: Record<string, unknown>) => registrar("error", mensagem, contexto),
};
