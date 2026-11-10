export function validarFiltros(query, regras) {
  const permitidos = Object.keys(regras);
  const desconhecidos = Object.keys(query).filter((campo) => !permitidos.includes(campo));

  if (desconhecidos.length) {
    return { erro: `Filtro(s) não permitido(s): ${desconhecidos.join(', ')}.` };
  }

  const filtros = {};
  for (const [campo, regra] of Object.entries(regras)) {
    const valor = query[campo];
    if (valor === undefined) {
      continue;
    }

    if (typeof valor !== 'string' || !valor.trim()) {
      return { erro: `O filtro "${campo}" deve ter um único valor não vazio.` };
    }

    if (regra.tipo === 'texto') {
      filtros[campo] = valor.trim();
      continue;
    }

    const numero = Number(valor);
    if (
      !Number.isInteger(numero)
      || (regra.min !== undefined && numero < regra.min)
      || (regra.max !== undefined && numero > regra.max)
    ) {
      return { erro: `O filtro "${campo}" deve ser um inteiro válido.` };
    }
    filtros[campo] = numero;
  }

  return { filtros };
}

export function filtrarRegistros(registros, filtros) {
  return registros.filter((registro) => Object.entries(filtros).every(([campo, valor]) => {
    if (typeof valor === 'string') {
      return String(registro[campo] ?? '').toLocaleLowerCase().includes(valor.toLocaleLowerCase());
    }
    return registro[campo] === valor;
  }));
}
