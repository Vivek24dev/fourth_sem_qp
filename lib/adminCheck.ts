export const ADMIN_EMAIL = "shreedharmm3@gmail.com";

export function adminCheck(email?: string | null) {
  return email?.trim().toLowerCase() === ADMIN_EMAIL;
}
