import { ClientError } from 'graphql-request'
import { GraphQLError } from 'graphql'

export type CELOJSErrorName = 'CELOJSSubgraphError'

export class CELOJSError<T> extends Error {
  name = 'CELOJSSubgraphError'

  errors?: GraphQLError[]

  data?: T

  constructor({ data, errors }: { data?: T; errors?: GraphQLError[] }) {
    super()
    this.data = data
    this.errors = errors
  }
}

export const getClientErrors = (e: unknown) => {
  const error = e instanceof ClientError ? (e as ClientError) : undefined
  return error?.response?.errors || [new GraphQLError('unknown_error')]
}

const isDebugEnvironmentActive = () => {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_CELOJS_DEBUG === 'on'
  )
}

export const debugSubgraphError = (request: any) => {
  if (
    isDebugEnvironmentActive() &&
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('celojs-debug') === 'CELOJSSubgraphError'
  ) {
    // If we are testing indexing errors, we will allow _meta queries
    // to pass through.
    if (
      localStorage.getItem('subgraph-debug') === 'CELOJSSubgraphIndexingError' &&
      /_meta {/.test(request.body)
    )
      return
    throw new ClientError(
      {
        data: undefined,
        errors: [new GraphQLError('celojs-debug')],
        status: 200,
      },
      request,
    )
  }
}

export const debugSubgraphLatency = (): Promise<void> | undefined => {
  if (
    isDebugEnvironmentActive() &&
    typeof localStorage !== 'undefined' &&
    localStorage.getItem('celojs-debug') === 'CELOJSSubgraphLatency'
  ) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 10000)
    })
  }
}
