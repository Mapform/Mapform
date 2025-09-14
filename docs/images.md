# Images

- Images are stored in Vercel Blob storage
- When an image is create:

1. A Vercel blob is created
2. A Blob record is created inside of DB with a url field

- Deleting images is done asynchronously. This is to allow "undo" functionality in the future.
- When deleting an image, the `queuedForDeletionDate` field is set to 'now' on the Blob
- The 'cleanup-blobs' cron job deletes the Vercel blobs by querying against `queuedForDeletionDate`
