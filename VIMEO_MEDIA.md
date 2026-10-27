# Vimeo media — 27/10/2026

The active source of truth is VIDEO_SOURCES.json. All 11 project films and the 12-film library use Vimeo iframe players. No YouTube iframe or Cloudflare MP4 player remains in generated project film sections.

| Project / library item | Vimeo ID | Uploaded source resolution |
|---|---|---|
| the-hera-resort | [1239705668](https://vimeo.com/1239705668) | 3840 × 2160 |
| capital-one | [1239702393](https://vimeo.com/1239702393) | 2560 × 1440 |
| kawara-my-an | [1239705666](https://vimeo.com/1239705666) | 3840 × 2160 |
| aegis-hospital | [1239701212](https://vimeo.com/1239701212) | 2560 × 1440 |
| onsen-thanh-thuy | [1239708807](https://vimeo.com/1239708807) | 2560 × 1440 |
| ecopark-thanh-hoa | [1239702394](https://vimeo.com/1239702394) | 1920 × 1080 |
| nam-o-residence | [1239711738](https://vimeo.com/1239711738) | 3840 × 2160 |
| hakuba-hotel | [1239711741](https://vimeo.com/1239711741) | 3840 × 2160 |
| thien-mu-hotel | [1239705667](https://vimeo.com/1239705667) | 3840 × 2026 |
| ecopark-hung-yen | [1239702391](https://vimeo.com/1239702391) | 1920 × 1080 |
| binh-minh | [1239702392](https://vimeo.com/1239702392) |  ×  |
| Library reference: Kyoto | [1239711740](https://vimeo.com/1239711740) | 3840 × 2160 |

Uploads preserve the selected source bytes. uploadBytes / uploadSha256 describe the Vimeo input; bytes / sha256 / deliveryUrl describe the previous Cloudflare asset. AEGIS uses the newly supplied X6Pxndcwgyc source, while legacyDelivery records its previous 640 × 480 file.

Vimeo processes uploads into its own playback renditions. Free embeds use automatic quality; uploading a 4K source does not force 4K playback on every connection. The source files have not been recompressed by this migration.

The SDK requests audible playback with inline controls. Vimeo URL autoplay is disabled to avoid the provider silently retrying muted; the SDK requests play when the film is visible. If playback is blocked, Play remains available. Only one visible library film receives autoplay; leaving view pauses without resetting playback. Closing the library releases its players. Viewer mute/volume choices after initial playback are preserved.

Players use 16:9 containers. Cinema-aspect footage remains undistorted inside that frame. Mobile landscape fits the player below the compact project header. Existing photos, homepage images and contact form are unchanged.

The Google-account management table is stored privately in the task workspace (vimeo-upload-20261027/tai-khoan-video-vimeo.md), outside dist and outside this public repository. No credentials are recorded.

Rollback: restore the MP4 kind and previous delivery URLs in VIDEO_SOURCES.json, then run python3 render-projects.py. Existing CDN objects are retained.

Validation: node --test tests/*.test.cjs; browser playback and portrait/landscape sizing are recorded separately from source tests. Verify deployment against the merged commit; source tests alone do not establish production status.
