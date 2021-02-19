import axios from 'axios'
const baseUrl = '/api/login'
//フロント側で入力された資格情報をバックエンドに検査してもらうイメージ
const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
