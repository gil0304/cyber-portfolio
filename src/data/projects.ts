export type ProjectType = "core" | "project";

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  id: number;
  name: string;
  position: [number, number, number];
  color: string;
  type: ProjectType;
  description?: string;
  stack?: string;
  link?: string;
  links?: ProjectLink[];
  detail?: string;
  role?: string;
  year?: string;
  highlights?: string[];
  images?: string[];
}

export const projects: Project[] = [
  {
    id: 0,
    name: "GIL",
    position: [0, 0, 0],
    color: "#ffffff",
    type: "core",
    description: "大学生",
    stack: "SwiftUI • Ruby • JavaScript • TypeScript",
    detail: "今まで作ったもの",
    role: "WebS / WebD / iPhone",
    year: "2024–",
    highlights: ["WebS", "WebD", "iPhone"],
    images: ["/images/gil.jpg"],
  },
  {
    id: 1,
    name: "Google Calendar スケジューラー",
    position: [3, 1, -2],
    color: "#7A2CFF",
    type: "project",
    description:
      "SlackでGoogle Calendarの予定から空き時間を共有し、予定を作成できる",
    stack: "Slack API • TypeScript • Google Calendar API • Node.js • Supabase",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/gil0304/GoogleCalendar-SlackApp.git",
      },
      {
        label: "Install",
        href: "https://googlecalendar-slackapp.onrender.com/slack/install",
      },
    ],
    detail: "企画からコーディングまで全て1人で実装",
    role: "Backend",
    year: "2026",
    highlights: ["Slack", "Google Calendar"],
    images: ["/images/gcal/gcal-app.png", "/images/gcal/gcal-detail.png"],
  },
  {
    id: 2,
    name: "パントバーグ様 Webサイト",
    position: [-3, 2, -1],
    color: "#FFF87A",
    type: "project",
    description: "山梨県にあるパントバーグ様のWebサイト",
    stack: "Web • HTML • css • JavaScript",
    links: [
      {
        label: "Webサイト",
        href: "https://pantoburg.com/",
      },
    ],
    detail: "主にコーディングを担当",
    role: "Frontend",
    year: "2024",
    highlights: ["情報設計", "コーディング"],
    images: ["/images/pantoburg/home.png"],
  },
  {
    id: 3,
    name: "地酒のモトヘイ様 Webサイト",
    position: [2, -2, 1],
    color: "#2F7BFF",
    type: "project",
    description:
      "地酒のモトヘイ様のWebサイトの山梨地酒の特集ページ、お店の紹介ページ",
    stack: "HTML • css • UI/UX • Content",
    links: [
      {
        label: "山梨地酒の特集ページ",
        href: "https://jizake-motohei.com/?mode=f7",
      },
      {
        label: "お店の紹介ページ",
        href: "https://jizake-motohei.com/?mode=f8",
      },
    ],
    detail: "企画からコーディングまで担当",
    role: "Design / Frontend",
    year: "2026",
    highlights: ["情報設計", "コンテンツ制作", "Next.js最適化"],
    images: ["/images/motohei/jizake.png", "/images/motohei/about.png"],
  },
  // {
  //   id: 4,
  //   name: "SkillChecker",
  //   position: [-2, -1, 2],
  //   color: "#00ff88",
  //   type: "project",
  //   description: "学習者の理解をチェックするRAG/問題生成",
  //   stack: "Next.js • RAG • OpenAI",
  //   detail: "教材から理解度を測る問題を自動生成し、学習の抜けを可視化。",
  //   role: "Frontend / AI",
  //   year: "2024",
  //   highlights: ["RAG構成", "問題生成", "学習ダッシュボード"],
  //   images: ["/images/placeholder-cyber.svg"],
  // },
];
