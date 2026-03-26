# Issue #001: Add Bitcoin/Sats Prize Support Using Spark/Lightspark

## Context
Users want to add real bitcoin prizes to challenges. This uses Spark (by Lightspark) for the easiest Lightning Network integration - allowing participants to create payment requests that winners can claim.

## Requirements
1. Add "Bitcoin Prize" option alongside current text prize in challenge creation
2. When Bitcoin is selected, show fields for:
   - Amount in sats
   - Optional description/note
3. Integrate Spark SDK for Lightning payments:
   - Generate Lightning invoice/payment request for the prize amount
   - Display QR code and payment request string on challenge dashboard
   - Show payment status (pending/paid)
4. Update challenge settings to support editing bitcoin prizes
5. Update database schema to store:
   - Prize type (text vs bitcoin)
   - Sats amount (if bitcoin)
   - Lightning invoice details
   - Payment status

## Acceptance Criteria
- [ ] Can create challenge with bitcoin prize in sats
- [ ] Dashboard shows Lightning invoice/QR code for the prize
- [ ] Prize type stored in database (text or bitcoin)
- [ ] History page shows bitcoin prizes with sats amounts
- [ ] Edit settings works for bitcoin prizes

## Files to Modify/Create
- `src/lib/server/db.ts` - Add prize_type, sats_amount, invoice, payment_status columns
- `src/routes/start/+page.svelte` - Add Bitcoin prize option with sats input
- `src/routes/challenge/[uuid]/+page.svelte` - Display Lightning QR/invoice
- `src/routes/challenge/[uuid]/settings/+page.svelte` - Edit bitcoin prize
- `src/routes/history/+page.svelte` - Show sats amounts in history
- `src/routes/history/[id]/+page.svelte` - Show bitcoin prize details
