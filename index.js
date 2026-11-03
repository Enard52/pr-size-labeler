const fs = require('fs');

async function run() {
  try {
    const eventPath = process.env.GITHUB_EVENT_PATH;
    if (!eventPath || !fs.existsSync(eventPath)) {
      console.log('No GITHUB_EVENT_PATH found. Skipping.');
      return;
    }

    const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
    const pr = event.pull_request;
    if (!pr) {
      console.log('Not a pull request event. Skipping.');
      return;
    }

    const token = process.env.INPUT_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GitHub token is required.');
    }

    const prefix = process.env['INPUT_LABEL-PREFIX'] || 'size/';
    const xsMax = parseInt(process.env['INPUT_XS-MAX-SIZE'] || '10', 10);
    const sMax = parseInt(process.env['INPUT_S-MAX-SIZE'] || '50', 10);
    const mMax = parseInt(process.env['INPUT_M-MAX-SIZE'] || '250', 10);
    const lMax = parseInt(process.env['INPUT_L-MAX-SIZE'] || '1000', 10);

    const additions = pr.additions || 0;
    const deletions = pr.deletions || 0;
    const totalLines = additions + deletions;

    let tier = 'XL';
    if (totalLines <= xsMax) {
      tier = 'XS';
    } else if (totalLines <= sMax) {
      tier = 'S';
    } else if (totalLines <= mMax) {
      tier = 'M';
    } else if (totalLines <= lMax) {
      tier = 'L';
    }

    const targetSize = `${prefix}${tier}`;
    console.log(`PR #${pr.number}: +${additions} -${deletions} (total: ${totalLines}) -> ${targetSize}`);

    const existingLabels = (pr.labels || []).map((l) => l.name);
    const sizeLabels = ['XS', 'S', 'M', 'L', 'XL'].map((t) => `${prefix}${t}`);
    const currentSizeLabel = existingLabels.find((l) => sizeLabels.includes(l));

    if (currentSizeLabel === targetSize) {
      console.log(`PR already has label ${targetSize}. Nothing to change.`);
      return;
    }

    const repo = process.env.GITHUB_REPOSITORY;
    const apiUrl = process.env.GITHUB_API_URL || 'https://api.github.com';
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'pr-size-labeler-action',
      'Content-Type': 'application/json',
    };

    // Remove old size label if exists
    if (currentSizeLabel) {
      console.log(`Removing old label: ${currentSizeLabel}`);
      await fetch(`${apiUrl}/repos/${repo}/issues/${pr.number}/labels/${encodeURIComponent(currentSizeLabel)}`, {
        method: 'DELETE',
        headers,
      }).catch((err) => console.warn('Could not remove old label:', err.message));
    }

    // Add new size label
    console.log(`Adding new label: ${targetSize}`);
    const res = await fetch(`${apiUrl}/repos/${repo}/issues/${pr.number}/labels`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ labels: [targetSize] }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error(`Failed to add label: ${res.status} ${text}`);
    } else {
      console.log(`Successfully applied ${targetSize} to PR #${pr.number}`);
    }
  } catch (error) {
    console.error('Action failed with error:', error.message);
    process.exit(1);
  }
}

run();
