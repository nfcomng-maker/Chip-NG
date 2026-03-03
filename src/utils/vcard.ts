import { Profile } from "../types";

export function generateVCard(profile: Profile): string {
  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${profile.contact_first_name || ""} ${profile.contact_last_name || ""}`.trim(),
    `N:${profile.contact_last_name || ""};${profile.contact_first_name || ""};;;`,
    profile.contact_email ? `EMAIL;TYPE=INTERNET;TYPE=WORK:${profile.contact_email}` : "",
    profile.contact_phone ? `TEL;TYPE=CELL:${profile.contact_phone}` : "",
    profile.contact_organization ? `ORG:${profile.contact_organization}` : "",
    profile.contact_job_title ? `TITLE:${profile.contact_job_title}` : "",
    profile.contact_website ? `URL:${profile.contact_website}` : "",
    profile.avatar_url ? `PHOTO;VALUE=URI:${profile.avatar_url.startsWith('http') ? profile.avatar_url : window.location.origin + profile.avatar_url}` : "",
    "END:VCARD"
  ].filter(line => line !== "").join("\n");

  return vcard;
}

export function downloadVCard(profile: Profile) {
  const vcard = generateVCard(profile);
  const blob = new Blob([vcard], { type: "text/vcard" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${profile.username || 'contact'}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
