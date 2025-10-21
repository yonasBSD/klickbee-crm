export interface UserType {
  id: string
  name:string
  registrationDate?: string
  lastLogin ?: string
  status ?: 'Active' | 'Inactive' | 'Invite' | 'Deleted',
  ownerImage:string
}
