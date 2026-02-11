export type Organization = {
  id: string
  created_at: string
  name: string
  created_by: string | null
}

export type OrganizationMember = {
  id: string
  created_at: string
  organization_id: string
  user_id: string
  role: 'owner' | 'member'
  invited_email: string | null
}

export type OrganizationInvite = {
  id: string
  created_at: string
  organization_id: string
  email: string
  invited_by: string | null
  role: 'owner' | 'member'
}

export type Survey = {
  id: string
  created_at: string
  updated_at: string
  user_id: string
  organization_id: string
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
  location: string | null
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
