import { namehash } from '../utils/normalise'

describe('normalise', () => {
  it('should namehash an empty string', () => {
    const hash = namehash('')
    expect(hash).toEqual(
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    )
  })
  it('should namehash a TLD', () => {
    const hash = namehash('celo')
    expect(hash).toEqual(
      '0x8544fc7218df5ae04007a85c4aad404496768a619cc81f2ce17c3bed39cfe88c',
    )
  })
  it('should namehash a 2LD', () => {
    const hash = namehash('foo.celo')
    expect(hash).toEqual(
      '0xde9b09fd7c5f901e23a3f19fecc54828e9c848539801e86591bd9801b019f84f',
    )
  })
})
