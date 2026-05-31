export function formatLastLogin(lastLoginAt) {
  if (!lastLoginAt) {
    return 'Jamais connecte'
  }

  return new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(lastLoginAt))
}

export function toUserResponse(userDocument) {
  return {
    id: userDocument._id.toString(),
    name: userDocument.name,
    email: userDocument.email,
    role: userDocument.role,
    team: userDocument.team,
    status: userDocument.status,
    lastLogin: formatLastLogin(userDocument.lastLoginAt),
  }
}
