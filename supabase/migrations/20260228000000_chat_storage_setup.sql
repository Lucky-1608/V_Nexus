-- Create the 'chat_attachments' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('chat_attachments', 'chat_attachments', true, 524288000)
ON CONFLICT (id) DO UPDATE SET file_size_limit = 524288000;

-- Policy: Allow public access to view files (since it's a public bucket)
CREATE POLICY "chat_attachments_public_access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'chat_attachments' );

-- Policy: Allow authenticated users to upload files
CREATE POLICY "chat_attachments_authenticated_upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'chat_attachments' );

-- Policy: Allow users to update/delete their own files
CREATE POLICY "chat_attachments_users_update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'chat_attachments' AND auth.uid() = owner );

CREATE POLICY "chat_attachments_users_delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'chat_attachments' AND auth.uid() = owner );
