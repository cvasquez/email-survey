export type Survey = {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  title: string
  require_name: boolean
  unique_link_id: string
  is_active: boolean
  created_by_email: string | null
}

export type Response = {
  id: string
  created_at: string
  survey_id: string
  answer_value: string
  free_response: string
  respondent_name: string | null
  hash_md5: string | null
  ip_address: string | null
  user_agent: string | null
}

export type CreateSurveyInput = {
  title: string
  require_name: boolean
}

export type CreateResponseInput = {
  survey_id: string
  answer_value: string
  free_response: string
  respondent_name?: string
  hash_md5?: string
}
