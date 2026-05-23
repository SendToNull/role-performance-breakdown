// Upload a snapshot to a GitHub Gist (private by default) and return the raw URL.
// Uses GitHub REST API directly — no extra dependency.

export interface UploadedGist {
  /** Public Gist page (for humans). */
  htmlUrl: string;
  /** Raw file URL (what the web app will fetch). */
  rawUrl: string;
}

export async function uploadGist(
  token: string,
  filename: string,
  content: string,
  description: string,
): Promise<UploadedGist> {
  const res = await fetch("https://api.github.com/gists", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      description,
      public: false,
      files: { [filename]: { content } },
    }),
  });
  if (!res.ok) {
    const body = await safeText(res);
    throw new Error(`Gist upload failed (${res.status}): ${body ?? "(no body)"}`);
  }
  const json = (await res.json()) as {
    html_url: string;
    files: Record<string, { raw_url: string }>;
  };
  const file = json.files[filename];
  if (!file?.raw_url) throw new Error("Gist response missing raw_url");
  return { htmlUrl: json.html_url, rawUrl: file.raw_url };
}

async function safeText(res: Response): Promise<string | undefined> {
  try {
    return await res.text();
  } catch {
    return undefined;
  }
}
