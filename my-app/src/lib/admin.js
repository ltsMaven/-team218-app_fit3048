const DEFAULT_ROLES_CLAIM = "https://abilitytothrive.app/roles";

function getClaimArray(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === "string");
  }

  return [];
}

export function isAdminUser(user) {
  if (!user) {
    return false;
  }

  const adminEmail = process.env.AUTH0_ADMIN_EMAIL?.trim().toLowerCase();
  const adminRole = process.env.AUTH0_ADMIN_ROLE?.trim();
  const rolesClaim =
    process.env.AUTH0_ROLES_CLAIM?.trim() || DEFAULT_ROLES_CLAIM;
  const email = typeof user.email === "string" ? user.email.toLowerCase() : "";
  const roles = [
    ...getClaimArray(user[rolesClaim]),
    ...getClaimArray(user.roles),
  ];

  if (adminEmail && email === adminEmail) {
    return true;
  }

  if (adminRole && roles.includes(adminRole)) {
    return true;
  }

  return !adminEmail && !adminRole;
}
