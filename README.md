# HAZE.
An independent cannabis journal. Curiosity is brave.

## Publishing
Site hosted with GitHub Pages. To enable, go to Settings > Pages and choose GitHub Actions as the build source.

Create articles in https://app.pagescms.org after granting it access to this repository. Articles are stored in content/posts as JSON and deployed by the workflow in .github/workflows/deploy.yml. Only entries with published=true appear on the site.

Design is based on HAZE. V6. Pages CMS connects to the repository and edits content. The public site is static and requires no server.

## Deployment
Pages source: GitHub Actions. A commit to main triggers the Publish HAZE. workflow.
