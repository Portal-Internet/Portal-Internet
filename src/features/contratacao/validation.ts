/**
 * Validação do formulário de contratação.
 *
 * Roda no navegador por conveniência — para o cliente descobrir o erro antes
 * de enviar. O que realmente barra dado ruim é a mesma checagem dentro de
 * `submit_contratacao`, no Postgres: o navegador é território do usuário.
 */

const somenteDigitos = (value: string) => value.replace(/\D/g, '')

/** Confere um dígito verificador de CPF pelo módulo 11. */
function digitoCpfValido(digits: string, ate: number, pesoInicial: number): boolean {
  let soma = 0
  for (let i = 0; i < ate; i += 1) {
    soma += Number(digits[i]) * (pesoInicial - i)
  }
  let resto = (soma * 10) % 11
  if (resto === 10) {
    resto = 0
  }
  return resto === Number(digits[ate])
}

export function isValidCpf(value: string): boolean {
  const d = somenteDigitos(value)
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) {
    return false
  }
  return digitoCpfValido(d, 9, 10) && digitoCpfValido(d, 10, 11)
}

export function isValidCnpj(value: string): boolean {
  const d = somenteDigitos(value)
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) {
    return false
  }

  const digitoValido = (ate: number, pesos: number[]) => {
    let soma = 0
    for (let i = 0; i < ate; i += 1) {
      soma += Number(d[i]) * pesos[i]
    }
    const resto = soma % 11
    return (resto < 2 ? 0 : 11 - resto) === Number(d[ate])
  }

  return (
    digitoValido(12, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) &&
    digitoValido(13, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2])
  )
}

export function isValidEmail(value: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value.trim())
}

export function isValidCep(value: string): boolean {
  return somenteDigitos(value).length === 8
}

/**
 * Espera uma data ISO (`AAAA-MM-DD`). O contrato exige titular maior de idade.
 */
export function isAdult(isoDate: string): boolean {
  const nascimento = new Date(`${isoDate}T00:00:00`)
  if (Number.isNaN(nascimento.getTime())) {
    return false
  }

  const limite = new Date()
  limite.setFullYear(limite.getFullYear() - 18)
  return nascimento <= limite
}
