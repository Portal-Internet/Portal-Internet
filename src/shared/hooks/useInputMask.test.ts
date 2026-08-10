import { describe, expect, it } from 'vitest'
import { applyMask } from './useInputMask'

describe('applyMask', () => {
  it('formata CPF', () => {
    expect(applyMask('cpf', '11144477735')).toBe('111.444.777-35')
  })

  it('formata CPF parcial sem inventar separador à frente', () => {
    expect(applyMask('cpf', '111')).toBe('111')
    expect(applyMask('cpf', '1114')).toBe('111.4')
  })

  it('formata CNPJ', () => {
    expect(applyMask('cnpj', '11222333000181')).toBe('11.222.333/0001-81')
  })

  it('formata data', () => {
    expect(applyMask('date', '01012000')).toBe('01/01/2000')
  })

  it('descarta dígitos além do tamanho', () => {
    expect(applyMask('cpf', '111444777359999')).toBe('111.444.777-35')
  })

  it('mantém as máscaras que já existiam', () => {
    expect(applyMask('tel', '98991250780')).toBe('(98) 99125-0780')
    expect(applyMask('cep', '65075441')).toBe('65075-441')
  })
})
