export type Problem = {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
};

export function problem(status: number, title: string, detail?: string): Problem {
  return {
    type: "about:blank",
    title,
    status,
    detail,
  };
}

export function jsonProblem(p: Problem, init?: ResponseInit) {
  return new Response(JSON.stringify(p), {
    status: p.status,
    headers: { "content-type": "application/problem+json", ...(init?.headers || {}) },
    ...init,
  });
}

