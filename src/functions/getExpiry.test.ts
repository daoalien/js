import { ENS } from '..'
import setup from '../tests/setup'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ensInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('getExpiry', () => {
  it('should get the expiry for a .celo name with no other args', async () => {
    const result = await ensInstance.getExpiry('with-profile.celo')
    expect(result).toBeTruthy()
    if (result) {
      const { expiry, gracePeriod } = result
      expect(expiry).toBeInstanceOf(Date)
      expect(gracePeriod).toBe(7776000000)
    }
  })
  it('should get the expiry for a wrapped name', async () => {
    const result = await ensInstance.getExpiry('wrapped.celo', {
      contract: 'nameWrapper',
    })

    expect(result).toBeTruthy()
    if (result) {
      const { expiry, gracePeriod } = result
      expect(expiry).toBeInstanceOf(Date)
      expect(gracePeriod).toBe(null)
    }
  })
  it('should throw an error for a non .celo name if not wrapped', async () => {
    try {
      await ensInstance.getExpiry('sub.with-profile.celo')
      expect(false).toBeTruthy()
    } catch {
      expect(true).toBeTruthy()
    }
  })
  it('should throw an error for a non .celo name if registrar is specified', async () => {
    try {
      await ensInstance.getExpiry('sub.with-profile.celo', {
        contract: 'registrar',
      })
      expect(false).toBeTruthy()
    } catch {
      expect(true).toBeTruthy()
    }
  })
})
