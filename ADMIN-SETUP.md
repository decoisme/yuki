# Admin setup

The admin editor is available at `/admin`. It uses Supabase Auth and the
existing `works`, `gallery_items`, `site_content`, `hero_images`, and
`contact_images` tables.

## One-time Supabase setup

1. Run the base `supabase-schema.sql` and `supabase-gallery-schema.sql` if
   those tables are not already set up. Then run `supabase-project-stories.sql`
   and `supabase-contact-content.sql` to add editable project stories and
   contact-section copy/links. If you ran the older contact migration, rerun
   `supabase-contact-content.sql`; it preserves existing social URLs while
   moving them into the new flexible list.
2. Run `supabase-admin-policies.sql`. This enables writes only for users whose
   server-managed `app_metadata.role` is `admin` and creates/sets the public
   `content` Storage bucket.
3. In Supabase **Authentication → Users**, create the account you will use to
   sign in. Then open **SQL Editor** and assign its admin role with this query,
   replacing the email with the account's email:

   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb)
     || '{"role":"admin"}'::jsonb
   WHERE email = 'you@example.com';
   ```

   Do not use `user_metadata` for this role; users can edit their own user
   metadata. Sign out and back in after changing the role so the session token
   refreshes.
4. Ensure the app has `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` configured.
5. Visit `/admin/login` and sign in with that user's email and password.

The route checks the user on the server, and the database/storage RLS policies
also enforce admin permissions. The public site continues to have read-only
access. No service-role key is used in the browser.

## What can be edited

- **Page copy** — values in `site_content`; only `<em>` and `<br>` markup is
  rendered by the public site, all other input is displayed as text.
- **Selected work** — create, update, reorder, and delete `works` entries;
  edit project summaries, stories, and supporting images shown in the
  Selected Work editorial overlay on the homepage.
- **Obscura gallery** — manage image/video URLs, category, format, ordering,
  visibility, and featured status.
- **Contact details** — edit the contact section's email, description, heading,
  add/remove any number of social profiles, and edit the footer location under
  Page copy.
- **Site images** — update hero/contact images, alt text/captions, and choose
  the currently active image.
- **Uploads** — image/video files are uploaded to the public `content` bucket;
  the admin form then stores the resulting public URL in the selected record.
