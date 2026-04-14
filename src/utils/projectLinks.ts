import type { Project, ProjectLink } from "../data/projects";

export function getProjectLinks(project: Project): ProjectLink[] {
  if (project.links && project.links.length > 0) {
    return project.links;
  }

  if (project.link) {
    return [{ label: "OPEN", href: project.link }];
  }

  return [];
}
