export type ProjectType = "core" | "project"

export interface Project {
  id: number
  name: string
  position: [number, number, number]
  color: string
  type: ProjectType
  description?: string
  stack?: string
  link?: string
  detail?: string
  role?: string
  year?: string
  highlights?: string[]
  images?: string[]
}

export const projects: Project[] = [
  {
    id: 0,
    name: "GIL",
    position: [0, 0, 0],
    color: "#ffffff",
    type: "core",
    description: "Creative Engineer / Builder",
    stack: "SwiftUI • Node • WebGL • AWS",
    detail:
      "インタラクティブ体験を設計し、プロトタイプから本番まで一気通貫で作ることを大切にしています。",
    role: "Creative Engineer",
    year: "2024–",
    highlights: ["体験設計とUI/UX", "リアルタイム3D表現", "プロトタイピング"],
    images: ["/images/gil.jpg","/images/placeholder-cyber.svg","/images/placeholder-cyber.svg"],
  },
  {
    id: 1,
    name: "SaunaMix",
    position: [3, 1, -2],
    color: "#00f5ff",
    type: "project",
    description: "Apple Watch × AI：ととのい体験を可視化",
    stack: "SwiftUI • HealthKit • Node/Express",
    link: "https://example.com",
    detail: "心拍や体温などの生体情報を元に、ととのい指標を可視化するプロトタイプ。",
    role: "iOS / Backend",
    year: "2023",
    highlights: ["HealthKit連携", "リアルタイム可視化", "AIによるセッション分析"],
    images: ["/images/placeholder-cyber.svg"],
  },
  {
    id: 2,
    name: "HeiseiCamera",
    position: [-3, 2, -1],
    color: "#9d4edd",
    type: "project",
    description: "平成っぽいフィルターで撮れるカメラ",
    stack: "iOS • Vision • AR",
    detail: "平成の写ルンです的な質感を再現するために、色味とノイズを細かく調整。",
    role: "iOS / Creative",
    year: "2022",
    highlights: ["フィルター設計", "Vision活用", "レトロ表現"],
    images: ["/images/placeholder-cyber.svg"],
  },
  {
    id: 3,
    name: "Motohei Web",
    position: [2, -2, 1],
    color: "#ff00ff",
    type: "project",
    description: "酒屋サイトの企画・デザイン・実装",
    stack: "Next.js • UI/UX • Content",
    detail: "ブランディングから導線設計まで一貫して担当し、回遊性を高めたEC体験。",
    role: "Design / Frontend",
    year: "2021",
    highlights: ["情報設計", "コンテンツ制作", "Next.js最適化"],
    images: ["/images/placeholder-cyber.svg"],
  },
  {
    id: 4,
    name: "SkillChecker",
    position: [-2, -1, 2],
    color: "#00ff88",
    type: "project",
    description: "学習者の理解をチェックするRAG/問題生成",
    stack: "Next.js • RAG • OpenAI",
    detail: "教材から理解度を測る問題を自動生成し、学習の抜けを可視化。",
    role: "Frontend / AI",
    year: "2024",
    highlights: ["RAG構成", "問題生成", "学習ダッシュボード"],
    images: ["/images/placeholder-cyber.svg"],
  },
]
