import 'server-only'
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'
import { writeToken } from './writeToken'

/** Used only by server routes that create documents (the contact API route). Never imported
 * by anything that runs in the browser or during static rendering. */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: writeToken,
  useCdn: false,
})
