import type {ApiCategoryItem, ApiGetCategoriesData} from './getApiCategories'

const getApiCategoriesByName = async (
  bearerToken: string,
  name: string
): Promise<ApiCategoryItem[]> => {
  const url = `https://api.twitch.tv/helix/search/categories`

  const urlWithQuery = `${url}?query=${name}`
  const res = await fetch(urlWithQuery, {
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

export default getApiCategoriesByName
