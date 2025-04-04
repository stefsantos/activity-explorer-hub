
-- Add user_id column to activity_reviews table if it doesn't exist already
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'activity_reviews' 
        AND column_name = 'user_id'
    ) THEN
        ALTER TABLE activity_reviews ADD COLUMN user_id UUID REFERENCES auth.users(id);
    END IF;
END $$;
