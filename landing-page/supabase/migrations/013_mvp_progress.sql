-- Mark p3-csv-export done.
-- Run after 012. Idempotent.

update mvp_tasks
set done = true,
    done_at = now(),
    done_by = 'system · auto',
    note = 'GET /api/admin/customers/export streams customers + entitlement-join as RFC 4180 CSV with UTF-8 BOM (Excel auto-detects encoding). Auth: getUser + isAdmin gate; 401/403 on miss. Filename: ets-customers-YYYY-MM-DD.csv via Content-Disposition. Columns: user_id, email, name, signed_up_at, license_active, granted_at, source. Export button on /admin/customers topbar with download attribute.',
    updated_at = now()
where slug = 'p3-csv-export' and done = false;
