create policy "Anyone can read quiz assets"
  on storage.objects for select to anon, authenticated
  using (bucket_id = 'quiz-assets');

create policy "Admins can upload quiz assets"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'quiz-assets' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update quiz assets"
  on storage.objects for update to authenticated
  using (bucket_id = 'quiz-assets' and public.has_role(auth.uid(), 'admin'))
  with check (bucket_id = 'quiz-assets' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete quiz assets"
  on storage.objects for delete to authenticated
  using (bucket_id = 'quiz-assets' and public.has_role(auth.uid(), 'admin'));