/**
 * supabase/migrations/ の DDL に対応する型定義。
 *
 * 実際に Supabase へ接続するようになったら
 * `supabase gen types typescript` の出力でこのファイルを置き換える想定。
 * それまでは手書きで DDL と同じ形を保つ（列の追加時は必ず両方を更新すること）。
 */

// -----------------------------------------------------------------------------
// 列挙型
// -----------------------------------------------------------------------------

export type UserRole = "student" | "admin";

export type LessonType = "video" | "text" | "pdf";

export type EnrollmentStatus = "active" | "completed" | "suspended";

export type SubmissionKind = "video" | "report" | "both";

export type SubmissionStatus =
  | "submitted"
  | "under_review"
  | "approved"
  | "revision_requested";

export type AnnouncementAudience = "all" | "students" | "graduates";

// -----------------------------------------------------------------------------
// 行の型（テーブル1つにつき1つ）
// -----------------------------------------------------------------------------

export type ProfileRow = {
  id: string;
  email: string;
  full_name: string;
  furigana: string | null;
  role: UserRole;
  avatar_url: string | null;
  phone: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
};

export type CourseRow = {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  instructor_name: string;
  is_published: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type ChapterRow = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
  created_at: string;
  updated_at: string;
};

export type LessonRow = {
  id: string;
  chapter_id: string;
  title: string;
  description: string | null;
  lesson_type: LessonType;
  video_url: string | null;
  pdf_url: string | null;
  /** Web テキスト教材（Markdown） */
  content: string | null;
  duration_seconds: number;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type EnrollmentRow = {
  id: string;
  user_id: string;
  course_id: string;
  status: EnrollmentStatus;
  enrolled_at: string;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProgressRow = {
  id: string;
  user_id: string;
  lesson_id: string;
  is_completed: boolean;
  completed_at: string | null;
  last_position_seconds: number;
  created_at: string;
  updated_at: string;
};

export type AssignmentRow = {
  id: string;
  course_id: string;
  chapter_id: string | null;
  title: string;
  description: string | null;
  submission_kind: SubmissionKind;
  due_date: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type SubmissionRow = {
  id: string;
  assignment_id: string;
  student_id: string;
  body: string | null;
  file_url: string | null;
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  submitted_at: string;
  created_at: string;
  updated_at: string;
};

export type MessageThreadRow = {
  id: string;
  student_id: string;
  subject: string;
  last_message_at: string;
  is_closed: boolean;
  created_at: string;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  read_at: string | null;
  created_at: string;
};

export type AnnouncementRow = {
  id: string;
  title: string;
  body: string;
  audience: AnnouncementAudience;
  is_pinned: boolean;
  published_at: string | null;
  author_id: string | null;
  created_at: string;
  updated_at: string;
};

export type CertificateRow = {
  id: string;
  user_id: string;
  course_id: string;
  /** 認定ID（例: SRP-2026-0001） */
  certificate_no: string;
  recipient_name: string;
  instructor_name: string;
  issued_at: string;
  created_at: string;
};

// -----------------------------------------------------------------------------
// supabase-js に渡す Database 型
// -----------------------------------------------------------------------------

/** created_at / updated_at / id など DB 側で既定値が入る列を任意にするユーティリティ */
type Insert<T, GeneratedKeys extends keyof T> = Omit<T, GeneratedKeys> &
  Partial<Pick<T, GeneratedKeys>>;

type Timestamps = "id" | "created_at" | "updated_at";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Insert<ProfileRow, "created_at" | "updated_at" | "role">;
        Update: Partial<ProfileRow>;
      };
      courses: {
        Row: CourseRow;
        Insert: Insert<CourseRow, Timestamps | "instructor_name" | "is_published">;
        Update: Partial<CourseRow>;
      };
      chapters: {
        Row: ChapterRow;
        Insert: Insert<ChapterRow, Timestamps | "position">;
        Update: Partial<ChapterRow>;
      };
      lessons: {
        Row: LessonRow;
        Insert: Insert<
          LessonRow,
          Timestamps | "position" | "duration_seconds" | "is_published" | "lesson_type"
        >;
        Update: Partial<LessonRow>;
      };
      enrollments: {
        Row: EnrollmentRow;
        Insert: Insert<EnrollmentRow, Timestamps | "status" | "enrolled_at">;
        Update: Partial<EnrollmentRow>;
      };
      progress: {
        Row: ProgressRow;
        Insert: Insert<
          ProgressRow,
          Timestamps | "is_completed" | "completed_at" | "last_position_seconds"
        >;
        Update: Partial<ProgressRow>;
      };
      assignments: {
        Row: AssignmentRow;
        Insert: Insert<
          AssignmentRow,
          Timestamps | "position" | "is_published" | "submission_kind"
        >;
        Update: Partial<AssignmentRow>;
      };
      submissions: {
        Row: SubmissionRow;
        Insert: Insert<SubmissionRow, Timestamps | "status" | "submitted_at">;
        Update: Partial<SubmissionRow>;
      };
      message_threads: {
        Row: MessageThreadRow;
        Insert: Insert<
          MessageThreadRow,
          Timestamps | "subject" | "last_message_at" | "is_closed"
        >;
        Update: Partial<MessageThreadRow>;
      };
      messages: {
        Row: MessageRow;
        Insert: Insert<MessageRow, "id" | "created_at" | "read_at">;
        Update: Partial<MessageRow>;
      };
      announcements: {
        Row: AnnouncementRow;
        Insert: Insert<AnnouncementRow, Timestamps | "audience" | "is_pinned">;
        Update: Partial<AnnouncementRow>;
      };
      certificates: {
        Row: CertificateRow;
        Insert: Insert<CertificateRow, "id" | "created_at" | "issued_at" | "instructor_name">;
        Update: Partial<CertificateRow>;
      };
    };
    Enums: {
      user_role: UserRole;
      lesson_type: LessonType;
      enrollment_status: EnrollmentStatus;
      submission_kind: SubmissionKind;
      submission_status: SubmissionStatus;
      announcement_audience: AnnouncementAudience;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
