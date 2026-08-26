CREATE TABLE IF NOT EXISTS public.api_usage (
  ip_hash text NOT NULL,
  date_utc date NOT NULL,
  endpoint text NOT NULL,
  count integer NOT NULL DEFAULT 0,
  CONSTRAINT api_usage_pkey PRIMARY KEY (ip_hash, date_utc, endpoint)
);

-- RLS and Permissions
ALTER TABLE public.api_usage ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.api_usage FROM anon, authenticated, public;
GRANT ALL ON TABLE public.api_usage TO service_role;

-- The RPC for atomic check and increment
CREATE OR REPLACE FUNCTION check_and_increment_api_usage(
  p_ip_hash TEXT,
  p_endpoint TEXT,
  p_ip_limit INT,
  p_global_limit INT
) RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_global_count INT;
  v_ip_count INT;
  v_today DATE := (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date;
BEGIN
  IF p_endpoint IS NULL OR p_endpoint = '' THEN
    RETURN json_build_object('allowed', false, 'reason', 'invalid_endpoint');
  END IF;

  -- Ensure rows exist before locking to prevent race conditions
  INSERT INTO api_usage (ip_hash, date_utc, endpoint, count)
  VALUES ('GLOBAL', v_today, p_endpoint, 0)
  ON CONFLICT DO NOTHING;

  INSERT INTO api_usage (ip_hash, date_utc, endpoint, count)
  VALUES (p_ip_hash, v_today, p_endpoint, 0)
  ON CONFLICT DO NOTHING;

  -- 1. Check Global Limit using row-level lock
  SELECT count INTO v_global_count FROM api_usage
  WHERE ip_hash = 'GLOBAL' AND date_utc = v_today AND endpoint = p_endpoint
  FOR UPDATE;
  
  IF COALESCE(v_global_count, 0) >= p_global_limit THEN
    RETURN json_build_object('allowed', false, 'reason', 'global_limit');
  END IF;

  -- 2. Check IP Limit
  SELECT count INTO v_ip_count FROM api_usage
  WHERE ip_hash = p_ip_hash AND date_utc = v_today AND endpoint = p_endpoint
  FOR UPDATE;
  
  IF COALESCE(v_ip_count, 0) >= p_ip_limit THEN
    RETURN json_build_object('allowed', false, 'reason', 'ip_limit');
  END IF;

  -- 3. Increment both atomically since they are locked
  UPDATE api_usage SET count = count + 1 
  WHERE ip_hash = 'GLOBAL' AND date_utc = v_today AND endpoint = p_endpoint;

  UPDATE api_usage SET count = count + 1 
  WHERE ip_hash = p_ip_hash AND date_utc = v_today AND endpoint = p_endpoint;

  RETURN json_build_object('allowed', true, 'ip_count', COALESCE(v_ip_count, 0) + 1);
END;
$$;

-- RPC Permissions
REVOKE ALL ON FUNCTION check_and_increment_api_usage(TEXT, TEXT, INT, INT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION check_and_increment_api_usage(TEXT, TEXT, INT, INT) TO service_role;

-- Cleanup approach for records older than 30 days
CREATE OR REPLACE FUNCTION cleanup_old_api_usage() RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM api_usage WHERE date_utc < ((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date - INTERVAL '30 days');
$$;

-- Try to schedule pg_cron job if available
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron') THEN
    PERFORM cron.schedule('cleanup-api-usage', '0 1 * * *', 'SELECT public.cleanup_old_api_usage()');
  END IF;
END $$;
