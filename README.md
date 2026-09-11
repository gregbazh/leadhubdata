This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Contractor contact enrichment

Customer counts, samples and downloads use `fl_contractors_contactable`, which excludes records without a phone, email or contact form. The complete active-license source remains in `fl_contractors_current` for research and enrichment.

For an existing database, run `node --env-file=.env.local scripts/migrate-contactable-catalog.mjs` before deploying. New catalog setup also applies this migration.

Run `node --env-file=.env.local scripts/enrich-current-contractors.mjs publish` to reuse contacts across licenses with the same business name, street address and ZIP. Run the script with `crawl` to look for published contacts on candidate business websites, then `publish` again to add confirmed matches. Attempts and backups are saved under `private-data/current-contractor-enrichment/`; rerunning resumes unfinished work. `ENRICH_CONCURRENCY` controls parallel website checks (default 32). Progress includes page-read and transport-error counts so network failures are distinguishable from successful research. Unmatched records are unresolved, not proof that no public contact exists.

The crawl confirms the business name and Florida location before retaining contacts. It records actual published contact details and form URLs, never guessed mailboxes. Unmatched businesses remain outside the customer list. A published phone, email or form is not a guarantee of a response or inbox delivery.
