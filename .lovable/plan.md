

## Diagnosis

The RLS policies are actually **correct and PERMISSIVE** now — I verified directly in the database. The upload is failing with a **network-level "Load failed"** error, not a permissions error.

The root cause: The user is uploading a **16.6MB .mov file** through the preview environment, which likely has connection/timeout constraints that cause large uploads to fail silently.

## Plan

1. **Add a file size limit reduction and better error handling** — Lower the max file size to 20MB and add a retry mechanism with a more descriptive error message showing the actual failure reason.

2. **Switch to chunked upload or use `tus` protocol** — Supabase supports resumable uploads via the tus protocol for larger files. However, the simpler fix is to handle the error gracefully and suggest smaller files.

3. **Improve error feedback in UploadVideo.tsx**:
   - Wrap the upload in a try/catch that logs the full error object
   - Add a timeout wrapper around the upload call
   - Show a more helpful toast when the network fails (e.g., "Upload failed — try a smaller file or check your connection")

4. **Test with a smaller file** — The quickest validation: try uploading a small video (under 5MB). If that works, the issue is confirmed as file-size/timeout related in the preview environment.

### Key code change in `src/pages/UploadVideo.tsx`:
- Add console.error logging of the full error object before the toast
- Add a suggestion in the error toast about file size
- Consider reducing the displayed max to 20MB since the preview environment may not handle 50MB reliably

