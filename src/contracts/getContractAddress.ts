import { ContractName, SupportedNetworkId } from './types'

const addresses: Record<
  ContractName,
  Partial<Record<SupportedNetworkId, string>> | string
> = {
  /* eslint-disable @typescript-eslint/naming-convention */
  BaseRegistrarImplementation: {
    '5': '0x17AB01831d27602A3431D6f87e1A222354C84F32',
    '42220': '0x17AB01831d27602A3431D6f87e1A222354C84F32',
  },
  DNSRegistrar: {
    '5': '0x10DBe44ADf4c04D56333A80994b3F2D1eFb0bfF2',
    '42220': '0x10DBe44ADf4c04D56333A80994b3F2D1eFb0bfF2',
  },
  ETHRegistrarController: {
    '5': '0xB0C57d3843A6Dd4f58A0C266A52E03566129C51d',
    '42220': '0xB0C57d3843A6Dd4f58A0C266A52E03566129C51d',
  },
  Multicall: '0xcA11bde05977b3631167028862bE2a173976CA11',
  NameWrapper: {
    '5': '0x8D028006Ac841862C3f0FDA4C67c995C5133ECD6',
    '42220': '0x8D028006Ac841862C3f0FDA4C67c995C5133ECD6',
  },
  PublicResolver: {
    '5': '0x537c7D15CD24855D092927b3Faf326897d5645A4',
    '42220': '0x537c7D15CD24855D092927b3Faf326897d5645A4',
  },
  ENSRegistry: {
    '5': '0xe51eBC096cDE3198C98118e0F9AB9aBA202a9307',
    '42220': '0xe51eBC096cDE3198C98118e0F9AB9aBA202a9307',
  },
  ReverseRegistrar: {
    '5': '0x455aafC66e698cD91ffC88680BF191FC01f72560',
    '42220': '0x455aafC66e698cD91ffC88680BF191FC01f72560',
  },
  UniversalResolver: {
    '5': '0xC5CD56FdDECa464a7FAd4Dd7868EcfDE4C282Fde',
    '42220': '0xC5CD56FdDECa464a7FAd4Dd7868EcfDE4C282Fde',
  },
  BulkRenewal: {
    '5': '0xE1F9bff1f8cDdBDa6B9F9D2DFc2D83aA48cB70B2',
    '42220': '0xE1F9bff1f8cDdBDa6B9F9D2DFc2D83aA48cB70B2',
  },
  /* eslint-enable @typescript-eslint/naming-convention */
}

export type ContractAddressFetch = (contractName: ContractName) => string

export const getContractAddress = (networkId: SupportedNetworkId) =>
  ((contractName: ContractName) => {
    try {
      return typeof addresses[contractName] === 'string'
        ? addresses[contractName]
        : addresses[contractName][networkId]
    } catch {
      throw new Error(
        `No address for contract ${contractName} on network ${networkId}`,
      )
    }
  }) as ContractAddressFetch
