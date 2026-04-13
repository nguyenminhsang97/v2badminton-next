# Sprint 1 Done

Sprint 1 is complete as of `2026-04-09`.

## Final State

- Project ID: `w58s0f53`
- Dataset: `production`
- Embedded Studio live at `/studio`
- Schemas completed: `site_settings`, `location`, `pricing_tier`, `schedule_block`, `faq`, `coach`, `testimonial`, `money_page`, `campaign`, `post`
- Migrated content:
  - `1` site settings document
  - `4` locations
  - `5` pricing tiers
  - `15` schedule blocks
  - `21` FAQs

## Acceptance

`S1-D1` passed with browser-based Studio verification using an editor account.

Verified flows:

- edit and revert a pricing tier
- edit and revert an FAQ
- create, publish, and delete a test location
- navigate from a schedule block reference to the correct location document

## Validation

Final command:

```powershell
npx sanity@latest documents validate --project-id w58s0f53 --dataset production --level error --yes
```

Final result:

- `Valid: 46 documents`
- `Errors: 0`

## Notes

- During acceptance, temporary test data was reverted or deleted.
- FAQ content was restored from source after a Unicode typing issue in browser automation, so the final dataset matches the intended source content.
- Sprint 1 is ready to hand off to Sprint 2 planning and implementation.
