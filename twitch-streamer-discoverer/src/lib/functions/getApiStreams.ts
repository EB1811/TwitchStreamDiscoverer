import getStreamsParams from './getStreamsParams'

export type ApiStreamItem = {
  id?: string
  user_id?: string
  user_login?: string
  user_name?: string
  game_id?: string
  game_name?: string
  type?: string
  title?: string
  viewer_count?: number
  started_at?: string
  language?: string
  thumbnail_url?: string
  tag_ids?: string[]
  is_mature?: boolean
}

export type ApiGetStreamsData = {
  data?: ApiStreamItem[]
  pagination?: {
    cursor?: string
  }
}

const getApiStreams = async (
  bearerToken: string,
  categories?: string[],
  languages?: string[],
  cursor?: string
): Promise<ApiStreamItem[]> => {
  const url = `https://api.twitch.tv/helix/streams`

  const urlWithParams = `${url}?${getStreamsParams(
    categories,
    languages,
    cursor
  )}`
  const res = await fetch(urlWithParams, {
    method: 'GET',
    headers: {
      'Client-ID': import.meta.env.VITE_TWITCH_CLIENT_ID,
      Authorization: `Bearer ${bearerToken}`
    }
  })
  const resJson: ApiGetStreamsData = await res.json()
  console.log('resJson', resJson)

  return resJson.pagination?.cursor
    ? [
        ...(resJson.data ?? []),
        ...(await getApiStreams(
          bearerToken,
          categories,
          languages,
          resJson.pagination?.cursor
        ))
      ]
    : resJson.data ?? []
}

export default getApiStreams
