import { ENS } from '..'
import setup from '../tests/setup'

let ensInstance: ENS

beforeAll(async () => {
  ;({ ensInstance } = await setup())
})

describe('getAvailable', () => {
  it('should return false for a name that is unavailable', async () => {
    const result = await ensInstance.getAvailable('test123.celo')
    expect(typeof result).toBe('boolean')
    expect(result).toBe(false)
  })
  it('should return true for a name that is available', async () => {
    const result = await ensInstance.getAvailable('available-name.celo')
    expect(typeof result).toBe('boolean')
    expect(result).toBe(true)
  })
})
