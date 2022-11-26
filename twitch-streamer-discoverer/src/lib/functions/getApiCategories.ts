export type ApiCategoryItem = {
  id?: string
  name?: string
  box_art_url?: string
}

export type ApiGetCategoriesData = {
  data?: ApiCategoryItem[]
  pagination?: {
    cursor?: string
  }
}

const getApiCategories = async (
  bearerToken: string
): Promise<ApiCategoryItem[]> => {
  const url = `https://api.twitch.tv/helix/games/top`
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Client-ID': import.meta.env.VITE_TWITCH_CLIENT_ID,
      Authorization: `Bearer ${bearerToken}`
    }
  })
  const resJson: ApiGetCategoriesData = await res.json()
  console.log('resJson', resJson)

  return resJson.data ?? []
}

export default getApiCategories
