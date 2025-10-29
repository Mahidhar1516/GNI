-- Create exam_marks table
CREATE TABLE public.exam_marks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  course_id UUID NOT NULL,
  exam_name TEXT NOT NULL,
  marks_obtained INTEGER NOT NULL,
  total_marks INTEGER NOT NULL,
  exam_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT exam_marks_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id)
);

-- Enable RLS
ALTER TABLE public.exam_marks ENABLE ROW LEVEL SECURITY;

-- RLS policies for exam_marks
CREATE POLICY "Students can view their own exam marks"
ON public.exam_marks
FOR SELECT
USING (auth.uid() = student_id);

-- Create fee_payments table
CREATE TABLE public.fee_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fee_payments ENABLE ROW LEVEL SECURITY;

-- RLS policies for fee_payments
CREATE POLICY "Students can view their own fee payments"
ON public.fee_payments
FOR SELECT
USING (auth.uid() = student_id);