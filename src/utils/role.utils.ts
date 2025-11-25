export const assertRole = (user: any, allowed: string | string[]) => {
  if (!user) {
    const res: any = new Response("Unauthorized", { status: 401 });
    throw res;
  }

  const roles = Array.isArray(allowed) ? allowed : [allowed];
  if (!roles.includes(user.role)) {
    const res: any = new Response("Forbidden", { status: 403 });
    throw res;
  }
};