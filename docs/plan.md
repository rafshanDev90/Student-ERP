Role & Task: 
You are an expert full-stack engineer building a resilient, hybrid image upload pipeline for our MERN application. Your task is to implement a robust, fail-safe middleware that attempts to upload images to Cloudinary (Memory Storage), but gracefully catches errors and falls back to storing images on the local server file system (Disk Storage) if Cloudinary fails or is offline.

Follow the exact technical specifications below. Do not deviate from these patterns.

### 1. Dependencies & Environment
- Ensure 'multer', 'cloudinary', and 'dotenv' are properly configured.
- Expect these variables in the backend .env:
  CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET

### 2. Static File Serving (Server Entry Point)
- In the main server file (e.g., server.js or app.js), locate where middleware is registered.
- Add an Express static middleware pointing to the 'public' folder to serve fallback images:
  app.use(express.static(path.join(process.cwd(), 'public')));

### 3. Middleware Implementation (src/middleware/uploadMiddleware.js)
Create an upload middleware with the following logic:
- Use `multer.memoryStorage()` so the file buffer is available in memory.
- Enforce a 5MB maximum file size restriction.
- Implement a `fileFilter` that strictly allows image mime-types (image/*).
- Export a higher-order function named `uploadWithFallback(folderName)`. This function must:
  a. Wrap the `cloudinary.uploader.upload_stream` in a Promise to safely manage async execution flow.
  b. Pass the designated `folderName` to Cloudinary configurations.
  c. If successful: Attach the Cloudinary secure URL string to `req.body.imageUrl`, set `req.body.isLocalFallback = false`, and call `next()`.
  d. If an error is caught (Cloudinary down/rate-limited): Log a warning, programmatically create a nested directory locally under `public/uploads/${folderName}` using `fs.mkdirSync({ recursive: true })`, generate a unique filename with a timestamp, write the memory buffer to disk using `fs.writeFileSync`, assign the relative path string (e.g., `/uploads/folderName/filename.ext`) to `req.body.imageUrl`, set `req.body.isLocalFallback = true`, and call `next()`.

### 4. Controller Pattern Verification
- Verify or adapt our standard resource controllers (e.g., products, courses, or users) to read `req.body.imageUrl` directly into the Mongoose schema image field. The controller should be completely agnostic about whether the URL points to Cloudinary or a local path.

### 5. Frontend React Component Guidelines
- Ensure frontend file uploads use the native `FormData` object with the header `{"Content-Type": "multipart/form-data"}` when POSTing to the backend.
- Create a clean helper function or update image elements to conditionally parse the path:
  If the image path starts with 'http' or 'https', render it directly.
  Otherwise, prefix the path with the environment's absolute backend API base URL string.

Please implement this entire pipeline, structure files cleanly, and provide structural file outlines upon completion.
