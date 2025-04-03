
-- Function to get a user's review for a specific activity
CREATE OR REPLACE FUNCTION get_user_review(
  user_id_param UUID,
  activity_id_param UUID
) 
RETURNS TABLE (
  id UUID,
  rating INTEGER,
  comment TEXT,
  review_date TIMESTAMP WITH TIME ZONE
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ar.id, ar.rating, ar.comment, ar.review_date::TIMESTAMP WITH TIME ZONE
  FROM activity_reviews ar
  WHERE ar.activity_id = activity_id_param
  AND EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = user_id_param 
    AND CONCAT(p.first_name, ' ', p.last_name) = ar.reviewer_name
  );
END;
$$;

-- Function to check if a user has already reviewed an activity
CREATE OR REPLACE FUNCTION check_user_review(
  user_id_param UUID,
  activity_id_param UUID
) 
RETURNS TABLE (
  id UUID
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT ar.id
  FROM activity_reviews ar
  WHERE ar.activity_id = activity_id_param
  AND EXISTS (
    SELECT 1 FROM profiles p 
    WHERE p.id = user_id_param 
    AND CONCAT(p.first_name, ' ', p.last_name) = ar.reviewer_name
  );
END;
$$;

-- Function to update a user's review
CREATE OR REPLACE FUNCTION update_user_review(
  review_id_param UUID,
  rating_param INTEGER,
  comment_param TEXT
) 
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE activity_reviews
  SET rating = rating_param,
      comment = comment_param,
      review_date = CURRENT_TIMESTAMP
  WHERE id = review_id_param;
END;
$$;

-- Function to delete a user's review
CREATE OR REPLACE FUNCTION delete_user_review(
  review_id_param UUID
) 
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM activity_reviews
  WHERE id = review_id_param;
END;
$$;
