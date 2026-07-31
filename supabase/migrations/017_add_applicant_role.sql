-- Add a distinct 'applicant' role. Today every signup gets role='intern'
-- immediately (both the column DEFAULT and AuthContext.tsx hard-code it),
-- so a brand-new visitor who registers gets full training/dashboard access
-- whether or not they ever applied or were accepted. This violates FR-004
-- ("New registrations receive the lowest-privilege role by default") and
-- FR-005 ("An account is promoted to intern only when an application
-- reaches accepted") -- both Must-have.
--
-- New signups now default to 'applicant'. AdminConversion.tsx is the only
-- path that promotes applicant -> intern (it already sets role='intern' on
-- conversion, unchanged by this migration). AuthContext.tsx additionally
-- promotes a brand-new account straight to 'intern' at signup time when the
-- application being linked (FR-006) is already 'accepted' -- matching the
-- App Flow document's described journey ("If accepted, they create an
-- account and their existing application is linked to it").

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
  ALTER COLUMN role SET DEFAULT 'applicant',
  ADD CONSTRAINT users_role_check CHECK (role IN ('applicant', 'intern', 'mentor', 'admin'));
