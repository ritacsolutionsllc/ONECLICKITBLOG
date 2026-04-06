import 'server-only'

import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId, writeToken } from './env'

export const sanityWriteClient = projectId && writeToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: writeToken,
    })
  : null
