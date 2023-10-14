import { ENS } from '..'
import setup from '../tests/setup'
import { CELOJSError } from '../utils/errors'

let ensInstance: ENS

beforeAll(async () => {
  ;({ ensInstance } = await setup())
})

describe('batch', () => {
  it('should batch calls together', async () => {
    const result = await ensInstance.batch(
      ensInstance.getText.batch('with-profile.celo', 'description'),
      ensInstance.getAddr.batch('with-profile.celo'),
      ensInstance.getName.batch('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'),
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result[0]).toBe('Hello2')
      expect(result[1]).toBe('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
      expect(result[2]).toMatchObject({
        name: 'with-profile.celo',
        match: true,
      })
    }
  })
  it('should batch a single call', async () => {
    const result = await ensInstance.batch(
      ensInstance.getText.batch('with-profile.celo', 'description'),
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result[0]).toBe('Hello2')
    }
  })

  describe('errors', () => {
    beforeAll(() => {
      process.env.NEXT_PUBLIC_CELOJS_DEBUG = 'on'
      localStorage.setItem('celojs-debug', 'CELOJSSubgraphError')
    })

    afterAll(() => {
      process.env.NEXT_PUBLIC_CELOJS_DEBUG = ''
      localStorage.removeItem('celojs-debug')
    })

    it('should throw a single error if there is an indexing error', async () => {
      try {
        await ensInstance.batch(
          ensInstance.getText.batch('with-profile.celo', 'description'),
          ensInstance.getOwner.batch('expired.celo', { skipGraph: false }),
          ensInstance.getName.batch(
            '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          ),
        )
        expect(true).toBe(false)
      } catch (e) {
        expect(e).toBeInstanceOf(CELOJSError)
        const error = e as CELOJSError<any[]>
        expect(error.name).toBe('CELOJSSubgraphError')
        const result = error.data as any[]
        expect(result[0]).toBe('Hello2')
        expect(result[1]).toEqual({
          expired: true,
          owner: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
          ownershipLevel: 'registrar',
        })
        expect(result[2]).toMatchObject({
          name: 'with-profile.celo',
          match: true,
        })
      }
    })
  })
})
