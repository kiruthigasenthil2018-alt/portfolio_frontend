// "Save my contact": builds a .vcf file in the browser so people can add Kiruthiga to their phone / address book.
export function downloadVCard(profile) {
  const lines = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `FN:${profile.name}`, `N:;${profile.name};;;`,
    `EMAIL;TYPE=INTERNET:${profile.email}`,
    `TITLE:${profile.resume_title || 'Full Stack Developer'}`,
    profile.linkedin_url ? `URL:${profile.linkedin_url}` : '',
    profile.github_url ? `URL:${profile.github_url}` : '',
    profile.location ? `ADR;TYPE=HOME:;;${profile.location};;;;` : '',
    'END:VCARD',
  ].filter(Boolean)
  const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `${profile.name.replace(/\s+/g, '_')}.vcf`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 1500)
}
