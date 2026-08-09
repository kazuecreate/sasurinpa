import type { ChapterRow, CourseRow, LessonRow } from "@/types/database";
import { CHAPTER_IDS, COURSE_ID, LESSON_IDS, USER_IDS } from "./ids";

/**
 * 動画 / PDF の URL はダミー。
 * 実装時は Storage の `course-assets` バケットの署名付き URL に差し替える。
 */
const CDN = "https://cdn.sasurinpa.example";

export const mockCourse: CourseRow = {
  id: COURSE_ID,
  title: "さすりんぱ認定講師養成講座 ベーシック",
  description:
    "洋服の上からチタニウムプレートでやさしくさする「手当」の技術を、基礎から部位別アプローチ、フェムケアまで体系的に学びます。全4章・8レッスン、課題3本の提出で認定講師証を発行します。",
  cover_image_url: `${CDN}/courses/basic-cover.webp`,
  instructor_name: "RIKA",
  is_published: true,
  created_by: USER_IDS.rika,
  created_at: "2026-04-01T11:00:00+09:00",
  updated_at: "2026-07-12T14:20:00+09:00",
};

export const mockChapters: ChapterRow[] = [
  {
    id: CHAPTER_IDS.basics,
    course_id: COURSE_ID,
    title: "リンパの基礎",
    description:
      "さすりんぱの考え方と、リンパ・自律神経のしくみを学びます。施術の土台になる章です。",
    position: 1,
    created_at: "2026-04-01T11:10:00+09:00",
    updated_at: "2026-04-01T11:10:00+09:00",
  },
  {
    id: CHAPTER_IDS.plate,
    course_id: COURSE_ID,
    title: "チタニウムプレートの使い方",
    description:
      "プレートの持ち方・圧のかけ方・基本ストローク3種、そして衛生管理までを扱います。",
    position: 2,
    created_at: "2026-04-01T11:12:00+09:00",
    updated_at: "2026-05-02T09:00:00+09:00",
  },
  {
    id: CHAPTER_IDS.bodyParts,
    course_id: COURSE_ID,
    title: "部位別アプローチ",
    description: "デコルテ・首まわり、脚のむくみケアを部位ごとに練習します。",
    position: 3,
    created_at: "2026-04-01T11:14:00+09:00",
    updated_at: "2026-06-18T13:30:00+09:00",
  },
  {
    id: CHAPTER_IDS.femcare,
    course_id: COURSE_ID,
    title: "フェムケア・更年期ケア",
    description:
      "デリケートなお悩みに寄り添うための知識と、安心していただける声かけを学びます。",
    position: 4,
    created_at: "2026-04-01T11:16:00+09:00",
    updated_at: "2026-07-12T14:20:00+09:00",
  },
];

export const mockLessons: LessonRow[] = [
  // --- 第1章 リンパの基礎 -----------------------------------------------------
  {
    id: LESSON_IDS.whatIsSasurinpa,
    chapter_id: CHAPTER_IDS.basics,
    title: "さすりんぱとは ── Sea Moon Original Method の考え方",
    description:
      "「治す」ではなく「手当てする」。さすりんぱが大切にしている温もりと安心感についてお話しします。",
    lesson_type: "video",
    video_url: `${CDN}/lessons/01-what-is-sasurinpa.mp4`,
    pdf_url: null,
    content: null,
    duration_seconds: 480,
    position: 1,
    is_published: true,
    created_at: "2026-04-02T10:00:00+09:00",
    updated_at: "2026-04-02T10:00:00+09:00",
  },
  {
    id: LESSON_IDS.lymphAndNerves,
    chapter_id: CHAPTER_IDS.basics,
    title: "リンパと自律神経のしくみ",
    description: "施術の効果を説明できるようになるための、からだの基礎知識です。",
    lesson_type: "text",
    video_url: null,
    pdf_url: null,
    content: [
      "## リンパのはたらき",
      "",
      "リンパ管は血管に沿って全身をめぐり、余分な水分や老廃物を回収しています。",
      "筋肉のポンプ作用に頼っているため、動かない時間が長いほど流れが滞ります。",
      "",
      "## 自律神経とのつながり",
      "",
      "- **交感神経**が優位だと血管が収縮し、流れが滞りやすくなります",
      "- ゆっくりとした一定のリズムでさすることで、**副交感神経**が優位になります",
      "- 「気持ちいい」と感じる強さが、いちばん効果の出る強さです",
      "",
      "## お客様への伝え方",
      "",
      "専門用語を並べるのではなく、「めぐりを助けるお手伝いをします」という言葉に置き換えてお伝えしましょう。",
    ].join("\n"),
    duration_seconds: 600,
    position: 2,
    is_published: true,
    created_at: "2026-04-02T10:05:00+09:00",
    updated_at: "2026-05-30T16:00:00+09:00",
  },

  // --- 第2章 チタニウムプレートの使い方 ---------------------------------------
  {
    id: LESSON_IDS.plateGrip,
    chapter_id: CHAPTER_IDS.plate,
    title: "プレートの持ち方と圧のかけ方",
    description:
      "力を入れずに肌へ届かせるための、手首と指のつかい方を実演で確認します。",
    lesson_type: "video",
    video_url: `${CDN}/lessons/03-plate-grip.mp4`,
    pdf_url: null,
    content: null,
    duration_seconds: 760,
    position: 1,
    is_published: true,
    created_at: "2026-04-05T13:00:00+09:00",
    updated_at: "2026-04-05T13:00:00+09:00",
  },
  {
    id: LESSON_IDS.basicStrokes,
    chapter_id: CHAPTER_IDS.plate,
    title: "基本ストローク3種",
    description:
      "「なでる」「流す」「ゆらす」の3ストローク。すべての部位別施術のベースになります。",
    lesson_type: "video",
    video_url: `${CDN}/lessons/04-basic-strokes.mp4`,
    pdf_url: null,
    content: null,
    duration_seconds: 920,
    position: 2,
    is_published: true,
    created_at: "2026-04-05T13:20:00+09:00",
    updated_at: "2026-05-02T09:00:00+09:00",
  },
  {
    id: LESSON_IDS.hygiene,
    chapter_id: CHAPTER_IDS.plate,
    title: "衛生管理とプレートのメンテナンス",
    description: "サロン開業時に必要な衛生基準とお手入れ手順のチェックリストです。",
    lesson_type: "pdf",
    video_url: null,
    pdf_url: `${CDN}/lessons/05-hygiene-checklist.pdf`,
    content: null,
    duration_seconds: 300,
    position: 3,
    is_published: true,
    created_at: "2026-04-05T13:40:00+09:00",
    updated_at: "2026-04-05T13:40:00+09:00",
  },

  // --- 第3章 部位別アプローチ -------------------------------------------------
  {
    id: LESSON_IDS.decollete,
    chapter_id: CHAPTER_IDS.bodyParts,
    title: "デコルテ・首まわりのアプローチ",
    description: "肩こり・顔まわりのくすみが気になる方への基本の流れです。",
    lesson_type: "video",
    video_url: `${CDN}/lessons/06-decollete.mp4`,
    pdf_url: null,
    content: null,
    duration_seconds: 1080,
    position: 1,
    is_published: true,
    created_at: "2026-04-20T15:00:00+09:00",
    updated_at: "2026-06-18T13:30:00+09:00",
  },
  {
    id: LESSON_IDS.legs,
    chapter_id: CHAPTER_IDS.bodyParts,
    title: "脚・むくみケア",
    description: "立ち仕事・デスクワークの方に喜ばれる、ふくらはぎから太もものケア。",
    lesson_type: "video",
    video_url: `${CDN}/lessons/07-legs.mp4`,
    pdf_url: null,
    content: null,
    duration_seconds: 990,
    position: 2,
    is_published: true,
    created_at: "2026-04-20T15:30:00+09:00",
    updated_at: "2026-04-20T15:30:00+09:00",
  },

  // --- 第4章 フェムケア・更年期ケア -------------------------------------------
  {
    id: LESSON_IDS.femcareBasics,
    chapter_id: CHAPTER_IDS.femcare,
    title: "フェムケアの基礎と寄り添う声かけ",
    description:
      "更年期のからだの変化と、デリケートな相談を受けたときの言葉えらびを学びます。",
    lesson_type: "video",
    video_url: `${CDN}/lessons/08-femcare-basics.mp4`,
    pdf_url: null,
    content: null,
    duration_seconds: 1320,
    position: 1,
    is_published: true,
    created_at: "2026-05-10T11:00:00+09:00",
    updated_at: "2026-07-12T14:20:00+09:00",
  },
];
