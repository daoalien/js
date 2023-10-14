import { ENS } from '..'
import setup from '../tests/setup'
import { CELOJSError } from '../utils/errors'
import { ReturnData } from './getHistory'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ensInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('getHistory', () => {
  it('should return null for a non-existent name', async () => {
    const result = await ensInstance.getHistory('test123123cool.celo')
    expect(result).toBeUndefined()
  })
  it('should return the history of a name', async () => {
    const result = await ensInstance.getHistory('with-profile.celo')
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).toHaveProperty('registration')
    }
  })
  it('should return the history of a wrapped name', async () => {
    const result = await ensInstance.getHistory('wrapped.celo')
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).toHaveProperty('registration')
    }
  })
  it('should return the history of a subname', async () => {
    const result = await ensInstance.getHistory(
      'test.wrapped-with-subnames.celo',
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result).toHaveProperty('domain')
      expect(result).toHaveProperty('resolver')
      expect(result).not.toHaveProperty('registration')
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

    it('should throw an error with no data', async () => {
      try {
        await ensInstance.getHistory('with-profile.celo')
        expect(true).toBeFalsy()
      } catch (e) {
        expect(e).toBeInstanceOf(CELOJSError)
        const error = e as CELOJSError<ReturnData>
        expect(error.data).toBeUndefined()
      }
    })
  })
})
