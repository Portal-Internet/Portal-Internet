import { describe, expect, it } from 'vitest'
import { isAdult, isValidCep, isValidCnpj, isValidCpf, isValidEmail } from './validation'

describe('isValidCpf', () => {
  it('aceita CPF válido com e sem pontuação', () => {
    expect(isValidCpf('111.444.777-35')).toBe(true)
    expect(isValidCpf('52998224725')).toBe(true)
  })

  it('rejeita dígito verificador errado', () => {
    expect(isValidCpf('11144477736')).toBe(false)
  })

  it('rejeita dígitos repetidos', () => {
    expect(isValidCpf('11111111111')).toBe(false)
  })

  it('rejeita tamanho errado', () => {
    expect(isValidCpf('123')).toBe(false)
    expect(isValidCpf('')).toBe(false)
  })
})

describe('isValidCnpj', () => {
  it('aceita CNPJ válido', () => {
    expect(isValidCnpj('11.222.333/0001-81')).toBe(true)
  })

  it('rejeita dígito verificador errado', () => {
    expect(isValidCnpj('11222333000182')).toBe(false)
  })

  it('rejeita dígitos repetidos', () => {
    expect(isValidCnpj('00000000000000')).toBe(false)
  })
})

describe('isValidEmail', () => {
  it('aceita endereço comum', () => {
    expect(isValidEmail('maria@exemplo.com.br')).toBe(true)
  })

  it('rejeita sem arroba, sem domínio ou com espaço', () => {
    expect(isValidEmail('maria.exemplo.com')).toBe(false)
    expect(isValidEmail('maria@exemplo')).toBe(false)
    expect(isValidEmail('ma ria@exemplo.com')).toBe(false)
  })
})

describe('isValidCep', () => {
  it('aceita oito dígitos com ou sem hífen', () => {
    expect(isValidCep('65075-441')).toBe(true)
    expect(isValidCep('65075441')).toBe(true)
  })

  it('rejeita quantidade diferente de oito dígitos', () => {
    expect(isValidCep('6507544')).toBe(false)
  })
})

describe('isAdult', () => {
  it('aceita quem já fez 18 anos', () => {
    expect(isAdult('1990-01-01')).toBe(true)
  })

  it('rejeita quem ainda não fez 18 anos', () => {
    const ontem = new Date()
    ontem.setFullYear(ontem.getFullYear() - 17)
    expect(isAdult(ontem.toISOString().slice(0, 10))).toBe(false)
  })

  it('rejeita data vazia ou inválida', () => {
    expect(isAdult('')).toBe(false)
    expect(isAdult('não é data')).toBe(false)
  })
})
