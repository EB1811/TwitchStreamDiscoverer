type ApiTagItem = {
  id?: string
  is_auto?: boolean
  localization_names?: {
    [key: string]: string
  }
  localization_descriptions?: {
    [key: string]: string
  }
}

export type ApiGetTagsData = {
  data?: ApiTagItem[]
  pagination?: {
    cursor?: string
  }
}

const getApiTags = async (
  bearerToken: string,
  cursor?: string
): Promise<ApiTagItem[]> => {
  const url = `https://api.twitch.tv/helix/tags/streams`

  const basicParams: {readonly [key: string]: string} = {
    first: '100',
    ...(cursor ? {after: cursor} : {})
  }
  const basicParamsString = Object.keys(basicParams)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(basicParams[k])}`)
    .join('&')

  const res = await fetch(`${url}?${basicParamsString}`, {
    method: 'GET',
    headers: {
      'Client-ID': import.meta.env.VITE_TWITCH_CLIENT_ID,
      Authorization: `Bearer ${bearerToken}`
    }
  })
  const resJson: ApiGetTagsData = await res.json()
  console.log('resJson', resJson)

  return resJson.pagination?.cursor
    ? [
        ...(resJson.data ?? []),
        ...(await getApiTags(bearerToken, resJson.pagination?.cursor))
      ]
    : resJson.data ?? []
}

export default getApiTags
