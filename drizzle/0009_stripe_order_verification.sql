-- Fulfill Stripe orders only when the signed event matches the checkout
-- session and amount stored for that exact order.

CREATE OR REPLACE FUNCTION fulfill_stripe_order(
  p_order_id uuid,
  p_provider_ref text,
  p_amount_total integer,
  p_currency text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  o orders%ROWTYPE;
BEGIN
  SELECT * INTO o FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'order_not_found';
  END IF;
  IF o.status = 'paid' THEN
    RETURN false;
  END IF;
  IF o.provider <> 'stripe'
    OR o.provider_ref IS DISTINCT FROM p_provider_ref
    OR o.amount_czk_ex_vat * 100 <> p_amount_total
    OR lower(p_currency) <> 'czk'
  THEN
    RAISE EXCEPTION 'order_verification_failed';
  END IF;
  RETURN fulfill_paid_order(p_order_id, p_provider_ref);
END;
$$;

REVOKE ALL ON FUNCTION fulfill_stripe_order(uuid, text, integer, text) FROM PUBLIC;
DO $$ BEGIN
  IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'dilna_app') THEN
    GRANT EXECUTE ON FUNCTION fulfill_stripe_order(uuid, text, integer, text) TO dilna_app;
  END IF;
END $$;
