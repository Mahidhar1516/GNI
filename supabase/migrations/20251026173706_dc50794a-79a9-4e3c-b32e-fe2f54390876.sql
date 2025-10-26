-- Create class_schedule table
CREATE TABLE public.class_schedule (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  title TEXT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  type TEXT NOT NULL CHECK (type IN ('class', 'others')),
  course_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.class_schedule ENABLE ROW LEVEL SECURITY;

-- Students can view their own schedule
CREATE POLICY "Students can view their own schedule"
ON public.class_schedule
FOR SELECT
USING (auth.uid() = student_id);

-- Students can insert their own schedule
CREATE POLICY "Students can insert their own schedule"
ON public.class_schedule
FOR INSERT
WITH CHECK (auth.uid() = student_id);

-- Students can update their own schedule
CREATE POLICY "Students can update their own schedule"
ON public.class_schedule
FOR UPDATE
USING (auth.uid() = student_id);

-- Students can delete their own schedule
CREATE POLICY "Students can delete their own schedule"
ON public.class_schedule
FOR DELETE
USING (auth.uid() = student_id);